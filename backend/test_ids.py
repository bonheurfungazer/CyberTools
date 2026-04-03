from app.core.ids_utils import ids_engine
from scapy.all import IP, TCP, Raw

def test_ids():
    print("Testing IDS Engine...")

    # Mocking a packet
    # Scapy packet construction
    # Note: Raw load is not automatically processed as payload by `bytes(packet[TCP].payload)`
    # unless we use Raw layer or access it correctly.

    # Let's recreate packet exactly as ids_utils expects
    packet_xss = IP(src="192.168.1.50")/TCP(dport=80)/Raw(load=b"GET /?q=<script>alert(1)</script> HTTP/1.1")

    # Inject packet
    ids_engine.process_packet(packet_xss)

    alerts = ids_engine.get_alerts()
    print(f"Alerts: {alerts}")

    # Alert 0 might be "IPS Block Action", Alert 1 "XSS Attempt" (LIFO deque)
    # Check if ANY alert is XSS
    has_xss = any(a["title"] == "XSS Attempt" for a in alerts)
    assert has_xss, "XSS Alert not found"

    # Check IPS Blocking
    blocklist = ids_engine.get_blocklist()
    print(f"Blocklist: {blocklist}")
    assert "192.168.1.50" in blocklist

    # Test Unblock
    ids_engine.unblock_ip("192.168.1.50")
    assert "192.168.1.50" not in ids_engine.get_blocklist()

    print("IDS Test Passed")

if __name__ == "__main__":
    test_ids()
