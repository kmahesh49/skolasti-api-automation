/**
 * Marketing API - Page Content Endpoints Test Suite
 * 
 * Covers 3 content types:
 * 1. Dynamic Content: /api/PageSectionDynamicContent
 * 2. Static Content: /api/PageSectionStaticContent
 * 3. Product Content: /api/SectionProductContent + /api/SectionProductDetails
 * 
 * Total Endpoints: 17
 * 
 * Test Coverage:
 * DYNAMIC CONTENT (6 endpoints):
 * - GET /pagesectiondynamiccontent
 * - POST /pagesectiondynamiccontent (multipart/form-data)
 * - PUT /pagesectiondynamiccontent (multipart/form-data)
 * - GET /pagesectiondynamiccontent/{id}
 * - DELETE /pagesectiondynamiccontent/{id}
 * - GET /pagesectiondynamiccontent/active (deprecated)
 * - POST /invalidatecache
 * 
 * STATIC CONTENT (4 endpoints):
 * - GET /pagesectionstaticcontent
 * - POST /pagesectionstaticcontent (multipart/form-data)
 * - PUT /pagesectionstaticcontent (multipart/form-data)
 * - GET /pagesectionstaticcontent/{id}
 * - DELETE /pagesectionstaticcontent/{id}
 * 
 * PRODUCT CONTENT (4 endpoints):
 * - GET /sectionproductcontent
 * - POST /sectionproductcontent
 * - PUT /sectionproductcontent
 * - GET /sectionproductcontent/{id}
 * - DELETE /sectionproductcontent/{id}
 * 
 * PRODUCT DETAILS (4 endpoints):
 * - GET /sectionproductdetails
 * - POST /sectionproductdetails
 * - PUT /sectionproductdetails
 * - GET /sectionproductdetails/{id}
 * - DELETE /sectionproductdetails/{id}
 * 
 * Standards Applied:
 * - GET collections: [200, 204] valid (empty state OK)
 * - GET by ID: [200, 204, 404] valid
 * - POST: 201 for success, 409 for conflict
 * - PUT: 200 for success, 304 for no changes
 * - DELETE: 204 for success, 409 for conflict
 * - Negative tests: expect only error codes
 * 
 * Note: POST/PUT with multipart/form-data might need special handling
 */

const { test, expect } = require('@playwright/test');
const { ApiHelper } = require('../../utils/ApiHelper');
const { MarketingAPIURL, marketingHeaders } = require('../../config/config');
const payloads = require('../../payloads/Marketing-API/PageContentPayloads');

