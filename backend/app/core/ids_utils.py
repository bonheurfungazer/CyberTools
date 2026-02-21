import threading
from scapy.all import sniff, IP, TCP, Raw
import datetime
from collections import deque
import time

class IdsEngine:
    def __init__(self):
        self.is_running = False
        self.blocklist = set()
        self.alerts = deque(maxlen=100)
        self.stop_event = threading.Event()
        self.thread = None

        # Simple signatures
        self.signatures = [
            {"name": "SQL Injection", "pattern": b"UNION SELECT"},
            {"name": "XSS Attempt", "pattern": b"<script>"},
            {"name": "Path Traversal", "pattern": b"../.."},
        ]

    def start_sniffing(self, interface=None):
        if self.is_running: return
        self.is_running = True
        self.stop_event.clear()

        # Run sniffing in background thread
        # daemon=True ensures thread exits when main program exits
        self.thread = threading.Thread(target=self._sniff_loop, args=(interface,), daemon=True)
        self.thread.start()

    def stop_sniffing(self):
        self.is_running = False
        self.stop_event.set()
        # Do not join here, as sniff loop might block waiting for packets
        # Just set the flag and let the lambda stop_filter handle it

    def _sniff_loop(self, interface):
        try:
            # Use a lambda for stop_filter that checks our event
            sniff(
                filter="ip",
                prn=self.process_packet,
                store=0,
                stop_filter=lambda x: self.stop_event.is_set(),
                iface=interface,
                timeout=None # Run indefinitely until stop_filter returns True
            )
        except Exception as e:
            print(f"IDS Sniff Error: {e}")
        finally:
            self.is_running = False

    def process_packet(self, packet):
        if not packet.haslayer(IP): return

        src_ip = packet[IP].src

        # Check Blocklist (IPS Simulation)
        if src_ip in self.blocklist:
            return

        # Signature Matching
        if packet.haslayer(TCP):
            tcp_layer = packet[TCP]
            # Handle payload safely
            try:
                payload = bytes(tcp_layer.payload)
            except:
                payload = b""

            flags = tcp_layer.flags

            # Pattern matching
            for sig in self.signatures:
                if "pattern" in sig and sig["pattern"] in payload:
                    self.trigger_alert(sig["name"], "High", src_ip, f"Payload detected: {sig['pattern']}")
                    self.block_ip(src_ip)

            # Flag matching (Xmas Scan: FIN=1, PSH=1, URG=1 -> 0x29)
            # Scapy flags can be compared to int or string
            if flags == 0x29:
                 self.trigger_alert("Nmap Xmas Scan", "Medium", src_ip, "Suspicious TCP Flags: FPU")

    def trigger_alert(self, title, severity, source, description):
        alert = {
            "timestamp": datetime.datetime.now().isoformat(),
            "title": title,
            "severity": severity,
            "source": source,
            "description": description
        }
        self.alerts.appendleft(alert)

    def block_ip(self, ip):
        if ip not in self.blocklist:
            self.blocklist.add(ip)
            self.trigger_alert("IPS Block Action", "High", ip, f"IP {ip} added to blocklist due to malicious activity.")

    def unblock_ip(self, ip):
        if ip in self.blocklist:
            self.blocklist.remove(ip)

    def get_alerts(self):
        return list(self.alerts)

    def get_blocklist(self):
        return list(self.blocklist)

# Singleton
ids_engine = IdsEngine()
