from app.core.siem_utils import siem_engine
from app.api.siem import analyze_log_with_ai

def test_siem():
    print("Testing SIEM Engine...")

    # Test Log Parsing (Regex fix: was 192.168.1.10)
    log_line = '192.168.1.10 - - [21/Feb/2026:10:00:00 +0000] "GET /index.html HTTP/1.1" 200 1234'
    parsed = siem_engine.parse_log(log_line, log_type="apache")
    print(f"Parsed Log: {parsed}")
    assert parsed["ip"] == "192.168.1.10"
    assert "200" in parsed["event"]

    # Test Correlation (Brute Force)
    print("Simulating Brute Force...")
    # Using 192.168.1.5
    failed_log = '192.168.1.5 - - [21/Feb/2026:10:01:00 +0000] "POST /login HTTP/1.1" 401 500'
    for _ in range(7): # > 5
        parsed_fail = siem_engine.parse_log(failed_log, log_type="apache")
        siem_engine.correlate(parsed_fail)

    alerts = siem_engine.get_alerts()
    print(f"Alerts: {len(alerts)}")
    # Should have at least 1 alert
    has_alert = any(a["title"] == "Brute Force Detected" and a["source"] == "192.168.1.5" for a in alerts)
    assert has_alert

    # Test AI Integration (Mock Log)
    print("Testing AI Bridge...")
    # Anomaly Log
    # Using a separate dict structure as parse_log creates one
    mock_log = {
        "ip": "10.0.0.5",
        "event": "GET /admin.php?id=1 UNION SELECT 1,2,3... HTTP/1.1 500",
        "request": "A" * 2000,
        "type": "apache",
        "timestamp": "2026-02-21T10:00:00"
    }

    from app.core.siem_ai_bridge import analyze_log_with_ai
    ai_res = analyze_log_with_ai(mock_log)
    print(f"AI Result: {ai_res}")
    assert ai_res["is_anomaly"] == True

    print("SIEM Test Passed")

if __name__ == "__main__":
    test_siem()
