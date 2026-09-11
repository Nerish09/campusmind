from fastapi import APIRouter

router = APIRouter()


@router.get("/assignments")
def get_assignments():
    return [
        {
            "course": "Operating Systems",
            "title": "Process Scheduling Lab",
            "due": "Tomorrow",
            "priority": "High priority",
            "status": "In progress",
        },
        {
            "course": "Computer Architecture",
            "title": "Cache Memory Worksheet",
            "due": "Friday",
            "priority": "Medium priority",
            "status": "Not started",
        },
        {
            "course": "Software Design & Development",
            "title": "Sprint Retrospective",
            "due": "Next Monday",
            "priority": "Low priority",
            "status": "Complete",
        },
    ]
