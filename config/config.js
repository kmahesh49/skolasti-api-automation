// Configuration for Skolasti API
// Supports environment variables for CI/CD
// Usage: Set ENV variable to 'dev' or 'test' (default: 'dev')

// Get current environment from ENV variable (default: dev)
const currentEnv = process.env.ENV || 'dev';

// =============================================================================
// ENVIRONMENT-SPECIFIC BASE URLs
// =============================================================================
const environments = {
  dev: {
    adminApi: 'https://adminapi.skolasti.com/api',
    courseApi: 'https://courseapi.skolasti.com/api',
    clientApi: 'https://clientapi.skolasti.com/api',
    tenantApi: 'https://tenantapi.skolasti.com/api',
    marketingApi: 'https://marketingapi.skolasti.com/api'
  },
  test: {
    adminApi: 'https://adminapi.skillrok.com/api',
    courseApi: 'https://courseapi.skillrok.com/api',
    clientApi: 'https://clientapi.skillrok.com/api',
    tenantApi: 'https://tenantapi.skillrok.com/api',
    marketingApi: 'https://marketingapi.skillrok.com/api'
  }
};

// Get environment config (fallback to dev if invalid env specified)
const getEnvConfig = (env) => environments[env] || environments.dev;
const envConfig = getEnvConfig(currentEnv);

// =============================================================================
// AUTHORIZATION TOKEN (without "Bearer" prefix - added automatically in headers)
// =============================================================================
const defaultToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InhQcmIxTUxiVXhqdTZxdXRFek9hTUlMYXppbyJ9.eyJhdWQiOiIwMmFhZGMwZC03M2JlLTRhNWMtYTg2MC0xNzExMDJiZDEwZWMiLCJleHAiOjE3Njk1MTI3MTcsImlhdCI6MTc2OTUwOTExNywiaXNzIjoiaHR0cHM6Ly9hdXRoLnNrb2xhc3RpLmFwcC8iLCJzdWIiOiJkNTk3NzMyNS1jYmQ4LTRiMDUtOTE0ZC1iNDI5ZGM1MTU0NGIiLCJqdGkiOiJlOTJkNDM4Zi03Y2JmLTQ4ZmYtOTA3MC0zYTA3MmE1Yjc0YjYiLCJhdXRoZW50aWNhdGlvblR5cGUiOiJQQVNTV09SRCIsImVtYWlsIjoiZ29waWtyaXNobmEyMjIxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJnb3Bpa3Jpc2huYTIyMjFAZ21haWwuY29tIiwiYXBwbGljYXRpb25JZCI6IjAyYWFkYzBkLTczYmUtNGE1Yy1hODYwLTE3MTEwMmJkMTBlYyIsInJvbGVzIjpbInVzZXIiXSwic2lkIjoiMGZhYmUyMzQtNjM1OS00OWFlLTlkNGItMTg2ZmE2MGRmYTY0IiwiYXV0aF90aW1lIjoxNzY5NTA5MTE3LCJ0aWQiOiI2YmViZjlhNS04MjY0LTRlMmQtYjk4Yy1jMzU1MDk2ODIyMjkifQ.QHEUqTPn0uy_Dnl4A5oFDCrHTk626R2A_cBmpKEfKI65_PgM1G4pFU4bRg99ZqhtG1CCgG7enYF47H_j88JXqHsV_dbwt1LejxDFgWP7FN99AVde4WojydtAgnGXt8B72cku6IDFbA-cvrcF8ljmdI7xIrd8SCm3vaTajSehi8Rz_C21EP2WGg3iqMralqSeGBNf348zKTbvHk_OjyCsQZhqpEvs2l1GN3-FxWzvf26HuulkbB9KYe8zGt_Rz8HshXa1ZyWcmkc_GBoVCKMBXwdTzed2S5Je8i2-WdXN_tJ6MWMmLVIus3s6VyEao_K1gUmhPX_RLCBs9OwEq1DpoQ";

// =============================================================================
// EXPORTED CONFIGURATION
// =============================================================================
module.exports = {
  // Current environment name
  currentEnv,
  
  // Base URLs for current environment
  AdminAPIURL: process.env.ADMIN_API_URL || envConfig.adminApi,
  CourseAPIURL: process.env.COURSE_API_URL || envConfig.courseApi,
  ClientAPIURL: process.env.CLIENT_API_URL || envConfig.clientApi,
  TenantAPIURL: process.env.TENANT_API_URL || envConfig.tenantApi,
  MarketingAPIURL: process.env.MARKETING_API_URL || envConfig.marketingApi,
  
  // Legacy support (for backward compatibility)
  baseURL: process.env.API_BASE_URL || envConfig.adminApi,
  CoursebaseURL: process.env.COURSE_API_BASE_URL || envConfig.courseApi,
  
  // All environment configurations
  environments,
  
  // Headers for Client API (requires Authorization + clientid)
  headers: {
    "Authorization": process.env.API_TOKEN ? `Bearer ${process.env.API_TOKEN}` : `Bearer ${defaultToken}`,
    "Content-Type": "application/json",
    "clientid": "6cffdd62-8649-4d9d-86fe-3066ee447082"
  },
  
  // Headers for Marketing API (requires ONLY clientId, no Bearer token)
  // Note: Uses different clientId value (tenant/application ID)
  // NOTE: PageContent endpoints (Dynamic/Static) require multipart/form-data but current framework uses JSON
  // TODO: These endpoints may require file upload implementation or backend API changes
  marketingHeaders: {
    "Content-Type": "application/json",
    "clientId": "bbf5b899-4a34-4474-a0ab-5b69d9c51f92"
  },
  
  // Headers for Admin API (requires Bearer token + clientid, same as Client API)
  adminHeaders: {
    "Authorization": process.env.API_TOKEN ? `Bearer ${process.env.API_TOKEN}` : `Bearer ${defaultToken}`,
    "Content-Type": "application/json",
    "clientid": "6cffdd62-8649-4d9d-86fe-3066ee447082"
  },
  
  // Headers for Tenant API (requires X-Api-Key, NO Bearer token)
  // Note: Different authentication pattern - uses API Key in custom header
  tenantHeaders: {
    "Content-Type": "application/json",
    "X-Api-Key": "7VtvvnImeGev1FZQXYYbHthXumoWaVwj_L3wHqSl0Q9waC4Ye2Wenh8Z"
  },
  
  // Headers for Course API (requires Bearer token + clientid, same as Client/Admin API)
  courseHeaders: {
    "Authorization": process.env.API_TOKEN ? `Bearer ${process.env.API_TOKEN}` : `Bearer ${defaultToken}`,
    "Content-Type": "application/json",
    "clientid": "6cffdd62-8649-4d9d-86fe-3066ee447082"
  }
};