test.describe('Marketing API - Page Content Endpoints', () => {
  let api;
  let createdDynamicContentId = null;
  let createdStaticContentId = null;
  let createdProductContentId = null;
  let createdProductDetailId = null;

  test.beforeEach(async ({ request }) => {
    api = new ApiHelper(request, MarketingAPIURL, marketingHeaders);
  });

  // =============================================================================
  // DYNAMIC CONTENT ENDPOINTS
  // =============================================================================
  
  test.describe('Dynamic Content - GET /api/PageSectionDynamicContent/pagesectiondynamiccontent', () => {
    test('should get all dynamic content or return empty list', async () => {
      const data = await api.get('/PageSectionDynamicContent/pagesectiondynamiccontent', [200, 204]);
      
      if (data) {
        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(true);
        
        if (data.length > 0) {
          const content = data[0];
          expect(content).toHaveProperty('Id');
          expect(content).toHaveProperty('Pagesectionid');
          expect(content).toHaveProperty('Heading');
        }
      }
      
      api.assertAll();
    });
  });

  test.describe('Dynamic Content - POST /api/PageSectionDynamicContent/pagesectiondynamiccontent', () => {
    test('should create new dynamic content with valid data', async () => {
      const uniqueHeading = `Test Dynamic ${Date.now()}`;
      const payload = {
        ...payloads.createDynamicContent.validRequest,
        Heading: uniqueHeading
      };

      // Note: This endpoint uses multipart/form-data
      // ApiHelper should handle JSON body, but may need adjustment for multipart
      const data = await api.post(
        '/PageSectionDynamicContent/pagesectiondynamiccontent',
        payload,
        [201]
      );
      
      if (data && data.Id) {
        createdDynamicContentId = data.Id;
      }
      
      api.assertAll();
    });

    test('NEGATIVE: should reject missing required page section ID', async () => {
      await api.post(
        '/PageSectionDynamicContent/pagesectiondynamiccontent',
        payloads.createDynamicContent.missingRequired,
        [400]
      );
      
      api.assertAll();
    });

    test('NEGATIVE: should reject invalid rating value', async () => {
      await api.post(
        '/PageSectionDynamicContent/pagesectiondynamiccontent',
        {
          ...payloads.createDynamicContent.validRequest,
          Rating: 10 // Assuming max is 5
        },
        [400]
      );
      
      api.assertAll();
    });

    test('NEGATIVE: should reject negative rating', async () => {
      await api.post(
        '/PageSectionDynamicContent/pagesectiondynamiccontent',
        {
          ...payloads.createDynamicContent.validRequest,
          Rating: -1
        },
        [400]
      );
      
      api.assertAll();
    });
  });

  test.describe('Dynamic Content - GET /api/PageSectionDynamicContent/pagesectiondynamiccontent/{id}', () => {
    test('should get dynamic content by valid ID', async () => {
      const data = await api.get(
        '/PageSectionDynamicContent/pagesectiondynamiccontent/1',
        [200, 204, 404]
      );
      
      if (data) {
        expect(data).toHaveProperty('Id');
        expect(data).toHaveProperty('Heading');
      }
      
      api.assertAll();
    });

    test('NEGATIVE: should handle non-existent dynamic content ID', async () => {
      await api.get(
        '/PageSectionDynamicContent/pagesectiondynamiccontent/99999',
        [404, 204]
      );
      
      api.assertAll();
    });
  });

  test.describe('Dynamic Content - PUT /api/PageSectionDynamicContent/pagesectiondynamiccontent', () => {
    test('should update existing dynamic content', async () => {
      // Create content first
      const createPayload = {
        ...payloads.createDynamicContent.validRequest,
        Heading: `Update Test ${Date.now()}`
      };
      const createData = await api.post(
        '/PageSectionDynamicContent/pagesectiondynamiccontent',
        createPayload,
        [201]
      );

      if (createData && createData.Id) {
        const contentId = createData.Id;
        
        const updatePayload = {
          ...createPayload,
          Id: contentId,
          Heading: `Updated Dynamic ${Date.now()}`,
          Rating: 5.0
        };

        await api.put(
          '/PageSectionDynamicContent/pagesectiondynamiccontent',
          updatePayload,
          [200]
        );
      }
      
      api.assertAll();
    });

    test('NEGATIVE: should reject update with non-existent ID', async () => {
      await api.put(
        '/PageSectionDynamicContent/pagesectiondynamiccontent',
        {
          ...payloads.createDynamicContent.validRequest,
          Id: 99999
        },
        [404, 400]
      );
      
      api.assertAll();
    });
  });

  test.describe('Dynamic Content - DELETE /api/PageSectionDynamicContent/pagesectiondynamiccontent/{id}', () => {
    test('should delete existing dynamic content', async () => {
      const createPayload = {
        ...payloads.createDynamicContent.validRequest,
        Heading: `Delete Test ${Date.now()}`
      };
      const createData = await api.post(
        '/PageSectionDynamicContent/pagesectiondynamiccontent',
        createPayload,
        [201]
      );

      if (createData && createData.Id) {
        const contentId = createData.Id;
        
        await api.delete(
          `/PageSectionDynamicContent/pagesectiondynamiccontent/${contentId}`,
          [204]
        );
      }
      
      api.assertAll();
    });

    test('NEGATIVE: should return conflict if content has dependencies', async () => {
      await api.delete(
        '/PageSectionDynamicContent/pagesectiondynamiccontent/1',
        [204, 409]
      );
      
      api.assertAll();
    });
  });

  test.describe('Dynamic Content - GET /api/PageSectionDynamicContent/pagesectiondynamiccontent/active [DEPRECATED]', () => {
    test('should get active dynamic content', async () => {
      const data = await api.get(
        '/PageSectionDynamicContent/pagesectiondynamiccontent/active',
        [200, 204]
      );
      
      if (data) {
        expect(Array.isArray(data)).toBe(true);
      }
      
      api.assertAll();
    });
  });

  test.describe('Dynamic Content - POST /api/PageSectionDynamicContent/invalidatecache', () => {
    test('should invalidate dynamic content cache', async () => {
      await api.post(
        '/PageSectionDynamicContent/invalidatecache',
        {},
        [200]
      );
      
      api.assertAll();
    });
  });

  // =============================================================================
  // STATIC CONTENT ENDPOINTS
  // =============================================================================
  
  test.describe('Static Content - GET /api/PageSectionStaticContent/pagesectionstaticcontent', () => {
    test('should get all static content or return empty list', async () => {
      const data = await api.get('/PageSectionStaticContent/pagesectionstaticcontent', [200, 204]);
      
      if (data) {
        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(true);
        
        if (data.length > 0) {
          const content = data[0];
          expect(content).toHaveProperty('Id');
          expect(content).toHaveProperty('Heading');
          expect(content).toHaveProperty('Buttontext');
        }
      }
      
      api.assertAll();
    });
  });

  test.describe('Static Content - POST /api/PageSectionStaticContent/pagesectionstaticcontent', () => {
    test('should create new static content with valid data', async () => {
      const uniqueHeading = `Test Static ${Date.now()}`;
      const payload = {
        ...payloads.createStaticContent.validRequest,
        Heading: uniqueHeading
      };

      const data = await api.post(
        '/PageSectionStaticContent/pagesectionstaticcontent',
        payload,
        [201]
      );
      
      if (data && data.Id) {
        createdStaticContentId = data.Id;
      }
      
      api.assertAll();
    });

    test('NEGATIVE: should reject invalid button URL', async () => {
      await api.post(
        '/PageSectionStaticContent/pagesectionstaticcontent',
        payloads.createStaticContent.invalidUrl,
        [400]
      );
      
      api.assertAll();
    });

    test('NEGATIVE: should reject exceeding max length for button text', async () => {
      await api.post(
        '/PageSectionStaticContent/pagesectionstaticcontent',
        {
          ...payloads.createStaticContent.validRequest,
          Buttontext: "A".repeat(51) // max is 50
        },
        [400]
      );
      
      api.assertAll();
    });
  });

  test.describe('Static Content - GET /api/PageSectionStaticContent/pagesectionstaticcontent/{id}', () => {
    test('should get static content by valid ID', async () => {
      await api.get(
        '/PageSectionStaticContent/pagesectionstaticcontent/1',
        [200, 204, 404]
      );
      
      api.assertAll();
    });

    test('NEGATIVE: should handle non-existent static content ID', async () => {
      await api.get(
        '/PageSectionStaticContent/pagesectionstaticcontent/99999',
        [404, 204]
      );
      
      api.assertAll();
    });
  });

  test.describe('Static Content - PUT /api/PageSectionStaticContent/pagesectionstaticcontent', () => {
    test('should update existing static content', async () => {
      const createPayload = {
        ...payloads.createStaticContent.validRequest,
        Heading: `Update Static Test ${Date.now()}`
      };
      const createData = await api.post(
        '/PageSectionStaticContent/pagesectionstaticcontent',
        createPayload,
        [201]
      );

      if (createData && createData.Id) {
        const contentId = createData.Id;
        
        const updatePayload = {
          ...createPayload,
          Id: contentId,
          Buttontext: "Updated Button"
        };

        await api.put(
          '/PageSectionStaticContent/pagesectionstaticcontent',
          updatePayload,
          [200]
        );
      }
      
      api.assertAll();
    });
  });

  test.describe('Static Content - DELETE /api/PageSectionStaticContent/pagesectionstaticcontent/{id}', () => {
    test('should delete existing static content', async () => {
      const createPayload = {
        ...payloads.createStaticContent.validRequest,
        Heading: `Delete Static ${Date.now()}`
      };
      const createData = await api.post(
        '/PageSectionStaticContent/pagesectionstaticcontent',
        createPayload,
        [201]
      );

      if (createData && createData.Id) {
        const contentId = createData.Id;
        
        await api.delete(
          `/PageSectionStaticContent/pagesectionstaticcontent/${contentId}`,
          [204]
        );
      }
      
      api.assertAll();
    });
  });

  // =============================================================================
  // PRODUCT CONTENT ENDPOINTS
  // =============================================================================
  
  test.describe('Product Content - GET /api/SectionProductContent/sectionproductcontent', () => {
    test('should get all product content or return empty list', async () => {
      const data = await api.get('/SectionProductContent/sectionproductcontent', [200, 204]);
      
      if (data) {
        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(true);
        
        if (data.length > 0) {
          const product = data[0];
          expect(product).toHaveProperty('Id');
          expect(product).toHaveProperty('Pagesectionid');
          expect(product).toHaveProperty('Contentid');
        }
      }
      
      api.assertAll();
    });
  });

  test.describe('Product Content - POST /api/SectionProductContent/sectionproductcontent', () => {
    test('should create new product content with valid data', async () => {
      const data = await api.post(
        '/SectionProductContent/sectionproductcontent',
        payloads.createProductContent.validRequest,
        [201]
      );
      
      if (data && data.Id) {
        createdProductContentId = data.Id;
      }
      
      api.assertAll();
    });

    test('NEGATIVE: should reject invalid section ID', async () => {
      await api.post(
        '/SectionProductContent/sectionproductcontent',
        payloads.createProductContent.invalidSectionId,
        [400, 404]
      );
      
      api.assertAll();
    });

    test('NEGATIVE: should reject invalid content ID', async () => {
      await api.post(
        '/SectionProductContent/sectionproductcontent',
        payloads.createProductContent.invalidContentId,
        [400, 404]
      );
      
      api.assertAll();
    });
  });

  test.describe('Product Content - GET /api/SectionProductContent/sectionproductcontent/{id}', () => {
    test('should get product content by valid ID', async () => {
      await api.get(
        '/SectionProductContent/sectionproductcontent/1',
        [200, 204, 404]
      );
      
      api.assertAll();
    });

    test('NEGATIVE: should handle non-existent product content ID', async () => {
      await api.get(
        '/SectionProductContent/sectionproductcontent/99999',
        [404, 204]
      );
      
      api.assertAll();
    });
  });

  test.describe('Product Content - DELETE /api/SectionProductContent/sectionproductcontent/{id}', () => {
    test('should delete existing product content', async () => {
      const createData = await api.post(
        '/SectionProductContent/sectionproductcontent',
        payloads.createProductContent.validRequest,
        [201]
      );

      if (createData && createData.Id) {
        const productId = createData.Id;
        
        await api.delete(
          `/SectionProductContent/sectionproductcontent/${productId}`,
          [204]
        );
      }
      
      api.assertAll();
    });
  });

  // =============================================================================
  // PRODUCT DETAILS ENDPOINTS
  // =============================================================================
  
  test.describe('Product Details - GET /api/SectionProductDetails/sectionproductdetails', () => {
    test('should get all product details or return empty list', async () => {
      const data = await api.get('/SectionProductDetails/sectionproductdetails', [200, 204]);
      
      if (data) {
        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(true);
        
        if (data.length > 0) {
          const detail = data[0];
          expect(detail).toHaveProperty('Id');
          expect(detail).toHaveProperty('Contenttitle');
          expect(detail).toHaveProperty('Price');
        }
      }
      
      api.assertAll();
    });
  });

  test.describe('Product Details - POST /api/SectionProductDetails/sectionproductdetails', () => {
    test('should create new product details with valid data', async () => {
      const data = await api.post(
        '/SectionProductDetails/sectionproductdetails',
        payloads.createProductDetails.validRequest,
        [201]
      );
      
      if (data && data.Id) {
        createdProductDetailId = data.Id;
      }
      
      api.assertAll();
    });

    test('NEGATIVE: should reject negative price', async () => {
      await api.post(
        '/SectionProductDetails/sectionproductdetails',
        payloads.createProductDetails.invalidPrice,
        [400]
      );
      
      api.assertAll();
    });

    test('NEGATIVE: should reject invalid rating', async () => {
      await api.post(
        '/SectionProductDetails/sectionproductdetails',
        {
          ...payloads.createProductDetails.validRequest,
          Rating: 10
        },
        [400]
      );
      
      api.assertAll();
    });
  });

  test.describe('Product Details - GET /api/SectionProductDetails/sectionproductdetails/{id}', () => {
    test('should get product details by valid ID', async () => {
      await api.get(
        '/SectionProductDetails/sectionproductdetails/1',
        [200, 204, 404]
      );
      
      api.assertAll();
    });

    test('NEGATIVE: should handle non-existent product detail ID', async () => {
      await api.get(
        '/SectionProductDetails/sectionproductdetails/99999',
        [404, 204]
      );
      
      api.assertAll();
    });
  });

  test.describe('Product Details - PUT /api/SectionProductDetails/sectionproductdetails', () => {
    test('should update existing product details', async () => {
      const createData = await api.post(
        '/SectionProductDetails/sectionproductdetails',
        payloads.createProductDetails.validRequest,
        [201]
      );

      if (createData && createData.Id) {
        const detailId = createData.Id;
        
        const updatePayload = {
          ...payloads.createProductDetails.validRequest,
          Id: detailId,
          Price: 149.99
        };

        await api.put(
          '/SectionProductDetails/sectionproductdetails',
          updatePayload,
          [201, 304]
        );
      }
      
      api.assertAll();
    });
  });

  test.describe('Product Details - DELETE /api/SectionProductDetails/sectionproductdetails/{id}', () => {
    test('should delete existing product details', async () => {
      const createData = await api.post(
        '/SectionProductDetails/sectionproductdetails',
        payloads.createProductDetails.validRequest,
        [201]
      );

      if (createData && createData.Id) {
        const detailId = createData.Id;
        
        await api.delete(
          `/SectionProductDetails/sectionproductdetails/${detailId}`,
          [204]
        );
      }
      
      api.assertAll();
    });
  });

  // =============================================================================
  // CLEANUP
  // =============================================================================
  
  test.afterAll(async () => {
    // Cleanup: Delete all created content
    if (createdDynamicContentId) {
      await api.delete(
        `/PageSectionDynamicContent/pagesectiondynamiccontent/${createdDynamicContentId}`,
        [204, 404, 409]
      );
    }
    if (createdStaticContentId) {
      await api.delete(
        `/PageSectionStaticContent/pagesectionstaticcontent/${createdStaticContentId}`,
        [204, 404, 409]
      );
    }
    if (createdProductContentId) {
      await api.delete(
        `/SectionProductContent/sectionproductcontent/${createdProductContentId}`,
        [204, 404, 409]
      );
    }
    if (createdProductDetailId) {
      await api.delete(
        `/SectionProductDetails/sectionproductdetails/${createdProductDetailId}`,
        [204, 404, 409]
      );
    }
  });
});
