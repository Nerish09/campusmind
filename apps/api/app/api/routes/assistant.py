from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class AssistantRequest(BaseModel):
    message: str


@router.post("/assistant")
def ask_assistant(request: AssistantRequest):
    user_message = request.message

    return {
        "message": user_message,
        "response": (
            "CampusMind AI received your question. "
            "The real AI integration will be added next."
        ),
    }
