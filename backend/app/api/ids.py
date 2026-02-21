from fastapi import APIRouter
from app.core.ids_utils import ids_engine

router = APIRouter()

@router.post("/start")
def api_ids_start(interface: str = None):
    ids_engine.start_sniffing(interface)
    return {"status": "Started", "interface": interface}

@router.post("/stop")
def api_ids_stop():
    ids_engine.stop_sniffing()
    return {"status": "Stopped"}

@router.get("/alerts")
def api_ids_alerts():
    return ids_engine.get_alerts()

@router.get("/blocklist")
def api_ids_blocklist():
    return list(ids_engine.blocklist)

@router.post("/unblock")
def api_ids_unblock(ip: str):
    ids_engine.unblock_ip(ip)
    return {"status": "Unblocked", "ip": ip}
