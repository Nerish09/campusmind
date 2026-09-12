from sqlalchemy import delete

from app.database import SessionLocal
from app.models.assignment import Assignment
from app.models.course import Course
from app.models.study_session import StudySession


def seed_demo_data():
    db = SessionLocal()

    try:
        db.execute(delete(StudySession))
        db.execute(delete(Assignment))
        db.execute(delete(Course))

        db.commit()

        operating_systems = Course(
            code="CS 3013",
            name="Operating Systems",
            instructor="Dr. Carter",
            progress=68,
        )

        computer_architecture = Course(
            code="CS 3023",
            name="Computer Architecture",
            instructor="Dr. Nguyen",
            progress=54,
        )

        software_design = Course(
            code="CS 3203",
            name="Software Design & Development",
            instructor="Dr. Patel",
            progress=76,
        )

        db.add_all(
            [
                operating_systems,
                computer_architecture,
                software_design,
            ]
        )

        db.flush()

        db.add_all(
            [
                Assignment(
                    course_id=operating_systems.id,
                    title="Process Scheduling Lab",
                    due_date="Tomorrow",
                    priority="High priority",
                    status="In progress",
                ),
                Assignment(
                    course_id=computer_architecture.id,
                    title="Cache Memory Worksheet",
                    due_date="Friday",
                    priority="Medium priority",
                    status="Not started",
                ),
                Assignment(
                    course_id=software_design.id,
                    title="Sprint Retrospective",
                    due_date="Next Monday",
                    priority="Low priority",
                    status="Complete",
                ),
            ]
        )

        db.add_all(
            [
                StudySession(
                    course_id=operating_systems.id,
                    topic="CPU Scheduling",
                    duration_minutes=50,
                    status="Completed",
                ),
                StudySession(
                    course_id=computer_architecture.id,
                    topic="Cache Mapping",
                    duration_minutes=35,
                    status="Completed",
                ),
                StudySession(
                    course_id=software_design.id,
                    topic="Design Patterns",
                    duration_minutes=60,
                    status="Planned",
                ),
                StudySession(
                    course_id=operating_systems.id,
                    topic="Memory Management",
                    duration_minutes=45,
                    status="Completed",
                ),
            ]
        )

        db.commit()

        print("CampusMind demo data seeded successfully.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_data()
