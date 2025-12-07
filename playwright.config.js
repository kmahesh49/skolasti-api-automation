// Playwright config for API tests
/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  timeout: 30000,
  testDir: "tests",
  reporter: [
    ["list"],
    ["allure-playwright"],
     ["html", { open: "never" }]
  ],
  use: {
    ignoreHTTPSErrors: true,
  },
};
