const { test, expect } = require("@playwright/test");
const { CoursebaseURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { PayloadGenerator } = require("../../utils/PayloadGenerator.js");
const { allure } = require("allure-playwright");

test.describe("Audio API", () => {
  test.beforeEach(async () => {
    allure.epic("Skolasti API Automation");
    allure.feature("Audio Content Management");
    allure.owner("QA Team");
    allure.tag("api", "audio", "crud");
  });

  test("Audio - Complete CRUD Operations", async ({ request }) => {
    test.setTimeout(120000);
    allure.story("Audio CRUD");
    allure.severity("critical");
    allure.description("Complete validation of Audio API including create, get, update, and delete operations");
    
    const api = new ApiHelper(request, CoursebaseURL, headers);

    // ==================== CREATE AUDIO ====================
    const createAudioPayload = PayloadGenerator.generateAudioPayload();
    const createAudioResponse = await api.create("/Audio/createaudio", createAudioPayload, 200);
    
    const audioId = createAudioResponse[0].Id;
    const audioTitle = createAudioPayload[0].Title;
    console.log("Created Audio ID:", audioId);

    // ==================== GET AUDIO ====================
    const getAudioResponse = await api.get(`/Audio/getbyaudioid?id=${audioId}`, 200);
    console.log("Audio details retrieved successfully");
    expect(getAudioResponse.Id).toBe(audioId);
    expect(getAudioResponse.Title).toBe(audioTitle);

    // ==================== UPDATE AUDIO ====================
    const updateAudioPayload = PayloadGenerator.generateAudioUpdatePayload(audioId, audioTitle);
    const updateAudioResponse = await api.update("/Audio/updateaudio", updateAudioPayload, 201);
    console.log("Audio updated successfully");

    // ==================== GET AUDIO AFTER UPDATE ====================
    const getAudioAfterUpdate = await api.get(`/Audio/getbyaudioid?id=${audioId}`, 200);
    console.log("Updated audio details retrieved successfully");
    expect(getAudioAfterUpdate.Id).toBe(audioId);
    expect(getAudioAfterUpdate.Description).toContain("<p>");

    // ==================== DELETE AUDIO ====================
    await api.delete(`/Audio/deletebyidaudio/${audioId}`, 204);
    console.log("Audio deleted successfully");

    // ==================== VERIFY AUDIO DELETION ====================
    await api.verifyDeleted(`/Audio/getbyaudioid?id=${audioId}`);
    console.log("Audio deletion verified");
  });
});
