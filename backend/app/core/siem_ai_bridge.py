from app.core.siem_utils import siem_engine
from app.core.ai_utils import ai_engine
import time
import threading

# Use AI engine for log analysis
def analyze_log_with_ai(log_entry):
    """
    Analyzes the log entry using the AI model and potentially triggers an alert.
    """
    # Extract features for AI (Simplified mapping)
    # Features: [request_length, response_code, duration_ms, is_admin_page]

    # Heuristic parsing for feature extraction
    request_len = len(log_entry.get("request", "")) # Simplified
    status_code = 200
    duration = 50
    is_admin = 0

    msg = log_entry.get("event", "")
    if "admin" in msg.lower(): is_admin = 1
    if "403" in msg: status_code = 403
    if "500" in msg: status_code = 500
    if len(msg) > 500: request_len = 1000 # Long payload

    features = [request_len, status_code, duration, is_admin]
    prediction = ai_engine.predict(features)

    if prediction["is_anomaly"]:
        siem_engine.trigger_alert("AI Detected Anomaly", "Critical", log_entry["ip"], f"Unusual traffic pattern detected (Score: {prediction['anomaly_score']:.2f})")

    return prediction
