// VisibilityTenantSettings API Payloads
// Admin API - Tenant configurations, settings, and payment gateway management

module.exports = {
  // Create Configuration
  createConfiguration: {
    Integrationtype: "Google Calendar",
    Description: "Google Calendar integration for tenant",
    VisibilityConfigurationId: 1,
    TenantId: 1,
    Providermailid: "admin@test.com",
    Accesstoken: "test-access-token-123456",
    Refreshtoken: "test-refresh-token-789012",
    CalendarId: "test-calendar-id",
    ExpiredAt: "2026-12-31T23:59:59Z",
    Scope: "https://www.googleapis.com/auth/calendar"
  },

  createConfigurationMinimal: {
    Integrationtype: "Outlook Calendar",
    VisibilityConfigurationId: 2,
    TenantId: 1,
    Providermailid: "admin@test.com",
    Accesstoken: "minimal-access-token",
    Refreshtoken: "minimal-refresh-token",
    CalendarId: "minimal-calendar-id",
    ExpiredAt: "2026-12-31T23:59:59Z"
  },

  createConfigurationInvalid: {
    // Missing required Integrationtype
    VisibilityConfigurationId: 1,
    TenantId: 1,
    Providermailid: "admin@test.com"
  },

  // Create Tenant Settings
  createTenantSettings: {
    TenantConfigurationId: 1,
    ConfigurationValue: "enabled",
    IsEnabled: true
  },

  createTenantSettingsMinimal: {
    TenantConfigurationId: 2,
    IsEnabled: false
  },

  createTenantSettingsInvalid: {
    // Missing required TenantConfigurationId
    ConfigurationValue: "test",
    IsEnabled: true
  },

  // Update Tenant Settings
  updateTenantSettings: {
    TenantSettingsId: 1,
    ConfigurationValue: "updated-value",
    IsEnabled: true
  },

  updateTenantSettingsMinimal: {
    TenantSettingsId: 1,
    IsEnabled: false
  },

  updateTenantSettingsInvalid: {
    TenantSettingsId: 0, // Invalid ID
    IsEnabled: true
  },

  // Payment Gateway Config (Create)
  createPaymentGatewayConfig: {
    Id: 0,
    TenantId: 1,
    PaymentGatewayType: "Stripe",
    GatewayAccountId: "acct_test123456",
    GatewayProductId: "prod_test789012",
    IsConfigured: true,
    ConfiguredStatus: "Active",
    ConfiguredDate: "2026-01-24T00:00:00Z"
  },

  createPaymentGatewayConfigMinimal: {
    TenantId: 1,
    PaymentGatewayType: "PayPal",
    IsConfigured: false
  },

  // Payment Gateway Config (Update)
  updatePaymentGatewayConfig: {
    Id: 1,
    TenantId: 1,
    PaymentGatewayType: "Stripe",
    GatewayAccountId: "acct_updated123",
    GatewayProductId: "prod_updated456",
    IsConfigured: true,
    ConfiguredStatus: "Active",
    ConfiguredDate: "2026-01-24T10:00:00Z"
  },

  updatePaymentGatewayConfigMinimal: {
    Id: 1,
    TenantId: 1,
    IsConfigured: false
  },

  updatePaymentGatewayConfigInvalid: {
    Id: 0, // Invalid ID
    TenantId: 1
  }
};
