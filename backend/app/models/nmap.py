from pydantic import BaseModel
from typing import Optional

class NmapRequest(BaseModel):
    target: str
    scan_type: str
    custom_command: Optional[str] = None