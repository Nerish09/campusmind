from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.course import Course
from app.models.study_session import StudySession

router = APIRouter()


# --------------------------------
# Request models
# --------------------------------

class StudySessionCreate(BaseModel):
    course_id: int
    topic: str
    duration_minutes: int
    status: str = "Planned"


class StudySessionUpdate(BaseModel):
    course_id: int | None = None
    topic: str | None = None
    duration_minutes: int | None = None
    status: str | None = None


# --------------------------------
# Helpers
# --------------------------------

ALLOWED_STATUSES = {
    "Planned",
    "In progress",
    "Completed",
}


def serialize_study_session(
    study_session: StudySession,
    course: Course,
):
    return {
        "id": study_session.id,
        "course_id": course.id,
        "subject": course.name,
        "topic": study_session.topic,
        "duration": f"{study_session.duration_minutes} min",
        "duration_minutes": study_session.duration_minutes,
        "status": study_session.status,
    }


# --------------------------------
# GET
# --------------------------------

@router.get("/study-sessions")
def get_study_sessions(
    db: Session = Depends(get_db),
):
    statement = (
        select(StudySession, Course)
        .join(
            Course,
            StudySession.course_id == Course.id,
        )
        .order_by(StudySession.id)
    )

    rows = db.execute(statement).all()

    return [
        serialize_study_session(
            study_session,
            course,
        )
        for study_session, course in rows
    ]


# --------------------------------
# POST
# --------------------------------

@router.post(
    "/study-sessions",
    status_code=201,
)
def create_study_session(
    study_data: StudySessionCreate,
    db: Session = Depends(get_db),
):
    course = db.get(
        Course,
        study_data.course_id,
    )

    if course is None:
        raise HTTPException(
            status_code=404,
            detail="Course not found",
        )

    topic = study_data.topic.strip()

    if not topic:
        raise HTTPException(
            status_code=400,
            detail="Topic is required",
        )

    if study_data.duration_minutes <= 0:
        raise HTTPException(
            status_code=400,
            detail="Duration must be greater than 0",
        )

    if study_data.status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=400,
            detail="Invalid study session status",
        )

    study_session = StudySession(
        course_id=study_data.course_id,
        topic=topic,
        duration_minutes=study_data.duration_minutes,
        status=study_data.status,
    )

    db.add(study_session)
    db.commit()
    db.refresh(study_session)

    return serialize_study_session(
        study_session,
        course,
    )


# --------------------------------
# PATCH
# --------------------------------

@router.patch(
    "/study-sessions/{session_id}",
)
def update_study_session(
    session_id: int,
    study_data: StudySessionUpdate,
    db: Session = Depends(get_db),
):
    study_session = db.get(
        StudySession,
        session_id,
    )

    if study_session is None:
        raise HTTPException(
            status_code=404,
            detail="Study session not found",
        )

    # Course
    if study_data.course_id is not None:
        course = db.get(
            Course,
            study_data.course_id,
        )

        if course is None:
            raise HTTPException(
                status_code=404,
                detail="Course not found",
            )

        study_session.course_id = (
            study_data.course_id
        )

    # Topic
    if study_data.topic is not None:
        topic = study_data.topic.strip()

        if not topic:
            raise HTTPException(
                status_code=400,
                detail="Topic is required",
            )

        study_session.topic = topic

    # Duration
    if study_data.duration_minutes is not None:
        if study_data.duration_minutes <= 0:
            raise HTTPException(
                status_code=400,
                detail="Duration must be greater than 0",
            )

        study_session.duration_minutes = (
            study_data.duration_minutes
        )

    # Status
    if study_data.status is not None:
        if study_data.status not in ALLOWED_STATUSES:
            raise HTTPException(
                status_code=400,
                detail="Invalid study session status",
            )

        study_session.status = (
            study_data.status
        )

    db.commit()
    db.refresh(study_session)

    course = db.get(
        Course,
        study_session.course_id,
    )

    return serialize_study_session(
        study_session,
        course,
    )


# --------------------------------
# DELETE
# --------------------------------

@router.delete(
    "/study-sessions/{session_id}",
    status_code=204,
)
def delete_study_session(
    session_id: int,
    db: Session = Depends(get_db),
):
    study_session = db.get(
        StudySession,
        session_id,
    )

    if study_session is None:
        raise HTTPException(
            status_code=404,
            detail="Study session not found",
        )

    db.delete(study_session)
    db.commit()

    return Response(status_code=204)
