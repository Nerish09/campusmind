from datetime import datetime, timezone

from fastapi import APIRouter

router = APIRouter(tags=["system"])


@router.get("/health")
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "campusmind-api",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
