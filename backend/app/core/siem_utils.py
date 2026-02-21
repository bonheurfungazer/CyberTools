import re
import datetime
from collections import deque, Counter
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

LOG_PATTERN_APACHE = r'(\d+\.\d+\.\d+\.\d+) - - \[(.*?)\] "(.*?)" (\d+) (\d+)'
LOG_PATTERN_SSHD = r'(\w+ \d+ \d+:\d+:\d+) (\w+) sshd\[(\d+)\]: (.*)'

class SiemEngine:
    def __init__(self):
        self.logs = deque(maxlen=1000) # Store last 1000 logs
        self.alerts = deque(maxlen=100)
        self.ip_tracker = Counter()
        self.failed_logins = Counter()

    def parse_log(self, log_line: str, log_type="apache"):
        """
        Parses a log line and returns a structured dict.
        """
        log_entry = {
            "raw": log_line,
            "timestamp": datetime.datetime.now().isoformat(),
            "type": log_type,
            "ip": "0.0.0.0",
            "event": "Unknown"
        }

        if log_type == "apache":
            match = re.match(LOG_PATTERN_APACHE, log_line)
            if match:
                log_entry["ip"] = match.group(1)
                log_entry["event"] = f"{match.group(3)} (Status: {match.group(4)})"

        elif log_type == "sshd":
            match = re.match(LOG_PATTERN_SSHD, log_line)
            if match:
                log_entry["timestamp"] = match.group(1) # Use log timestamp if available
                log_entry["event"] = match.group(4)
                # Try extract IP from message
                ip_match = re.search(r'from (\d+\.\d+\.\d+\.\d+)', match.group(4))
                if ip_match:
                    log_entry["ip"] = ip_match.group(1)

        self.logs.appendleft(log_entry)
        self.correlate(log_entry)
        return log_entry

    def correlate(self, log_entry):
        """
        Analyzes the log entry for patterns (Brute Force, Port Scan).
        """
        ip = log_entry["ip"]
        event = log_entry["event"]

        if ip == "0.0.0.0": return

        # Rule 1: Brute Force Detection (SSHD or 401/403 errors)
        if "Failed password" in event or "401" in event or "403" in event:
            self.failed_logins[ip] += 1
            if self.failed_logins[ip] > 5:
                self.trigger_alert("Brute Force Detected", "High", ip, f"> 5 failed attempts from {ip}")
                self.failed_logins[ip] = 0 # Reset to avoid spamming alerts every request

        # Rule 2: High Traffic (DoS / Scan)
        self.ip_tracker[ip] += 1
        # In a real system, we'd reset this counter periodically.
        # Here we just check total observed in recent buffer.
        if self.ip_tracker[ip] > 50:
             self.trigger_alert("High Traffic / DoS", "Medium", ip, f"> 50 requests from {ip}")
             self.ip_tracker[ip] = 0

    def trigger_alert(self, title, severity, source, description):
        alert = {
            "timestamp": datetime.datetime.now().isoformat(),
            "title": title,
            "severity": severity,
            "source": source,
            "description": description
        }
        self.alerts.appendleft(alert)
        # print(f"[SIEM ALERT] {title}: {description}")

    def get_logs(self):
        return list(self.logs)

    def get_alerts(self):
        return list(self.alerts)

# File Monitoring (Optional Demo)
class LogFileHandler(FileSystemEventHandler):
    def __init__(self, siem_engine):
        self.siem_engine = siem_engine

    def on_modified(self, event):
        if event.src_path.endswith("demo.log"):
            with open(event.src_path, "r") as f:
                lines = f.readlines()
                if lines:
                    last_line = lines[-1].strip()
                    self.siem_engine.parse_log(last_line, log_type="apache")

# Singleton
siem_engine = SiemEngine()

# Start Observer (Optional, disabled for now to avoid threading complexity in initial setup)
# observer = Observer()
# observer.schedule(LogFileHandler(siem_engine), path='.', recursive=False)
# observer.start()
