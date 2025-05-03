from pydantic import BaseModel
from typing import Optional

class CryptoRequest(BaseModel):
    text: str

class CaesarRequest(BaseModel):
    text: str
    shift: int

class HashRequest(BaseModel):
    text: str

class CryptoActionRequest(BaseModel):
    action: str
    text: str
    shift: Optional[int] = None  # Pour caesar