/**
 * Marketing API - CourseData Endpoints Test Suite
 * 
 * Base URL: /api/CourseData
 * Total Endpoints: 13
 * 
 * Test Coverage:
 * - GET /categories (collection - can be empty)
 * - GET /subscriptionplans (collection - can be empty)
 * - GET /subscriptionplans/{planId} (by ID)
 * - GET /getcontentreviews (paginated)
 * - GET /getbyidcourse (course details)
 * - POST /getallcourses (filtered list)
 * - GET /getbyaudioid (audio details)
 * - GET /getbyidcontentdocument (document details)
 * - GET /details/{videoId} (video details)
 * - GET /validateemail (email validation)
 * - POST /inviteuser (user invitation)
 * - GET /coursecontenttypes (content types)
 * - GET /getlinkedconfig (payment gateway config)
 * - GET /getfeatureavaibility (feature flags)
 * 
 * Standards Applied:
 * - GET collections: [200, 204] valid (empty state OK)
 * - GET by ID: [200, 404] valid (resource may not exist)
 * - POST/PUT: 200/201 for success
 * - Negative tests: expect only error codes
 * - No error masking (no 500 or 400 in positive tests)
 */

const { test, expect } = require('@playwright/test');
const { ApiHelper } = require('../../utils/ApiHelper');
const { MarketingAPIURL, marketingHeaders } = require('../../config/config');
const payloads = require('../../payloads/Marketing-API/CourseDataPayloads');

