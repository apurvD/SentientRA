import puppeteer from 'puppeteer';

/**
 * Headless browser automation engine to extract DOM tree structure and visual states
 * @param {string} url - The target website to scrape
 * @returns {Promise<{ html: string, screenshotBase64: string }>} 
 */
export async function scrapeTargetPage(url) {
  let browser;
  try {
    // Launch headless Chromium browser instance
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set standard viewport sizing to accurately capture desktop-grade layout distributions
    await page.setViewport({ width: 1280, height: 800 });

    // Emulate standard user-agent string to prevent immediate bot-mitigation triggers
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Navigate to target URL and await network layer completion
    await page.goto(url, {
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });

    // Extract the fully rendered DOM string
    const html = await page.content();

    // Capture visual layout state to a binary buffer and encode as base64 string
    const screenshotBuffer = await page.screenshot({
      type: 'png',
      fullPage: false 
    });
    const screenshotBase64 = screenshotBuffer.toString('base64');

    return {
      html,
      screenshotBase64
    };

  } catch (error) {
    console.error(`[Scraper Engine Failure] Failed to process URL: ${url}`, error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}