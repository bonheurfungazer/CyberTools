import whois
import dns.resolver
import socket

def get_whois_info(domain: str):
    try:
        w = whois.whois(domain)
        # Convert datetime objects to string for JSON serialization
        if w.creation_date:
            if isinstance(w.creation_date, list):
                w.creation_date = [str(d) for d in w.creation_date]
            else:
                w.creation_date = str(w.creation_date)
        if w.expiration_date:
            if isinstance(w.expiration_date, list):
                w.expiration_date = [str(d) for d in w.expiration_date]
            else:
                w.expiration_date = str(w.expiration_date)
        if w.updated_date:
             if isinstance(w.updated_date, list):
                w.updated_date = [str(d) for d in w.updated_date]
             else:
                w.updated_date = str(w.updated_date)

        return w
    except Exception as e:
        return {"error": str(e)}

def get_dns_info(domain: str):
    records = {}
    record_types = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME']

    for r_type in record_types:
        try:
            answers = dns.resolver.resolve(domain, r_type)
            records[r_type] = [str(r) for r in answers]
        except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN, dns.resolver.LifetimeTimeout):
            records[r_type] = []
        except Exception as e:
            records[r_type] = [f"Error: {str(e)}"]

    return records

def get_ip_geolocation(ip_address: str):
    # Mock function since we don't have an external API key (e.g. ipinfo.io)
    # In a real scenario, use requests.get(f"https://ipinfo.io/{ip_address}/json")
    try:
        # Simple local check
        hostname = socket.gethostbyaddr(ip_address)
        return {
            "ip": ip_address,
            "hostname": hostname[0],
            "city": "Unknown (API Key Required)",
            "region": "Unknown",
            "country": "Unknown",
            "loc": "0,0",
            "org": "Unknown"
        }
    except Exception as e:
        return {"error": str(e)}
