from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import crypto, nmap, metasploit

app = FastAPI(title="CyberTools Backend")

# Middleware CORS pour permettre les requêtes cross-origin depuis le front (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Pour la prod, remplace par ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routes de chaque module
app.include_router(crypto.router, prefix="/crypto", tags=["crypto"])
app.include_router(nmap.router, prefix="/nmap", tags=["nmap"])
app.include_router(metasploit.router, prefix="/metasploit", tags=["metasploit"])