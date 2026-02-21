import time
from playwright.sync_api import sync_playwright, expect

def verify_siem_suite():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            print("Navigating to Dashboard...")
            page.goto("http://localhost:3000")
            page.wait_for_load_state("networkidle")

            # 1. SIEM
            print("Testing SIEM Tab...")
            # Use get_by_role("button") since sidebar items are buttons
            page.get_by_role("button", name="SIEM Logs").click()
            expect(page.get_by_role("heading", name="SIEM Dashboard")).to_be_visible()

            # Verify table headers exist (Correct headers: Heure, Type, Source IP)
            expect(page.locator("text=Heure")).to_be_visible()
            expect(page.locator("text=Type")).to_be_visible()

            # Click Simulate Attack (if available)
            sim_btn = page.locator("button:has-text('Simuler Attaque')")
            if sim_btn.is_visible():
                sim_btn.click()
                time.sleep(2)

            # 2. IDS
            print("Testing IDS Tab...")
            page.get_by_role("button", name="IDS / IPS Monitor").click()
            expect(page.get_by_role("heading", name="IDS / IPS Monitor")).to_be_visible()

            # Check for button state
            start_btn = page.locator("button:has-text('Démarrer IDS')")
            stop_btn = page.locator("button:has-text('Arrêter IDS')")

            if start_btn.is_visible():
                print("Clicking Start IDS...")
                start_btn.click()
                # Wait for Stop button to appear
                expect(stop_btn).to_be_visible(timeout=10000)
                # verify text
                expect(page.locator("text=Surveillance Active")).to_be_visible(timeout=10000)
            elif stop_btn.is_visible():
                print("IDS already running. Verify text...")
                expect(page.locator("text=Surveillance Active")).to_be_visible()
            else:
                # If neither, maybe loading or error, try waiting a bit
                time.sleep(2)
                if start_btn.is_visible():
                    start_btn.click()
                    expect(stop_btn).to_be_visible(timeout=10000)
                elif stop_btn.is_visible():
                     expect(page.locator("text=Surveillance Active")).to_be_visible()
                else:
                    raise Exception("Neither Start nor Stop button found for IDS")

            # 3. AI
            print("Testing AI Tab...")
            # Label is "Threat Intelligence (AI)"
            page.get_by_role("button", name="Threat Intelligence (AI)").click()
            expect(page.get_by_role("heading", name="Threat Intelligence (AI)")).to_be_visible()

            # Analyze Log
            analyze_btn = page.locator("button:has-text('Analyser avec l\\'IA')")
            if analyze_btn.is_visible():
                analyze_btn.click()
                expect(page.locator("text=Score d'Anomalie :")).to_be_visible(timeout=20000)

            # Final Screenshot
            page.screenshot(path="verification/verification_siem.png")
            print("SIEM/AI/IDS Verification Complete. Screenshot saved.")

        except Exception as e:
            print(f"Verification Failed: {e}")
            page.screenshot(path="verification/verification_siem_failed.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_siem_suite()
