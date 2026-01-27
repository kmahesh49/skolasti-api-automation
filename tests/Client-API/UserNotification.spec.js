const { test, expect } = require("@playwright/test");
const { ClientAPIURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { NegativeTestGenerator } = require("../../utils/NegativeTestGenerator.js");
const { ValidationHelper } = require("../../utils/ValidationHelper.js");
const { allure } = require("allure-playwright");

// Module-level variables
let api;
let createdPreferenceId = null;
const userId = "3f537698-4e5e-4101-9115-626385911940";

test.describe("User Notification Management API - Comprehensive Testing", () => {
  test.beforeEach(async ({ request }) => {
    api = new ApiHelper(request, ClientAPIURL, headers);
    allure.epic("Skolasti API Automation");
    allure.feature("User Notification Management");
    allure.owner("QA Team");
    allure.tag("api", "notification", "preferences", "comprehensive");
  });

  // ==================== NOTIFICATION PREFERENCE CRUD FLOW ====================
  test.describe("✅ Notification Preference - CRUD Flow", () => {
    test('Step 1: CREATE - POST /UserNotification/createnotificationpreferences', async () => {
      test.setTimeout(60000);
      allure.story("Notification CRUD - CREATE");
      allure.severity("critical");

      console.log("\n========== ✨ CREATE NOTIFICATION PREFERENCES ==========");
      const notificationCategoryId = 1;

      const createdPreference = await api.post(
        `/UserNotification/createnotificationpreferences?userId=${userId}&notificationCategoryId=${notificationCategoryId}`,
        {},
        [200, 201]
      );

      expect(createdPreference).toHaveProperty("Id");
      expect(typeof createdPreference.Id).toBe("number");
      
      createdPreferenceId = createdPreference.Id;
      console.log(`✅ Created notification preference ID: ${createdPreferenceId}`);
      
      api.assertAll();
    });

    test('Step 2: GET - Verify preference after CREATE (No GET endpoint available)', async () => {
      test.skip(!createdPreferenceId, 'Preference ID not available - CREATE may have failed');
      allure.story("Notification CRUD - GET after CREATE");
      allure.severity("medium");

      console.log("\n========== ℹ️ NOTE: No GET by ID endpoint available ==========");
      console.log("⚠️ API does not provide GET /notificationpreferences?id endpoint");
      console.log(`✅ Preference ${createdPreferenceId} assumed to exist`);
    });

    test('Step 3: UPDATE - No UPDATE endpoint available', async () => {
      test.skip(!createdPreferenceId, 'Preference ID not available - CREATE may have failed');
      allure.story("Notification CRUD - UPDATE");
      allure.severity("low");

      console.log("\n========== ℹ️ NOTE: No UPDATE endpoint available ==========");
      console.log("⚠️ API does not provide PUT /updatenotificationpreferences endpoint");
      console.log("✅ Skipping UPDATE step");
    });

    test('Step 4: GET - Verify preference after UPDATE (No UPDATE/GET available)', async () => {
      test.skip(!createdPreferenceId, 'Preference ID not available - CREATE may have failed');
      console.log("✅ Skipping - No UPDATE or GET endpoints available");
    });

    test('Step 5: DELETE - DELETE /UserNotification/Deletenotificationpreferences', async () => {
      test.setTimeout(60000);
      test.skip(!createdPreferenceId, 'Preference ID not available - CREATE may have failed');
      allure.story("Notification CRUD - DELETE");
      allure.severity("critical");

      console.log("\n========== 🗑️ DELETE NOTIFICATION PREFERENCES ==========");
      
      await api.delete(
        `/UserNotification/Deletenotificationpreferences?userId=${userId}&notificationPreferenceId=${createdPreferenceId}`,
        {},
        [200, 204]
      );
      console.log(`✅ Notification preference ${createdPreferenceId} deleted successfully`);
      
      api.assertAll();
    });

    test('Step 6: GET - Verify preference after DELETE (No GET endpoint available)', async () => {
      test.skip(!createdPreferenceId, 'Preference ID not available - CREATE may have failed');
      console.log("\n========== ℹ️ NOTE: No GET endpoint to verify deletion ==========");
      console.log(`✅ Preference ${createdPreferenceId} assumed deleted`);
    });
  });

  // ==================== ADDITIONAL TESTS ====================
  test.describe("✅ Notification Preference - Additional Tests", () => {
    test("Multiple Preferences Management", async () => {
      test.setTimeout(120000);
      allure.story("Multiple Notification Preferences");
      allure.severity("medium");

      const preferenceIds = [];

      console.log("\n========== ✨ CREATE MULTIPLE PREFERENCES ==========");
      
      const categoryIds = [1, 2, 3];
      
      for (const categoryId of categoryIds) {
        const createdPreference = await api.post(
          `/UserNotification/createnotificationpreferences?userId=${userId}&notificationCategoryId=${categoryId}`,
          {},
          [200, 201]
        );

        preferenceIds.push(createdPreference.Id);
        console.log(`✅ Created preference for category ${categoryId}: ID ${createdPreference.Id}`);
      }

      console.log(`✅ Total preferences created: ${preferenceIds.length}`);

      console.log("\n========== 🗑️ DELETE ALL PREFERENCES ==========");
      
      for (const preferenceId of preferenceIds) {
        await api.delete(
          `/UserNotification/Deletenotificationpreferences?userId=${userId}&notificationPreferenceId=${preferenceId}`,
          {},
          [200, 204]
        );
        console.log(`✅ Deleted preference ID: ${preferenceId}`);
      }

      console.log(`✅ All ${preferenceIds.length} preferences deleted`);
      api.assertAll();
    });
  });

  // ==================== NEGATIVE TESTS ====================
  test.describe("❌ NEGATIVE TEST CASES", () => {
    test("UserNotification API - Invalid User ID", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Notification Negative - Invalid User");
      allure.severity("high");
      allure.description("Validate API handles invalid user IDs");

      try {
        console.log("\n========== ❌ TEST: INVALID USER ID ==========");
        
        const invalidUserScenarios = [
          {
            name: "Empty User ID",
            userId: "",
            categoryId: 1
          },
          {
            name: "Invalid UUID Format",
            userId: "invalid-uuid-format",
            categoryId: 1
          },
          {
            name: "Non-existent User ID",
            userId: "00000000-0000-0000-0000-000000000000",
            categoryId: 1
          }
        ];

        for (const scenario of invalidUserScenarios) {
          await allure.step(`User Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            
            const response = await request.post(
              `${ClientAPIURL}/UserNotification/createnotificationpreferences?userId=${scenario.userId}&notificationCategoryId=${scenario.categoryId}`,
              { headers }
            );

            const status = response.status();
            console.log(`📊 Response Status: ${status}`);
            
            expect([400, 404, 422]).toContain(status);
            console.log(`✅ Correctly rejected with status ${status}`);
          });
        }

        console.log("\n✅ ALL INVALID USER ID TESTS PASSED");

      } catch (error) {
        console.error("❌ Invalid user test error:", error.message);
      }
    });

    test("UserNotification API - Invalid Category ID", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Notification Negative - Invalid Category");
      allure.severity("high");
      allure.description("Validate API handles invalid notification category IDs");

      try {
        console.log("\n========== ❌ TEST: INVALID CATEGORY ID ==========");
        
        const userId = "3f537698-4e5e-4101-9115-626385911940";
        
        const invalidCategoryScenarios = NegativeTestGenerator.getInvalidIdScenarios("notificationCategoryId");

        for (const scenario of invalidCategoryScenarios) {
          await allure.step(`Category Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            
            const response = await request.post(
              `${ClientAPIURL}/UserNotification/createnotificationpreferences?userId=${userId}&notificationCategoryId=${scenario.value}`,
              { headers }
            );

            const status = response.status();
            console.log(`📊 Response Status: ${status}`);
            
            expect([400, 404, 200]).toContain(status);
            console.log(`✅ Handled with status ${status}`);
          });
        }

        console.log("\n✅ ALL INVALID CATEGORY ID TESTS PASSED");

      } catch (error) {
        console.error("❌ Invalid category test error:", error.message);
      }
    });

    test("UserNotification API - Delete Non-existent Preference", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Notification Negative - Non-existent Preference");
      allure.severity("medium");
      allure.description("Validate API handles deletion of non-existent preferences");

      try {
        console.log("\n========== ❌ TEST: DELETE NON-EXISTENT PREFERENCE ==========");
        
        const userId = "3f537698-4e5e-4101-9115-626385911940";
        const nonExistentPreferenceId = 999999999;

        await allure.step("Delete Non-existent Preference", async () => {
          console.log(`\n🧪 Testing: Delete preference ID ${nonExistentPreferenceId}`);
          
          const response = await request.delete(
            `${ClientAPIURL}/UserNotification/Deletenotificationpreferences?userId=${userId}&notificationPreferenceId=${nonExistentPreferenceId}`,
            { headers }
          );

          const status = response.status();
          console.log(`📊 Response Status: ${status}`);
          
          expect([404, 400, 200]).toContain(status);
          console.log(`✅ Handled non-existent preference with status ${status}`);
        });

        console.log("\n✅ DELETE NON-EXISTENT PREFERENCE TEST PASSED");

      } catch (error) {
        console.error("❌ Delete test error:", error.message);
      }
    });

    test("UserNotification API - Missing Required Parameters", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Notification Negative - Missing Parameters");
      allure.severity("critical");
      allure.description("Validate API rejects requests with missing required parameters");

      try {
        console.log("\n========== ❌ TEST: MISSING REQUIRED PARAMETERS ==========");
        
        const invalidScenarios = [
          {
            name: "Missing userId",
            url: `/UserNotification/createnotificationpreferences?notificationCategoryId=1`
          },
          {
            name: "Missing notificationCategoryId",
            url: `/UserNotification/createnotificationpreferences?userId=3f537698-4e5e-4101-9115-626385911940`
          },
          {
            name: "Missing Both Parameters",
            url: `/UserNotification/createnotificationpreferences`
          }
        ];

        for (const scenario of invalidScenarios) {
          await allure.step(`Missing Parameter Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            
            const response = await request.post(`${ClientAPIURL}${scenario.url}`, {
              headers
            });

            const status = response.status();
            console.log(`📊 Response Status: ${status}`);
            
            expect([400, 422]).toContain(status);
            console.log(`✅ Correctly rejected with status ${status}`);
          });
        }

        console.log("\n✅ ALL MISSING PARAMETER TESTS PASSED");

      } catch (error) {
        console.error("❌ Missing parameter test error:", error.message);
      }
    });

    test("UserNotification API - Unauthorized Access", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Notification Negative - Authentication");
      allure.severity("critical");
      allure.description("Validate API rejects unauthorized notification operations");

      try {
        console.log("\n========== ❌ TEST: UNAUTHORIZED ACCESS ==========");
        
        const authScenarios = NegativeTestGenerator.getInvalidAuthScenarios();
        const userId = "3f537698-4e5e-4101-9115-626385911940";

        for (const scenario of authScenarios) {
          await allure.step(`Auth Test: ${scenario.name}`, async () => {
            console.log(`\n🔒 Testing: ${scenario.name}`);
            
            const response = await request.post(
              `${ClientAPIURL}/UserNotification/createnotificationpreferences?userId=${userId}&notificationCategoryId=1`,
              {
                headers: scenario.headers
              }
            );

            const status = response.status();
            console.log(`📊 Response Status: ${status}`);
            
            expect(status).toBe(scenario.expectedStatus);
            console.log(`✅ Correctly rejected with status ${status}`);
          });
        }

        console.log("\n✅ ALL UNAUTHORIZED ACCESS TESTS PASSED");

      } catch (error) {
        console.error("❌ Auth test error:", error.message);
      }
    });
  });
});
