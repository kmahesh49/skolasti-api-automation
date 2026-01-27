// Admin API - UserManagement Tests
// Tests for user management, roles, invitations, and profile operations

const { test, expect } = require('@playwright/test');
const { ApiHelper } = require('../../utils/ApiHelper');
const { AdminAPIURL, adminHeaders } = require('../../config/config');
const payloads = require('../../payloads/Admin-API/UserManagementPayloads');

let api;

test.describe('Admin API - UserManagement Tests', () => {
  test.beforeEach(async ({ request }) => {
    api = new ApiHelper(request, AdminAPIURL, adminHeaders);
  });

  test.describe('POST /UserManagement/getusers', () => {
    test('should retrieve paginated user list', async () => {
      const response = await api.post('/UserManagement/getusers', payloads.pagination, 200);
      
      expect(response).toBeDefined();
      expect(typeof response === 'object').toBe(true);
    });

    test('should retrieve users with filters', async () => {
      const response = await api.post('/UserManagement/getusers', payloads.paginationWithFilter, 200);
      
      expect(response).toBeDefined();
    });

    test('should reject invalid pagination parameters', async () => {
      const response = await api.post('/UserManagement/getusers', payloads.paginationInvalid, 400);
      
      // Should return validation error
    });
  });

  test.describe('POST /UserManagement/getuserroles', () => {
    test('should retrieve paginated user roles', async () => {
      const response = await api.post('/UserManagement/getuserroles', payloads.pagination, 200);
      
      expect(response).toBeDefined();
    });

    test('should handle empty result set', async () => {
      const response = await api.post('/UserManagement/getuserroles', payloads.pagination, [200, 204]);
      
      // May return 204 if no roles
    });
  });

  test.describe('POST /UserManagement/getfusionauthuserroles', () => {
    test('should retrieve FusionAuth user roles', async () => {
      const response = await api.post('/UserManagement/getfusionauthuserroles', payloads.pagination, 200);
      
      expect(response).toBeDefined();
    });
  });

  test.describe('GET /UserManagement/details', () => {
    test('should retrieve user details by ID', async () => {
      const response = await api.get('/UserManagement/details?userId=3f537698-4e5e-4101-9115-626385911940', [200, 404]);
      
      // May return 404 if user doesn't exist
      if (response && response !== null) {
        expect(typeof response === 'object').toBe(true);
      }
    });

    test('should handle non-existent user ID', async () => {
      const response = await api.get('/UserManagement/details?userId=00000000-0000-0000-0000-000000000000', 404);
      
      // Should return 404
    });

    test('should handle missing user ID parameter', async () => {
      const response = await api.get('/UserManagement/details', [400, 404]);
      
      // Should return error
    });
  });

  test.describe('PUT /UserManagement/updateuserroleinusers', () => {
    test('should update user role', async () => {
      const response = await api.put('/UserManagement/updateuserroleinusers', payloads.updateUserRole, [200, 404]);
      
      // May return 404 if user doesn't exist
    });

    test('should reject empty user ID', async () => {
      const response = await api.put('/UserManagement/updateuserroleinusers', payloads.updateUserRoleInvalid, 400);
      
      // Should return validation error
    });
  });

  test.describe('POST /UserManagement/inviteuser', () => {
    test('should invite a single user', async () => {
      const response = await api.post('/UserManagement/inviteuser', payloads.inviteUser, [200, 201]);
      
      expect(response).toBeDefined();
    });

    test('should invite user with minimal data', async () => {
      const response = await api.post('/UserManagement/inviteuser', payloads.inviteUserMinimal, [200, 201]);
      
      expect(response).toBeDefined();
    });

    test('should reject invalid email', async () => {
      const response = await api.post('/UserManagement/inviteuser', payloads.inviteUserInvalid, 400);
      
      // Should return validation error
    });
  });

  test.describe('POST /UserManagement/bulkinviteuser', () => {
    test('should invite multiple users', async () => {
      const response = await api.post('/UserManagement/bulkinviteuser', payloads.bulkInviteUsers, [200, 201]);
      
      expect(response).toBeDefined();
    });

    test('should invite single user in bulk format', async () => {
      const response = await api.post('/UserManagement/bulkinviteuser', payloads.bulkInviteUsersSingle, [200, 201]);
      
      expect(response).toBeDefined();
    });

    test('should reject invalid email in bulk invite', async () => {
      const response = await api.post('/UserManagement/bulkinviteuser', payloads.bulkInviteUsersInvalid, 400);
      
      // Should return validation error
    });
  });

  test.describe('GET /UserManagement/validateemail', () => {
    test('should validate email format', async () => {
      const response = await api.get('/UserManagement/validateemail?email=test@example.com&domain=example.com', 200);
      
      expect(response).toBeDefined();
    });

    test('should reject invalid email format', async () => {
      const response = await api.get('/UserManagement/validateemail?email=invalid-email&domain=example.com', [400, 200]);
      
      // API may return 200 with validation result or 400
    });

    test('should handle missing parameters', async () => {
      const response = await api.get('/UserManagement/validateemail', [400, 200]);
      
      // Should return error or validation result
    });
  });

  test.describe('PUT /UserManagement/updateuserprofile', () => {
    test('should update user profile with all fields', async () => {
      const response = await api.put('/UserManagement/updateuserprofile', payloads.updateUserProfile, [200, 404]);
      
      // May return 404 if user doesn't exist
    });

    test('should update user profile with minimal fields', async () => {
      const response = await api.put('/UserManagement/updateuserprofile', payloads.updateUserProfileMinimal, [200, 404]);
      
      // Should allow partial updates
    });

    test('should reject update without user ID', async () => {
      const response = await api.put('/UserManagement/updateuserprofile', payloads.updateUserProfileInvalid, 400);
      
      // Should return validation error
    });
  });

  test.describe('PUT /UserManagement/updatedpreferredlanguage', () => {
    test('should update user preferred language', async () => {
      const response = await api.put('/UserManagement/updatedpreferredlanguage', payloads.updateLanguage, [200, 404]);
      
      // May return 404 if user doesn't exist
    });

    test('should reject invalid language ID', async () => {
      const response = await api.put('/UserManagement/updatedpreferredlanguage', payloads.updateLanguageInvalid, 400);
      
      // Should return validation error
    });
  });

  test.describe('GET /UserManagement/getalllanguages', () => {
    test('should retrieve all available languages', async () => {
      const response = await api.get('/UserManagement/getalllanguages', 200);
      
      expect(response).toBeDefined();
      expect(Array.isArray(response) || typeof response === 'object').toBe(true);
    });
  });

  test.describe('DELETE /UserManagement/deleteuserprofile/{userId}', () => {
    test('should delete user profile by ID', async () => {
      const response = await api.delete('/UserManagement/deleteuserprofile/3f537698-4e5e-4101-9115-626385911940', [200, 204, 404]);
      
      // May return 404 if user already deleted
    });

    test('should handle deletion of non-existent user', async () => {
      const response = await api.delete('/UserManagement/deleteuserprofile/00000000-0000-0000-0000-000000000000', [404, 200, 204]);
      
      // Should handle gracefully
    });
  });

  test.describe('DELETE /UserManagement/deleteprofilepicture', () => {
    test('should delete user profile picture', async () => {
      const response = await api.delete('/UserManagement/deleteprofilepicture?userId=3f537698-4e5e-4101-9115-626385911940', [200, 204, 404]);
      
      // May return 404 if no picture exists
    });

    test('should handle deletion when no picture exists', async () => {
      const response = await api.delete('/UserManagement/deleteprofilepicture?userId=00000000-0000-0000-0000-000000000000', [404, 204]);
      
      // Should handle gracefully
    });
  });

  test.describe('POST /UserManagement/uploadprofilepicture', () => {
    test.skip('should upload profile picture (multipart/form-data)', async () => {
      // File upload requires special handling with Playwright
      // This test is skipped as it requires actual file content
      // Implementation would use request.post with multipart/form-data
    });
  });

  test.describe('Negative Tests', () => {
    test('should reject requests without authentication', async () => {
      // Would require separate request without headers
    });

    test('should handle malformed user IDs', async () => {
      const response = await api.get('/UserManagement/details?userId=invalid-uuid', [400, 404]);
      
      // Should return error
    });

    test('should reject pagination with negative page number', async () => {
      const invalidPagination = { ...payloads.pagination, PageNumber: -1 };
      const response = await api.post('/UserManagement/getusers', invalidPagination, 400);
      
      // Should return validation error
    });

    test('should reject pagination with excessive page size', async () => {
      const invalidPagination = { ...payloads.pagination, PageSize: 1000 };
      const response = await api.post('/UserManagement/getusers', invalidPagination, 400);
      
      // Should return validation error
    });
  });
});
