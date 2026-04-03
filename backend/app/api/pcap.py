from fastapi import APIRouter, UploadFile, File
import shutil
import os
from app.core.pcap_utils import analyze_pcap

router = APIRouter()

@router.post("/analyze")
def api_pcap_analyze(file: UploadFile = File(...)):
    # Save file temporarily
    filename = f"temp_{file.filename}"
    try:
        with open(filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = analyze_pcap(filename)
        return result
    finally:
        if os.path.exists(filename):
            os.remove(filename)
