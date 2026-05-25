import { chromium } from 'playwright';
import * as path from 'path';

async function searchAndScreenshot() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'en-US',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  const page = await context.newPage();

  // Mask navigator.webdriver to reduce bot detection
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const outputPath = path.resolve(__dirname, '../screenshots/claude-ai-search.png');

  try {
    await page.goto('https://google.com', { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Accept cookie consent if present
    const consentButton = page.locator(
      'button:has-text("Accept all"), button:has-text("I agree"), [aria-label="Accept all"]'
    );
    if (await consentButton.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await consentButton.first().click();
      await page.waitForTimeout(500);
    }

    // Fill search box and submit
    const searchBox = page.locator('textarea[name="q"], input[name="q"]');
    await searchBox.waitFor({ timeout: 5000 });
    await searchBox.fill('Claude AI');
    await page.keyboard.press('Enter');

    // Wait for search results to render
    await page
      .waitForSelector('#search, #rso, #main', { timeout: 10000 })
      .catch(() => console.warn('Search results selector not found — screenshotting current page'));

    // Allow JS-rendered content to fully paint
    await page.waitForTimeout(1500);

    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`Screenshot saved to: ${outputPath}`);
  } finally {
    await browser.close();
  }
}

searchAndScreenshot().catch(console.error);
