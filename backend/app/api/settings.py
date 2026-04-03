from fastapi import APIRouter
from pydantic import BaseModel
from app.core.settings import load_settings, save_settings

router = APIRouter()

class SettingsModel(BaseModel):
    theme: str
    defaultScanType: str
    autoSave: bool
    notifications: bool

@router.get("/")
def get_settings():
    return load_settings()

@router.post("/")
def update_settings(settings: SettingsModel):
    return save_settings(settings.model_dump())
