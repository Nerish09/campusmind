from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.assignment import Assignment
from app.models.course import Course

router = APIRouter()


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
            "course": course.name,
            "title": assignment.title,
            "due": assignment.due_date,
            "priority": assignment.priority,
            "status": assignment.status,
        }
        for assignment, course in rows
    ]
