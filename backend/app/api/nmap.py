from fastapi import APIRouter, HTTPException
from app.models.nmap import NmapRequest
from app.core.nmap_utils import run_nmap_scan

router = APIRouter()

@router.post("/scan")
def api_nmap_scan(req: NmapRequest):
    try:
        output = run_nmap_scan(req.target, req.scan_type, req.custom_command)
        return {"result": output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))