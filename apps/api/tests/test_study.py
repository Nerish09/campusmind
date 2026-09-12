from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def get_operating_systems_course_id():
    response = client.get("/courses")

    assert response.status_code == 200

    courses = response.json()

    course = next(
        (
            course
            for course in courses
            if course["code"] == "CS 3013"
        ),
        None,
    )

    assert course is not None

    return course["id"]


def test_get_study_sessions():
    response = client.get("/study-sessions")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_study_session():
    course_id = get_operating_systems_course_id()

    payload = {
        "course_id": course_id,
        "topic": "API Testing",
        "duration_minutes": 30,
        "status": "Planned",
    }

    response = client.post("/study-sessions", json=payload)

    assert response.status_code == 201

    data = response.json()

    assert "id" in data
    assert data["subject"] == "Operating Systems"
    assert data["topic"] == "API Testing"
    assert data["duration"] == "30 min"
    assert data["status"] == "Planned"

    delete_response = client.delete(
        f"/study-sessions/{data['id']}"
    )

    assert delete_response.status_code == 204


def test_create_study_session_invalid_duration():
    course_id = get_operating_systems_course_id()

    payload = {
        "course_id": course_id,
        "topic": "Invalid Duration",
        "duration_minutes": -10,
        "status": "Planned",
    }

    response = client.post("/study-sessions", json=payload)

    assert response.status_code == 400
    assert (
        response.json()["detail"]
        == "Duration must be greater than 0"
    )


def test_create_study_session_invalid_course():
    payload = {
        "course_id": 999999,
        "topic": "Missing Course",
        "duration_minutes": 30,
        "status": "Planned",
    }

    response = client.post("/study-sessions", json=payload)

    assert response.status_code == 404
    assert response.json()["detail"] == "Course not found"


def test_update_nonexistent_study_session():
    payload = {
        "status": "Completed",
    }

    response = client.patch(
        "/study-sessions/999999999",
        json=payload,
    )

    assert response.status_code == 404


def test_delete_nonexistent_study_session():
    response = client.delete("/study-sessions/999999999")

    assert response.status_code == 404
