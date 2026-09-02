from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app import models, schemas
from app.database import get_session
from app.dependencies import get_current_user
from app.security import (
    create_access_token,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def _auth_response(user: models.User) -> schemas.AuthResponse:
    token = create_access_token(str(user.id))
    return schemas.AuthResponse(access_token=token, user=user)


@router.post(
    "/register",
    response_model=schemas.AuthResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    payload: schemas.RegisterRequest,
    session: AsyncSession = Depends(get_session),
) -> schemas.AuthResponse:
    email = payload.email.lower()
    existing = await session.scalar(select(models.User).where(func.lower(models.User.email) == email))
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )
    user = models.User(
        name=payload.name,
        email=email,
        password_hash=hash_password(payload.password),
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return _auth_response(user)


@router.post("/login", response_model=schemas.AuthResponse)
async def login(
    payload: schemas.LoginRequest,
    session: AsyncSession = Depends(get_session),
) -> schemas.AuthResponse:
    email = payload.email.lower()
    user = await session.scalar(select(models.User).where(func.lower(models.User.email) == email))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email or password is incorrect.",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="This account is no longer active.",
        )
    return _auth_response(user)


@router.get("/me", response_model=schemas.UserRead)
async def me(user: models.User = Depends(get_current_user)) -> models.User:
    return user