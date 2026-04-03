from fastapi import APIRouter
from pydantic import BaseModel
from app.core.crack_utils import check_password_strength, mock_brute_force

router = APIRouter()

class PasswordCheckRequest(BaseModel):
    password: str

class HashCrackRequest(BaseModel):
    hash: str
    wordlist: str

@router.post("/strength")
def api_crack_strength(req: PasswordCheckRequest):
    return check_password_strength(req.password)

@router.post("/brute")
def api_crack_brute(req: HashCrackRequest):
    return mock_brute_force(req.hash, req.wordlist)
