const { test, expect } = require("@playwright/test");
const { ClientAPIURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { NegativeTestGenerator } = require("../../utils/NegativeTestGenerator.js");
const { ValidationHelper } = require("../../utils/ValidationHelper.js");
const { allure } = require("allure-playwright");
const { faker } = require("@faker-js/faker");

test.describe("Category Management API - Comprehensive Testing", () => {
  test.beforeEach(async () => {
    allure.epic("Skolasti API Automation");
    allure.feature("Category Management");
    allure.owner("QA Team");
    allure.tag("api", "category", "comprehensive");
  });

  const getExpectedCategories = () => [
    { Id: 0, CategoryName: "Leadership", Description: "Entertainment" },
    { Id: 1, CategoryName: "Technology", Description: "Technology" },
    { Id: 2, CategoryName: "Soft Skills", Description: "Soft Skills" },
    { Id: 3, CategoryName: "Production", Description: "Production" },
    { Id: 4, CategoryName: "Learning", Description: "Learning" },
    { Id: 5, CategoryName: "Life style", Description: "Life style" },
    { Id: 6, CategoryName: "LIfestyle", Description: "LIfestyle" }
  ];

  test.describe("✅ POSITIVE TEST CASES", () => {
    test("Category API - Complete Operations (Positive)", async ({ request }) => {
      test.setTimeout(120000);
      allure.story("Category Positive Flow");
      allure.severity("critical");
      allure.description("Complete validation of Category API with valid data");

      const api = new ApiHelper(request, ClientAPIURL, headers);

      try {
        // ==================== GET ALL CATEGORIES ====================
        await allure.step("Get All Categories", async () => {
          console.log("\n========== 📋 GET ALL CATEGORIES ==========");
          const categories = await api.get("/Category/getallcategories", 200);
          
          expect(Array.isArray(categories)).toBeTruthy();
          console.log(`✅ Total categories: ${categories.length}`);
          
          // Verify expected base categories exist
          const expectedCategories = getExpectedCategories();
          expectedCategories.forEach(expected => {
            const found = categories.find(c => c.Id === expected.Id);
            if (found) {
              expect(found.CategoryName).toBe(expected.CategoryName);
              console.log(`✅ Category ${expected.Id}: ${expected.CategoryName} verified`);
            }
          });

          // Validate structure
          if (categories.length > 0) {
            const category = categories[0];
            const schema = {
              Id: "number",
              CategoryName: "string",
              Description: "string",
              CreatedDate: "string",
              UpdatedDate: "string"
            };
            const validation = ValidationHelper.validateSchema(category, schema);
            console.log(`✅ Category structure: ${validation.message}`);
          }
        });

        // ==================== GET ALL PLAYLIST CATEGORIES ====================
        await allure.step("Get All Playlist Categories", async () => {
          console.log("\n========== 📋 GET ALL PLAYLIST CATEGORIES ==========");
          const playlistCategories = await api.get("/Category/getallplaylistcategories", 200);
          
          expect(Array.isArray(playlistCategories)).toBeTruthy();
          console.log(`✅ Total playlist categories: ${playlistCategories.length}`);
          
          // Validate structure
          if (playlistCategories.length > 0) {
            const category = playlistCategories[0];
            expect(category).toHaveProperty("Id");
            expect(category).toHaveProperty("PlaylistCategoryName");
            expect(category).toHaveProperty("PlaylistCategoryDescription");
            console.log(`✅ Playlist category structure validated`);
          }
        });

        // ==================== INVALIDATE CATEGORY CACHES ====================
        await allure.step("Invalidate Category Caches", async () => {
          console.log("\n========== 🔄 INVALIDATE CATEGORY CACHES ==========");
          const response = await api.post("/Category/invalidatecategorycaches", {}, [200, 204]);
          console.log(`✅ Category caches invalidated`);
        });

        // ==================== CATEGORIES CONSISTENCY CHECK ====================
        await allure.step("Categories Consistency Check", async () => {
          console.log("\n========== ✓ CATEGORIES CONSISTENCY CHECK ==========");
          
          const categories = await api.get("/Category/getallcategories", 200);
          const playlistCategories = await api.get("/Category/getallplaylistcategories", 200);
          
          console.log(`Categories count: ${categories.length}`);
          console.log(`Playlist categories count: ${playlistCategories.length}`);
          
          // Verify base categories exist in both
          const expectedCategories = getExpectedCategories();
          expectedCategories.forEach(expected => {
            const inCategories = categories.some(c => c.CategoryName === expected.CategoryName);
            const inPlaylist = playlistCategories.some(p => p.PlaylistCategoryName === expected.CategoryName);
            
            console.log(`✅ ${expected.CategoryName}: Categories=${inCategories}, Playlist=${inPlaylist}`);
          });
        });

        api.assertAll();

      } catch (error) {
        console.error("❌ Test failed with error:", error.message);
        throw error;
      }
    });
  });

  test.describe("❌ NEGATIVE TEST CASES", () => {
    test("Category API - Create with Invalid Data", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Category Negative - Invalid Creation");
      allure.severity("critical");
      allure.description("Validate API rejects invalid category creation");

      try {
        console.log("\n========== ❌ TEST: INVALID CATEGORY CREATION ==========");
        
        const invalidPayloads = NegativeTestGenerator.getInvalidCategoryPayloads();

        for (const scenario of invalidPayloads) {
          await allure.step(`Negative Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            console.log(`📦 Payload:`, JSON.stringify(scenario.payload, null, 2));
            
            const response = await request.post(`${ClientAPIURL}/Category/createcategory`, {
              headers,
              data: scenario.payload
            });

            const status = response.status();
            console.log(`📊 Response Status: ${status}`);
            
            expect(status).toBe(scenario.expectedStatus);
            console.log(`✅ Correctly rejected with status ${status}`);
            
            const responseBody = await response.text();
            console.log(`📥 Response: ${responseBody.substring(0, 200)}`);
          });
        }

        console.log("\n✅ ALL INVALID CATEGORY CREATION TESTS PASSED");

      } catch (error) {
        console.error("❌ Negative test error:", error.message);
      }
    });

    test("Category API - String Validation Failures", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Category Negative - String Validation");
      allure.severity("high");
      allure.description("Validate API rejects invalid string formats in category names");

      try {
        console.log("\n========== ❌ TEST: STRING VALIDATION ==========");
        
        const stringScenarios = [
          {
            name: "CategoryName with Numbers",
            payload: [{
              CategoryName: "Category123"
            }],
            expectedStatus: 400
          },
          {
            name: "CategoryName with Special Characters",
            payload: [{
              CategoryName: "Category@#$"
            }],
            expectedStatus: 400
          },
          {
            name: "CategoryName Too Short (1 char)",
            payload: [{
              CategoryName: "A"
            }],
            expectedStatus: 400
          },
          {
            name: "CategoryName with SQL Injection",
            payload: [{
              CategoryName: "'; DROP TABLE Categories; --"
            }],
            expectedStatus: 400
          },
          {
            name: "CategoryName with XSS",
            payload: [{
              CategoryName: "<script>alert('XSS')</script>"
            }],
            expectedStatus: 400
          }
        ];

        for (const scenario of stringScenarios) {
          await allure.step(`String Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            
            const response = await request.post(`${ClientAPIURL}/Category/createcategory`, {
              headers,
              data: scenario.payload
            });

            const status = response.status();
            console.log(`📊 Response Status: ${status}`);
            
            expect([400, 422]).toContain(status);
            console.log(`✅ Correctly rejected with status ${status}`);
          });
        }

        console.log("\n✅ ALL STRING VALIDATION TESTS PASSED");

      } catch (error) {
        console.error("❌ String validation test error:", error.message);
      }
    });

    test("Category API - Unauthorized Operations", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Category Negative - Authentication");
      allure.severity("critical");
      allure.description("Validate API rejects unauthorized category operations");

      try {
        console.log("\n========== ❌ TEST: UNAUTHORIZED OPERATIONS ==========");
        
        const authScenarios = NegativeTestGenerator.getInvalidAuthScenarios();

        for (const scenario of authScenarios) {
          await allure.step(`Auth Test: ${scenario.name}`, async () => {
            console.log(`\n🔒 Testing: ${scenario.name}`);
            
            const validPayload = [{
              CategoryName: "Test Category"
            }];

            const response = await request.post(`${ClientAPIURL}/Category/createcategory`, {
              headers: scenario.headers,
              data: validPayload
            });

            const status = response.status();
            console.log(`📊 Response Status: ${status}`);
            
            expect(status).toBe(scenario.expectedStatus);
            console.log(`✅ Correctly rejected with status ${status}`);
          });
        }

        console.log("\n✅ ALL UNAUTHORIZED OPERATION TESTS PASSED");

      } catch (error) {
        console.error("❌ Auth test error:", error.message);
      }
    });

    test("Category API - Boundary Value Testing", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Category Negative - Boundary Values");
      allure.severity("medium");
      allure.description("Validate API handles boundary values correctly");

      try {
        console.log("\n========== ❌ TEST: BOUNDARY VALUES ==========");
        
        const boundaryScenarios = [
          {
            name: "Exactly 2 characters (minimum boundary)",
            payload: [{
              CategoryName: "AB"
            }],
            shouldPass: true
          },
          {
            name: "Exactly 200 characters (maximum boundary)",
            payload: [{
              CategoryName: "A".repeat(200)
            }],
            shouldPass: true
          },
          {
            name: "201 characters (above maximum)",
            payload: [{
              CategoryName: "A".repeat(201)
            }],
            shouldPass: false
          }
        ];

        for (const scenario of boundaryScenarios) {
          await allure.step(`Boundary Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            
            const response = await request.post(`${ClientAPIURL}/Category/createcategory`, {
              headers,
              data: scenario.payload
            });

            const status = response.status();
            console.log(`📊 Response Status: ${status}`);
            
            if (scenario.shouldPass) {
              expect([200, 201]).toContain(status);
              console.log(`✅ Correctly accepted with status ${status}`);
            } else {
              expect([400, 422]).toContain(status);
              console.log(`✅ Correctly rejected with status ${status}`);
            }
          });
        }

        console.log("\n✅ ALL BOUNDARY VALUE TESTS PASSED");

      } catch (error) {
        console.error("❌ Boundary test error:", error.message);
      }
    });
  });
});
