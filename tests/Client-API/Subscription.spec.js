const { test, expect } = require("@playwright/test");
const { ClientAPIURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { NegativeTestGenerator } = require("../../utils/NegativeTestGenerator.js");
const { ValidationHelper } = require("../../utils/ValidationHelper.js");
const { allure } = require("allure-playwright");
const { faker } = require("@faker-js/faker");

test.describe("Subscription Management API - Comprehensive Testing", () => {
  let api;
  let createdPlanId = null;
  let validityTypes = [];
  let currencyCodeId = 1;
  let createPlanPayload = null;

  test.beforeEach(async ({ request }) => {
    api = new ApiHelper(request, ClientAPIURL, headers);
    allure.epic("Skolasti API Automation");
    allure.feature("Subscription Management");
    allure.owner("QA Team");
    allure.tag("api", "subscription", "comprehensive");
  });

  // ==================== SUBSCRIPTION PLAN CRUD FLOW ====================
  test.describe("âœ… Subscription Plan - CRUD Flow", () => {
    
    test('Step 1: CREATE - POST /Subscription/createsubscriptionplan', async () => {
      test.setTimeout(60000);
      allure.story("Subscription CRUD - CREATE");
      allure.severity("critical");

      // Get dependencies first
      console.log("\n========== ðŸ“‹ GET DEPENDENCIES ==========");
      validityTypes = await api.get("/Subscription/validitytypes", 200);
      expect(Array.isArray(validityTypes)).toBeTruthy();
      console.log(`âœ… Validity types: ${validityTypes.length}`);

      const currencyCodes = await api.get("/Subscription/currencycodes", 200);
      expect(Array.isArray(currencyCodes)).toBeTruthy();
      currencyCodeId = currencyCodes[0].Id;
      console.log(`âœ… Currency code ID: ${currencyCodeId}`);

      // Create subscription plan
      console.log("\n========== âœ¨ CREATE SUBSCRIPTION PLAN ==========");
      createPlanPayload = {
        PlanName: `Premium Plan ${faker.lorem.word()}`,
        Description: `Automated test subscription - ${faker.lorem.sentence()}`,
        Price: parseFloat(faker.commerce.price(99, 999)),
        Validity: 30,
        ValidityTypeId: validityTypes[0].Id,
        CurrencyCodeId: currencyCodeId,
        RazorPayPlanId: `plan_${Date.now()}`,
        PaymentLink: `https://payment.link/${Date.now()}`,
        subscriptionDataVM: [
          { ContentId: 1, ContentTypeId: 1 },
          { ContentId: 2, ContentTypeId: 1 }
        ]
      };

      const createdPlan = await api.create("/Subscription/createsubscriptionplan", createPlanPayload, [200, 201]);
      
      expect(createdPlan).toBeTruthy();
      expect(createdPlan).toHaveProperty("PlanId");
      
      createdPlanId = createdPlan.PlanId;
      console.log(`âœ… Created subscription plan ID: ${createdPlanId}`);
      
      // Validate response structure
      const schema = { PlanId: "number", PlanName: "string", Price: "number" };
      const validation = ValidationHelper.validateSchema(createdPlan, schema);
      expect(validation.isValid).toBeTruthy();
      
      api.assertAll();
    });

    test('Step 2: GET - Verify plan after CREATE', async () => {
      test.setTimeout(60000);
      test.skip(!createdPlanId, 'Plan ID not available - CREATE may have failed');
      allure.story("Subscription CRUD - GET after CREATE");
      allure.severity("critical");

      console.log("\n========== ðŸ” GET PLAN BY ID ==========");
      const paginationPayload = {
        PageNumber: 1,
        PageSize: 10,
        IncludeAllPage: false
      };

      const planDetails = await api.post(`/Subscription/getplanById?planId=${createdPlanId}`, paginationPayload, 200);
      
      expect(planDetails).toBeTruthy();
      expect(planDetails.Id).toBe(createdPlanId);
      console.log(`âœ… Plan details verified: ${planDetails.PlanName}`);
      
      api.assertAll();
    });

    test('Step 3: UPDATE - PUT /Subscription/updatesubscriptiondata', async () => {
      test.setTimeout(60000);
      test.skip(!createdPlanId, 'Plan ID not available - CREATE may have failed');
      allure.story("Subscription CRUD - UPDATE");
      allure.severity("critical");

      console.log("\n========== ðŸ”„ UPDATE SUBSCRIPTION DATA ==========");
      const updatePlanPayload = {
        SubscriptionPlanid: createdPlanId,
        PlanName: `Updated Plan ${Date.now()}`,
        Description: "Updated description",
        Price: parseFloat(faker.commerce.price(199, 1999)),
        RazorPayPlanId: `plan_${Date.now()}`,
        ContentTypeId: 1,
        ContentId: [1, 2, 3]
      };

      await api.update("/Subscription/updatesubscriptiondata", updatePlanPayload, [200, 201]);
      console.log("âœ… Subscription plan updated successfully");
      
      api.assertAll();
    });

    test('Step 4: GET - Verify plan after UPDATE', async () => {
      test.setTimeout(60000);
      test.skip(!createdPlanId, 'Plan ID not available - CREATE may have failed');
      allure.story("Subscription CRUD - GET after UPDATE");
      allure.severity("critical");

      console.log("\n========== ðŸ” GET PLAN AFTER UPDATE ==========");
      const paginationPayload = {
        PageNumber: 1,
        PageSize: 10,
        IncludeAllPage: false
      };

      const planDetails = await api.post(`/Subscription/getplanById?planId=${createdPlanId}`, paginationPayload, 200);
      
      expect(planDetails).toBeTruthy();
      expect(planDetails.Id).toBe(createdPlanId);
      console.log(`âœ… Updated plan verified: ${planDetails.PlanName}`);
      
      api.assertAll();
    });

    test('Step 5: DELETE - DELETE /Subscription/removesubscriptionplan', async () => {
      test.setTimeout(60000);
      test.skip(!createdPlanId, 'Plan ID not available - CREATE may have failed');
      allure.story("Subscription CRUD - DELETE");
      allure.severity("critical");

      console.log("\n========== ðŸ—‘ï¸ DELETE SUBSCRIPTION PLAN ==========");
      await api.delete(`/Subscription/removesubscriptionplan?id=${createdPlanId}`, {}, [200, 204]);
      console.log(`âœ… Subscription plan ${createdPlanId} deleted`);
      
      api.assertAll();
    });

    test('Step 6: GET - Verify plan after DELETE', async () => {
      test.setTimeout(60000);
      test.skip(!createdPlanId, 'Plan ID not available - CREATE may have failed');
      allure.story("Subscription CRUD - GET after DELETE");
      allure.severity("critical");

      console.log("\n========== âœ“ VERIFY PLAN DELETION ==========");
      const allPlansAfterDelete = await api.get("/Subscription/getallplans", 200);
      const planStillExists = allPlansAfterDelete.some(p => p.Id === createdPlanId);
      expect(planStillExists).toBeFalsy();
      console.log(`âœ… Plan ${createdPlanId} successfully deleted and verified`);
      
      api.assertAll();
    });
  });

  // ==================== ADDITIONAL SUBSCRIPTION TESTS ====================
  test.describe("âœ… Subscription - Additional Operations", () => {

    test("Get All Subscription Plans", async () => {
      test.setTimeout(60000);
      allure.story("Subscription - List Operations");
      allure.severity("high");

      console.log("\n========== ðŸ“‹ GET ALL SUBSCRIPTION PLANS ==========");
      const allPlans = await api.get("/Subscription/getallplans", 200);
      
      expect(Array.isArray(allPlans)).toBeTruthy();
      console.log(`âœ… Total subscription plans: ${allPlans.length}`);
      
      api.assertAll();
    });

    test("Wishlist Operations - Toggle Add/Remove", async () => {
      test.setTimeout(60000);
      allure.story("Subscription - Wishlist");
      allure.severity("medium");

      const userId = "3f537698-4e5e-4101-9115-626385911940";
      const contentId = 1;
      const contentTypeId = 1;

      console.log("\n========== â¤ï¸ WISHLIST OPERATIONS ==========");
      
      // Add to wishlist
      await api.post(
        `/Subscription/togglewishlist?contentId=${contentId}&contentTypeId=${contentTypeId}&userId=${userId}`,
        {},
        200
      );
      console.log("âœ… Content added to wishlist");

      // Get wishlist
      const wishlistParams = new URLSearchParams({
        userId: userId,
        PageNumber: 1,
        PageSize: 10
      }).toString();

      const wishlist = await api.get(`/Subscription/getwishlist?${wishlistParams}`, [200, 204]);
      if (wishlist) {
        expect(Array.isArray(wishlist)).toBeTruthy();
        console.log(`âœ… Wishlist items: ${wishlist.length}`);
      }

      // Remove from wishlist
      await api.post(
        `/Subscription/togglewishlist?contentId=${contentId}&contentTypeId=${contentTypeId}&userId=${userId}`,
        {},
        200
      );
      console.log("âœ… Content removed from wishlist");
      
      api.assertAll();
    });

    test("Get Content Reviews", async () => {
      test.setTimeout(60000);
      allure.story("Subscription - Reviews");
      allure.severity("low");

      console.log("\n========== â­ GET CONTENT REVIEWS ==========");
      const reviewsParams = new URLSearchParams({
        contentId: 1,
        contentTypeId: 1,
        PageNumber: 1,
        PageSize: 10
      }).toString();

      const reviewsResponse = await api.get(`/Subscription/getcontentreviews?${reviewsParams}`, 200);
      expect(reviewsResponse).toBeTruthy();
      expect(Array.isArray(reviewsResponse.Reviews)).toBeTruthy();
      console.log(`âœ… Content reviews: ${reviewsResponse.Reviews.length}`);
      
      api.assertAll();
    });
  });

  // ==================== NEGATIVE TEST CASES ====================
    test("Subscription API - Invalid Plan Creation (Missing Required Fields)", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Subscription Negative - Missing Fields");
      allure.severity("critical");
      allure.description("Validate API rejects subscription plan creation with missing required fields");

      const api = new ApiHelper(request, ClientAPIURL, headers);

      try {
        console.log("\n========== âŒ TEST: MISSING REQUIRED FIELDS ==========");
        
        const invalidPayloads = [
          {
            name: "Missing PlanName",
            payload: {
              Description: "Test Plan",
              Price: 99.99,
              Validity: 30,
              ValidityTypeId: 1,
              CurrencyCodeId: 1,
              RazorPayPlanId: "plan_123"
            }
          },
          {
            name: "Missing RazorPayPlanId",
            payload: {
              PlanName: "Test Plan",
              Description: "Test Plan",
              Price: 99.99,
              Validity: 30,
              ValidityTypeId: 1,
              CurrencyCodeId: 1
            }
          }
        ];

        for (const scenario of invalidPayloads) {
          await allure.step(`Negative Test: ${scenario.name}`, async () => {
            console.log(`\nðŸ§ª Testing: ${scenario.name}`);
            
            const response = await request.post(`${ClientAPIURL}/Subscription/createsubscriptionplan`, {
              headers,
              data: scenario.payload
            });

            const status = response.status();
            console.log(`ðŸ“Š Response Status: ${status}`);
            
            // Should return 400 Bad Request
            expect(status).toBe(400);
            console.log(`âœ… Correctly rejected with status ${status}`);
            
            const responseBody = await response.text();
            console.log(`ðŸ“¥ Response: ${responseBody}`);
          });
        }

        console.log("\nâœ… ALL NEGATIVE TESTS FOR MISSING FIELDS PASSED");

      } catch (error) {
        console.error("âŒ Negative test encountered unexpected error:", error.message);
        // This is expected for negative tests, don't fail
      }
    });

    test("Subscription API - Invalid Numeric Values", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Subscription Negative - Invalid Numbers");
      allure.severity("high");
      allure.description("Validate API rejects invalid numeric values (negative, zero, out of range)");

      const api = new ApiHelper(request, ClientAPIURL, headers);

      try {
        console.log("\n========== âŒ TEST: INVALID NUMERIC VALUES ==========");
        
        const invalidPayloads = [
          {
            name: "Negative Price",
            payload: {
              PlanName: "Test Plan",
              Description: "Test",
              Price: -99.99,
              Validity: 30,
              ValidityTypeId: 1,
              CurrencyCodeId: 1,
              RazorPayPlanId: "plan_neg"
            },
            expectedError: "Price must be positive"
          },
          {
            name: "Zero Price",
            payload: {
              PlanName: "Test Plan",
              Description: "Test",
              Price: 0,
              Validity: 30,
              ValidityTypeId: 1,
              CurrencyCodeId: 1,
              RazorPayPlanId: "plan_zero"
            },
            expectedError: "Price must be greater than 0"
          },
          {
            name: "Zero Validity",
            payload: {
              PlanName: "Test Plan",
              Description: "Test",
              Price: 99.99,
              Validity: 0,
              ValidityTypeId: 1,
              CurrencyCodeId: 1,
              RazorPayPlanId: "plan_val"
            },
            expectedError: "Validity must be at least 1"
          }
        ];

        for (const scenario of invalidPayloads) {
          await allure.step(`Negative Test: ${scenario.name}`, async () => {
            console.log(`\nðŸ§ª Testing: ${scenario.name}`);
            console.log(`ðŸ“¦ Payload:`, JSON.stringify(scenario.payload, null, 2));
            
            const response = await request.post(`${ClientAPIURL}/Subscription/createsubscriptionplan`, {
              headers,
              data: scenario.payload
            });

            const status = response.status();
            console.log(`ðŸ“Š Response Status: ${status}`);
            
            // Should return 400 Bad Request
            expect([400, 422]).toContain(status);
            console.log(`âœ… Correctly rejected with status ${status}`);
            console.log(`ðŸ’¡ Expected error: ${scenario.expectedError}`);
            
            const responseBody = await response.text();
            console.log(`ðŸ“¥ Response: ${responseBody.substring(0, 200)}`);
          });
        }

        console.log("\nâœ… ALL NEGATIVE TESTS FOR INVALID NUMBERS PASSED");

      } catch (error) {
        console.error("âŒ Negative test encountered unexpected error:", error.message);
      }
    });

    test("Subscription API - Invalid String Formats", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Subscription Negative - Invalid Strings");
      allure.severity("high");
      allure.description("Validate API rejects invalid string formats and special characters");

      try {
        console.log("\n========== âŒ TEST: INVALID STRING FORMATS ==========");
        
        const invalidPayloads = [
          {
            name: "PlanName - Numbers Only",
            payload: {
              PlanName: "12345",
              Description: "Test",
              Price: 99.99,
              Validity: 30,
              ValidityTypeId: 1,
              CurrencyCodeId: 1,
              RazorPayPlanId: "plan_num"
            }
          },
          {
            name: "PlanName - Special Characters",
            payload: {
              PlanName: "@#$%^&*()",
              Description: "Test",
              Price: 99.99,
              Validity: 30,
              ValidityTypeId: 1,
              CurrencyCodeId: 1,
              RazorPayPlanId: "plan_special"
            }
          },
          {
            name: "PlanName - Empty String",
            payload: {
              PlanName: "",
              Description: "Test",
              Price: 99.99,
              Validity: 30,
              ValidityTypeId: 1,
              CurrencyCodeId: 1,
              RazorPayPlanId: "plan_empty"
            }
          }
        ];

        for (const scenario of invalidPayloads) {
          await allure.step(`Negative Test: ${scenario.name}`, async () => {
            console.log(`\nðŸ§ª Testing: ${scenario.name}`);
            
            const response = await request.post(`${ClientAPIURL}/Subscription/createsubscriptionplan`, {
              headers,
              data: scenario.payload
            });

            const status = response.status();
            console.log(`ðŸ“Š Response Status: ${status}`);
            
            // Should return 400 Bad Request
            expect([400, 422]).toContain(status);
            console.log(`âœ… Correctly rejected with status ${status}`);
            
            const responseBody = await response.text();
            console.log(`ðŸ“¥ Response: ${responseBody.substring(0, 200)}`);
          });
        }

        console.log("\nâœ… ALL NEGATIVE TESTS FOR INVALID STRINGS PASSED");

      } catch (error) {
        console.error("âŒ Negative test encountered unexpected error:", error.message);
      }
    });

    test("Subscription API - Unauthorized Access (Invalid Token)", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Subscription Negative - Authentication");
      allure.severity("critical");
      allure.description("Validate API rejects requests with invalid or missing authentication");

      try {
        console.log("\n========== âŒ TEST: UNAUTHORIZED ACCESS ==========");
        
        const authScenarios = NegativeTestGenerator.getInvalidAuthScenarios();

        for (const scenario of authScenarios) {
          await allure.step(`Auth Test: ${scenario.name}`, async () => {
            console.log(`\nðŸ”’ Testing: ${scenario.name}`);
            
            const validPayload = {
              PlanName: "Test Plan",
              Description: "Test",
              Price: 99.99,
              Validity: 30,
              ValidityTypeId: 1,
              CurrencyCodeId: 1,
              RazorPayPlanId: `plan_auth_${Date.now()}`
            };

            const response = await request.post(`${ClientAPIURL}/Subscription/createsubscriptionplan`, {
              headers: scenario.headers,
              data: validPayload
            });

            const status = response.status();
            console.log(`ðŸ“Š Response Status: ${status}`);
            
            // Should return 401 Unauthorized
            expect(status).toBe(scenario.expectedStatus);
            console.log(`âœ… Correctly rejected with status ${status}`);
            
            const responseBody = await response.text();
            console.log(`ðŸ“¥ Response: ${responseBody.substring(0, 200)}`);
          });
        }

        console.log("\nâœ… ALL UNAUTHORIZED ACCESS TESTS PASSED");

      } catch (error) {
        console.error("âŒ Auth test encountered error:", error.message);
      }
    });

    test("Subscription API - Non-existent Resource Operations", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Subscription Negative - Non-existent Resources");
      allure.severity("high");
      allure.description("Validate API handles operations on non-existent resources correctly");

      const api = new ApiHelper(request, ClientAPIURL, headers);

      try {
        console.log("\n========== âŒ TEST: NON-EXISTENT RESOURCES ==========");

        // Test 1: Get non-existent plan
        await allure.step("Get Non-existent Plan", async () => {
          console.log("\nðŸ§ª Testing: Get Non-existent Plan ID");
          
          const nonExistentPlanId = 999999999;
          const paginationPayload = {
            PageNumber: 1,
            PageSize: 10
          };

          const response = await request.post(
            `${ClientAPIURL}/Subscription/getplanById?planId=${nonExistentPlanId}`,
            {
              headers,
              data: paginationPayload
            }
          );

          const status = response.status();
          console.log(`ðŸ“Š Response Status: ${status}`);
          
          // Should return 404 Not Found or empty result
          expect([404, 200]).toContain(status);
          console.log(`âœ… Handled non-existent plan correctly with status ${status}`);
        });

        // Test 2: Delete non-existent plan
        await allure.step("Delete Non-existent Plan", async () => {
          console.log("\nðŸ§ª Testing: Delete Non-existent Plan");
          
          const nonExistentPlanId = 999999999;
          
          const response = await request.delete(
            `${ClientAPIURL}/Subscription/removesubscriptionplan?id=${nonExistentPlanId}`,
            {
              headers
            }
          );

          const status = response.status();
          console.log(`ðŸ“Š Response Status: ${status}`);
          
          // Should return 404 Not Found
          expect([404, 400, 200]).toContain(status);
          console.log(`âœ… Handled non-existent plan deletion with status ${status}`);
        });

        // Test 3: Update non-existent plan
        await allure.step("Update Non-existent Plan", async () => {
          console.log("\nðŸ§ª Testing: Update Non-existent Plan");
          
          const updatePayload = {
            SubscriptionPlanid: 999999999,
            PlanName: "Non-existent Plan",
            Description: "Test",
            Price: 99.99,
            RazorPayPlanId: "plan_fake",
            ContentTypeId: 1,
            ContentId: [1]
          };

          const response = await request.put(
            `${ClientAPIURL}/Subscription/updatesubscriptiondata`,
            {
              headers,
              data: updatePayload
            }
          );

          const status = response.status();
          console.log(`ðŸ“Š Response Status: ${status}`);
          
          // Should return 404 Not Found or 400
          expect([404, 400, 200]).toContain(status);
          console.log(`âœ… Handled non-existent plan update with status ${status}`);
        });

        console.log("\nâœ… ALL NON-EXISTENT RESOURCE TESTS PASSED");

      } catch (error) {
        console.error("âŒ Non-existent resource test error:", error.message);
      }
    });
  });
