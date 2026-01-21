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
// AUTHORIZATION TOKEN
// =============================================================================
const defaultToken = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkFlOUduTnJHYXVMX1ZFUnpJNUZFWlZfYktmOCJ9.eyJhdWQiOiJiYmY1Yjg5OS00YTM0LTQ0NzQtYTBhYi01YjY5ZDljNTFmOTIiLCJleHAiOjE3Njg5NzkxMjIsImlhdCI6MTc2ODk3NTUyMiwiaXNzIjoiaHR0cHM6Ly9hdXRoLnNrb2xhc3RpLmFwcC8iLCJzdWIiOiIzZjUzNzY5OC00ZTVlLTQxMDEtOTExNS02MjYzODU5MTE5NDAiLCJqdGkiOiJmMTk3N2E3My1hOGQ2LTQyMzQtYjQ2Zi1kMDY0NjRmYmQwZDAiLCJhdXRoZW50aWNhdGlvblR5cGUiOiJQQVNTV09SRCIsImVtYWlsIjoiZ29waWtyaXNobmEyMjIxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJnb3Bpa3Jpc2huYTIyMjFAZ21haWwuY29tIiwiYXBwbGljYXRpb25JZCI6ImJiZjViODk5LTRhMzQtNDQ3NC1hMGFiLTViNjlkOWM1MWY5MiIsInJvbGVzIjpbInVzZXIiXSwic2lkIjoiOTExYTFhN2EtOGZmZC00MTk2LWEwYzctNzVjZGMzOTg0NjFjIiwiYXV0aF90aW1lIjoxNzY4OTc1NTIyLCJ0aWQiOiI2Y2ZmZGQ2Mi04NjQ5LTRkOWQtODZmZS0zMDY2ZWU0NDcwODIifQ.CpE6ksn5xFmM5kseEqgdVEr3EChppRja6vT1g8o8LAAnIB80M8olMGiNVid8pmEoLMk-ND4v-dpVZqz3r6-LHJsNqjXu6f-G4RN_uE606QsHIErxHM4tXsWqx8mqIwyLigrYDAHgZQlUBRfjn-BGczJjIx_xQwpf3NLLU7_SGQsDuyZ5n2Hu92MEIw_EgOa5ueF_FZzdecAfCEOOYnpTJvuMsWjVZTYbgGqUItrQ1Oe08subPP2YkLzVKsh5tZi2y7aIPSB4-hF09HXfwNLVc3FwWfaEqYJh9yYhMtPrTC_9rkXnVipDRm0aTrOB7cKDyerDDiEQAam1KkMKARiSCw";

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
  
  // Headers
  headers: {
    "Authorization": process.env.API_TOKEN ? `Bearer ${process.env.API_TOKEN}` : `Bearer ${defaultToken}`,
    "Content-Type": "application/json"
  }
};
