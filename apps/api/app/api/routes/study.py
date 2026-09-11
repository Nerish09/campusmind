from fastapi import APIRouter

router = APIRouter()


@router.get("/study-sessions")
def get_study_sessions():
    return [
        {
            "subject": "Operating Systems",
            "topic": "CPU Scheduling",
            "duration": "50 min",
            "status": "Completed",
        },
        {
            "subject": "Computer Architecture",
            "topic": "Cache Mapping",
            "duration": "35 min",
            "status": "Completed",
        },
        {
            "subject": "Software Design & Development",
            "topic": "Design Patterns",
            "duration": "60 min",
            "status": "Planned",
        },
    ]
