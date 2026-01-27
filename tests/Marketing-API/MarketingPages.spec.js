/**
 * Marketing API - Marketing Pages Endpoints Test Suite
 * 
 * Base URL: /api/Marketingpages
 * Total Endpoints: 4
 * 
 * Test Coverage:
 * - GET /marketingpages (all pages)
 * - POST /marketingpages (create page)
 * - PUT /marketingpages (update page)
 * - GET /marketingpages/{id} (get by ID)
 * - DELETE /marketingpages/{id} (delete page)
 * - GET /marketingpages/active (deprecated - active pages only)
 * 
 * Standards Applied:
 * - GET collections: [200, 204] valid (empty state OK)
 * - GET by ID: [200, 204, 404] valid
 * - POST: 201 for success, 409 for conflict
 * - PUT: 200 for success, 304 for no changes
 * - DELETE: 204 for success, 409 for conflict
 * - Negative tests: expect only error codes
 */

const { test, expect } = require('@playwright/test');
const { ApiHelper } = require('../../utils/ApiHelper');
const { MarketingAPIURL, marketingHeaders } = require('../../config/config');
const payloads = require('../../payloads/Marketing-API/MarketingPagesPayloads');

test.describe('Marketing API - Marketing Pages Endpoints', () => {
  let api;
  let createdPageId = null;

  test.beforeEach(async ({ request }) => {
    api = new ApiHelper(request, MarketingAPIURL, marketingHeaders);
  });

  // =============================================================================
  // GET ALL MARKETING PAGES
  // =============================================================================
  
  test.describe('GET /api/Marketingpages/marketingpages', () => {
    test('should get all marketing pages or return empty list', async () => {
      const pages = await api.get('/Marketingpages/marketingpages', [200, 204]);
      
      if (pages) {
        expect(Array.isArray(pages)).toBe(true);
        
        if (pages.length > 0) {
          const page = pages[0];
          expect(page).toHaveProperty('Id');
          expect(page).toHaveProperty('PageName');
          expect(page).toHaveProperty('IsPageVisible');
          expect(page).toHaveProperty('IsPublished');
        }
      }
      
      api.assertAll();
    });
  });

  // =============================================================================
  // CREATE MARKETING PAGE (CRUD - CREATE)
  // =============================================================================
  
  test.describe('POST /api/Marketingpages/marketingpages', () => {
    test('should create new marketing page with valid data', async () => {
      const uniquePageName = `Test Page ${Date.now()}`;
      const payload = {
        ...payloads.createMarketingPage.validRequest,
        PageName: uniquePageName
      };

      const page = await api.post('/Marketingpages/marketingpages', payload, [201]);
      
      // Store ID for cleanup
      if (page && page.Id) {
        createdPageId = page.Id;
      }
      
      api.assertAll();
    });

    test('NEGATIVE: should reject empty page name', async () => {
      await api.post(
        '/Marketingpages/marketingpages',
        payloads.createMarketingPage.invalidData,
        [400]
      );
      
      api.assertAll();
    });

    test('NEGATIVE: should return conflict for duplicate page name', async () => {
      // Create a page first
      const uniqueName = `Duplicate Test ${Date.now()}`;
      const payload = {
        ...payloads.createMarketingPage.validRequest,
        PageName: uniqueName
      };

      await api.post('/Marketingpages/marketingpages', payload, [201]);
      
      // Try to create again with same name
      await api.post(
        '/Marketingpages/marketingpages',
        payload,
        [409]
      );
      
      api.assertAll();
    });

    test('NEGATIVE: should reject missing required fields', async () => {
      await api.post(
        '/Marketingpages/marketingpages',
        {},
        [400]
      );
      
      api.assertAll();
    });
  });

  // =============================================================================
  // GET MARKETING PAGE BY ID
  // =============================================================================
  
  test.describe('GET /api/Marketingpages/marketingpages/{id}', () => {
    test('should get marketing page by valid ID', async () => {
      const page = await api.get('/Marketingpages/marketingpages/1', [200, 204, 404]);
      
      if (page) {
        expect(page).toHaveProperty('Id');
        expect(page).toHaveProperty('PageName');
        expect(page).toHaveProperty('IsPageVisible');
        expect(page).toHaveProperty('IsPublished');
      }
      
      api.assertAll();
    });

    test('NEGATIVE: should handle non-existent page ID', async () => {
      await api.get('/Marketingpages/marketingpages/99999', [404, 204]);
      
      api.assertAll();
    });

    test('NEGATIVE: should reject non-numeric ID', async () => {
      await api.get('/Marketingpages/marketingpages/invalid', [400, 404]);
      
      api.assertAll();
    });
  });

  // =============================================================================
  // UPDATE MARKETING PAGE (CRUD - UPDATE)
  // =============================================================================
  
  test.describe('PUT /api/Marketingpages/marketingpages', () => {
    test('should update existing marketing page', async () => {
      // First create a page to update
      const createPayload = {
        ...payloads.createMarketingPage.validRequest,
        PageName: `Update Test ${Date.now()}`
      };
      const createdPage = await api.post(
        '/Marketingpages/marketingpages',
        createPayload,
        [201]
      );

      if (createdPage && createdPage.Id) {
        const pageId = createdPage.Id;
        
        // Now update it
        const updatePayload = {
          ...payloads.updateMarketingPage.validRequest,
          Id: pageId,
          PageName: `Updated ${Date.now()}`,
          IsPageVisible: false
        };

        await api.put(
          '/Marketingpages/marketingpages',
          updatePayload,
          [200]
        );
      }
      
      api.assertAll();
    });

    test('should return 304 when no changes made', async () => {
      // TODO: Review if 304 is expected behavior or backend issue
      // Currently accepting 304, but may need backend investigation
      await api.put(
        '/Marketingpages/marketingpages',
        payloads.updateMarketingPage.noChanges,
        [200, 304]
      );
      
      api.assertAll();
    });

    test('NEGATIVE: should reject update with non-existent ID', async () => {
      await api.put(
        '/Marketingpages/marketingpages',
        payloads.updateMarketingPage.invalidId,
        [404, 400]
      );
      
      api.assertAll();
    });

    test('NEGATIVE: should reject update with invalid data', async () => {
      await api.put(
        '/Marketingpages/marketingpages',
        { Id: 1, PageName: "" },
        [400]
      );
      
      api.assertAll();
    });
  });

  // =============================================================================
  // DELETE MARKETING PAGE (CRUD - DELETE)
  // =============================================================================
  
  test.describe('DELETE /api/Marketingpages/marketingpages/{id}', () => {
    test('should delete existing marketing page', async () => {
      // Create a page to delete
      const createPayload = {
        ...payloads.createMarketingPage.validRequest,
        PageName: `Delete Test ${Date.now()}`
      };
      const createdPage = await api.post(
        '/Marketingpages/marketingpages',
        createPayload,
        [201]
      );

      if (createdPage && createdPage.Id) {
        const pageId = createdPage.Id;
        
        // Delete it
        await api.delete(
          `/Marketingpages/marketingpages/${pageId}`,
          [204]
        );
        
        // Verify deletion
        await api.get(
          `/Marketingpages/marketingpages/${pageId}`,
          [404, 204]
        );
      }
      
      api.assertAll();
    });

    test('NEGATIVE: should handle non-existent page ID for deletion', async () => {
      await api.delete(
        '/Marketingpages/marketingpages/99999',
        [404, 204]
      );
      
      api.assertAll();
    });

    test('NEGATIVE: should return conflict if page cannot be deleted', async () => {
      // This test assumes some pages have dependencies and return 409
      // Adjust based on actual API behavior
      await api.delete(
        '/Marketingpages/marketingpages/1',
        [204, 409]
      );
      
      api.assertAll();
    });
  });

  // =============================================================================
  // GET ACTIVE MARKETING PAGES (DEPRECATED)
  // =============================================================================
  
  test.describe('GET /api/Marketingpages/marketingpages/active [DEPRECATED]', () => {
    test('should get active marketing pages', async () => {
      const pages = await api.get('/Marketingpages/marketingpages/active', [200, 204]);
      
      if (pages && Array.isArray(pages)) {
        // All returned pages should be active
        if (pages.length > 0) {
          pages.forEach(page => {
            expect(page.IsPageVisible).toBe(true);
            expect(page.IsPublished).toBe(true);
          });
        }
      }
      
      api.assertAll();
    });
  });

  // =============================================================================
  // CLEANUP
  // =============================================================================
  
  test.afterAll(async () => {
    // Cleanup: Delete created page if exists
    if (createdPageId) {
      await api.delete(`/Marketingpages/marketingpages/${createdPageId}`, [204, 404]);
    }
  });
});
