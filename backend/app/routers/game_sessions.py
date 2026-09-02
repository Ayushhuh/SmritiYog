from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import models, schemas
from app.database import get_session
from app.dependencies import require_caregiver


router = APIRouter(
    prefix="/game-sessions",
    tags=["game-sessions"],
)


@router.post(
    "",
    response_model=schemas.GameSessionRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_game_session(
    payload: schemas.GameSessionCreate,
    caregiver: models.User = Depends(require_caregiver),
    session: AsyncSession = Depends(get_session),
) -> schemas.GameSessionRead:

    link = await session.scalar(
        select(models.CaregiverPatient).where(
            models.CaregiverPatient.caregiver_id == caregiver.id,
            models.CaregiverPatient.patient_id == payload.patient_id,
        )
    )

    if link is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient is not linked to this caregiver.",
        )

    existing = await session.scalar(
        select(models.GameSession).where(
            models.GameSession.session_id == payload.session_id
        )
    )

    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This game session already exists.",
        )

    game_session = models.GameSession(
        game_id=payload.game_id,
        session_id=payload.session_id,
        patient_id=payload.patient_id,
        caregiver_id=caregiver.id,
        level=payload.level,
        total_rounds=payload.total_rounds,
    )

    session.add(game_session)
    await session.commit()
    await session.refresh(game_session)

    return schemas.GameSessionRead.model_validate(game_session)


@router.patch(
    "/{session_id}",
    response_model=schemas.GameSessionRead,
)
async def update_game_session(
    session_id: str,
    payload: schemas.GameSessionUpdate,
    caregiver: models.User = Depends(require_caregiver),
    session: AsyncSession = Depends(get_session),
) -> schemas.GameSessionRead:

    game_session = await session.scalar(
        select(models.GameSession).where(
            models.GameSession.session_id == session_id,
            models.GameSession.caregiver_id == caregiver.id,
        )
    )

    if game_session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game session not found.",
        )

    game_session.score = payload.score
    game_session.completed = payload.completed

    if payload.completed:
        game_session.completed_at = datetime.now(timezone.utc)

    await session.commit()
    await session.refresh(game_session)

    return schemas.GameSessionRead.model_validate(game_session)
