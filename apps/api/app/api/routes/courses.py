from fastapi import APIRouter, Depends, HTTPException, Response
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


class CourseUpdate(BaseModel):
    code: str | None = None
    name: str | None = None
    instructor: str | None = None
    progress: int | None = None


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


@router.patch("/courses/{course_id}")
def update_course(
    course_id: int,
    course_data: CourseUpdate,
    db: Session = Depends(get_db),
):
    course = db.get(Course, course_id)

    if course is None:
        raise HTTPException(
            status_code=404,
            detail="Course not found",
        )

    if course_data.code is not None:
        code = course_data.code.strip()

        if not code:
            raise HTTPException(
                status_code=400,
                detail="Course code is required",
            )

        existing_course = db.scalar(
            select(Course).where(
                Course.code == code,
                Course.id != course_id,
            )
        )

        if existing_course is not None:
            raise HTTPException(
                status_code=409,
                detail="Course code already exists",
            )

        course.code = code

    if course_data.name is not None:
        name = course_data.name.strip()

        if not name:
            raise HTTPException(
                status_code=400,
                detail="Course name is required",
            )

        course.name = name

    if course_data.instructor is not None:
        instructor = course_data.instructor.strip()

        if not instructor:
            raise HTTPException(
                status_code=400,
                detail="Instructor is required",
            )

        course.instructor = instructor

    if course_data.progress is not None:
        if course_data.progress < 0 or course_data.progress > 100:
            raise HTTPException(
                status_code=400,
                detail="Progress must be between 0 and 100",
            )

        course.progress = course_data.progress

    db.commit()
    db.refresh(course)

    return {
        "id": course.id,
        "code": course.code,
        "name": course.name,
        "instructor": course.instructor,
        "progress": course.progress,
    }


@router.delete("/courses/{course_id}", status_code=204)
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
):
    course = db.get(Course, course_id)

    if course is None:
        raise HTTPException(
            status_code=404,
            detail="Course not found",
        )

    db.delete(course)
    db.commit()

    return Response(status_code=204)
