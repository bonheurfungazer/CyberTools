from pydantic import BaseModel
from typing import Optional

class MetasploitRequest(BaseModel):
    module_type: str
    module: str
    target_host: str
    target_port: Optional[str] = None