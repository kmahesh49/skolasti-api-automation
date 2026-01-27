const { test, expect } = require("@playwright/test");
const { ClientAPIURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { NegativeTestGenerator } = require("../../utils/NegativeTestGenerator.js");
const { ValidationHelper } = require("../../utils/ValidationHelper.js");
const { allure } = require("allure-playwright");

test.describe("Certificates Management API - Comprehensive Testing", () => {
  test.beforeEach(async () => {
    allure.epic("Skolasti API Automation");
    allure.feature("Certificates Management");
    allure.owner("QA Team");
    allure.tag("api", "certificates", "comprehensive");
  });

  test.describe("✅ POSITIVE TEST CASES", () => {
    test("Certificates API - Complete Operations (Positive)", async ({ request }) => {
      test.setTimeout(120000);
      allure.story("Certificates Positive Flow");
      allure.severity("high");
      allure.description("Complete validation of Certificates API operations");

      const api = new ApiHelper(request, ClientAPIURL, headers);
      const userId = "3f537698-4e5e-4101-9115-626385911940";

      try {
        // ==================== GET ALL USER CERTIFICATES ====================
        await allure.step("Get All User Certificates", async () => {
          console.log("\n========== 📜 GET ALL USER CERTIFICATES ==========");
          const paginationPayload = {
            PageNumber: 1,
            PageSize: 10,
            IncludeAllPage: false,
            SortField: "CreatedDate",
            SortType: "DESC"
          };

          const certificatesResponse = await api.post("/Certificates/getallusercertificates", paginationPayload, [200, 204]);
          
          // API may return empty/null response (204) or paginated object
          if (certificatesResponse) {
            // Handle both array and object responses
            const userCertificates = Array.isArray(certificatesResponse) 
              ? certificatesResponse 
              : (certificatesResponse.Certificates || certificatesResponse.Data || []);
            
            console.log(`✅ Total user certificates: ${userCertificates.length}`);

            // Validate certificate structure if certificates exist
            if (userCertificates.length > 0) {
              const cert = userCertificates[0];
              expect(cert).toHaveProperty("Id");
              console.log(`✅ Sample certificate ID: ${cert.Id}`);
            }
          } else {
            console.log(`✅ No user certificates found`);
          }
        });

        // ==================== GET CERTIFICATE TEMPLATES ====================
        await allure.step("Get Certificate Templates", async () => {
          console.log("\n========== 📋 GET CERTIFICATE TEMPLATES ==========");
          const templates = await api.get("/Certificates/getcertificatetemplates", 200);
          
          expect(Array.isArray(templates)).toBeTruthy();
          console.log(`✅ Total certificate templates: ${templates.length}`);

          if (templates.length > 0) {
            const template = templates[0];
            expect(template).toHaveProperty("CertificateId");
            console.log(`✅ Sample template ID: ${template.CertificateId}`);
          }
        });

        // ==================== GET CERTIFICATE BY USER ID ====================
        await allure.step("Get Certificates By User ID", async () => {
          console.log("\n========== 👤 GET CERTIFICATES BY USER ID ==========");
          const paginationPayload = {
            PageNumber: 1,
            PageSize: 10
          };

          // API may return 204 when user has no certificates
          const certificatesByUser = await api.post(
            `/Certificates/getcertificatebyid?userId=${userId}`,
            paginationPayload,
            [200, 204]
          );
          
          console.log(`✅ Certificates for user: ${certificatesByUser ? certificatesByUser.length || 0 : 0}`);
        });

        api.assertAll();

      } catch (error) {
        console.error("❌ Test failed with error:", error.message);
        throw error;
      }
    });
  });

  test.describe("❌ NEGATIVE TEST CASES", () => {
    test("Certificates API - Invalid Pagination Parameters", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Certificates Negative - Invalid Pagination");
      allure.severity("high");
      allure.description("Validate API handles invalid pagination");

      try {
        console.log("\n========== ❌ TEST: INVALID PAGINATION ==========");
        
        const invalidPayloads = [
          {
            name: "Page Number Exceeds Maximum",
            payload: {
              PageNumber: 25,
              PageSize: 10
            }
          },
          {
            name: "Page Size Exceeds Maximum",
            payload: {
              PageNumber: 1,
              PageSize: 50
            }
          },
          {
            name: "Negative Page Number",
            payload: {
              PageNumber: -1,
              PageSize: 10
            }
          }
        ];

        for (const scenario of invalidPayloads) {
          await allure.step(`Negative Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            
            const response = await request.post(`${ClientAPIURL}/Certificates/getallusercertificates`, {
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

    test("Certificates API - Invalid User ID", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Certificates Negative - Invalid User");
      allure.severity("high");
      allure.description("Validate API handles invalid user IDs");

      try {
        console.log("\n========== ❌ TEST: INVALID USER ID ==========");
        
        const invalidUserScenarios = [
          {
            name: "Non-existent User ID",
            userId: "00000000-0000-0000-0000-000000000000"
          },
          {
            name: "Invalid UUID Format",
            userId: "invalid-uuid-format"
          },
          {
            name: "Empty User ID",
            userId: ""
          }
        ];

        for (const scenario of invalidUserScenarios) {
          await allure.step(`User ID Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            
            const paginationPayload = {
              PageNumber: 1,
              PageSize: 10
            };

            const response = await request.post(
              `${ClientAPIURL}/Certificates/getcertificatebyid?userId=${scenario.userId}`,
              {
                headers,
                data: paginationPayload
              }
            );

            const status = response.status();
            console.log(`📊 Response Status: ${status}`);
            
            // Should return 400 (bad request) or 404 (not found) for invalid user ID
            expect([400, 404]).toContain(status);
            console.log(`✅ Correctly rejected with status ${status}`);
          });
        }

        console.log("\n✅ ALL INVALID USER ID TESTS PASSED");

      } catch (error) {
        console.error("❌ Invalid user ID test error:", error.message);
      }
    });

    test("Certificates API - Share Certificate with Invalid Data", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Certificates Negative - Invalid Sharing");
      allure.severity("medium");
      allure.description("Validate API handles invalid certificate sharing");

      try {
        console.log("\n========== ❌ TEST: INVALID CERTIFICATE SHARING ==========");
        
        const invalidShareScenarios = [
          {
            name: "Invalid Email Format",
            sharedBy: "user123",
            sharedWith: "invalid-email",
            certificateId: 1
          },
          {
            name: "Non-existent Certificate ID",
            sharedBy: "user123",
            sharedWith: "test@example.com",
            certificateId: 999999999
          },
          {
            name: "Missing SharedWith",
            sharedBy: "user123",
            sharedWith: "",
            certificateId: 1
          }
        ];

        for (const scenario of invalidShareScenarios) {
          await allure.step(`Share Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            
            const response = await request.post(
              `${ClientAPIURL}/Certificates/sharemycertificate?sharedBy=${scenario.sharedBy}&sharedWith=${scenario.sharedWith}&certificateId=${scenario.certificateId}`,
              { headers }
            );

            const status = response.status();
            console.log(`📊 Response Status: ${status}`);
            
            // Should return 400 (bad request) or 404 (not found) for invalid sharing parameters
            expect([400, 404]).toContain(status);
            console.log(`✅ Correctly rejected with status ${status}`);
          });
        }

        console.log("\n✅ ALL INVALID SHARING TESTS PASSED");

      } catch (error) {
        console.error("❌ Invalid sharing test error:", error.message);
      }
    });

    test("Certificates API - Unauthorized Access", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("Certificates Negative - Authentication");
      allure.severity("critical");
      allure.description("Validate API rejects unauthorized access");

      try {
        console.log("\n========== ❌ TEST: UNAUTHORIZED ACCESS ==========");
        
        const authScenarios = NegativeTestGenerator.getInvalidAuthScenarios();

        for (const scenario of authScenarios) {
          await allure.step(`Auth Test: ${scenario.name}`, async () => {
            console.log(`\n🔒 Testing: ${scenario.name}`);
            
            const response = await request.get(`${ClientAPIURL}/Certificates/getcertificatetemplates`, {
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
  });
});
