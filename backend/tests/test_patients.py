def _patient_payload(**overrides):
    payload = {
        "full_name": "Ramesh Das",
        "preferred_name": "Ramesh",
        "date_of_birth": "1948-03-14",
        "preferred_language": "as",
        "relationship": "child",
    }
    payload.update(overrides)
    return payload


def _auth_client(client, token):
    client.headers.update({"Authorization": f"Bearer {token}"})
    return client


def test_create_patient_success(caregiver_client):
    response = caregiver_client.post("/patients", json=_patient_payload())
    assert response.status_code == 201
    body = response.json()
    assert body["full_name"] == "Ramesh Das"
    assert body["preferred_name"] == "Ramesh"
    assert body["date_of_birth"] == "1948-03-14"
    assert body["preferred_language"] == "as"
    assert body["relationship"] == "child"
    assert body["id"] > 0


def test_create_patient_requires_login(client):
    response = client.post("/patients", json=_patient_payload())
    assert response.status_code == 401


def test_create_patient_wrong_role_forbidden(client, admin_token):
    _auth_client(client, admin_token)
    response = client.post("/patients", json=_patient_payload())
    assert response.status_code == 403


def test_create_patient_duplicate_conflict(caregiver_client):
    first = caregiver_client.post("/patients", json=_patient_payload())
    assert first.status_code == 201
    second = caregiver_client.post(
        "/patients", json=_patient_payload(full_name="Ramesh   Das ")
    )
    assert second.status_code == 409


def test_create_patient_validation_empty_name(caregiver_client):
    response = caregiver_client.post(
        "/patients", json=_patient_payload(full_name="   ")
    )
    assert response.status_code == 422


def test_create_patient_validation_bad_language(caregiver_client):
    response = caregiver_client.post(
        "/patients", json=_patient_payload(preferred_language="zz")
    )
    assert response.status_code == 422


def test_create_patient_validation_bad_relationship(caregiver_client):
    response = caregiver_client.post(
        "/patients", json=_patient_payload(relationship="enemy")
    )
    assert response.status_code == 422


def test_list_patients_returns_only_own(caregiver_client):
    caregiver_client.post("/patients", json=_patient_payload(full_name="Ramesh Das"))
    response = caregiver_client.get("/patients")
    assert response.status_code == 200
    body = response.json()
    assert isinstance(body, list)
    assert len(body) == 1
    assert body[0]["full_name"] == "Ramesh Das"
    assert body[0]["relationship"] == "child"


def test_get_patient_authorized(caregiver_client):
    created = caregiver_client.post("/patients", json=_patient_payload()).json()
    response = caregiver_client.get(f"/patients/{created['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_cross_caregiver_authorization_denied(
    client, caregiver_token, other_caregiver_token
):
    first = _auth_client(client, caregiver_token)
    created = first.post("/patients", json=_patient_payload()).json()
    # Other caregiver cannot fetch this patient (not linked) -> 404
    client.headers.pop("Authorization")
    _auth_client(client, other_caregiver_token)
    response = client.get(f"/patients/{created['id']}")
    assert response.status_code == 404


def test_get_patient_not_found(caregiver_client):
    response = caregiver_client.get("/patients/99999")
    assert response.status_code == 404