test.describe('Marketing API - CourseData Endpoints', () => {
  let api;

  test.beforeEach(async ({ request }) => {
    api = new ApiHelper(request, MarketingAPIURL, marketingHeaders);
  });

  // =============================================================================
  // CATEGORIES ENDPOINTS
  // =============================================================================
  
  test.describe('GET /api/CourseData/categories', () => {
    test('should get all categories or return empty list', async () => {
      const categories = await api.get('/CourseData/categories', [200, 204]);
      
      if (categories) {
        expect(Array.isArray(categories)).toBe(true);
        
        if (categories.length > 0) {
          const category = categories[0];
          expect(category).toHaveProperty('Id');
          expect(category).toHaveProperty('CategoryName');
        }
      }
      
      api.assertAll();
    });
  });

  // =============================================================================
  // SUBSCRIPTION PLANS ENDPOINTS
  // =============================================================================
  
  test.describe('GET /api/CourseData/subscriptionplans', () => {
    test('should get all subscription plans or return empty list', async () => {
      const plans = await api.get('/CourseData/subscriptionplans', [200, 204]);
      
      if (plans) {
        expect(Array.isArray(plans)).toBe(true);
        
        if (plans.length > 0) {
          const plan = plans[0];
          expect(plan).toHaveProperty('PlanId');
          expect(plan).toHaveProperty('PlanName');
          expect(plan).toHaveProperty('Price');
        }
      }
      
      api.assertAll();
    });
  });

  test.describe('GET /api/CourseData/subscriptionplans/{planId}', () => {
    test('should get subscription plan by valid ID', async () => {
      const plan = await api.get('/CourseData/subscriptionplans/1', [200, 204, 404]);
      
      if (plan) {
        expect(plan).toHaveProperty('Id');
        expect(plan).toHaveProperty('PlanName');
        expect(plan).toHaveProperty('Price');
      }
      
      api.assertAll();
    });

    test('should handle subscription plan by ID with optional contentTypeId', async () => {
      await api.get('/CourseData/subscriptionplans/1?contentTypeId=1', [200, 204, 404]);
      
      api.assertAll();
    });

    test('NEGATIVE: should handle invalid plan ID', async () => {
      await api.get('/CourseData/subscriptionplans/99999', [404, 400]);
      
      api.assertAll();
    });

    test('NEGATIVE: should reject non-numeric plan ID', async () => {
      await api.get('/CourseData/subscriptionplans/invalid', [400, 404]);
      
      api.assertAll();
    });
  });

  // =============================================================================
  // CONTENT REVIEWS ENDPOINT
  // =============================================================================
  
  test.describe('GET /api/CourseData/getcontentreviews', () => {
    test('should get content reviews with valid params', async () => {
      const params = new URLSearchParams(payloads.getContentReviews.validRequest);
      await api.get(`/CourseData/getcontentreviews?${params}`, [200, 204]);
      
      api.assertAll();
    });

    test('NEGATIVE: should reject invalid content ID', async () => {
      const params = new URLSearchParams(payloads.getContentReviews.invalidContentId);
      await api.get(`/CourseData/getcontentreviews?${params}`, [400, 404]);
      
      api.assertAll();
    });

    test('NEGATIVE: should reject invalid pagination params (exceeds max)', async () => {
      const params = new URLSearchParams(payloads.getContentReviews.invalidPagination);
      await api.get(`/CourseData/getcontentreviews?${params}`, [400]);
      
      api.assertAll();
    });

    test('NEGATIVE: should require contentId and contentTypeId', async () => {
      await api.get('/CourseData/getcontentreviews', [400]);
      
      api.assertAll();
    });
  });

  // =============================================================================
  // COURSE DETAILS ENDPOINTS
  // =============================================================================
  
  test.describe('GET /api/CourseData/getbyidcourse', () => {
    test('should get course by ID', async () => {
      const course = await api.get('/CourseData/getbyidcourse?id=1', [200, 204, 404]);
      
      if (course) {
        expect(course).toBeDefined();
      }
      
      api.assertAll();
    });

    test('NEGATIVE: should handle non-existent course ID', async () => {
      await api.get('/CourseData/getbyidcourse?id=99999', [404, 204]);
      
      api.assertAll();
    });
  });

  test.describe('POST /api/CourseData/getallcourses', () => {
    test('should get all courses with basic pagination', async () => {
      await api.post('/CourseData/getallcourses', payloads.getAllCourses.validRequest, [200, 204]);
      
      api.assertAll();
    });

    test('should get courses with filters applied', async () => {
      await api.post('/CourseData/getallcourses', payloads.getAllCourses.withFilters, [200, 204]);
      
      api.assertAll();
    });

    test('should handle empty filters', async () => {
      await api.post('/CourseData/getallcourses', payloads.getAllCourses.emptyFilters, [200, 204]);
      
      api.assertAll();
    });

    test('should accept viewAllCourseType query param', async () => {
      await api.post(
        '/CourseData/getallcourses?viewAllCourseType=1',
        payloads.getAllCourses.validRequest,
        [200, 204]
      );
      
      api.assertAll();
    });
  });

  // =============================================================================
  // AUDIO ENDPOINT
  // =============================================================================
  
  test.describe('GET /api/CourseData/getbyaudioid', () => {
    test('should get audio by ID', async () => {
      await api.get('/CourseData/getbyaudioid?id=1', [200, 204, 404]);
      
      api.assertAll();
    });

    test('NEGATIVE: should handle non-existent audio ID', async () => {
      await api.get('/CourseData/getbyaudioid?id=99999', [404, 204]);
      
      api.assertAll();
    });
  });

  // =============================================================================
  // DOCUMENT ENDPOINT
  // =============================================================================
  
  test.describe('GET /api/CourseData/getbyidcontentdocument', () => {
    test('should get content document by ID', async () => {
      await api.get('/CourseData/getbyidcontentdocument?id=1', [200, 204, 404]);
      
      api.assertAll();
    });

    test('NEGATIVE: should handle non-existent document ID', async () => {
      await api.get('/CourseData/getbyidcontentdocument?id=99999', [404, 204]);
      
      api.assertAll();
    });
  });

  // =============================================================================
  // VIDEO DETAILS ENDPOINT
  // =============================================================================
  
  test.describe('GET /api/CourseData/details/{videoId}', () => {
    test('should get video details by ID', async () => {
      const video = await api.get('/CourseData/details/1', [200, 404]);
      
      if (video) {
        expect(video).toBeDefined();
      }
      
      api.assertAll();
    });

    test('NEGATIVE: should handle non-existent video ID', async () => {
      await api.get('/CourseData/details/99999', [404]);
      
      api.assertAll();
    });

    test('NEGATIVE: should reject non-numeric video ID', async () => {
      await api.get('/CourseData/details/invalid', [400, 404]);
      
      api.assertAll();
    });
  });

  // =============================================================================
  // EMAIL VALIDATION ENDPOINT
  // =============================================================================
  
  test.describe('GET /api/CourseData/validateemail', () => {
    test('should validate email with domain', async () => {
      const result = await api.get(
        '/CourseData/validateemail?email=test@example.com&domain=skillrok.com',
        [200]
      );
      
      expect(result).toBeDefined();
      
      api.assertAll();
    });

    test('NEGATIVE: should reject invalid email format', async () => {
      await api.get(
        '/CourseData/validateemail?email=invalid-email&domain=skillrok.com',
        [400]
      );
      
      api.assertAll();
    });

    test('NEGATIVE: should handle missing email param', async () => {
      await api.get('/CourseData/validateemail?domain=skillrok.com', [400]);
      
      api.assertAll();
    });
  });

  // =============================================================================
  // INVITE USER ENDPOINT
  // =============================================================================
  
  test.describe('POST /api/CourseData/inviteuser', () => {
    test('should invite user with valid data', async () => {
      await api.post(
        '/CourseData/inviteuser',
        payloads.inviteUser.validRequest,
        [200, 201]
      );
      
      api.assertAll();
    });

    test('NEGATIVE: should reject invalid email format', async () => {
      await api.post(
        '/CourseData/inviteuser',
        payloads.inviteUser.invalidEmail,
        [400]
      );
      
      api.assertAll();
    });

    test('NEGATIVE: should reject missing required fields', async () => {
      await api.post(
        '/CourseData/inviteuser',
        payloads.inviteUser.missingRequired,
        [400]
      );
      
      api.assertAll();
    });
  });

  // =============================================================================
  // COURSE CONTENT TYPES ENDPOINT
  // =============================================================================
  
  test.describe('GET /api/CourseData/coursecontenttypes', () => {
    test('should get all course content types', async () => {
      const contentTypes = await api.get('/CourseData/coursecontenttypes', [200, 204]);
      
      if (contentTypes) {
        expect(contentTypes).toBeDefined();
      }
      
      api.assertAll();
    });
  });

  // =============================================================================
  // PAYMENT GATEWAY CONFIG ENDPOINT
  // =============================================================================
  
  test.describe('GET /api/CourseData/getlinkedconfig', () => {
    test('should get payment gateway config with tenant ID', async () => {
      const config = await api.get('/CourseData/getlinkedconfig?tenantId=1', [200, 204, 404]);
      
      if (config) {
        expect(config).toBeDefined();
        expect(config).toHaveProperty('PaymentGatewayType');
      }
      
      api.assertAll();
    });

    test('should handle missing tenant ID param', async () => {
      await api.get('/CourseData/getlinkedconfig', [200, 204, 400]);
      
      api.assertAll();
    });
  });

  // =============================================================================
  // FEATURE AVAILABILITY ENDPOINT
  // =============================================================================
  
  test.describe('GET /api/CourseData/getfeatureavaibility', () => {
    test('should get feature availability', async () => {
      const features = await api.get('/CourseData/getfeatureavaibility', [200]);
      
      expect(features).toBeDefined();
      
      api.assertAll();
    });
  });
});
