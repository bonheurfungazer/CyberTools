from fastapi import APIRouter, Response
from pydantic import BaseModel
from typing import Dict, Any
from app.core.report_utils import generate_pdf_report

router = APIRouter()

class ReportRequest(BaseModel):
    report_type: str
    data: Dict[str, Any]

@router.post("/pdf")
def api_report_pdf(req: ReportRequest):
    pdf_buffer = generate_pdf_report(req.report_type, req.data)
    headers = {'Content-Disposition': f'attachment; filename="cybertools_{req.report_type}.pdf"'}
    return Response(content=pdf_buffer.getvalue(), headers=headers, media_type="application/pdf")
