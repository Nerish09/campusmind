from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.course import Course

router = APIRouter(prefix="/courses", tags=["courses"])


@router.get("")
def get_courses(db: Session = Depends(get_db)):
    courses = db.scalars(select(Course).order_by(Course.id)).all()

    return [
        {
            "id": course.id,
            "code": course.code,
            "name": course.name,
            "instructor": course.instructor,
            "progress": course.progress,
        }
        for course in courses
    ]
