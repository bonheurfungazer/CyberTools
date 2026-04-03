from scapy.all import rdpcap, IP, TCP, UDP
import os

def analyze_pcap(filepath: str):
    """
    Reads a pcap file and returns a summary.
    """
    if not os.path.exists(filepath):
        return {"error": "File not found"}

    try:
        packets = rdpcap(filepath)
        summary = {
            "total_packets": len(packets),
            "protocols": {"TCP": 0, "UDP": 0, "ICMP": 0, "Other": 0},
            "src_ips": {},
            "dst_ips": {},
            "conversations": []
        }

        for pkt in packets:
            if IP in pkt:
                src = pkt[IP].src
                dst = pkt[IP].dst

                # Count Protocols
                if TCP in pkt:
                    summary["protocols"]["TCP"] += 1
                elif UDP in pkt:
                    summary["protocols"]["UDP"] += 1
                else:
                    # Simple check for ICMP
                    if pkt[IP].proto == 1:
                        summary["protocols"]["ICMP"] += 1
                    else:
                        summary["protocols"]["Other"] += 1

                # Count IPs
                summary["src_ips"][src] = summary["src_ips"].get(src, 0) + 1
                summary["dst_ips"][dst] = summary["dst_ips"].get(dst, 0) + 1

                # Track conversations (limit to first 50 unique for demo)
                conv = f"{src} -> {dst}"
                if len(summary["conversations"]) < 50 and conv not in summary["conversations"]:
                    summary["conversations"].append(conv)

        # Sort IPs by count
        summary["src_ips"] = dict(sorted(summary["src_ips"].items(), key=lambda item: item[1], reverse=True)[:10])
        summary["dst_ips"] = dict(sorted(summary["dst_ips"].items(), key=lambda item: item[1], reverse=True)[:10])

        return summary
    except Exception as e:
        return {"error": str(e)}
