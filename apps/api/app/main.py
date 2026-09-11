from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.assignments import router as assignments_router
from app.api.routes.assistant import router as assistant_router
from app.api.routes.courses import router as courses_router
from app.api.routes.health import router as health_router
from app.api.routes.study import router as study_router
from app.core.config import settings


app = FastAPI(
    title="CampusMind API",
    version="0.1.0",
    description="Backend API for the CampusMind student operating system.",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(health_router)
app.include_router(courses_router)
app.include_router(assignments_router)
app.include_router(study_router)
app.include_router(assistant_router)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "service": "campusmind-api",
        "environment": settings.app_env,
        "message": "CampusMind API is running.",
    }
