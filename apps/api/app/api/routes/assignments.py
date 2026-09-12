from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.assignment import Assignment
from app.models.course import Course

router = APIRouter()


class AssignmentCreate(BaseModel):
    course_id: int
    title: str
    due_date: str
    priority: str
    status: str


class AssignmentUpdate(BaseModel):
    course_id: int | None = None
    title: str | None = None
    due_date: str | None = None
    priority: str | None = None
    status: str | None = None


@router.get("/assignments")
def get_assignments(db: Session = Depends(get_db)):
    statement = (
        select(Assignment, Course)
        .join(Course, Assignment.course_id == Course.id)
        .order_by(Assignment.id)
    )

    rows = db.execute(statement).all()

    return [
        {
            "id": assignment.id,
            "course_id": course.id,
            "course": course.name,
            "title": assignment.title,
            "due": assignment.due_date,
            "priority": assignment.priority,
            "status": assignment.status,
        }
        for assignment, course in rows
    ]


@router.post("/assignments", status_code=201)
def create_assignment(
    assignment_data: AssignmentCreate,
    db: Session = Depends(get_db),
):
    course = db.get(Course, assignment_data.course_id)

    if course is None:
        raise HTTPException(
            status_code=404,
            detail="Course not found",
        )

    title = assignment_data.title.strip()
    due_date = assignment_data.due_date.strip()
    priority = assignment_data.priority.strip()
    status = assignment_data.status.strip()

    if not title:
        raise HTTPException(
            status_code=400,
            detail="Assignment title is required",
        )

    if not due_date:
        raise HTTPException(
            status_code=400,
            detail="Due date is required",
        )

    allowed_priorities = {
        "Low priority",
        "Medium priority",
        "High priority",
    }

    if priority not in allowed_priorities:
        raise HTTPException(
            status_code=400,
            detail="Invalid assignment priority",
        )

    allowed_statuses = {
        "Not started",
        "In progress",
        "Complete",
    }

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid assignment status",
        )

    assignment = Assignment(
        course_id=assignment_data.course_id,
        title=title,
        due_date=due_date,
        priority=priority,
        status=status,
    )

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return {
        "id": assignment.id,
        "course_id": course.id,
        "course": course.name,
        "title": assignment.title,
        "due": assignment.due_date,
        "priority": assignment.priority,
        "status": assignment.status,
    }


@router.patch("/assignments/{assignment_id}")
def update_assignment(
    assignment_id: int,
    assignment_data: AssignmentUpdate,
    db: Session = Depends(get_db),
):
    assignment = db.get(Assignment, assignment_id)

    if assignment is None:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found",
        )

    if assignment_data.course_id is not None:
        course = db.get(Course, assignment_data.course_id)

        if course is None:
            raise HTTPException(
                status_code=404,
                detail="Course not found",
            )

        assignment.course_id = assignment_data.course_id

    if assignment_data.title is not None:
        title = assignment_data.title.strip()

        if not title:
            raise HTTPException(
                status_code=400,
                detail="Assignment title is required",
            )

        assignment.title = title

    if assignment_data.due_date is not None:
        due_date = assignment_data.due_date.strip()

        if not due_date:
            raise HTTPException(
                status_code=400,
                detail="Due date is required",
            )

        assignment.due_date = due_date

    if assignment_data.priority is not None:
        allowed_priorities = {
            "Low priority",
            "Medium priority",
            "High priority",
        }

        priority = assignment_data.priority.strip()

        if priority not in allowed_priorities:
            raise HTTPException(
                status_code=400,
                detail="Invalid assignment priority",
            )

        assignment.priority = priority

    if assignment_data.status is not None:
        allowed_statuses = {
            "Not started",
            "In progress",
            "Complete",
        }

        status = assignment_data.status.strip()

        if status not in allowed_statuses:
            raise HTTPException(
                status_code=400,
                detail="Invalid assignment status",
            )

        assignment.status = status

    db.commit()
    db.refresh(assignment)

    course = db.get(Course, assignment.course_id)

    return {
        "id": assignment.id,
        "course_id": course.id,
        "course": course.name,
        "title": assignment.title,
        "due": assignment.due_date,
        "priority": assignment.priority,
        "status": assignment.status,
    }


@router.delete("/assignments/{assignment_id}", status_code=204)
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
):
    assignment = db.get(Assignment, assignment_id)

    if assignment is None:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found",
        )

    db.delete(assignment)
    db.commit()

    return Response(status_code=204)
