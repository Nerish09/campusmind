from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_course_crud():
    payload = {
        "code": "TEST 9999",
        "name": "Automated Test Course",
        "instructor": "Test Instructor",
        "progress": 10,
    }

    create_response = client.post(
        "/courses",
        json=payload,
    )

    assert create_response.status_code == 201

    course = create_response.json()
    course_id = course["id"]

    assert course["code"] == "TEST 9999"
    assert course["name"] == "Automated Test Course"
    assert course["instructor"] == "Test Instructor"
    assert course["progress"] == 10

    update_response = client.patch(
        f"/courses/{course_id}",
        json={
            "progress": 55,
        },
    )

    assert update_response.status_code == 200

    updated_course = update_response.json()

    assert updated_course["progress"] == 55

    delete_response = client.delete(
        f"/courses/{course_id}"
    )

    assert delete_response.status_code == 204

    second_delete_response = client.delete(
        f"/courses/{course_id}"
    )

    assert second_delete_response.status_code == 404


def test_duplicate_course_code():
    courses_response = client.get("/courses")

    assert courses_response.status_code == 200

    courses = courses_response.json()

    assert len(courses) > 0

    existing_course = courses[0]

    response = client.post(
        "/courses",
        json={
            "code": existing_course["code"],
            "name": "Duplicate Course",
            "instructor": "Test Instructor",
            "progress": 0,
        },
    )

    assert response.status_code == 409
    assert response.json()["detail"] == "Course code already exists"


def test_invalid_course_progress():
    response = client.post(
        "/courses",
        json={
            "code": "TEST BAD",
            "name": "Invalid Progress Course",
            "instructor": "Test Instructor",
            "progress": 150,
        },
    )

    assert response.status_code == 400
    assert (
        response.json()["detail"]
        == "Progress must be between 0 and 100"
    )


def test_update_nonexistent_course():
    response = client.patch(
        "/courses/999999999",
        json={
            "progress": 25,
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Course not found"


def test_delete_nonexistent_course():
    response = client.delete(
        "/courses/999999999"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Course not found"
