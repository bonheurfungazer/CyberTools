import subprocess

def run_metasploit_module(module_type, module, target_host, target_port):
    # Pour la démo, on simule la commande msfconsole en ligne de commande.
    # En prod, utiliser msfrpc ou un wrapper sécurisé !
    script = f"""
use {module_type}/{module}
set RHOSTS {target_host}
{f"set RPORT {target_port}" if target_port else ""}
run
exit
"""
    cmd = ["msfconsole", "-q", "-x", script]
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    return proc.stdout if proc.returncode == 0 else proc.stderr