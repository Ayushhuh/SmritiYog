from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.patient_config import PATIENT_RELATIONSHIPS, SUPPORTED_PATIENT_LANGUAGES


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
    role: str
    language: str
    created_at: datetime


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user: UserRead


class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    language: str = Field(default="en", max_length=10)


class PatientCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=100)
    preferred_name: str | None = Field(default=None, max_length=100)
    date_of_birth: date | None = None
    preferred_language: str = Field(default="en", max_length=10)
    relationship: str = Field(min_length=1, max_length=40)

    @field_validator("full_name")
    @classmethod
    def strip_full_name(cls, value: str) -> str:
        stripped = " ".join(value.split())
        if not stripped:
            raise ValueError("a name is required")
        return stripped

    @field_validator("preferred_name")
    @classmethod
    def strip_preferred_name(cls, value: str | None) -> str | None:
        if value is None:
            return None
        stripped = " ".join(value.split())
        return stripped or None

    @field_validator("preferred_language")
    @classmethod
    def language_supported(cls, value: str) -> str:
        if value not in SUPPORTED_PATIENT_LANGUAGES:
            raise ValueError("unsupported language")
        return value

    @field_validator("relationship")
    @classmethod
    def relationship_supported(cls, value: str) -> str:
        if value not in PATIENT_RELATIONSHIPS:
            raise ValueError("unsupported relationship")
        return value


class PatientRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    preferred_name: str | None
    date_of_birth: date | None
    preferred_language: str
    is_active: bool
    created_at: datetime


class PatientWithRelationship(PatientRead):
    relationship: str


class GameSessionCreate(BaseModel):
    game_id: str = Field(min_length=1, max_length=100)
    session_id: str = Field(min_length=1, max_length=100)
    patient_id: int
    level: str = Field(min_length=1, max_length=20)
    total_rounds: int = Field(default=5, ge=1)


class GameSessionUpdate(BaseModel):
    score: int = Field(default=0, ge=0)
    completed: bool = False


class GameSessionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    game_id: str
    session_id: str
    patient_id: int
    caregiver_id: int
    level: str
    score: int
    total_rounds: int
    completed: bool
    created_at: datetime
    completed_at: datetime | None
