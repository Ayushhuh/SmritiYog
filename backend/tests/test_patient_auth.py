"""Tests for patient authentication: login, refresh, logout."""

import pytest


@pytest.mark.asyncio
async def test_patient_login_success(auth_client, db_session):
    """Patient can log in with UID + password."""
    # Create a patient first
    create_resp = auth_client.post(
        "/caregiver/patients",
        json={"full_name": "Login Test", "password": "patient123"},
    )
    assert create_resp.status_code == 201
    uid = create_resp.json()["patient"]["uid"]

    # Login with UID + password
    response = auth_client.post(
        "/auth/patient/login",
        json={"uid": uid, "password": "patient123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["patient"]["uid"] == uid
    assert data["preferred_language"] == "en"


@pytest.mark.asyncio
async def test_patient_login_wrong_password(auth_client, db_session):
    """Wrong password returns 401."""
    create_resp = auth_client.post(
        "/caregiver/patients",
        json={"full_name": "Wrong Pass", "password": "patient123"},
    )
    uid = create_resp.json()["patient"]["uid"]

    response = auth_client.post(
        "/auth/patient/login",
        json={"uid": uid, "password": "wrongpassword"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_patient_login_nonexistent_uid(auth_client, db_session):
    """Non-existent UID returns 401."""
    response = auth_client.post(
        "/auth/patient/login",
        json={"uid": "000000", "password": "patient123"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_refresh_token_rotation(auth_client, db_session):
    """Refresh token rotation issues new tokens and revokes old."""
    # Create and login
    create_resp = auth_client.post(
        "/caregiver/patients",
        json={"full_name": "Refresh Test", "password": "patient123"},
    )
    uid = create_resp.json()["patient"]["uid"]

    login_resp = auth_client.post(
        "/auth/patient/login",
        json={"uid": uid, "password": "patient123"},
    )
    refresh_token = login_resp.json()["refresh_token"]

    # Refresh
    response = auth_client.post(
        "/auth/patient/refresh",
        json={"refresh_token": refresh_token},
    )
    assert response.status_code == 200
    new_refresh = response.json()["refresh_token"]
    assert new_refresh != refresh_token  # Should be different

    # Old refresh token should now be revoked
    response2 = auth_client.post(
        "/auth/patient/refresh",
        json={"refresh_token": refresh_token},
    )
    assert response2.status_code == 401


@pytest.mark.asyncio
async def test_refresh_token_reuse_revokes_family(auth_client, db_session):
    """Reusing a revoked refresh token revokes the entire family."""
    create_resp = auth_client.post(
        "/caregiver/patients",
        json={"full_name": "Reuse Test", "password": "patient123"},
    )
    uid = create_resp.json()["patient"]["uid"]

    login_resp = auth_client.post(
        "/auth/patient/login",
        json={"uid": uid, "password": "patient123"},
    )
    refresh1 = login_resp.json()["refresh_token"]

    # Rotate once
    resp2 = auth_client.post(
        "/auth/patient/refresh",
        json={"refresh_token": refresh1},
    )
    refresh2 = resp2.json()["refresh_token"]

    # Rotate again
    resp3 = auth_client.post(
        "/auth/patient/refresh",
        json={"refresh_token": refresh2},
    )
    refresh3 = resp3.json()["refresh_token"]

    # Try to use refresh2 (already revoked) - should revoke family
    resp_reuse = auth_client.post(
        "/auth/patient/refresh",
        json={"refresh_token": refresh2},
    )
    assert resp_reuse.status_code == 401

    # refresh3 should also be revoked now (family revoked)
    resp4 = auth_client.post(
        "/auth/patient/refresh",
        json={"refresh_token": refresh3},
    )
    assert resp4.status_code == 401


@pytest.mark.asyncio
async def test_logout_revokes_refresh_token(auth_client, db_session):
    """Logout revokes the refresh token."""
    create_resp = auth_client.post(
        "/caregiver/patients",
        json={"full_name": "Logout Test", "password": "patient123"},
    )
    uid = create_resp.json()["patient"]["uid"]

    login_resp = auth_client.post(
        "/auth/patient/login",
        json={"uid": uid, "password": "patient123"},
    )
    refresh_token = login_resp.json()["refresh_token"]

    # Logout
    response = auth_client.post(
        "/auth/patient/logout",
        json={"refresh_token": refresh_token},
    )
    assert response.status_code == 204

    # Refresh should fail after logout
    response2 = auth_client.post(
        "/auth/patient/refresh",
        json={"refresh_token": refresh_token},
    )
    assert response2.status_code == 401


@pytest.mark.asyncio
async def test_patient_auth_response_never_includes_password_hash(
    auth_client, db_session
):
    """Patient auth response should never include password_hash."""
    create_resp = auth_client.post(
        "/caregiver/patients",
        json={"full_name": "No Hash", "password": "patient123"},
    )
    uid = create_resp.json()["patient"]["uid"]

    login_resp = auth_client.post(
        "/auth/patient/login",
        json={"uid": uid, "password": "patient123"},
    )
    data = login_resp.json()
    assert "password" not in str(data).lower() or "password_hash" not in str(data).lower()
    assert "password_hash" not in data.get("patient", {})
