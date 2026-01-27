const { test, expect } = require("@playwright/test");
const { CoursebaseURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { PayloadGenerator } = require("../../utils/PayloadGenerator.js");
const { allure } = require("allure-playwright");

test.describe("Document API", () => {
  let api;
  let documentId = null;
  let documentTitle = null;

  test.beforeEach(async ({ request }) => {
    api = new ApiHelper(request, CoursebaseURL, headers);
    allure.epic("Skolasti API Automation");
    allure.feature("Document Content Management");
    allure.owner("QA Team");
    allure.tag("api", "document", "crud");
  });

  test.describe("✅ Document - CRUD Flow", () => {
    
    test('Step 1: CREATE - POST /ContentDocument/createcontentdocument', async () => {
      test.setTimeout(60000);
      allure.story("Document CRUD - CREATE");
      allure.severity("critical");

      console.log("\n========== ✨ CREATE DOCUMENT ==========");
      const createDocumentPayload = PayloadGenerator.generateDocumentPayload();
      const createDocumentResponse = await api.create("/ContentDocument/createcontentdocument", createDocumentPayload, [200, 201]);
      
      expect(Array.isArray(createDocumentResponse)).toBeTruthy();
      expect(createDocumentResponse[0]).toHaveProperty("Id");
      
      documentId = createDocumentResponse[0].Id;
      documentTitle = createDocumentPayload[0].Title;
      console.log(`✅ Created Document ID: ${documentId}`);
      
      api.assertAll();
    });

    test('Step 2: GET - Verify document after CREATE', async () => {
      test.setTimeout(60000);
      test.skip(!documentId, 'Document ID not available - CREATE may have failed');
      allure.story("Document CRUD - GET after CREATE");
      allure.severity("critical");

      console.log("\n========== 📥 GET DOCUMENT AFTER CREATE ==========");
      const getDocumentResponse = await api.get(`/ContentDocument/getbyidcontentdocument?id=${documentId}`, 200);
      
      expect(getDocumentResponse).toHaveProperty("Id");
      expect(getDocumentResponse.Id).toBe(documentId);
      expect(getDocumentResponse.Title).toBe(documentTitle);
      console.log("✅ Document verified after CREATE");
      
      api.assertAll();
    });

    test('Step 3: UPDATE - PUT /ContentDocument/updatecontentdocument', async () => {
      test.setTimeout(60000);
      test.skip(!documentId, 'Document ID not available - CREATE may have failed');
      allure.story("Document CRUD - UPDATE");
      allure.severity("critical");

      console.log("\n========== 🔄 UPDATE DOCUMENT ==========");
      const updateDocumentPayload = PayloadGenerator.generateDocumentUpdatePayload(documentId, documentTitle);
      await api.update(`/ContentDocument/updatecontentdocument?documentType=${documentId}`, updateDocumentPayload, [200, 201]);
      console.log("✅ Document updated successfully");
      
      api.assertAll();
    });

    test('Step 4: GET - Verify document after UPDATE', async () => {
      test.setTimeout(60000);
      test.skip(!documentId, 'Document ID not available - CREATE may have failed');
      allure.story("Document CRUD - GET after UPDATE");
      allure.severity("critical");

      console.log("\n========== 📥 GET DOCUMENT AFTER UPDATE ==========");
      const getDocumentAfterUpdate = await api.get(`/ContentDocument/getbyidcontentdocument?id=${documentId}`, 200);
      
      expect(getDocumentAfterUpdate).toHaveProperty("Id");
      expect(getDocumentAfterUpdate.Id).toBe(documentId);
      console.log("✅ Document verified after UPDATE");
      
      api.assertAll();
    });

    test('Step 5: DELETE - DELETE /ContentDocument/deletebyidcontentdocument', async () => {
      test.setTimeout(60000);
      test.skip(!documentId, 'Document ID not available - CREATE may have failed');
      allure.story("Document CRUD - DELETE");
      allure.severity("critical");

      console.log("\n========== 🗑️ DELETE DOCUMENT ==========");
      await api.delete(`/ContentDocument/deletebyidcontentdocument/${documentId}`, [200, 204]);
      console.log(`✅ Document ${documentId} deleted successfully`);
      
      api.assertAll();
    });

    test('Step 6: GET - Verify document after DELETE', async () => {
      test.setTimeout(60000);
      test.skip(!documentId, 'Document ID not available - CREATE may have failed');
      allure.story("Document CRUD - GET after DELETE");
      allure.severity("medium");

      console.log("\n========== ✓ VERIFY DOCUMENT DELETION ==========");
      await api.verifyDeleted(`/ContentDocument/getbyidcontentdocument?id=${documentId}`);
      console.log(`✅ Document ${documentId} deletion verified`);
      
      api.assertAll();
    });
  });
});
