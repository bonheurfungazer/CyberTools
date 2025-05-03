from fastapi import APIRouter, HTTPException
from app.models.metasploit import MetasploitRequest
from app.core.metasploit_utils import run_metasploit_module

router = APIRouter()

@router.post("/run")
def api_msf_run(req: MetasploitRequest):
    try:
        output = run_metasploit_module(req.module_type, req.module, req.target_host, req.target_port)
        return {"result": output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))