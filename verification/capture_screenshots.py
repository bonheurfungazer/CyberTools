import os
import time
from playwright.sync_api import sync_playwright

def capture_interface_screenshots():
    # Ensure screenshots dir exists
    if not os.path.exists("screenshots"):
        os.makedirs("screenshots")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        try:
            print("Navigating to Dashboard...")
            page.goto("http://localhost:3000")
            page.wait_for_load_state("networkidle")

            # Dashboard Screenshot
            print("Taking Dashboard screenshot...")
            # Dashboard is default, or click specifically
            dash_btn = page.locator("button:has-text('Dashboard')")
            if dash_btn.is_visible():
                dash_btn.click()
            time.sleep(1) # Let animations finish
            page.screenshot(path="screenshots/dashboard.png")

            # SIEM Screenshot
            print("Taking SIEM screenshot...")
            page.locator("button:has-text('SIEM Logs')").click()
            time.sleep(1)
            page.screenshot(path="screenshots/siem.png")

            # IDS Screenshot
            print("Taking IDS screenshot...")
            page.locator("button:has-text('IDS / IPS Monitor')").click()
            time.sleep(1)
            page.screenshot(path="screenshots/ids.png")

            # AI Screenshot
            print("Taking AI screenshot...")
            # Using partial text match or exact text depending on sidebar implementation
            page.locator("button:has-text('Threat Intelligence')").click()
            time.sleep(1)
            page.screenshot(path="screenshots/ai.png")

            # Settings Screenshot
            print("Taking Settings screenshot...")
            page.locator("button:has-text('Paramètres')").click()
            time.sleep(1)
            page.screenshot(path="screenshots/settings.png")

            print("Screenshots captured successfully in 'screenshots/' directory.")

        except Exception as e:
            print(f"Error capturing screenshots: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    capture_interface_screenshots()
