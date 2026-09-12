from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def get_course_id():
    response = client.get("/courses")

    assert response.status_code == 200

    courses = response.json()

    assert len(courses) > 0

    return courses[0]["id"]


def test_assignment_crud():
    course_id = get_course_id()

    create_response = client.post(
        "/assignments",
        json={
            "course_id": course_id,
            "title": "Automated CRUD Assignment",
            "due_date": "Next Friday",
            "priority": "Medium priority",
            "status": "Not started",
        },
    )

    assert create_response.status_code == 201

    assignment = create_response.json()
    assignment_id = assignment["id"]

    assert assignment["title"] == "Automated CRUD Assignment"
    assert assignment["priority"] == "Medium priority"
    assert assignment["status"] == "Not started"

    update_response = client.patch(
        f"/assignments/{assignment_id}",
        json={
            "priority": "High priority",
            "status": "In progress",
        },
    )

    assert update_response.status_code == 200

    updated_assignment = update_response.json()

    assert updated_assignment["priority"] == "High priority"
    assert updated_assignment["status"] == "In progress"

    delete_response = client.delete(
        f"/assignments/{assignment_id}"
    )

    assert delete_response.status_code == 204

    second_delete_response = client.delete(
        f"/assignments/{assignment_id}"
    )

    assert second_delete_response.status_code == 404


def test_assignment_invalid_course():
    response = client.post(
        "/assignments",
        json={
            "course_id": 999999999,
            "title": "Invalid Assignment",
            "due_date": "Tomorrow",
            "priority": "Medium priority",
            "status": "Not started",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Course not found"


def test_invalid_assignment_priority():
    course_id = get_course_id()

    response = client.post(
        "/assignments",
        json={
            "course_id": course_id,
            "title": "Invalid Priority Assignment",
            "due_date": "Tomorrow",
            "priority": "Critical",
            "status": "Not started",
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid assignment priority"


def test_invalid_assignment_status():
    course_id = get_course_id()

    response = client.post(
        "/assignments",
        json={
            "course_id": course_id,
            "title": "Invalid Status Assignment",
            "due_date": "Tomorrow",
            "priority": "Medium priority",
            "status": "Blocked",
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid assignment status"


def test_update_nonexistent_assignment():
    response = client.patch(
        "/assignments/999999999",
        json={
            "status": "Complete",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Assignment not found"


def test_delete_nonexistent_assignment():
    response = client.delete(
        "/assignments/999999999"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Assignment not found"
