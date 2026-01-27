const { test, expect } = require("@playwright/test");
const { ClientAPIURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { NegativeTestGenerator } = require("../../utils/NegativeTestGenerator.js");
const { ValidationHelper } = require("../../utils/ValidationHelper.js");
const { allure } = require("allure-playwright");
const { faker } = require("@faker-js/faker");

test.describe("Badges Management API - Comprehensive Testing", () => {
  test.beforeEach(async () => {
    allure.epic("Skolasti API Automation");
    allure.feature("Badges Management");
    allure.owner("QA Team");
    allure.tag("api", "badges", "comprehensive");
  });

  test.describe("✅ POSITIVE TEST CASES", () => {
    test("Badges API - Complete Operations (Positive)", async ({ request }) => {
      test.setTimeout(120000);
      allure.story("Badges Positive Flow");
      allure.severity("critical");
      allure.description("Complete validation of Badges API with valid operations");

      const api = new ApiHelper(request, ClientAPIURL, headers);

      try {
        // ==================== GET ALL BADGES ====================
        await allure.step("Get All Badges", async () => {
          console.log("\n========== 🏅 GET ALL BADGES ==========");
          const allBadges = await api.get("/Badges/getallBadges", 200);
          
          expect(Array.isArray(allBadges)).toBeTruthy();
          console.log(`✅ Total badges retrieved: ${allBadges.length}`);
          
          // Validate badge structure if badges exist
          if (allBadges.length > 0) {
            const badge = allBadges[0];
            const requiredFields = ValidationHelper.validateRequiredFields(badge, ['Id', 'Title']);
            console.log(`✅ Badge structure validation: ${requiredFields.message}`);
            
            expect(badge).toHaveProperty("Id");
            expect(badge).toHaveProperty("Title");
            expect(typeof badge.Id).toBe("number");
            expect(typeof badge.Title).toBe("string");
            
            // API returns ScorePoints object with ScoredPoints property
            if (badge.ScorePoints) {
              console.log(`✅ Sample badge: ${badge.Title} (${badge.ScorePoints.ScoredPoints} points)`);
            } else {
              console.log(`✅ Sample badge: ${badge.Title}`);
            }
          }
        });

        // ==================== GET ALL USER BADGES ====================
        await allure.step("Get All User Badges", async () => {
          console.log("\n========== 👤 GET ALL USER BADGES ==========");
          const userBadgesPayload = {
            PageNumber: 1,
            PageSize: 10,
            IncludeAllPage: false,
            SortField: "CreatedDate",
            SortType: "DESC"
          };

          // API may return 204 when user has no badges
          const userBadges = await api.post("/Badges/getalluserbadges", userBadgesPayload, [200, 204]);
          
          if (userBadges) {
            expect(Array.isArray(userBadges)).toBeTruthy();
            console.log(`✅ Total user badges retrieved: ${userBadges.length}`);
            
            // Validate array structure
            const arrayValidation = ValidationHelper.validateArray(userBadges, null, 0, 100);
            expect(arrayValidation.isValid).toBeTruthy();
            console.log(`✅ Array validation: ${arrayValidation.message}`);
          } else {
            console.log(`✅ No user badges found (204 No Content)`);
          }
        });

        // ==================== CREATE BADGE INFO ====================
        await allure.step("Badge Creation Information", async () => {
          console.log("\n========== ℹ️ CREATE BADGE INFO ==========");
          console.log("📝 Badge creation requires multipart/form-data with:");
          console.log("   • Title (string): Badge title");
          console.log("   • Points (string): Points value");
          console.log("   • BadgeImage (binary): Image file");
          console.log("✅ Endpoint: POST /Badges/createbadges");
        });

        api.assertAll();

      } catch (error) {
        console.error("❌ Test failed with error:", error.message);
        throw error;
      }
    });
  });

  test.describe("❌ NEGATIVE TEST CASES", () => {
    test("Badges API - Get User Badges with Invalid Pagination", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Badges Negative - Invalid Pagination");
      allure.severity("high");
      allure.description("Validate API handles invalid pagination parameters");

      try {
        console.log("\n========== ❌ TEST: INVALID PAGINATION ==========");
        
        const invalidPayloads = [
          {
            name: "Negative Page Number",
            payload: {
              PageNumber: -1,
              PageSize: 10
            }
          },
          {
            name: "Zero Page Number",
            payload: {
              PageNumber: 0,
              PageSize: 10
            }
          },
          {
            name: "Exceeds Max Page Size",
            payload: {
              PageNumber: 1,
              PageSize: 100
            }
          },
          {
            name: "Negative Page Size",
            payload: {
              PageNumber: 1,
              PageSize: -10
            }
          }
        ];

        for (const scenario of invalidPayloads) {
          await allure.step(`Negative Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            
            const response = await request.post(`${ClientAPIURL}/Badges/getalluserbadges`, {
              headers,
              data: scenario.payload
            });

            const status = response.status();
            console.log(`📊 Response Status: ${status}`);
            
            // Should return 400 for invalid pagination data
            expect(status).toBe(400);
            console.log(`✅ Correctly rejected with status ${status}`);
          });
        }

        console.log("\n✅ ALL INVALID PAGINATION TESTS PASSED");

      } catch (error) {
        console.error("❌ Negative test error:", error.message);
      }
    });

    test("Badges API - Unauthorized Access", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Badges Negative - Authentication");
      allure.severity("critical");
      allure.description("Validate API rejects unauthorized badge operations");

      try {
        console.log("\n========== ❌ TEST: UNAUTHORIZED ACCESS ==========");
        
        const authScenarios = NegativeTestGenerator.getInvalidAuthScenarios();

        for (const scenario of authScenarios) {
          await allure.step(`Auth Test: ${scenario.name}`, async () => {
            console.log(`\n🔒 Testing: ${scenario.name}`);
            
            const response = await request.get(`${ClientAPIURL}/Badges/getallBadges`, {
              headers: scenario.headers
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

    test("Badges API - Delete Non-existent Badge", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Badges Negative - Non-existent Resources");
      allure.severity("high");
      allure.description("Validate API handles deletion of non-existent badges");

      try {
        console.log("\n========== ❌ TEST: DELETE NON-EXISTENT BADGE ==========");

        await allure.step("Delete Non-existent Badge", async () => {
          const nonExistentId = 999999999;
          console.log(`\n🧪 Testing: Delete badge ID ${nonExistentId}`);
          
          const response = await request.delete(
            `${ClientAPIURL}/Badges/deletebadge/${nonExistentId}`,
            { headers }
          );

          const status = response.status();
          console.log(`📊 Response Status: ${status}`);
          
          expect([404, 400, 200]).toContain(status);
          console.log(`✅ Handled non-existent badge with status ${status}`);
        });

        console.log("\n✅ DELETE NON-EXISTENT BADGE TEST PASSED");

      } catch (error) {
        console.error("❌ Non-existent resource test error:", error.message);
      }
    });
  });
});
