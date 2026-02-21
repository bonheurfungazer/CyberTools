import requests
import time

def scan_http_headers(url: str):
    """
    Analyzes HTTP headers for security best practices.
    """
    if not url.startswith("http"):
        url = "http://" + url

    try:
        response = requests.get(url, timeout=5)
        headers = response.headers

        security_headers = {
            "Strict-Transport-Security": "Missing",
            "Content-Security-Policy": "Missing",
            "X-Frame-Options": "Missing",
            "X-Content-Type-Options": "Missing",
            "Referrer-Policy": "Missing",
            "Permissions-Policy": "Missing"
        }

        for header, status in security_headers.items():
            if header in headers:
                security_headers[header] = f"Present: {headers[header]}"
            else:
                # Case insensitive check
                for h in headers:
                    if h.lower() == header.lower():
                        security_headers[header] = f"Present: {headers[h]}"
                        break

        return {
            "url": url,
            "status_code": response.status_code,
            "headers": dict(headers),
            "security_analysis": security_headers
        }
    except Exception as e:
        return {"error": str(e)}

def mock_vulnerability_scan(url: str):
    """
    Simulates a vulnerability scan (Nikto/ZAP style).
    """
    time.sleep(2) # Simulate work

    # Mock results based on URL (for demo variety)
    if "test" in url or "demo" in url:
         return {
            "target": url,
            "scan_tool": "MockVulnScanner v1.0",
            "duration": "2.1s",
            "vulnerabilities": [
                {"severity": "High", "name": "SQL Injection", "path": "/login.php?id=1'"},
                {"severity": "Medium", "name": "XSS Reflected", "path": "/search?q=<script>"},
                {"severity": "Low", "name": "Server Banner Disclosure", "description": "Apache/2.4.41 detected"}
            ]
        }
    else:
        return {
            "target": url,
            "scan_tool": "MockVulnScanner v1.0",
            "duration": "1.8s",
            "vulnerabilities": [
                {"severity": "Info", "name": "Robots.txt found", "path": "/robots.txt"},
                {"severity": "Low", "name": "Missing X-Frame-Options", "description": "Clickjacking possible"}
            ]
        }
