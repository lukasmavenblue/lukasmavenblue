const { chromium } = require('playwright');
const login_details = require('./login_details');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto('https://bsm-acc2.mavenblue.cloud/bsm/#/logon');

    await page.waitForLoadState('networkidle');

    await page.fill('input[placeholder="Email address"]', login_details.email_customer2);
    await page.fill('input[placeholder="Password"]', login_details.pw_customer2);
    await page.click('button:has-text("Log on")');

    await page.waitForNavigation({ timeout: 10000 });
    await page.screenshot({ path: 'login-success.png' });

    console.log('Login attempt completed successfully!');
  } catch (error) {
    console.error('An error occurred:', error);
    await page.screenshot({ path: 'login-error.png' });
  }
})();