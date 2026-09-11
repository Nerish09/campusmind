from fastapi import FastAPI

from app.api.routes.courses import router as courses_router
from app.api.routes.health import router as health_router
from app.core.config import settings


app = FastAPI(
    title="CampusMind API",
    version="0.1.0",
    description="Backend API for the CampusMind student operating system.",
)


app.include_router(health_router)
app.include_router(courses_router)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "service": "campusmind-api",
        "environment": settings.app_env,
        "message": "CampusMind API is running.",
    }
