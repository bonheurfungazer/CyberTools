from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import crypto, nmap, metasploit, settings, dashboard, osint, webscan, pcap, crack, report, siem, ids, ai

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
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
app.include_router(siem.router, prefix="/siem", tags=["siem"])
app.include_router(ids.router, prefix="/ids", tags=["ids"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])
app.include_router(osint.router, prefix="/osint", tags=["osint"])
app.include_router(nmap.router, prefix="/nmap", tags=["nmap"])
app.include_router(metasploit.router, prefix="/metasploit", tags=["metasploit"])
app.include_router(webscan.router, prefix="/webscan", tags=["webscan"])
app.include_router(pcap.router, prefix="/pcap", tags=["pcap"])
app.include_router(crack.router, prefix="/crack", tags=["crack"])
app.include_router(crypto.router, prefix="/crypto", tags=["crypto"])
app.include_router(report.router, prefix="/report", tags=["report"])
app.include_router(settings.router, prefix="/settings", tags=["settings"])
