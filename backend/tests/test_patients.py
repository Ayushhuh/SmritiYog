"""Tests for patient creation, listing, and retrieval."""

import pytest


# ── Patient Creation Tests ─────────────────────────────────


@pytest.mark.asyncio
async def test_create_patient_success(auth_client, db_session):
    """Valid caregiver + valid patient data + valid password -> patient created."""
    response = auth_client.post(
        "/caregiver/patients",
        json={
            "full_name": "Ramesh Sharma",
            "preferred_name": "Ramesh",
            "date_of_birth": "1948-05-12",
            "gender": "male",
            "preferred_language": "en",
            "phone_number": "+911234567890",
            "password": "securepass123",
        },
    )
    assert response.status_code == 201
    data = response.json()
    patient = data["patient"]

    assert patient["full_name"] == "Ramesh Sharma"
    assert patient["preferred_name"] == "Ramesh"
    assert patient["date_of_birth"] == "1948-05-12"
    assert patient["gender"] == "male"
    assert patient["preferred_language"] == "en"
    assert patient["phone_number"] == "+911234567890"

    # UID should be 6-digit numeric
    uid = patient["uid"]
    assert len(uid) == 6
    assert uid.isdigit()


@pytest.mark.asyncio
async def test_create_patient_uid_is_numeric_and_6_digits(auth_client, db_session):
    """UID must be 6-digit numeric."""
    response = auth_client.post(
        "/caregiver/patients",
        json={
            "full_name": "Test Patient",
            "password": "securepass123",
        },
    )
    assert response.status_code == 201
    uid = response.json()["patient"]["uid"]
    assert len(uid) == 6
    assert uid.isdigit()
    assert uid[0] != "0"  # Should not start with 0


@pytest.mark.asyncio
async def test_create_patient_uid_is_unique(auth_client, db_session):
    """Each patient gets a unique UID."""
    uids = set()
    for i in range(5):
        response = auth_client.post(
            "/caregiver/patients",
            json={
                "full_name": f"Patient {i}",
                "password": "securepass123",
            },
        )
        assert response.status_code == 201
        uids.add(response.json()["patient"]["uid"])
    assert len(uids) == 5


@pytest.mark.asyncio
async def test_create_patient_password_is_hashed(auth_client, db_session):
    """Password is hashed on backend, never stored as plaintext."""
    response = auth_client.post(
        "/caregiver/patients",
        json={
            "full_name": "Hash Test",
            "password": "securepass123",
        },
    )
    assert response.status_code == 201

    # Verify via the database directly
    from sqlalchemy import select
    from app import models

    result = await db_session.execute(select(models.User))
    users = list(result.scalars().all())

    # Find the patient user (email contains patient-)
    patient_users = [u for u in users if "patient-" in (u.email or "")]
    assert len(patient_users) >= 1

    # Password hash should NOT be the plaintext
    for u in patient_users:
        assert u.password_hash != "securepass123"
        assert len(u.password_hash) > 20  # bcrypt hashes are long


@pytest.mark.asyncio
async def test_create_patient_response_never_includes_password(auth_client, db_session):
    """Password should never be in the API response."""
    response = auth_client.post(
        "/caregiver/patients",
        json={
            "full_name": "No Password Response",
            "password": "securepass123",
        },
    )
    assert response.status_code == 201
    data = response.json()
    patient = data["patient"]

    # Should not contain password or password_hash keys
    assert "password" not in patient
    assert "password_hash" not in patient


@pytest.mark.asyncio
async def test_create_patient_with_minimal_data(auth_client, db_session):
    """Only full_name and password are required."""
    response = auth_client.post(
        "/caregiver/patients",
        json={
            "full_name": "Minimal Patient",
            "password": "securepass123",
        },
    )
    assert response.status_code == 201
    patient = response.json()["patient"]
    assert patient["full_name"] == "Minimal Patient"
    assert patient["preferred_name"] == ""
    assert patient["gender"] == ""
    assert patient["preferred_language"] == "en"


@pytest.mark.asyncio
async def test_create_patient_relationship_established(auth_client, db_session):
    """Caregiver-patient relationship is created automatically."""
    response = auth_client.post(
        "/caregiver/patients",
        json={
            "full_name": "Relationship Test",
            "password": "securepass123",
        },
    )
    assert response.status_code == 201

    from sqlalchemy import select
    from app import models

    # Check the relationship exists
    result = await db_session.execute(select(models.CaregiverPatient))
    relationships = list(result.scalars().all())
    assert len(relationships) >= 1


@pytest.mark.asyncio
async def test_create_patient_role_is_patient(auth_client, db_session):
    """Created account has role implied by being a patient user."""
    response = auth_client.post(
        "/caregiver/patients",
        json={
            "full_name": "Role Test",
            "password": "securepass123",
        },
    )
    assert response.status_code == 201

    from sqlalchemy import select
    from app import models

    # Patient user has a patient- email prefix
    result = await db_session.execute(select(models.User))
    users = list(result.scalars().all())
    patient_users = [u for u in users if "patient-" in (u.email or "")]
    assert len(patient_users) >= 1


@pytest.mark.asyncio
async def test_create_patient_password_too_short(auth_client, db_session):
    """Password must be at least 8 characters."""
    response = auth_client.post(
        "/caregiver/patients",
        json={
            "full_name": "Short Password",
            "password": "short",
        },
    )
    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_create_patient_empty_name(auth_client, db_session):
    """Full name is required."""
    response = auth_client.post(
        "/caregiver/patients",
        json={
            "full_name": "",
            "password": "securepass123",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_patient_unauthenticated(client, db_session):
    """Unauthenticated user gets 401."""
    response = client.post(
        "/caregiver/patients",
        json={
            "full_name": "Unauth Test",
            "password": "securepass123",
        },
    )
    assert response.status_code == 401


# ── Patient Listing Tests ──────────────────────────────────


@pytest.mark.asyncio
async def test_list_patients_empty(auth_client, db_session):
    """Caregiver with no patients gets empty list."""
    response = auth_client.get("/caregiver/patients")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_list_patients_after_creation(auth_client, db_session):
    """Created patients appear in the list."""
    auth_client.post(
        "/caregiver/patients",
        json={"full_name": "Listed Patient", "password": "securepass123"},
    )
    response = auth_client.get("/caregiver/patients")
    assert response.status_code == 200
    patients = response.json()
    assert len(patients) >= 1
    assert any(p["full_name"] == "Listed Patient" for p in patients)


@pytest.mark.asyncio
async def test_list_patients_unauthenticated(client, db_session):
    """Unauthenticated user gets 401."""
    response = client.get("/caregiver/patients")
    assert response.status_code == 401


# ── Patient Retrieval Tests ────────────────────────────────


@pytest.mark.asyncio
async def test_get_patient_success(auth_client, db_session):
    """Caregiver can retrieve their own patient."""
    create_resp = auth_client.post(
        "/caregiver/patients",
        json={"full_name": "Get Patient", "password": "securepass123"},
    )
    patient_id = create_resp.json()["patient"]["id"]

    response = auth_client.get(f"/caregiver/patients/{patient_id}")
    assert response.status_code == 200
    assert response.json()["full_name"] == "Get Patient"


@pytest.mark.asyncio
async def test_get_patient_not_found(auth_client, db_session):
    """Nonexistent patient ID returns 404."""
    response = auth_client.get("/caregiver/patients/999999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_patient_unauthenticated(client, db_session):
    """Unauthenticated user gets 401."""
    response = client.get("/caregiver/patients/1")
    assert response.status_code == 401
