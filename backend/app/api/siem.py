from fastapi import APIRouter
from app.core.siem_utils import siem_engine
from app.core.siem_ai_bridge import analyze_log_with_ai

router = APIRouter()

@router.get("/logs")
def api_siem_logs():
    return siem_engine.get_logs()

@router.get("/alerts")
def api_siem_alerts():
    return siem_engine.get_alerts()

@router.get("/status")
def api_siem_status():
    return {
        "status": "Running",
        "log_count": len(siem_engine.logs),
        "alert_count": len(siem_engine.alerts)
    }

# Endpoint to manually feed a log (Demo)
@router.post("/feed")
def api_siem_feed(log_line: str):
    parsed_log = siem_engine.parse_log(log_line)
    # Also run AI analysis
    ai_result = analyze_log_with_ai(parsed_log)
    parsed_log["ai_analysis"] = ai_result
    return parsed_log
