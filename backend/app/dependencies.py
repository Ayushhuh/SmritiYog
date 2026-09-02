from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app import models
from app.database import get_session
from app.security import decode_access_token

bearer_scheme = HTTPBearer(auto_error=False)

UNAUTHORIZED = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Email or password is incorrect.",
)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    session: AsyncSession = Depends(get_session),
) -> models.User:
    if credentials is None or credentials.scheme != "Bearer":
        raise UNAUTHORIZED
    payload = decode_access_token(credentials.credentials)
    subject = payload.get("sub") if payload else None
    if subject is None:
        raise UNAUTHORIZED
    user = await session.get(models.User, int(subject))
    if user is None or not user.is_active:
        raise UNAUTHORIZED
    return user