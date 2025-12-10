const { test, expect } = require("@playwright/test");
const { CoursebaseURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { PayloadGenerator } = require("../../utils/PayloadGenerator.js");
const { allure } = require("allure-playwright");

test.describe("Document API", () => {
  test.beforeEach(async () => {
    allure.epic("Skolasti API Automation");
    allure.feature("Document Content Management");
    allure.owner("QA Team");
    allure.tag("api", "document", "crud");
  });

  test("Document - Complete CRUD Operations", async ({ request }) => {
    test.setTimeout(120000);
    allure.story("Document CRUD");
    allure.severity("critical");
    allure.description("Complete validation of Document API including create, get, update, and delete operations");
    
    const api = new ApiHelper(request, CoursebaseURL, headers);

    // ==================== CREATE DOCUMENT ====================
    const createDocumentPayload = PayloadGenerator.generateDocumentPayload();
    const createDocumentResponse = await api.create("/ContentDocument/createcontentdocument", createDocumentPayload, 200);
    
    const documentId = createDocumentResponse[0].Id;
    const documentTitle = createDocumentPayload[0].Title;
    console.log("Created Document ID:", documentId);

    // ==================== GET DOCUMENT ====================
    const getDocumentResponse = await api.get(`/ContentDocument/getbyidcontentdocument?id=${documentId}`, 200);
    console.log("Document details retrieved successfully");
    expect(getDocumentResponse.Id).toBe(documentId);
    expect(getDocumentResponse.Title).toBe(documentTitle);

    // ==================== UPDATE DOCUMENT ====================
    const updateDocumentPayload = PayloadGenerator.generateDocumentUpdatePayload(documentId, documentTitle);
    await api.update(`/ContentDocument/updatecontentdocument?documentType=${documentId}`, updateDocumentPayload, 201);
    console.log("Document updated successfully");

    // ==================== GET DOCUMENT AFTER UPDATE ====================
    const getDocumentAfterUpdate = await api.get(`/ContentDocument/getbyidcontentdocument?id=${documentId}`, 200);
    console.log("Updated document details retrieved successfully");
    expect(getDocumentAfterUpdate.Id).toBe(documentId);

    // ==================== DELETE DOCUMENT ====================
    await api.delete(`/ContentDocument/deletebyidcontentdocument/${documentId}`, 204);
    console.log("Document deleted successfully");

    // ==================== VERIFY DOCUMENT DELETION ====================
    await api.verifyDeleted(`/ContentDocument/getbyidcontentdocument?id=${documentId}`);
    console.log("Document deletion verified");
  });
});
