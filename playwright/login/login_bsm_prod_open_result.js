const { chromium } = require('playwright');
const login_details = require('./login_details');

(async () => {
  // Launch the browser (headless: false to see it in action)
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to the login page
    await page.goto('https://bsm.mavenblue.cloud/bsm/#/logon');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Fill in the email field
    await page.fill('input[placeholder="Email address"]', login_details.email_customer2);

    // Fill in the password field
    await page.fill('input[placeholder="Password"]', login_details.pw_customer2);

    // Click the login button
    await page.click('button:has-text("Log on")');

    // Wait for navigation after login
    await page.waitForNavigation({ timeout: 10000 });

    // Take a screenshot to verify login
    await page.screenshot({ path: 'login-success.png' });

    console.log('Login attempt completed successfully!');

    // Ensure we're on the "Results" page
    // The URL in the screenshot shows we're at /main/manage-instruction-executions
    await page.waitForURL('**/main/manage-instruction-executions', { timeout: 10000 });

    // Wait for the table to load
    await page.waitForSelector('table', { timeout: 10000 });

    // Find the row with the specific instruction
    const targetInstruction = 'A520 - Capital management - 020 - cap tier 3 tiering restriction';
    const row = await page.locator('tr', {
      has: page.locator('td', { hasText: targetInstruction })
    }).first();

    if (await row.count() === 0) {
      throw new Error(`Instruction "${targetInstruction}" not found in the table.`);
    }

    // Click on the "Id" field in that row (assuming the "Id" is the first column)
    const idCell = row.locator('td').nth(0); // First column (Id)
    await idCell.click();

    console.log(`Clicked on the Id field for instruction: ${targetInstruction}`);

    // Take a screenshot after clicking
    await page.screenshot({ path: 'id-clicked.png' });

  } catch (error) {
    console.error('An error occurred:', error);
    await page.screenshot({ path: 'error.png' });
  }
  // Browser remains open as requested
})();