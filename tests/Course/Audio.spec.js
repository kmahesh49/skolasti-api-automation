const { test, expect } = require("@playwright/test");
const { CoursebaseURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { PayloadGenerator } = require("../../utils/PayloadGenerator.js");
const { allure } = require("allure-playwright");

test.describe("Audio API", () => {
  let api;
  let audioId = null;
  let audioTitle = null;

  test.beforeEach(async ({ request }) => {
    api = new ApiHelper(request, CoursebaseURL, headers);
    allure.epic("Skolasti API Automation");
    allure.feature("Audio Content Management");
    allure.owner("QA Team");
    allure.tag("api", "audio", "crud");
  });

  test.describe("✅ Audio - CRUD Flow", () => {
    
    test('Step 1: CREATE - POST /Audio/createaudio', async () => {
      test.setTimeout(60000);
      allure.story("Audio CRUD - CREATE");
      allure.severity("critical");

      console.log("\n========== ✨ CREATE AUDIO ==========");
      const createAudioPayload = PayloadGenerator.generateAudioPayload();
      const createAudioResponse = await api.create("/Audio/createaudio", createAudioPayload, [200, 201]);
      
      expect(Array.isArray(createAudioResponse)).toBeTruthy();
      expect(createAudioResponse[0]).toHaveProperty("Id");
      
      audioId = createAudioResponse[0].Id;
      audioTitle = createAudioPayload[0].Title;
      console.log(`✅ Created Audio ID: ${audioId}`);
      
      api.assertAll();
    });

    test('Step 2: GET - Verify audio after CREATE', async () => {
      test.setTimeout(60000);
      test.skip(!audioId, 'Audio ID not available - CREATE may have failed');
      allure.story("Audio CRUD - GET after CREATE");
      allure.severity("critical");

      console.log("\n========== 📥 GET AUDIO AFTER CREATE ==========");
      const getAudioResponse = await api.get(`/Audio/getbyaudioid?id=${audioId}`, 200);
      
      expect(getAudioResponse).toHaveProperty("Id");
      expect(getAudioResponse.Id).toBe(audioId);
      expect(getAudioResponse.Title).toBe(audioTitle);
      console.log("✅ Audio verified after CREATE");
      
      api.assertAll();
    });

    test('Step 3: UPDATE - PUT /Audio/updateaudio', async () => {
      test.setTimeout(60000);
      test.skip(!audioId, 'Audio ID not available - CREATE may have failed');
      allure.story("Audio CRUD - UPDATE");
      allure.severity("critical");

      console.log("\n========== 🔄 UPDATE AUDIO ==========");
      const updateAudioPayload = PayloadGenerator.generateAudioUpdatePayload(audioId, audioTitle);
      await api.update("/Audio/updateaudio", updateAudioPayload, [200, 201]);
      console.log("✅ Audio updated successfully");
      
      api.assertAll();
    });

    test('Step 4: GET - Verify audio after UPDATE', async () => {
      test.setTimeout(60000);
      test.skip(!audioId, 'Audio ID not available - CREATE may have failed');
      allure.story("Audio CRUD - GET after UPDATE");
      allure.severity("critical");

      console.log("\n========== 📥 GET AUDIO AFTER UPDATE ==========");
      const getAudioAfterUpdate = await api.get(`/Audio/getbyaudioid?id=${audioId}`, 200);
      
      expect(getAudioAfterUpdate).toHaveProperty("Id");
      expect(getAudioAfterUpdate.Id).toBe(audioId);
      console.log("✅ Audio verified after UPDATE");
      console.log("ℹ️ Note: API does not return Description field in GET response");
      
      api.assertAll();
    });

    test('Step 5: DELETE - DELETE /Audio/deletebyidaudio', async () => {
      test.setTimeout(60000);
      test.skip(!audioId, 'Audio ID not available - CREATE may have failed');
      allure.story("Audio CRUD - DELETE");
      allure.severity("critical");

      console.log("\n========== 🗑️ DELETE AUDIO ==========");
      await api.delete(`/Audio/deletebyidaudio/${audioId}`, [200, 204]);
      console.log(`✅ Audio ${audioId} deleted successfully`);
      
      api.assertAll();
    });

    test('Step 6: GET - Verify audio after DELETE', async () => {
      test.setTimeout(60000);
      test.skip(!audioId, 'Audio ID not available - CREATE may have failed');
      allure.story("Audio CRUD - GET after DELETE");
      allure.severity("medium");

      console.log("\n========== ✓ VERIFY AUDIO DELETION ==========");
      await api.verifyDeleted(`/Audio/getbyaudioid?id=${audioId}`);
      console.log(`✅ Audio ${audioId} deletion verified`);
      
      api.assertAll();
    });
  });
});
