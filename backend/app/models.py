from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class RefreshToken(Base):
    """Tracks refresh tokens for rotation and revocation."""
    __tablename__ = "refresh_tokens"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    token_family: Mapped[str] = mapped_column(String(36), index=True)
    jti: Mapped[str] = mapped_column(String(36), unique=True, index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    revoked: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user: Mapped["User"] = relationship("User")


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="caregiver")
    language: Mapped[str] = mapped_column(String(10), default="en")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    patient_profile: Mapped["Patient | None"] = relationship(
        "Patient", back_populates="user", uselist=False
    )
    caregiver_relationships: Mapped[list["CaregiverPatient"]] = relationship(
        "CaregiverPatient",
        back_populates="caregiver",
        foreign_keys="CaregiverPatient.caregiver_id",
    )


class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(primary_key=True)
    uid: Mapped[str] = mapped_column(
        String(6), unique=True, index=True
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    full_name: Mapped[str] = mapped_column(String(100))
    preferred_name: Mapped[str] = mapped_column(String(100), default="")
    date_of_birth: Mapped[str] = mapped_column(String(10), default="")  # YYYY-MM-DD
    gender: Mapped[str] = mapped_column(String(20), default="")
    preferred_language: Mapped[str] = mapped_column(String(10), default="en")
    phone_number: Mapped[str] = mapped_column(String(20), default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="patient_profile")
    caregivers: Mapped[list["CaregiverPatient"]] = relationship(
        "CaregiverPatient",
        back_populates="patient",
    )


class CaregiverPatient(Base):
    __tablename__ = "caregiver_patient"
    __table_args__ = (
        UniqueConstraint("caregiver_id", "patient_id", name="uq_caregiver_patient"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    caregiver_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    caregiver: Mapped["User"] = relationship(
        "User", back_populates="caregiver_relationships", foreign_keys=[caregiver_id]
    )
    patient: Mapped["Patient"] = relationship(
        "Patient", back_populates="caregivers"
    )