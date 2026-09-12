from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.course import Course
from app.models.study_session import StudySession

router = APIRouter()


class StudySessionCreate(BaseModel):
    course_id: int
    topic: str
    duration_minutes: int
    status: str = "Planned"


class StudySessionUpdate(BaseModel):
    status: str


@router.get("/study-sessions")
def get_study_sessions(db: Session = Depends(get_db)):
    statement = (
        select(StudySession, Course)
        .join(Course, StudySession.course_id == Course.id)
        .order_by(StudySession.id)
    )

    rows = db.execute(statement).all()

    return [
        {
            "id": session.id,
            "subject": course.name,
            "topic": session.topic,
            "duration": f"{session.duration_minutes} min",
            "status": session.status,
        }
        for session, course in rows
    ]


@router.post("/study-sessions", status_code=201)
def create_study_session(
    session_data: StudySessionCreate,
    db: Session = Depends(get_db),
):
    course = db.get(Course, session_data.course_id)

    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")

    if session_data.duration_minutes <= 0:
        raise HTTPException(
            status_code=400,
            detail="Duration must be greater than 0",
        )

    allowed_statuses = {"Planned", "In progress", "Completed"}

    if session_data.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid study session status",
        )

    study_session = StudySession(
        course_id=session_data.course_id,
        topic=session_data.topic.strip(),
        duration_minutes=session_data.duration_minutes,
        status=session_data.status,
    )

    db.add(study_session)
    db.commit()
    db.refresh(study_session)

    return {
        "id": study_session.id,
        "subject": course.name,
        "topic": study_session.topic,
        "duration": f"{study_session.duration_minutes} min",
        "status": study_session.status,
    }


@router.patch("/study-sessions/{session_id}")
def update_study_session(
    session_id: int,
    session_data: StudySessionUpdate,
    db: Session = Depends(get_db),
):
    study_session = db.get(StudySession, session_id)

    if study_session is None:
        raise HTTPException(
            status_code=404,
            detail="Study session not found",
        )

    allowed_statuses = {"Planned", "In progress", "Completed"}

    if session_data.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid study session status",
        )

    study_session.status = session_data.status

    db.commit()
    db.refresh(study_session)

    return {
        "id": study_session.id,
        "status": study_session.status,
    }


@router.delete("/study-sessions/{session_id}", status_code=204)
def delete_study_session(
    session_id: int,
    db: Session = Depends(get_db),
):
    study_session = db.get(StudySession, session_id)

    if study_session is None:
        raise HTTPException(
            status_code=404,
            detail="Study session not found",
        )

    db.delete(study_session)
    db.commit()

    return Response(status_code=204)
