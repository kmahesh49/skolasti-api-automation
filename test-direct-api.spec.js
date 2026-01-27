const { test } = require("@playwright/test");
const { ClientAPIURL, headers } = require("./config/config.js");

test("Direct API Test - Check Headers", async ({ request }) => {
  console.log("\n========== TESTING DIRECT API REQUEST ==========");
  console.log("URL:", `${ClientAPIURL}/Subscription/validitytypes`);
  console.log("Headers:", JSON.stringify(headers, null, 2));
  
  const response = await request.get(`${ClientAPIURL}/Subscription/validitytypes`, {
    headers
  });
  
  const status = response.status();
  console.log("\nResponse Status:", status);
  const responseHeaders = await response.allHeaders();
  console.log("Response Headers:", JSON.stringify(responseHeaders, null, 2));
  
  const body = await response.text();
  console.log("Response Body:", body.substring(0, 500));
});
