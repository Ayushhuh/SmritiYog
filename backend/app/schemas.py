from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ── Auth Schemas ──────────────────────────────────────────


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    language: str
    created_at: datetime


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead


class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    language: str = Field(default="en", max_length=10)


# ── Patient Schemas ───────────────────────────────────────


class CreatePatientRequest(BaseModel):
    full_name: str = Field(min_length=1, max_length=100)
    preferred_name: str = Field(default="", max_length=100)
    date_of_birth: str = Field(default="", max_length=10)
    gender: str = Field(default="", max_length=20)
    preferred_language: str = Field(default="en", max_length=10)
    phone_number: str = Field(default="", max_length=20)
    password: str = Field(min_length=8, max_length=128)


class PatientRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uid: str
    full_name: str
    preferred_name: str
    date_of_birth: str
    gender: str
    preferred_language: str
    phone_number: str
    created_at: datetime
    updated_at: datetime


class PatientSummary(BaseModel):
    """Lightweight patient representation for lists."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    uid: str
    full_name: str
    preferred_name: str
    preferred_language: str
    created_at: datetime


class CreatePatientResponse(BaseModel):
    patient: PatientRead


# ── Patient Auth Schemas ───────────────────────────────────


class PatientLoginRequest(BaseModel):
    uid: str = Field(min_length=6, max_length=6)
    password: str = Field(min_length=1, max_length=128)


class PatientAuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    patient: PatientRead
    preferred_language: str


# ── Refresh Token Schemas ──────────────────────────────────


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
