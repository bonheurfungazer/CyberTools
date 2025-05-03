from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.crypto import CryptoRequest, CaesarRequest, HashRequest, CryptoActionRequest
from app.core.crypto_utils import (
    base64_encode, base64_decode, url_encode, url_decode,
    caesar_cipher, md5_hash, sha1_hash, sha256_hash, sha512_hash
)
import aiofiles

router = APIRouter()

@router.post("/action")
async def api_crypto_action(req: CryptoActionRequest):
    try:
        if req.action == "base64_encode":
            return {"result": base64_encode(req.text)}
        elif req.action == "base64_decode":
            return {"result": base64_decode(req.text)}
        elif req.action == "url_encode":
            return {"result": url_encode(req.text)}
        elif req.action == "url_decode":
            return {"result": url_decode(req.text)}
        elif req.action == "caesar_encrypt":
            return {"result": caesar_cipher(req.text, req.shift or 3)}
        elif req.action == "caesar_decrypt":
            return {"result": caesar_cipher(req.text, -(req.shift or 3))}
        elif req.action == "rot13":
            return {"result": caesar_cipher(req.text, 13)}
        elif req.action == "md5_hash":
            return {"result": md5_hash(req.text)}
        elif req.action == "sha1_hash":
            return {"result": sha1_hash(req.text)}
        elif req.action == "sha256_hash":
            return {"result": sha256_hash(req.text)}
        elif req.action == "sha512_hash":
            return {"result": sha512_hash(req.text)}
        else:
            return {"result": f"Action '{req.action}' non implémentée."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/file/base64-encode")
async def api_base64_encode_file(file: UploadFile = File(...)):
    contents = await file.read()
    import base64
    result = base64.b64encode(contents).decode()
    return {"result": result}