from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.course import Course

router = APIRouter()


class CourseCreate(BaseModel):
    code: str
    name: str
    instructor: str
    progress: int = 0


@router.get("/courses")
def get_courses(db: Session = Depends(get_db)):
    courses = db.scalars(
        select(Course).order_by(Course.id)
    ).all()

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


@router.post("/courses", status_code=201)
def create_course(
    course_data: CourseCreate,
    db: Session = Depends(get_db),
):
    code = course_data.code.strip()
    name = course_data.name.strip()
    instructor = course_data.instructor.strip()

    if not code:
        raise HTTPException(
            status_code=400,
            detail="Course code is required",
        )

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Course name is required",
        )

    if not instructor:
        raise HTTPException(
            status_code=400,
            detail="Instructor is required",
        )

    if course_data.progress < 0 or course_data.progress > 100:
        raise HTTPException(
            status_code=400,
            detail="Progress must be between 0 and 100",
        )

    existing_course = db.scalar(
        select(Course).where(Course.code == code)
    )

    if existing_course is not None:
        raise HTTPException(
            status_code=409,
            detail="Course code already exists",
        )

    course = Course(
        code=code,
        name=name,
        instructor=instructor,
        progress=course_data.progress,
    )

    db.add(course)
    db.commit()
    db.refresh(course)

    return {
        "id": course.id,
        "code": course.code,
        "name": course.name,
        "instructor": course.instructor,
        "progress": course.progress,
    }
