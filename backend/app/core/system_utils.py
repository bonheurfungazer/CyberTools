import psutil
import time

def get_system_stats():
    """
    Returns system statistics: CPU usage, RAM usage, and Disk usage.
    """
    cpu_percent = psutil.cpu_percent(interval=0.5)

    memory = psutil.virtual_memory()
    ram_percent = memory.percent
    ram_used_gb = round(memory.used / (1024**3), 2)
    ram_total_gb = round(memory.total / (1024**3), 2)

    disk = psutil.disk_usage('/')
    disk_percent = disk.percent

    # Network traffic (bytes sent/recv)
    net_io = psutil.net_io_counters()

    return {
        "cpu": cpu_percent,
        "ram": {
            "percent": ram_percent,
            "used_gb": ram_used_gb,
            "total_gb": ram_total_gb
        },
        "disk": disk_percent,
        "network": {
            "sent_mb": round(net_io.bytes_sent / (1024**2), 2),
            "recv_mb": round(net_io.bytes_recv / (1024**2), 2)
        }
    }
