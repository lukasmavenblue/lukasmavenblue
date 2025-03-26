const { test, expect } = require('@playwright/test');
const login_details = require('./login_details');

test('Login to BSM MavenBlue', async ({ page }) => {
  try {
    // Navigate to the login page
    await page.goto('https://bsm.mavenblue.cloud/bsm/#/logon');
    await page.waitForLoadState('networkidle');

    // Fill in login details
    await page.fill('input[placeholder="Email address"]', login_details.email_customer2);
    await page.fill('input[placeholder="Password"]', login_details.pw_customer2);
    await page.click('button:has-text("Log on")');

    // Wait for navigation after login
    await page.waitForNavigation({ timeout: 10000 });

    // Take a screenshot on success
    await page.screenshot({ path: 'login-success.png' });
    console.log('Login attempt completed successfully!');
  } catch (error) {
    console.error('An error occurred:', error);
    await page.screenshot({ path: 'login-error.png' });
    throw error; // Re-throw to mark the test as failed
  }
});