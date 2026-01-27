const { headers, ClientAPIURL } = require("./config/config.js");

console.log("Testing Authorization Configuration");
console.log("====================================");
console.log("API URL:", ClientAPIURL);
console.log("\nHeaders being sent:");
console.log(JSON.stringify(headers, null, 2));

// Decode token (basic JWT decode without verification)
const token = headers.Authorization.replace('Bearer ', '');
const parts = token.split('.');
if (parts.length === 3) {
  const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
  console.log("\nToken Payload:");
  console.log("- User:", payload.email);
  console.log("- User ID:", payload.sub);
  console.log("- Tenant ID:", payload.tid);
  console.log("- Expires:", new Date(payload.exp * 1000).toISOString());
  console.log("- Issued:", new Date(payload.iat * 1000).toISOString());
  console.log("- Is Expired:", new Date(payload.exp * 1000) < new Date());
}

console.log("\n✓ Configuration loaded successfully!");
