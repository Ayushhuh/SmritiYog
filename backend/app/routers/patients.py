from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import models, schemas
from app.database import get_session
from app.dependencies import require_caregiver

router = APIRouter(prefix="/patients", tags=["patients"])

_ALREADY_CONNECTED = "This patient is already connected to your account."
_NOT_FOUND = "Patient not found."


async def _linked_patients(
    caregiver_id: int,
    session: AsyncSession,
) -> list[models.CaregiverPatient]:
    result = await session.execute(
        select(models.CaregiverPatient).where(
            models.CaregiverPatient.caregiver_id == caregiver_id
        )
    )
    return list(result.scalars().all())


@router.post(
    "",
    response_model=schemas.PatientWithRelationship,
    status_code=status.HTTP_201_CREATED,
)
async def create_patient(
    payload: schemas.PatientCreate,
    caregiver: models.User = Depends(require_caregiver),
    session: AsyncSession = Depends(get_session),
) -> schemas.PatientWithRelationship:
    normalized = payload.full_name

    already = await session.scalar(
        select(models.CaregiverPatient)
        .join(
            models.Patient,
            models.Patient.id == models.CaregiverPatient.patient_id,
        )
        .where(
            models.CaregiverPatient.caregiver_id == caregiver.id,
            models.Patient.is_active.is_(True),
            models.Patient.full_name.ilike(normalized),
        )
    )
    if already is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=_ALREADY_CONNECTED,
        )

    patient = models.Patient(
        full_name=normalized,
        preferred_name=payload.preferred_name,
        date_of_birth=payload.date_of_birth,
        preferred_language=payload.preferred_language,
    )
    session.add(patient)
    await session.flush()

    link = models.CaregiverPatient(
        caregiver_id=caregiver.id,
        patient_id=patient.id,
        relationship=payload.relationship,
    )
    session.add(link)
    await session.commit()
    await session.refresh(patient)
    return schemas.PatientWithRelationship(
        **schemas.PatientRead.model_validate(patient).model_dump(),
        relationship=payload.relationship,
    )


@router.get("", response_model=list[schemas.PatientWithRelationship])
async def list_patients(
    caregiver: models.User = Depends(require_caregiver),
    session: AsyncSession = Depends(get_session),
) -> list[schemas.PatientWithRelationship]:
    links = await _linked_patients(caregiver.id, session)
    result: list[schemas.PatientWithRelationship] = []
    for link in links:
        patient = await session.get(models.Patient, link.patient_id)
        if patient is None or not patient.is_active:
            continue
        result.append(
            schemas.PatientWithRelationship(
                **schemas.PatientRead.model_validate(patient).model_dump(),
                relationship=link.relationship,
            )
        )
    result.sort(key=lambda item: item.full_name)
    return result


@router.get("/{patient_id}", response_model=schemas.PatientWithRelationship)
async def get_patient(
    patient_id: int,
    caregiver: models.User = Depends(require_caregiver),
    session: AsyncSession = Depends(get_session),
) -> schemas.PatientWithRelationship:
    patient = await session.get(models.Patient, patient_id)
    if patient is None or not patient.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=_NOT_FOUND
        )
    link = await session.scalar(
        select(models.CaregiverPatient).where(
            models.CaregiverPatient.caregiver_id == caregiver.id,
            models.CaregiverPatient.patient_id == patient_id,
        )
    )
    if link is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=_NOT_FOUND
        )
    return schemas.PatientWithRelationship(
        **schemas.PatientRead.model_validate(patient).model_dump(),
        relationship=link.relationship,
    )