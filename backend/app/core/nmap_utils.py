import subprocess

def run_nmap_scan(target, scan_type, custom_command=None):
    """
    Lance un scan Nmap avec le type choisi.
    - timeout: illimité (le scan peut durer le temps qu'il veut)
    """
    if custom_command:
        cmd = f"nmap {custom_command} {target}".strip()
        cmd_list = cmd.split()
    else:
        nmap_types = {
            "tcp_syn": "-sS",
            "tcp_connect": "-sT",
            "udp": "-sU",
            "fin": "-sF",
            "xmas": "-sX",
            "null": "-sN",
            "ack": "-sA",
            "version": "-sV",
            "os": "-O",
            "aggressive": "-A",
            "ping": "-sn",
            "list": "-sL",
            "rpc": "-sR",
            "script_default": "--script",
            "script_vuln": "--script",
            "fast": "-F",
            "top_ports": "--top-ports",
            "port_range": "-p",
        }
        args = nmap_types.get(scan_type, "-sS")
        if scan_type == "script_default":
            cmd_list = ["nmap", "--script", "default", target]
        elif scan_type == "script_vuln":
            cmd_list = ["nmap", "--script", "vuln", target]
        elif scan_type == "top_ports":
            cmd_list = ["nmap", "--top-ports", "1000", target]
        elif scan_type == "port_range":
            cmd_list = ["nmap", "-p", "1-1024", target]
        else:
            cmd_list = ["nmap", args, target]

    try:
        proc = subprocess.run(
            cmd_list,
            capture_output=True,
            text=True,
            timeout=None  # timeout illimité
        )
        if proc.returncode == 0:
            return proc.stdout
        else:
            return f"[ERREUR NMAP]\nCommande: {' '.join(cmd_list)}\nErreur: {proc.stderr}"
    except Exception as e:
        return f"[ERREUR INATTENDUE]\nCommande: {' '.join(cmd_list)}\nException: {str(e)}"