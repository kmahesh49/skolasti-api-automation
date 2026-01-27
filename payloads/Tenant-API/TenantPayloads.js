// ============================================================================
// Tenant API - Request Payloads
// ============================================================================
// All payloads for Tenant API CRUD operations and business logic

module.exports = {
  // ============================================================================
  // CREATE TENANT PAYLOADS
  // ============================================================================
  createTenant: {
    ogranisationId: "test-org-" + Date.now(),
    clientId: "test-client-" + Date.now(),
    organisationName: "Test Organization",
    organisationDomian: "test-domain-" + Date.now(),
    customerId: 100,
    organisationDataBaseName: "test-db-" + Date.now(),
    description: "Test tenant for automation"
  },

  // ============================================================================
  // UPDATE TENANT PAYLOADS (multipart/form-data - used differently)
  // Note: This uses FormData in the test, not JSON payload
  // ============================================================================
  updateTenantData: {
    TenantId: "PLACEHOLDER", // Will be replaced with actual tenant ID
    ClientId: "PLACEHOLDER", // Will be replaced with actual client ID
    OrganisationName: "Updated Test Organization",
    OrganisationRouteName: "updated-route",
    OrganisationDomian: "updated-domain",
    Description: "Updated tenant description",
    PrimaryColor: "#5681EF",
    SecondaryColor: "#EC4899",
    IsOnBoarded: true
  },

  // ============================================================================
  // CERTIFICATE TEMPLATE PAYLOADS (multipart/form-data)
  // ============================================================================
  certificateTemplateData: {
    TenantId: "PLACEHOLDER",
    ClientId: "PLACEHOLDER",
    CertificateId: "cert-" + Date.now(),
    Description: "Test certificate template"
  },

  // ============================================================================
  // SUBSCRIPTION PAYLOADS
  // ============================================================================
  createSubscription: {
    tenantId: "PLACEHOLDER",
    subscriptionId: "sub-" + Date.now(),
    subscriptionMetaData: JSON.stringify({ plan: "basic", features: ["feature1", "feature2"] }),
    subscriptionType: "monthly"
  },

  // ============================================================================
  // CUSTOMER PAYLOADS
  // ============================================================================
  createCustomer: {
    name: "Test Customer",
    mail: "testcustomer@example.com",
    address: "123 Test Street, Test City",
    number: "+1234567890"
  },

  // ============================================================================
  // NOTIFY TENANT PAYLOADS
  // ============================================================================
  notifyTenant: {
    email: "test@example.com",
    type: "welcome",
    domain: "test-domain.com",
    password: "TestPassword123!"
  },

  notifyTenantWithoutPassword: {
    email: "test@example.com",
    type: "reminder",
    domain: "test-domain.com"
  },

  // ============================================================================
  // LEARNING INSIGHTS PAYLOADS
  // ============================================================================
  createLearningInsights: [
    {
      tenantId: 1,
      clientId: "test-client-id",
      enhancing: "Critical thinking and problem-solving skills"
    },
    {
      tenantId: 1,
      clientId: "test-client-id",
      enhancing: "Communication and collaboration abilities"
    }
  ],

  createSingleLearningInsight: [
    {
      tenantId: 1,
      clientId: "test-client-id",
      enhancing: "Leadership and management skills"
    }
  ],

  updateLearningInsights: {
    learningInsightId: 1, // Will be updated with actual ID
    enhancing: "Updated: Advanced analytical and research capabilities"
  },

  // ============================================================================
  // NEGATIVE TEST PAYLOADS
  // ============================================================================
  invalidCreateTenant: {
    // Missing required fields
    organisationName: "Test Org"
  },

  invalidSubscription: {
    // Missing required tenantId
    subscriptionId: "sub-123",
    subscriptionMetaData: "{}",
    subscriptionType: "monthly"
  },

  invalidCustomer: {
    // Invalid email format
    name: "Test",
    mail: "invalid-email",
    address: "123 Test",
    number: "123"
  },

  invalidNotifyTenant: {
    // Missing required domain
    email: "test@example.com",
    type: "welcome"
  },

  invalidLearningInsights: [
    {
      // Missing required clientId
      tenantId: 1,
      enhancing: "Test"
    }
  ],

  invalidUpdateLearningInsights: {
    // Missing required learningInsightId
    enhancing: "Test"
  }
};
