// Admin API - VisibilityTenantSettings Tests
// Tests for tenant configurations, settings, and payment gateway management
// CRUD Pattern: CREATE → GET → UPDATE → GET → DELETE → GET

const { test, expect } = require('@playwright/test');
const { ApiHelper } = require('../../utils/ApiHelper');
const { AdminAPIURL, adminHeaders } = require('../../config/config');
const payloads = require('../../payloads/Admin-API/VisibilityTenantSettingsPayloads');

let api;
let createdConfigurationId = null;
let createdSettingsId = null;

test.describe('Admin API - VisibilityTenantSettings Tests', () => {
  test.beforeEach(async ({ request }) => {
    api = new ApiHelper(request, AdminAPIURL, adminHeaders);
  });

  // ==================== CONFIGURATION CRUD FLOW ====================
  test.describe('Configuration - CRUD Flow', () => {
    
    test('Step 1: CREATE - POST /VisibilityTenantSettings/createconfiguration', async () => {
      const response = await api.post('/VisibilityTenantSettings/createconfiguration', payloads.createConfiguration, [200, 201]);
      
      expect(response).toBeDefined();
      
      // Extract configuration ID for subsequent tests
      if (response && (response.id || response.Id || response.configurationId || response.ConfigurationId)) {
        createdConfigurationId = response.id || response.Id || response.configurationId || response.ConfigurationId;
        console.log(`Created Configuration ID: ${createdConfigurationId}`);
      }
    });

    test('Step 2: GET - Verify configuration after CREATE', async () => {
      test.skip(!createdConfigurationId, 'Configuration ID not available - CREATE may have failed');
      
      const response = await api.get(`/VisibilityTenantSettings/getconfigurationbyid?configurationId=${createdConfigurationId}`, 200);
      
      expect(response).toBeDefined();
      expect(typeof response === 'object').toBe(true);
    });

    test('Step 3: UPDATE - PUT /VisibilityTenantSettings/updateconfiguration', async () => {
      test.skip(!createdConfigurationId, 'Configuration ID not available - CREATE may have failed');
      
      const updatePayload = {
        ...payloads.updateConfiguration,
        id: createdConfigurationId,
        configurationId: createdConfigurationId
      };
      
      const response = await api.put('/VisibilityTenantSettings/updateconfiguration', updatePayload, [200, 201]);
      
      expect(response).toBeDefined();
    });

    test('Step 4: GET - Verify configuration after UPDATE', async () => {
      test.skip(!createdConfigurationId, 'Configuration ID not available - CREATE may have failed');
      
      const response = await api.get(`/VisibilityTenantSettings/getconfigurationbyid?configurationId=${createdConfigurationId}`, 200);
      
      expect(response).toBeDefined();
      expect(typeof response === 'object').toBe(true);
    });

    test('Step 5: DELETE - DELETE /VisibilityTenantSettings/deleteconfiguration', async () => {
      test.skip(!createdConfigurationId, 'Configuration ID not available - CREATE may have failed');
      
      const response = await api.delete(`/VisibilityTenantSettings/deleteconfiguration?configurationId=${createdConfigurationId}`, [200, 204]);
      
      console.log(`Deleted Configuration ID: ${createdConfigurationId}`);
    });

    test('Step 6: GET - Verify configuration after DELETE', async () => {
      test.skip(!createdConfigurationId, 'Configuration ID not available - CREATE may have failed');
      
      const response = await api.get(`/VisibilityTenantSettings/getconfigurationbyid?configurationId=${createdConfigurationId}`, [204, 404]);
      
      // Should return 204 (No Content) or 404 (Not Found) after deletion
    });
  });

  // ==================== ADDITIONAL CONFIGURATION TESTS ====================
  test.describe('Configuration - Additional Tests', () => {
    
    test('should create configuration with minimal fields', async () => {
      const response = await api.post('/VisibilityTenantSettings/createconfiguration', payloads.createConfigurationMinimal, [200, 201]);
      
      expect(response).toBeDefined();
    });

    test('should reject invalid configuration data', async () => {
      const response = await api.post('/VisibilityTenantSettings/createconfiguration', payloads.createConfigurationInvalid, 400);
      
      // Should return validation error
    });

    test('should retrieve configuration by tenant ID', async () => {
      const response = await api.get('/VisibilityTenantSettings/getconfigurationbytenantId?tenantId=1', [200, 404]);
      
      if (response && response !== null) {
        expect(typeof response === 'object').toBe(true);
      }
    });

    test('should handle non-existent configuration ID', async () => {
      const response = await api.get('/VisibilityTenantSettings/getconfigurationbyid?configurationId=999999', 404);
      
      // Should return 404
    });

    test('should handle deletion of non-existent configuration', async () => {
      const response = await api.delete('/VisibilityTenantSettings/deleteconfiguration?configurationId=999999', [404, 204]);
      
      // Should handle gracefully
    });
  });

  // ==================== CONFIGURATION LIST OPERATIONS ====================
  test.describe('Configuration - List Operations', () => {
    
    test('should retrieve all configurations', async () => {
      const response = await api.get('/VisibilityTenantSettings/getconfigurations', [200, 204]);
      
      if (response) {
        expect(Array.isArray(response) || typeof response === 'object').toBe(true);
      }
    });
  });

  // ==================== TENANT SETTINGS CRUD FLOW ====================
  test.describe('Tenant Settings - CRUD Flow', () => {
    
    test('Step 1: CREATE - POST /VisibilityTenantSettings/createtenantsettings', async () => {
      const response = await api.post('/VisibilityTenantSettings/createtenantsettings', payloads.createTenantSettings, [200, 201]);
      
      expect(response).toBeDefined();
      
      // Extract settings ID for subsequent tests
      if (response && (response.id || response.Id || response.settingsId || response.SettingsId)) {
        createdSettingsId = response.id || response.Id || response.settingsId || response.SettingsId;
        console.log(`Created Tenant Settings ID: ${createdSettingsId}`);
      }
    });

    test('Step 2: GET - Verify settings after CREATE', async () => {
      test.skip(!createdSettingsId, 'Settings ID not available - CREATE may have failed');
      
      const response = await api.get('/VisibilityTenantSettings/gettenantsettings', 200);
      
      expect(response).toBeDefined();
    });

    test('Step 3: UPDATE - PUT /VisibilityTenantSettings/updatetenantsettings', async () => {
      test.skip(!createdSettingsId, 'Settings ID not available - CREATE may have failed');
      
      const updatePayload = {
        ...payloads.updateTenantSettingsMinimal,
        id: createdSettingsId,
        settingsId: createdSettingsId
      };
      
      const response = await api.put('/VisibilityTenantSettings/updatetenantsettings', updatePayload, [200, 201]);
      
      expect(response).toBeDefined();
    });

    test('Step 4: GET - Verify settings after UPDATE', async () => {
      test.skip(!createdSettingsId, 'Settings ID not available - CREATE may have failed');
      
      const response = await api.get('/VisibilityTenantSettings/gettenantsettings', 200);
      
      expect(response).toBeDefined();
    });

    test('Step 5: DELETE - DELETE /VisibilityTenantSettings/deletesettings', async () => {
      test.skip(!createdSettingsId, 'Settings ID not available - CREATE may have failed');
      
      const response = await api.delete(`/VisibilityTenantSettings/deletesettings?settingsId=${createdSettingsId}`, [200, 204]);
      
      console.log(`Deleted Tenant Settings ID: ${createdSettingsId}`);
    });

    test('Step 6: GET - Verify settings after DELETE', async () => {
      test.skip(!createdSettingsId, 'Settings ID not available - CREATE may have failed');
      
      const response = await api.get('/VisibilityTenantSettings/gettenantsettings', [200, 204]);
      
      // May return 204 if no settings remain
    });
  });

  // ==================== ADDITIONAL TENANT SETTINGS TESTS ====================
  test.describe('Tenant Settings - Additional Tests', () => {
    
    test('should create tenant settings with minimal fields', async () => {
      const response = await api.post('/VisibilityTenantSettings/createtenantsettings', payloads.createTenantSettingsMinimal, [200, 201]);
      
      expect(response).toBeDefined();
    });

    test('should reject invalid tenant settings data', async () => {
      const response = await api.post('/VisibilityTenantSettings/createtenantsettings', payloads.createTenantSettingsInvalid, 400);
      
      // Should return validation error
    });

    test('should reject update with invalid settings ID', async () => {
      const response = await api.put('/VisibilityTenantSettings/updatetenantsettings', payloads.updateTenantSettingsInvalid, [400, 404]);
      
      // Should return error
    });
  });

  // ==================== PAYMENT GATEWAY CONFIG TESTS ====================
  test.describe('Payment Gateway Config - Operations', () => {
    
    test('should retrieve payment gateway config', async () => {
      const response = await api.get('/VisibilityTenantSettings/paymentgatewayconfig?tenantId=1', [200, 404]);
      
      if (response && response !== null) {
        expect(typeof response === 'object').toBe(true);
      }
    });

    test('should create payment gateway config', async () => {
      const response = await api.post('/VisibilityTenantSettings/paymentgatewayconfig', payloads.createPaymentGatewayConfig, [200, 201]);
      
      expect(response).toBeDefined();
    });

    test('should update payment gateway config', async () => {
      const response = await api.put('/VisibilityTenantSettings/paymentgatewayconfig', payloads.updatePaymentGatewayConfig, [200, 404]);
      
      // May return 404 if config doesn't exist
    });

    test('should delete payment gateway config', async () => {
      const response = await api.delete('/VisibilityTenantSettings/paymentgatewayconfig?tenantId=1', [200, 204, 404]);
      
      // May return 404 if already deleted
    });

    test('should create config with minimal fields', async () => {
      const response = await api.post('/VisibilityTenantSettings/paymentgatewayconfig', payloads.createPaymentGatewayConfigMinimal, [200, 201]);
      
      expect(response).toBeDefined();
    });

    test('should handle non-existent tenant payment config', async () => {
      const response = await api.get('/VisibilityTenantSettings/paymentgatewayconfig?tenantId=999999', [404, 204]);
      
      // Should return 404 or 204
    });

    test('should handle deletion of non-existent config', async () => {
      const response = await api.delete('/VisibilityTenantSettings/paymentgatewayconfig?tenantId=999999', [404, 204]);
      
      // Should handle gracefully
    });
  });

  // ==================== NEGATIVE TESTS ====================
  test.describe('Negative Tests', () => {
    test('should handle missing configuration ID', async () => {
      const response = await api.get('/VisibilityTenantSettings/getconfigurationbyid', 400);
      
      // Should return error for missing required parameter
    });

    test('should handle missing tenant ID', async () => {
      const response = await api.get('/VisibilityTenantSettings/getconfigurationbytenantId', 400);
      
      // Should return error
    });

    test('should handle missing configuration ID in delete', async () => {
      const response = await api.delete('/VisibilityTenantSettings/deleteconfiguration', 400);
      
      // Should return error
    });

    test('should reject requests with invalid tenant ID format', async () => {
      const response = await api.get('/VisibilityTenantSettings/getconfigurationbytenantId?tenantId=invalid', 400);
      
      // Should return error
    });

    test('should reject configuration with missing required fields', async () => {
      const response = await api.post('/VisibilityTenantSettings/createconfiguration', {}, 400);
      
      // Should return validation error
    });

    test('should reject settings with invalid configuration ID', async () => {
      const invalidSettings = { ...payloads.createTenantSettings, TenantConfigurationId: -1 };
      const response = await api.post('/VisibilityTenantSettings/createtenantsettings', invalidSettings, 400);
      
      // Should return validation error
    });

    test('should reject payment config with missing tenant ID', async () => {
      const invalidConfig = { ...payloads.createPaymentGatewayConfig };
      delete invalidConfig.TenantId;
      const response = await api.post('/VisibilityTenantSettings/paymentgatewayconfig', invalidConfig, 400);
      
      // Should return validation error
    });
  });
});
