from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import models, schemas
from app.database import get_session
from app.dependencies import require_caregiver

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[schemas.UserRead])
async def list_caregivers(
    _user: models.User = Depends(require_caregiver),
    session: AsyncSession = Depends(get_session),
) -> list[models.User]:
    result = await session.execute(select(models.User).order_by(models.User.id))
    return list(result.scalars().all())


@router.get("/{user_id}", response_model=schemas.UserRead)
async def get_caregiver(
    user_id: int,
    _user: models.User = Depends(require_caregiver),
    session: AsyncSession = Depends(get_session),
) -> models.User:
    user = await session.get(models.User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user