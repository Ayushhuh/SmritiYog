"""Patients router.

Provides endpoints for caregivers to manage patients:
- POST /caregiver/patients - create a new patient with authentication
- GET  /caregiver/patients - list caregiver's patients
- GET  /caregiver/patients/{patient_id} - get patient details
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import models, schemas
from app.database import get_session
from app.dependencies import get_current_user
from app.security import hash_password
from app.uid import generate_unique_uid

router = APIRouter(prefix="/caregiver/patients", tags=["patients"])


@router.post(
    "",
    response_model=schemas.CreatePatientResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_patient(
    payload: schemas.CreatePatientRequest,
    caregiver: models.User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> schemas.CreatePatientResponse:
    """Create a new patient account with authentication credentials.

    Steps:
    1. Validate caregiver is authenticated
    2. Generate unique 6-digit numeric UID
    3. Create User account with role patient
    4. Create Patient profile linked to User
    5. Create CaregiverPatient relationship
    6. Commit all atomically
    """
    # Generate unique UID server-side
    uid = await generate_unique_uid(session)

    # Hash the password (never store plaintext)
    password_hash_value = hash_password(payload.password)

    # Create the User account for the patient
    patient_user = models.User(
        name=payload.full_name,
        email=f"patient-{uid}@smrityog.local",
        password_hash=password_hash_value,
        language=payload.preferred_language,
    )
    session.add(patient_user)
    await session.flush()

    # Create the Patient profile
    patient = models.Patient(
        uid=uid,
        user_id=patient_user.id,
        full_name=payload.full_name,
        preferred_name=payload.preferred_name,
        date_of_birth=payload.date_of_birth,
        gender=payload.gender,
        preferred_language=payload.preferred_language,
        phone_number=payload.phone_number,
    )
    session.add(patient)
    await session.flush()

    # Create caregiver-patient relationship
    relationship = models.CaregiverPatient(
        caregiver_id=caregiver.id,
        patient_id=patient.id,
    )
    session.add(relationship)

    # Commit everything atomically
    await session.commit()
    await session.refresh(patient)

    return schemas.CreatePatientResponse(patient=patient)


@router.get(
    "",
    response_model=list[schemas.PatientSummary],
)
async def list_patients(
    caregiver: models.User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> list[models.Patient]:
    """List all patients connected to the authenticated caregiver."""
    result = await session.execute(
        select(models.Patient)
        .join(models.CaregiverPatient)
        .where(models.CaregiverPatient.caregiver_id == caregiver.id)
        .order_by(models.Patient.created_at.desc())
    )
    return list(result.scalars().all())


@router.get(
    "/{patient_id}",
    response_model=schemas.PatientRead,
)
async def get_patient(
    patient_id: int,
    caregiver: models.User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> models.Patient:
    """Get patient details. Only the caregiver who owns the patient can access it."""
    relationship = await session.scalar(
        select(models.CaregiverPatient).where(
            models.CaregiverPatient.caregiver_id == caregiver.id,
            models.CaregiverPatient.patient_id == patient_id,
        )
    )
    if relationship is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found.",
        )

    patient = await session.get(models.Patient, patient_id)
    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found.",
        )

    return patient
