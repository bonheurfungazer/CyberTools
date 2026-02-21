from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.osint_utils import get_whois_info, get_dns_info, get_ip_geolocation
import whois

router = APIRouter()

class OsintRequest(BaseModel):
    target: str

@router.post("/whois")
def api_osint_whois(req: OsintRequest):
    try:
        # python-whois returns a dictionary that might contain non-serializable objects (datetime)
        # We need to handle that inside get_whois_info or ensure the output is JSON safe.
        # However, `whois` library often returns strings or lists of strings for most fields.
        # But `creation_date` etc are datetime objects.

        info = get_whois_info(req.target)
        if "error" in info:
             raise HTTPException(status_code=400, detail=info["error"])

        # Convert the object to a dictionary if it isn't already (whois.WhoisEntry)
        if hasattr(info, '__dict__'):
            info_dict = info.__dict__
        else:
            info_dict = info

        # Basic cleanup for JSON serialization if needed (handled in utils mostly)
        return {"result": info_dict}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/dns")
def api_osint_dns(req: OsintRequest):
    try:
        info = get_dns_info(req.target)
        return {"result": info}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ipgeo")
def api_osint_ipgeo(req: OsintRequest):
    try:
        info = get_ip_geolocation(req.target)
        return {"result": info}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
