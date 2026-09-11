from fastapi import APIRouter

router = APIRouter(prefix="/courses", tags=["courses"])

courses = [
    {
        "code": "CS 3013",
        "name": "Operating Systems",
        "instructor": "Dr. Carter",
        "progress": 68,
    },
    {
        "code": "CS 3023",
        "name": "Computer Architecture",
        "instructor": "Dr. Nguyen",
        "progress": 54,
    },
    {
        "code": "CS 3203",
        "name": "Software Design & Development",
        "instructor": "Dr. Patel",
        "progress": 76,
    },
]


@router.get("")
def get_courses():
    return courses
