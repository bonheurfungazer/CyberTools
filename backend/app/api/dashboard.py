from fastapi import APIRouter
from app.core.system_utils import get_system_stats

router = APIRouter()

@router.get("/stats")
def api_dashboard_stats():
    return get_system_stats()
