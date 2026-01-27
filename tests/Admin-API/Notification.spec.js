// Admin API - Notification Tests
// Tests for notification and notification template management
// CRUD Pattern: CREATE → GET → UPDATE → GET → DELETE → GET

const { test, expect } = require('@playwright/test');
const { ApiHelper } = require('../../utils/ApiHelper');
const { AdminAPIURL, adminHeaders } = require('../../config/config');
const payloads = require('../../payloads/Admin-API/NotificationPayloads');

let api;
let createdNotificationId = null;

test.describe('Admin API - Notification Tests', () => {
  test.beforeEach(async ({ request }) => {
    api = new ApiHelper(request, AdminAPIURL, adminHeaders);
  });

  // ==================== NOTIFICATION CRUD FLOW ====================
  test.describe('Notification - CRUD Flow', () => {
    
    test('Step 1: CREATE - POST /Notification/createnotification', async () => {
      const response = await api.post('/Notification/createnotification', payloads.createNotification, [200, 201]);
      
      expect(response).toBeDefined();
      
      // Extract notification ID for subsequent tests
      if (response && (response.id || response.Id || response.notificationId || response.NotificationId)) {
        createdNotificationId = response.id || response.Id || response.notificationId || response.NotificationId;
        console.log(`Created Notification ID: ${createdNotificationId}`);
      }
    });

    test('Step 2: GET - Verify notification after CREATE', async () => {
      test.skip(!createdNotificationId, 'Notification ID not available - CREATE may have failed');
      
      const response = await api.get(`/Notification/notification?notificationId=${createdNotificationId}`, 200);
      
      expect(response).toBeDefined();
      expect(typeof response === 'object').toBe(true);
    });

    test('Step 3: UPDATE - PUT /Notification/updatenotification', async () => {
      test.skip(!createdNotificationId, 'Notification ID not available - CREATE may have failed');
      
      const updatePayload = {
        ...payloads.updateNotification,
        id: createdNotificationId,
        notificationId: createdNotificationId
      };
      
      const response = await api.put('/Notification/updatenotification', updatePayload, [200, 201]);
      
      expect(response).toBeDefined();
    });

    test('Step 4: GET - Verify notification after UPDATE', async () => {
      test.skip(!createdNotificationId, 'Notification ID not available - CREATE may have failed');
      
      const response = await api.get(`/Notification/notification?notificationId=${createdNotificationId}`, 200);
      
      expect(response).toBeDefined();
      expect(typeof response === 'object').toBe(true);
    });

    test('Step 5: DELETE - DELETE /Notification/deletenotification', async () => {
      test.skip(!createdNotificationId, 'Notification ID not available - CREATE may have failed');
      
      const response = await api.delete(`/Notification/deletenotification?notificationId=${createdNotificationId}`, [200, 204]);
      
      console.log(`Deleted Notification ID: ${createdNotificationId}`);
    });

    test('Step 6: GET - Verify notification after DELETE', async () => {
      test.skip(!createdNotificationId, 'Notification ID not available - CREATE may have failed');
      
      const response = await api.get(`/Notification/notification?notificationId=${createdNotificationId}`, [204, 404]);
      
      // Should return 204 (No Content) or 404 (Not Found) after deletion
    });
  });

  // ==================== ADDITIONAL NOTIFICATION TESTS ====================
  test.describe('Notification - Additional Tests', () => {
    
    test('should create notification with minimal fields', async () => {
      const response = await api.post('/Notification/createnotification', payloads.createNotificationMinimal, [200, 201]);
      
      expect(response).toBeDefined();
    });

    test('should reject notification without required fields', async () => {
      const response = await api.post('/Notification/createnotification', payloads.createNotificationInvalid, 400);
      
      // Should return validation error
    });

    test('should handle non-existent notification ID', async () => {
      const response = await api.get('/Notification/notification?notificationId=999999', 404);
      
      // Should return 404 for non-existent ID
    });

    test('should reject update with invalid notification ID', async () => {
      const response = await api.put('/Notification/updatenotification', payloads.updateNotificationInvalid, [400, 404]);
      
      // Should return error for invalid ID
    });

    test('should handle deletion of non-existent notification', async () => {
      const response = await api.delete('/Notification/deletenotification?notificationId=999999', [404, 204]);
      
      // Should handle gracefully
    });
  });

  // ==================== GET ALL NOTIFICATIONS ====================
  test.describe('Notification - List Operations', () => {
    
    test('should retrieve all notifications', async () => {
      const response = await api.get('/Notification/getallnotification', [200, 204]);
      
      // May return empty if no notifications exist
      if (response && response.length) {
        expect(Array.isArray(response) || typeof response === 'object').toBe(true);
      }
    });
  });

  // ==================== NOTIFICATION TEMPLATE CRUD FLOW ====================
  let createdTemplateId = null;

  test.describe('Notification Template - CRUD Flow', () => {
    
    test('Step 1: CREATE - POST /Notification/createnotificationtemplates', async () => {
      const response = await api.post('/Notification/createnotificationtemplates', payloads.createNotificationTemplatesSingle, [200, 201]);
      
      expect(response).toBeDefined();
      
      // Extract template ID for subsequent tests
      if (response) {
        // Response might be array or object
        const templateData = Array.isArray(response) ? response[0] : response;
        if (templateData && (templateData.id || templateData.Id || templateData.notificationTemplateId || templateData.NotificationTemplateId)) {
          createdTemplateId = templateData.id || templateData.Id || templateData.notificationTemplateId || templateData.NotificationTemplateId;
          console.log(`Created Notification Template ID: ${createdTemplateId}`);
        }
      }
    });

    test('Step 2: GET - Verify template after CREATE', async () => {
      test.skip(!createdTemplateId, 'Template ID not available - CREATE may have failed');
      
      const response = await api.get(`/Notification/notificationtemplates?notificationtemplateid=${createdTemplateId}`, 200);
      
      expect(response).toBeDefined();
      expect(typeof response === 'object').toBe(true);
    });

    test('Step 3: UPDATE - PUT /Notification/updatenotificationtemplates', async () => {
      test.skip(!createdTemplateId, 'Template ID not available - CREATE may have failed');
      
      const updatePayload = {
        ...payloads.updateNotificationTemplatesMinimal,
        id: createdTemplateId,
        notificationTemplateId: createdTemplateId
      };
      
      const response = await api.put('/Notification/updatenotificationtemplates', updatePayload, [200, 201]);
      
      expect(response).toBeDefined();
    });

    test('Step 4: GET - Verify template after UPDATE', async () => {
      test.skip(!createdTemplateId, 'Template ID not available - CREATE may have failed');
      
      const response = await api.get(`/Notification/notificationtemplates?notificationtemplateid=${createdTemplateId}`, 200);
      
      expect(response).toBeDefined();
      expect(typeof response === 'object').toBe(true);
    });

    test('Step 5: DELETE - DELETE /Notification/deletenotificationtemplate', async () => {
      test.skip(!createdTemplateId, 'Template ID not available - CREATE may have failed');
      
      const response = await api.delete(`/Notification/deletenotificationtemplate?notificationtemplateid=${createdTemplateId}`, [200, 204]);
      
      console.log(`Deleted Notification Template ID: ${createdTemplateId}`);
    });

    test('Step 6: GET - Verify template after DELETE', async () => {
      test.skip(!createdTemplateId, 'Template ID not available - CREATE may have failed');
      
      const response = await api.get(`/Notification/notificationtemplates?notificationtemplateid=${createdTemplateId}`, [204, 404]);
      
      // Should return 204 (No Content) or 404 (Not Found) after deletion
    });
  });

  // ==================== ADDITIONAL TEMPLATE TESTS ====================
  test.describe('Notification Template - Additional Tests', () => {
    
    test('should create multiple notification templates', async () => {
      const response = await api.post('/Notification/createnotificationtemplates', payloads.createNotificationTemplates, [200, 201]);
      
      expect(response).toBeDefined();
    });

    test('should reject invalid template data', async () => {
      const response = await api.post('/Notification/createnotificationtemplates', payloads.createNotificationTemplatesInvalid, 400);
      
      // Should return validation error
    });

    test('should retrieve all templates', async () => {
      const response = await api.get('/Notification/notificationtemplates', [200, 204]);
      
      // Should return all templates
    });

    test('should retrieve all notification templates', async () => {
      const response = await api.get('/Notification/getnotificationtemplates', [200, 204]);
      
      // May return empty if no templates exist
      if (response && response.length) {
        expect(Array.isArray(response) || typeof response === 'object').toBe(true);
      }
    });

    test('should retrieve tenant default templates', async () => {
      const response = await api.get('/Notification/gettenantdefaultnotificationtemplates', [200, 204]);
      
      if (response) {
        expect(Array.isArray(response) || typeof response === 'object').toBe(true);
      }
    });

    test('should reject update with invalid template ID', async () => {
      const response = await api.put('/Notification/updatenotificationtemplates', payloads.updateNotificationTemplatesInvalid, [400, 404]);
      
      // Should return error
    });

    test('should handle deletion of non-existent template', async () => {
      const response = await api.delete('/Notification/deletenotificationtemplate?notificationtemplateid=999999', [404, 204]);
      
      // Should handle gracefully
    });
  });

  // ==================== NEGATIVE TESTS ====================
  test.describe('Negative Tests', () => {
    test('should require authentication', async () => {
      // Test without authentication would require separate request without headers
      // This is a placeholder for future implementation
    });

    test('should validate required fields', async () => {
      const response = await api.post('/Notification/createnotification', {}, 400);
      
      // Should reject empty payload
    });
  });
});
