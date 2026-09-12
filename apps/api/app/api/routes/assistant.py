from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.assignment import Assignment
from app.models.course import Course
from app.models.study_session import StudySession

router = APIRouter(
    prefix="/assistant",
    tags=["assistant"],
)


class AssistantRequest(BaseModel):
    message: str


@router.post("")
def ask_assistant(
    request: AssistantRequest,
    db: Session = Depends(get_db),
):
    message = request.message.lower()

    courses = db.scalars(
        select(Course).order_by(Course.id)
    ).all()

    assignments = db.execute(
        select(Assignment, Course)
        .join(Course, Assignment.course_id == Course.id)
        .order_by(Assignment.id)
    ).all()

    study_sessions = db.execute(
        select(StudySession, Course)
        .join(Course, StudySession.course_id == Course.id)
        .order_by(StudySession.id)
    ).all()

    in_progress_sessions = [
        {
            "course": course.name,
            "topic": session.topic,
            "duration_minutes": session.duration_minutes,
        }
        for session, course in study_sessions
        if session.status == "In progress"
    ]

    planned_sessions = [
        {
            "course": course.name,
            "topic": session.topic,
            "duration_minutes": session.duration_minutes,
        }
        for session, course in study_sessions
        if session.status == "Planned"
    ]

    incomplete_assignments = [
        {
            "course": course.name,
            "title": assignment.title,
            "priority": assignment.priority,
            "status": assignment.status,
            "due": assignment.due_date,
        }
        for assignment, course in assignments
        if assignment.status != "Complete"
    ]

    high_priority_assignments = [
        assignment
        for assignment in incomplete_assignments
        if assignment["priority"] == "High priority"
    ]

    lowest_progress_course = None

    if courses:
        lowest_progress_course = min(
            courses,
            key=lambda course: course.progress,
        )

    # --------------------
    # Study recommendation
    # --------------------

    if "study" in message or "what should i do" in message:
        if in_progress_sessions:
            session = in_progress_sessions[0]

            reply = (
                f"Finish your current {session['topic']} session for "
                f"{session['course']} first. It is already in progress "
                f"and is planned for {session['duration_minutes']} minutes."
            )

        elif high_priority_assignments:
            assignment = high_priority_assignments[0]

            related_session = next(
                (
                    session
                    for session in planned_sessions
                    if session["course"] == assignment["course"]
                ),
                None,
            )

            if related_session:
                reply = (
                    f"Your highest priority is {assignment['title']} for "
                    f"{assignment['course']}, which is due {assignment['due']}. "
                    f"I recommend working on your planned "
                    f"{related_session['topic']} study session for "
                    f"{related_session['duration_minutes']} minutes first."
                )
            else:
                reply = (
                    f"Your highest priority is {assignment['title']} for "
                    f"{assignment['course']}. It is marked high priority "
                    f"and is due {assignment['due']}. I recommend focusing "
                    f"your next study session on that course."
                )

        elif planned_sessions:
            session = planned_sessions[0]

            reply = (
                f"I recommend studying {session['topic']} for "
                f"{session['course']} next. You already have a "
                f"{session['duration_minutes']}-minute session planned."
            )

        elif lowest_progress_course:
            reply = (
                f"You do not currently have a planned study session. "
                f"Your lowest-progress course is "
                f"{lowest_progress_course.name} at "
                f"{lowest_progress_course.progress}%, so I would focus "
                f"your next study session there."
            )

        else:
            reply = (
                "You do not currently have enough course or study data "
                "for me to make a recommendation."
            )

    # --------------------
    # Assignment recommendation
    # --------------------

    elif "assignment" in message or "prioritize" in message:
        if high_priority_assignments:
            assignment = high_priority_assignments[0]

            reply = (
                f"Prioritize {assignment['title']} for "
                f"{assignment['course']}. It is marked "
                f"{assignment['priority']} and is due "
                f"{assignment['due']}."
            )

        elif incomplete_assignments:
            assignment = incomplete_assignments[0]

            reply = (
                f"Your next incomplete assignment is "
                f"{assignment['title']} for {assignment['course']}. "
                f"It is due {assignment['due']}."
            )

        else:
            reply = "You currently have no incomplete assignments."

    # --------------------
    # Course progress
    # --------------------

    elif "course" in message or "progress" in message:
        if courses:
            strongest_course = max(
                courses,
                key=lambda course: course.progress,
            )

            weakest_course = min(
                courses,
                key=lambda course: course.progress,
            )

            reply = (
                f"Your highest-progress course is "
                f"{strongest_course.name} at "
                f"{strongest_course.progress}%. "
                f"Your lowest-progress course is "
                f"{weakest_course.name} at "
                f"{weakest_course.progress}%."
            )

        else:
            reply = "You do not currently have any courses."

    # --------------------
    # Fallback
    # --------------------

    else:
        reply = (
            "I can help using your actual CampusMind data. "
            "Try asking what you should study, which assignment to prioritize, "
            "or how your courses are progressing."
        )

    return {
        "message": request.message,
        "reply": reply,
    }
