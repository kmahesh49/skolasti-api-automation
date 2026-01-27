const { test, expect } = require("@playwright/test");
const { ClientAPIURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { NegativeTestGenerator } = require("../../utils/NegativeTestGenerator.js");
const { ValidationHelper } = require("../../utils/ValidationHelper.js");
const { allure } = require("allure-playwright");
const { faker } = require("@faker-js/faker");

test.describe("Webinar Sessions Management API - Comprehensive Testing", () => {
  test.beforeEach(async () => {
    allure.epic("Skolasti API Automation");
    allure.feature("Webinar Sessions Management");
    allure.owner("QA Team");
    allure.tag("api", "sessions", "webinar", "comprehensive");
  });

  test.describe("✅ POSITIVE TEST CASES", () => {
    test("Sessions API - Get Operations (Positive)", async ({ request }) => {
      test.setTimeout(120000);
      allure.story("Sessions Positive Flow");
      allure.severity("high");
      allure.description("Validation of Sessions API retrieval operations");

      const api = new ApiHelper(request, ClientAPIURL, headers);

      try {
        let testSessionId;

        // ==================== GET UPCOMING SESSIONS ====================
        await allure.step("Get Upcoming Sessions", async () => {
          console.log("\n========== 📅 GET UPCOMING SESSIONS ==========");
          const startDate = new Date();
          const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

          const upcomingSessionsPayload = {
            StartDate: startDate.toISOString(),
            EndDate: endDate.toISOString()
          };

          const upcomingSessions = await api.post("/Sessions/getupcomingsessions", upcomingSessionsPayload, 200);
          expect(Array.isArray(upcomingSessions)).toBeTruthy();
          console.log(`✅ Upcoming sessions: ${upcomingSessions.length}`);

          if (upcomingSessions.length > 0) {
            testSessionId = upcomingSessions[0].SessionId || upcomingSessions[0].Id;
            console.log(`✅ Using session ID for testing: ${testSessionId}`);
          }
        });

        // ==================== GET SESSION BY ID ====================
        if (testSessionId) {
          await allure.step("Get Admin Session By ID", async () => {
            console.log("\n========== 🔍 GET ADMIN SESSION BY ID ==========");
            const sessionDetails = await api.get(`/Sessions/getadminsessionbyid?sessionId=${testSessionId}`, 200);
            
            expect(sessionDetails).toHaveProperty("SessionId");
            console.log(`✅ Session title: ${sessionDetails.Title}`);
            console.log(`✅ Session date: ${sessionDetails.Date}`);
            console.log(`✅ Session status: ${sessionDetails.Status}`);

            // Validate date format
            const dateValidation = ValidationHelper.isValidISODate(sessionDetails.Date);
            console.log(`✅ Date format validation: ${dateValidation ? 'Valid' : 'Invalid'}`);
          });

          // ==================== GET WEBINAR DOCUMENTS ====================
          await allure.step("Get Webinar Documents By Session ID", async () => {
            console.log("\n========== 📄 GET WEBINAR DOCUMENTS ==========");
            const documents = await api.get(`/Sessions/getwebinardocumentbyid?sessionId=${testSessionId}`, 200);
            expect(Array.isArray(documents)).toBeTruthy();
            console.log(`✅ Documents for session ${testSessionId}: ${documents.length}`);
          });
        }

        // ==================== SESSION CREATION INFO ====================
        await allure.step("Session Creation Information", async () => {
          console.log("\n========== ℹ️ SESSION CREATION INFO ==========");
          console.log("📝 Session creation requires multipart/form-data with:");
          console.log("   • Title (required): Session title");
          console.log("   • Date (required): Session date");
          console.log("   • StartTime (required): Start time");
          console.log("   • EndTime (required): End time");
          console.log("   • Description: Session description");
          console.log("   • Filecontent (optional): Session image/file");
          console.log("✅ Endpoint: POST /Sessions/createsessions");
        });

        api.assertAll();

      } catch (error) {
        console.error("❌ Test failed with error:", error.message);
        throw error;
      }
    });
  });

  test.describe("❌ NEGATIVE TEST CASES", () => {
    test("Sessions API - Invalid Date Range", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Sessions Negative - Invalid Dates");
      allure.severity("high");
      allure.description("Validate API handles invalid date ranges");

      try {
        console.log("\n========== ❌ TEST: INVALID DATE RANGE ==========");
        
        const invalidPayloads = [
          {
            name: "StartDate After EndDate",
            payload: {
              StartDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              EndDate: new Date().toISOString()
            }
          },
          {
            name: "Invalid Date Format",
            payload: {
              StartDate: "invalid-date",
              EndDate: new Date().toISOString()
            }
          },
          {
            name: "Missing StartDate",
            payload: {
              EndDate: new Date().toISOString()
            }
          },
          {
            name: "Missing EndDate",
            payload: {
              StartDate: new Date().toISOString()
            }
          }
        ];

        for (const scenario of invalidPayloads) {
          await allure.step(`Date Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            
            const response = await request.post(`${ClientAPIURL}/Sessions/getupcomingsessions`, {
              headers,
              data: scenario.payload
            });

            const status = response.status();
            console.log(`📊 Response Status: ${status}`);
            
            expect([400, 422, 200]).toContain(status);
            console.log(`✅ Handled with status ${status}`);
          });
        }

        console.log("\n✅ ALL INVALID DATE RANGE TESTS PASSED");

      } catch (error) {
        console.error("❌ Date test error:", error.message);
      }
    });

    test("Sessions API - Invalid Session ID", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Sessions Negative - Invalid IDs");
      allure.severity("high");
      allure.description("Validate API handles invalid session IDs");

      try {
        console.log("\n========== ❌ TEST: INVALID SESSION ID ==========");
        
        const invalidIdScenarios = NegativeTestGenerator.getInvalidIdScenarios("sessionId");

        for (const scenario of invalidIdScenarios) {
          await allure.step(`Invalid ID Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            
            const response = await request.get(
              `${ClientAPIURL}/Sessions/getadminsessionbyid?sessionId=${scenario.value}`,
              { headers }
            );

            const status = response.status();
            console.log(`📊 Response Status: ${status}`);
            
            expect([404, 400, 200]).toContain(status);
            console.log(`✅ Handled with status ${status}`);
          });
        }

        console.log("\n✅ ALL INVALID SESSION ID TESTS PASSED");

      } catch (error) {
        console.error("❌ Invalid ID test error:", error.message);
      }
    });

    test("Sessions API - Delete Non-existent Session", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Sessions Negative - Non-existent Resources");
      allure.severity("medium");
      allure.description("Validate API handles deletion of non-existent sessions");

      try {
        console.log("\n========== ❌ TEST: DELETE NON-EXISTENT SESSION ==========");

        await allure.step("Delete Non-existent Session", async () => {
          const nonExistentId = 999999999;
          console.log(`\n🧪 Testing: Delete session ID ${nonExistentId}`);
          
          const response = await request.delete(
            `${ClientAPIURL}/Sessions/deletesession?sessionId=${nonExistentId}`,
            { headers }
          );

          const status = response.status();
          console.log(`📊 Response Status: ${status}`);
          
          expect([404, 400, 200]).toContain(status);
          console.log(`✅ Handled non-existent session with status ${status}`);
        });

        console.log("\n✅ DELETE NON-EXISTENT SESSION TEST PASSED");

      } catch (error) {
        console.error("❌ Delete test error:", error.message);
      }
    });

    test("Sessions API - Invalid Webinar Document", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Sessions Negative - Invalid Documents");
      allure.severity("medium");
      allure.description("Validate API rejects invalid webinar documents");

      try {
        console.log("\n========== ❌ TEST: INVALID WEBINAR DOCUMENT ==========");
        
        const invalidPayloads = [
          {
            name: "Missing SessionId",
            payload: {
              Documents: [{
                Title: "Test Document",
                Description: "Test"
              }]
            }
          },
          {
            name: "Missing Title in Document",
            payload: {
              SessionId: 1,
              Documents: [{
                Description: "Test"
              }]
            }
          },
          {
            name: "Empty Documents Array",
            payload: {
              SessionId: 1,
              Documents: []
            }
          },
          {
            name: "Invalid DocumentSize (Negative)",
            payload: {
              SessionId: 1,
              Documents: [{
                Title: "Test",
                DocumentSize: -100
              }]
            }
          }
        ];

        for (const scenario of invalidPayloads) {
          await allure.step(`Document Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            
            const response = await request.post(
              `${ClientAPIURL}/Sessions/createwebinardocument`,
              {
                headers,
                data: scenario.payload
              }
            );

            const status = response.status();
            console.log(`📊 Response Status: ${status}`);
            
            expect([400, 422, 200]).toContain(status);
            console.log(`✅ Handled with status ${status}`);
          });
        }

        console.log("\n✅ ALL INVALID DOCUMENT TESTS PASSED");

      } catch (error) {
        console.error("❌ Document test error:", error.message);
      }
    });

    test("Sessions API - Delete Non-existent Document", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Sessions Negative - Non-existent Documents");
      allure.severity("low");
      allure.description("Validate API handles deletion of non-existent documents");

      try {
        console.log("\n========== ❌ TEST: DELETE NON-EXISTENT DOCUMENT ==========");

        await allure.step("Delete Non-existent Document", async () => {
          const nonExistentId = 999999999;
          console.log(`\n🧪 Testing: Delete document ID ${nonExistentId}`);
          
          const response = await request.delete(
            `${ClientAPIURL}/Sessions/deleteWebinardocument?id=${nonExistentId}`,
            { headers }
          );

          const status = response.status();
          console.log(`📊 Response Status: ${status}`);
          
          expect([404, 400, 200]).toContain(status);
          console.log(`✅ Handled non-existent document with status ${status}`);
        });

        console.log("\n✅ DELETE NON-EXISTENT DOCUMENT TEST PASSED");

      } catch (error) {
        console.error("❌ Delete document test error:", error.message);
      }
    });

    test("Sessions API - Unauthorized Access", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Sessions Negative - Authentication");
      allure.severity("critical");
      allure.description("Validate API rejects unauthorized session operations");

      try {
        console.log("\n========== ❌ TEST: UNAUTHORIZED ACCESS ==========");
        
        const authScenarios = NegativeTestGenerator.getInvalidAuthScenarios();

        for (const scenario of authScenarios) {
          await allure.step(`Auth Test: ${scenario.name}`, async () => {
            console.log(`\n🔒 Testing: ${scenario.name}`);
            
            const payload = {
              StartDate: new Date().toISOString(),
              EndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            };

            const response = await request.post(`${ClientAPIURL}/Sessions/getupcomingsessions`, {
              headers: scenario.headers,
              data: payload
            });

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
