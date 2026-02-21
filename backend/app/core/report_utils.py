from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io
from datetime import datetime

def generate_pdf_report(report_type: str, data: dict):
    """
    Generates a PDF report based on provided JSON data.
    """
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Title
    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, height - 50, f"CyberTools Audit Report: {report_type.upper()}")

    # Metadata
    c.setFont("Helvetica", 10)
    c.drawString(50, height - 70, f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    c.drawString(50, height - 85, "Tool: CyberTools v1.0")

    y = height - 120

    # Content Logic
    c.setFont("Helvetica", 12)

    if report_type == "nmap":
        c.drawString(50, y, f"Target: {data.get('target', 'N/A')}")
        y -= 20
        c.drawString(50, y, "Scan Results:")
        y -= 20
        # Split multiline output
        text = c.beginText(50, y)
        text.setFont("Courier", 9)
        scan_output = data.get("scan_output", "No data")
        for line in scan_output.split("\n"):
            text.textLine(line)
            if text.getY() < 50: # Page break check
                c.drawText(text)
                c.showPage()
                text = c.beginText(50, height - 50)
                text.setFont("Courier", 9)
        c.drawText(text)

    elif report_type == "metasploit":
        c.drawString(50, y, f"Module: {data.get('module', 'N/A')}")
        y -= 20
        c.drawString(50, y, f"Target: {data.get('target', 'N/A')}")
        y -= 20
        c.drawString(50, y, "Execution Log:")
        y -= 20
        text = c.beginText(50, y)
        text.setFont("Courier", 9)
        log = data.get("log", "No log")
        for line in log.split("\n"):
            text.textLine(line)
        c.drawText(text)

    else:
        c.drawString(50, y, "Generic Report Data:")
        y -= 20
        text = c.beginText(50, y)
        text.setFont("Courier", 10)
        for k, v in data.items():
            text.textLine(f"{k}: {v}")
        c.drawText(text)

    c.save()
    buffer.seek(0)
    return buffer
