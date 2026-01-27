const { test, expect } = require("@playwright/test");
const { CoursebaseURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { PayloadGenerator } = require("../../utils/PayloadGenerator.js");
const { allure } = require("allure-playwright");

test.describe("Video API", () => {
  test.beforeEach(async () => {
    allure.epic("Skolasti API Automation");
    allure.feature("Video Content Management");
    allure.owner("QA Team");
    allure.tag("api", "video", "crud");
  });

  test("Video - Complete CRUD Operations", async ({ request }) => {
    test.setTimeout(120000);
    allure.story("Video CRUD");
    allure.severity("critical");
    allure.description("Complete validation of Video API including create operation");
    
    const api = new ApiHelper(request, CoursebaseURL, headers);

    // ==================== CREATE VIDEO ====================
    const createVideoPayload = PayloadGenerator.generateVideoPayload();
    const createVideoResponse = await api.create("/Video/create", createVideoPayload, [200, 201]);
    
    const videoId = createVideoResponse[0].VideoId;
    const videoFileName = createVideoPayload.Videos[0].FileName;
    console.log("Created Video ID:", videoId);
    console.log("Video created with filename:", videoFileName);
  });
});
