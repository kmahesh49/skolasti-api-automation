// Playwright config for API tests
/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  timeout: 30000,
  testDir: "tests",
  fullyParallel: true, // Run tests in parallel
  forbidOnly: !!process.env.CI, // Fail build on CI if test.only is left in
  retries: 0, // No retries to see actual failures
  workers: process.env.CI ? 2 : undefined, // Limit workers in CI
  reporter: [
    ["list"],
    ["allure-playwright"],
     ["html", { open: "never" }]
  ],
  use: {
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure', // Capture trace on failure for debugging
  },
};
