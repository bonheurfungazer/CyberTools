import base64
import urllib.parse
import hashlib

def base64_encode(text: str) -> str:
    return base64.b64encode(text.encode()).decode()

def base64_decode(text: str) -> str:
    return base64.b64decode(text.encode()).decode()

def url_encode(text: str) -> str:
    return urllib.parse.quote(text)

def url_decode(text: str) -> str:
    return urllib.parse.unquote(text)

def caesar_cipher(text: str, shift: int) -> str:
    s = shift % 26
    def shift_char(c):
        if 'A' <= c <= 'Z':
            return chr((ord(c) - 65 + s) % 26 + 65)
        elif 'a' <= c <= 'z':
            return chr((ord(c) - 97 + s) % 26 + 97)
        else:
            return c
    return ''.join(shift_char(c) for c in text)

def md5_hash(text: str) -> str:
    return hashlib.md5(text.encode()).hexdigest()

def sha1_hash(text: str) -> str:
    return hashlib.sha1(text.encode()).hexdigest()

def sha256_hash(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()

def sha512_hash(text: str) -> str:
    return hashlib.sha512(text.encode()).hexdigest()