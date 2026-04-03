from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.core.ai_utils import ai_engine

router = APIRouter()

class LogFeatures(BaseModel):
    request_length: int
    response_code: int
    duration_ms: int
    is_admin_page: int

@router.post("/analyze-log")
def api_ai_analyze(features: LogFeatures):
    """
    Analyzes a single log entry using the AI model.
    """
    feature_vector = [
        features.request_length,
        features.response_code,
        features.duration_ms,
        features.is_admin_page
    ]
    return ai_engine.predict(feature_vector)

@router.post("/train")
def api_ai_train():
    """
    Retrains the AI model on mock data.
    """
    ai_engine.train_on_mock()
    return {"message": "Model retrained successfully"}
