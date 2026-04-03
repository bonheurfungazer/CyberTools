import subprocess
import shutil
import shlex

def run_nmap_scan(target, scan_type, custom_command=None):
    """
    Lance un scan Nmap avec le type choisi.
    - timeout: illimité (le scan peut durer le temps qu'il veut)
    """
    if not shutil.which("nmap"):
        return "Erreur: Nmap n'est pas installé sur le serveur (backend). Veuillez l'installer pour utiliser cette fonctionnalité."

    cmd_list = ["nmap"]

    if custom_command:
        try:
            # shlex.split handles quotes correctly
            cmd_list.extend(shlex.split(custom_command))
        except Exception as e:
             return f"Erreur de syntaxe dans la commande personnalisée: {str(e)}"
        cmd_list.append(target)
    else:
        # Dictionary mapping scan types to their arguments
        scan_args = {
            "tcp_syn": ["-sS"],
            "tcp_connect": ["-sT"],
            "udp": ["-sU"],
            "fin": ["-sF"],
            "xmas": ["-sX"],
            "null": ["-sN"],
            "ack": ["-sA"],
            "version": ["-sV"],
            "os": ["-O"],
            "aggressive": ["-A"],
            "ping": ["-sn"],
            "list": ["-sL"],
            "rpc": ["-sR"],
            "script_default": ["--script", "default"],
            "script_vuln": ["--script", "vuln"],
            "fast": ["-F"],
            "top_ports": ["--top-ports", "1000"],
            "port_range": ["-p", "1-1024"],
        }

        # Get arguments for the scan type, default to SYN scan
        args = scan_args.get(scan_type, ["-sS"])
        cmd_list.extend(args)
        cmd_list.append(target)

    try:
        # Run nmap
        proc = subprocess.run(
            cmd_list,
            capture_output=True,
            text=True,
            timeout=None
        )

        if proc.returncode == 0:
            return proc.stdout
        else:
            return f"[ERREUR NMAP]\nCommande: {' '.join(cmd_list)}\nCode retour: {proc.returncode}\n\nSortie standard:\n{proc.stdout}\n\nErreur standard:\n{proc.stderr}"

    except Exception as e:
        return f"[ERREUR INATTENDUE]\nCommande: {' '.join(cmd_list)}\nException: {str(e)}"
