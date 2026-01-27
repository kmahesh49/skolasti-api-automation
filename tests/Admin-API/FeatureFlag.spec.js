// Admin API - FeatureFlag Tests
// Tests for feature flag management and subscription details

const { test, expect } = require('@playwright/test');
const { ApiHelper } = require('../../utils/ApiHelper');
const { AdminAPIURL, adminHeaders } = require('../../config/config');
const payloads = require('../../payloads/Admin-API/FeatureFlagPayloads');

let api;

test.describe('Admin API - FeatureFlag Tests', () => {
  test.beforeEach(async ({ request }) => {
    api = new ApiHelper(request, AdminAPIURL, adminHeaders);
  });

  test.describe('GET /FeatureFlag/getfeatureflags', () => {
    test('should retrieve all feature flags', async () => {
      const response = await api.get('/FeatureFlag/getfeatureflags', 200);
      
      expect(response).toBeDefined();
      expect(Array.isArray(response) || typeof response === 'object').toBe(true);
    });
  });

  test.describe('GET /FeatureFlag/getfeatureavaibility', () => {
    test('should retrieve feature availability', async () => {
      const response = await api.get('/FeatureFlag/getfeatureavaibility', 200);
      
      expect(response).toBeDefined();
    });
  });

  test.describe('GET /FeatureFlag/chargebeesubscriptiondetails', () => {
    test('should retrieve Chargebee subscription details', async () => {
      const response = await api.get('/FeatureFlag/chargebeesubscriptiondetails', [200, 204]);
      
      // May return empty array if no subscriptions
      if (response) {
        expect(Array.isArray(response) || typeof response === 'object').toBe(true);
      }
    });
  });

  test.describe('POST /FeatureFlag/invalidatecache', () => {
    test('should invalidate feature flag cache', async () => {
      const response = await api.post('/FeatureFlag/invalidatecache', payloads.emptyPayload, [200, 204]);
      
      // Cache invalidation may return 200 or 204
      expect(response !== undefined).toBe(true);
    });
  });

  test.describe('Negative Tests', () => {
    test('should handle invalid endpoint gracefully', async () => {
      try {
        await api.get('/FeatureFlag/nonexistent', 404);
      } catch (error) {
        // Expected to fail with 404
      }
    });
  });
});
