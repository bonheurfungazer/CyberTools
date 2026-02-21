from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.models.crypto import CryptoRequest, CaesarRequest, HashRequest, CryptoActionRequest, RsaEncryptRequest, RsaDecryptRequest
from app.core.crypto_utils import (
    base64_encode, base64_decode, url_encode, url_decode,
    caesar_cipher, md5_hash, sha1_hash, sha256_hash, sha512_hash,
    aes_encrypt_file, aes_decrypt_file, rsa_generate_keys, rsa_encrypt, rsa_decrypt
)
import aiofiles
import base64

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

@router.post("/file/aes-encrypt")
async def api_aes_encrypt_file(file: UploadFile = File(...), key: str = Form(None)):
    contents = await file.read()
    key_bytes = key.encode() if key else None
    encrypted_content, used_key = aes_encrypt_file(contents, key_bytes)
    return {
        "result": base64.b64encode(encrypted_content).decode(),
        "key": used_key.decode()
    }

@router.post("/file/aes-decrypt")
async def api_aes_decrypt_file(file: UploadFile = File(...), key: str = Form(...)):
    contents = await file.read()
    try:
        decrypted_content = aes_decrypt_file(contents, key.encode())
        return {"result": base64.b64encode(decrypted_content).decode()}
    except Exception as e:
         raise HTTPException(status_code=400, detail=f"Decryption failed: {str(e)}")

@router.post("/rsa/generate-keys")
async def api_rsa_generate_keys():
    private_key, public_key = rsa_generate_keys()
    return {"private_key": private_key, "public_key": public_key}

@router.post("/rsa/encrypt")
async def api_rsa_encrypt(req: RsaEncryptRequest):
    try:
        # Note: rsa_encrypt returns base64 string
        encrypted = rsa_encrypt(req.text, req.public_key)
        return {"result": encrypted}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/rsa/decrypt")
async def api_rsa_decrypt(req: RsaDecryptRequest):
    try:
        # req.encrypted_text should be base64 string
        decrypted = rsa_decrypt(req.encrypted_text, req.private_key)
        return {"result": decrypted}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
