"""Patient authentication router.

Provides patient login using UID + password, refresh token rotation,
and logout with token revocation.

Security:
- Refresh tokens rotate on every use (token family tracking)
- Old refresh tokens are revoked after rotation
- If a revoked token is reused, the entire family is revoked (breach detection)
- Access tokens are short-lived (1 hour default)
- Refresh tokens are long-lived (30 days default)
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import models, schemas
from app.database import get_session
from app.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    generate_token_family,
    verify_password,
)

router = APIRouter(prefix="/auth/patient", tags=["patient-auth"])


async def _issue_token_pair(
    session: AsyncSession,
    user: models.User,
    family: str | None = None,
) -> tuple[str, str]:
    """Create access + refresh token pair, and store the refresh token."""
    if family is None:
        family = generate_token_family()

    refresh = create_refresh_token(str(user.id), family=family)

    # Decode to get jti and expiry
    payload = decode_refresh_token(refresh)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate tokens.",
        )

    jti = payload.get("jti", "")
    exp = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)

    db_token = models.RefreshToken(
        user_id=user.id,
        token_family=family,
        jti=jti,
        expires_at=exp,
    )
    session.add(db_token)
    await session.flush()

    access = create_access_token(str(user.id), family=family)
    return access, refresh


@router.post("/login", response_model=schemas.PatientAuthResponse)
async def patient_login(
    payload: schemas.PatientLoginRequest,
    session: AsyncSession = Depends(get_session),
) -> schemas.PatientAuthResponse:
    """Patient login using UID + password.

    The UID is a 6-digit numeric identifier. The password is verified
    against the hashed password stored in the database.
    """
    # Find the patient by UID
    patient = await session.scalar(
        select(models.Patient).where(models.Patient.uid == payload.uid)
    )
    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid UID or password.",
        )

    # Get the associated user account
    user = await session.get(models.User, patient.user_id)
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid UID or password.",
        )

    # Verify password
    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid UID or password.",
        )

    # Generate token pair
    access, refresh = await _issue_token_pair(session, user)
    await session.commit()

    return schemas.PatientAuthResponse(
        access_token=access,
        refresh_token=refresh,
        patient=patient,
        preferred_language=patient.preferred_language,
    )


@router.post("/refresh", response_model=schemas.TokenResponse)
async def refresh_tokens(
    payload: schemas.RefreshRequest,
    session: AsyncSession = Depends(get_session),
) -> schemas.TokenResponse:
    """Refresh token rotation.

    Validates the old refresh token, revokes it, issues a new pair.
    If a revoked token is reused, revoke the entire token family (breach).
    """
    # Decode the refresh token
    decoded = decode_refresh_token(payload.refresh_token)
    if decoded is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token.",
        )

    user_id = int(decoded["sub"])
    jti = decoded.get("jti", "")
    family = decoded.get("family", "")

    # Find the stored token
    stored_token = await session.scalar(
        select(models.RefreshToken).where(
            models.RefreshToken.jti == jti,
            models.RefreshToken.user_id == user_id,
        )
    )

    if stored_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found.",
        )

    # Check if already revoked (breach: token reuse)
    if stored_token.revoked:
        # Revoke ALL tokens in this family
        result = await session.execute(
            select(models.RefreshToken).where(
                models.RefreshToken.token_family == family,
                models.RefreshToken.user_id == user_id,
            )
        )
        for token in result.scalars().all():
            token.revoked = True
        await session.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token reuse detected. All sessions revoked. Please log in again.",
        )

    # Revoke the old token
    stored_token.revoked = True
    await session.flush()

    # Check user is still active
    user = await session.get(models.User, user_id)
    if user is None or not user.is_active:
        await session.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is no longer active.",
        )

    # Issue new pair in the same family
    access, refresh = await _issue_token_pair(session, user, family=family)
    await session.commit()

    return schemas.TokenResponse(
        access_token=access,
        refresh_token=refresh,
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def patient_logout(
    payload: schemas.RefreshRequest,
    session: AsyncSession = Depends(get_session),
) -> None:
    """Logout by revoking the refresh token.

    This prevents further token rotation, effectively ending the session.
    """
    decoded = decode_refresh_token(payload.refresh_token)
    if decoded is None:
        return  # Already invalid, nothing to revoke

    jti = decoded.get("jti", "")
    user_id = decoded.get("sub")

    stored_token = await session.scalar(
        select(models.RefreshToken).where(
            models.RefreshToken.jti == jti,
            models.RefreshToken.user_id == int(user_id) if user_id else False,
        )
    )

    if stored_token:
        stored_token.revoked = True
        await session.commit()
