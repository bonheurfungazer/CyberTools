from fastapi import APIRouter
from pydantic import BaseModel
from app.core.webscan_utils import scan_http_headers, mock_vulnerability_scan

router = APIRouter()

class WebScanRequest(BaseModel):
    url: str

@router.post("/headers")
def api_webscan_headers(req: WebScanRequest):
    return scan_http_headers(req.url)

@router.post("/vuln")
def api_webscan_vuln(req: WebScanRequest):
    return mock_vulnerability_scan(req.url)
