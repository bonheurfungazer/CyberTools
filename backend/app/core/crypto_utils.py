import base64
import urllib.parse
import hashlib
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.backends import default_backend

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

# --- New AES Functions ---

def aes_encrypt_file(file_content: bytes, key: bytes = None):
    """
    Encrypts file content using AES (Fernet).
    If key is not provided, generates a new one.
    Returns (encrypted_content, key).
    """
    if not key:
        key = Fernet.generate_key()
    f = Fernet(key)
    encrypted_content = f.encrypt(file_content)
    return encrypted_content, key

def aes_decrypt_file(file_content: bytes, key: bytes):
    """
    Decrypts file content using AES (Fernet).
    Returns decrypted_content.
    """
    f = Fernet(key)
    decrypted_content = f.decrypt(file_content)
    return decrypted_content

# --- New RSA Functions ---

def rsa_generate_keys():
    """
    Generates a new RSA key pair.
    Returns (private_key_pem, public_key_pem) as strings.
    """
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )
    public_key = private_key.public_key()

    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    ).decode()

    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode()

    return private_pem, public_pem

def rsa_encrypt(text: str, public_key_pem: str) -> str:
    """
    Encrypts text using RSA public key.
    Returns base64 encoded encrypted string.
    """
    public_key = serialization.load_pem_public_key(
        public_key_pem.encode(),
        backend=default_backend()
    )
    encrypted = public_key.encrypt(
        text.encode(),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return base64.b64encode(encrypted).decode()

def rsa_decrypt(encrypted_base64: str, private_key_pem: str) -> str:
    """
    Decrypts base64 encoded encrypted string using RSA private key.
    Returns decrypted text.
    """
    private_key = serialization.load_pem_private_key(
        private_key_pem.encode(),
        password=None,
        backend=default_backend()
    )
    encrypted_data = base64.b64decode(encrypted_base64)
    decrypted = private_key.decrypt(
        encrypted_data,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return decrypted.decode()
