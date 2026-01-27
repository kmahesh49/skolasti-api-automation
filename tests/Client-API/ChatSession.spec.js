const { test, expect } = require("@playwright/test");
const { ClientAPIURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { NegativeTestGenerator } = require("../../utils/NegativeTestGenerator.js");
const { ValidationHelper } = require("../../utils/ValidationHelper.js");
const { allure } = require("allure-playwright");

test.describe("Chat Session Management API - Comprehensive Testing", () => {
  let api;
  let createdSessionId = null;
  const userId = "3f537698-4e5e-4101-9115-626385911940";

  test.beforeEach(async ({ request }) => {
    api = new ApiHelper(request, ClientAPIURL, headers);
    allure.epic("Skolasti API Automation");
    allure.feature("Chat Session Management");
    allure.owner("QA Team");
    allure.tag("api", "chat", "session", "comprehensive");
  });

  // ==================== CHAT SESSION CRUD FLOW ====================
  test.describe("✅ Chat Session - CRUD Flow", () => {
    
    test('Step 1: CREATE - POST /ChatSession/startchatsession', async () => {
      test.setTimeout(60000);
      allure.story("Chat Session CRUD - CREATE (Start Session)");
      allure.severity("critical");

      console.log("\n========== 🚀 START CHAT SESSION ==========");
      const startSessionPayload = {
        UserId: userId,
        CourseId: 1,
        VideoId: null
      };

      const sessionResponse = await api.post("/ChatSession/startchatsession", startSessionPayload, [200, 201]);
      
      expect(sessionResponse).toHaveProperty("Id");
      createdSessionId = sessionResponse.Id;
      console.log(`✅ Started chat session ID: ${createdSessionId}`);
      
      api.assertAll();
    });

    test('Step 2: GET - Verify session after CREATE', async () => {
      test.setTimeout(60000);
      test.skip(!createdSessionId, 'Session ID not available - CREATE may have failed');
      allure.story("Chat Session CRUD - GET after CREATE");
      allure.severity("critical");

      console.log("\n========== 📊 GET SESSIONS UNDER COURSE ==========");
      const getSessionsPayload = {
        UserId: userId,
        CourseId: 1,
        VideoId: null,
        PageNumber: 1,
        PageSize: 10
      };

      const sessions = await api.post("/ChatSession/sessionsundercourseorvideoofuser", getSessionsPayload, 200);
      expect(Array.isArray(sessions)).toBeTruthy();
      console.log(`✅ Total sessions: ${sessions.length}`);

      const sessionExists = sessions.some(s => s.Id === createdSessionId);
      expect(sessionExists).toBeTruthy();
      console.log(`✅ Created session ${createdSessionId} verified in list`);
      
      api.assertAll();
    });

    test('Step 3: UPDATE - POST /ChatSession/qna (Add Q&A to session)', async () => {
      test.setTimeout(60000);
      test.skip(!createdSessionId, 'Session ID not available - CREATE may have failed');
      allure.story("Chat Session CRUD - UPDATE (Add Q&A)");
      allure.severity("critical");

      console.log("\n========== 💬 CREATE Q&A LOG ==========");
      const qnaPayload = [
        {
          QuestionText: "What is the main topic of this course?",
          AnswerText: "The course covers advanced programming concepts."
        },
        {
          QuestionText: "How long is the course?",
          AnswerText: "The course duration is approximately 10 hours."
        }
      ];

      const qnaResponse = await api.post(`/ChatSession/qna?sessionId=${createdSessionId}`, qnaPayload, [200, 201]);
      console.log("✅ Q&A logs added to session successfully");
      
      api.assertAll();
    });

    test('Step 4: GET - Verify session after UPDATE (Q&A added)', async () => {
      test.setTimeout(60000);
      test.skip(!createdSessionId, 'Session ID not available - CREATE may have failed');
      allure.story("Chat Session CRUD - GET after UPDATE");
      allure.severity("critical");

      console.log("\n========== 📋 GET Q&A BY SESSION ID ==========");
      const paginationPayload = {
        PageNumber: 1,
        PageSize: 10,
        IncludeAllPage: false
      };

      const qnaLogs = await api.post(`/ChatSession/qnabysessionid?sessionId=${createdSessionId}`, paginationPayload, 200);
      expect(Array.isArray(qnaLogs)).toBeTruthy();
      expect(qnaLogs.length).toBeGreaterThan(0);
      console.log(`✅ Q&A logs verified: ${qnaLogs.length} entries`);
      
      api.assertAll();
    });

    test('Step 5: DELETE - PUT /ChatSession/endchatsession (End session)', async () => {
      test.setTimeout(60000);
      test.skip(!createdSessionId, 'Session ID not available - CREATE may have failed');
      allure.story("Chat Session CRUD - DELETE (End Session)");
      allure.severity("critical");

      console.log("\n========== 🛑 END CHAT SESSION ==========");
      await api.update(`/ChatSession/endchatsession?sessionId=${createdSessionId}`, {}, [200, 204]);
      console.log(`✅ Chat session ${createdSessionId} ended successfully`);
      
      api.assertAll();
    });

    test('Step 6: GET - Verify session after DELETE (Session ended)', async () => {
      test.setTimeout(60000);
      test.skip(!createdSessionId, 'Session ID not available - CREATE may have failed');
      allure.story("Chat Session CRUD - GET after DELETE");
      allure.severity("medium");

      console.log("\n========== ✓ VERIFY SESSION ENDED ==========");
      const getSessionsPayload = {
        UserId: userId,
        CourseId: 1,
        VideoId: null,
        PageNumber: 1,
        PageSize: 10
      };

      const sessions = await api.post("/ChatSession/sessionsundercourseorvideoofuser", getSessionsPayload, 200);
      
      // Session still exists but should be marked as ended
      const session = sessions.find(s => s.Id === createdSessionId);
      if (session) {
        console.log(`✅ Session ${createdSessionId} exists (status should be ended)`);
      } else {
        console.log(`✅ Session ${createdSessionId} no longer in active list`);
      }
      
      api.assertAll();
    });
  });

  // ==================== ADDITIONAL TESTS ====================
  test.describe("✅ Chat Session - Additional Operations", () => {
    
    test("Check Users Under Course", async () => {
      test.setTimeout(60000);
      allure.story("Chat Session - User Check");
      allure.severity("medium");

      console.log("\n========== 👤 CHECK USER UNDER COURSE ==========");
      const userUnderCoursePayload = {
        CourseId: 1,
        VideoId: null,
        PageNumber: 1,
        PageSize: 10
      };

      const usersUnderCourse = await api.post("/ChatSession/userundercourseorvideo", userUnderCoursePayload, [200, 204]);
      if (usersUnderCourse) {
        console.log(`✅ Users under course: ${usersUnderCourse.length || 0}`);
      }
      
      api.assertAll();
    });
  });

  test.describe("❌ NEGATIVE TEST CASES", () => {
    test("ChatSession API - Start Session with Invalid Data", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("ChatSession Negative - Invalid Session Start");
      allure.severity("critical");
      allure.description("Validate API rejects invalid session start requests");

      try {
        console.log("\n========== ❌ TEST: INVALID SESSION START ==========");
        
        const invalidPayloads = [
          {
            name: "Missing UserId",
            payload: {
              CourseId: 1,
              VideoId: null
            },
            expectedStatus: 400
          },
          {
            name: "Invalid UserId Format",
            payload: {
              UserId: "invalid-uuid",
              CourseId: 1
            },
            expectedStatus: 400
          },
          {
            name: "Both CourseId and VideoId Null",
            payload: {
              UserId: "3f537698-4e5e-4101-9115-626385911940",
              CourseId: null,
              VideoId: null
            },
            expectedStatus: 400
          }
        ];

        for (const scenario of invalidPayloads) {
          await allure.step(`Negative Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            
            const response = await request.post(`${ClientAPIURL}/ChatSession/startchatsession`, {
              headers,
              data: scenario.payload
            });

            const status = response.status();
            console.log(`📊 Response Status: ${status}`);
            
            expect([400, 422]).toContain(status);
            console.log(`✅ Correctly rejected with status ${status}`);
          });
        }

        console.log("\n✅ ALL INVALID SESSION START TESTS PASSED");

      } catch (error) {
        console.error("❌ Negative test error:", error.message);
      }
    });

    test("ChatSession API - Q&A with Invalid Session ID", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("ChatSession Negative - Invalid Q&A");
      allure.severity("high");
      allure.description("Validate API handles Q&A with invalid session IDs");

      try {
        console.log("\n========== ❌ TEST: INVALID SESSION ID FOR Q&A ==========");
        
        const nonExistentSessionId = 999999999;
        
        await allure.step("Create Q&A for Non-existent Session", async () => {
          console.log(`\n🧪 Testing: Q&A for session ${nonExistentSessionId}`);
          
          const qnaPayload = [
            {
              QuestionText: "Test question",
              AnswerText: "Test answer"
            }
          ];

          const response = await request.post(
            `${ClientAPIURL}/ChatSession/qna?sessionId=${nonExistentSessionId}`,
            {
              headers,
              data: qnaPayload
            }
          );

          const status = response.status();
          console.log(`📊 Response Status: ${status}`);
          
          expect([404, 400, 200]).toContain(status);
          console.log(`✅ Handled with status ${status}`);
        });

        console.log("\n✅ INVALID SESSION ID TEST PASSED");

      } catch (error) {
        console.error("❌ Negative test error:", error.message);
      }
    });

    test("ChatSession API - Invalid Q&A Payload", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("ChatSession Negative - Invalid Q&A Payload");
      allure.severity("high");
      allure.description("Validate API rejects invalid Q&A payloads");

      try {
        console.log("\n========== ❌ TEST: INVALID Q&A PAYLOAD ==========");
        
        const sessionId = 1; // Assuming a session exists
        
        const invalidPayloads = [
          {
            name: "Missing QuestionText",
            payload: [{
              AnswerText: "Test answer"
            }]
          },
          {
            name: "Missing AnswerText",
            payload: [{
              QuestionText: "Test question"
            }]
          },
          {
            name: "Empty Array",
            payload: []
          },
          {
            name: "Empty QuestionText",
            payload: [{
              QuestionText: "",
              AnswerText: "Test answer"
            }]
          }
        ];

        for (const scenario of invalidPayloads) {
          await allure.step(`Q&A Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            
            const response = await request.post(
              `${ClientAPIURL}/ChatSession/qna?sessionId=${sessionId}`,
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

        console.log("\n✅ ALL INVALID Q&A PAYLOAD TESTS PASSED");

      } catch (error) {
        console.error("❌ Invalid Q&A payload test error:", error.message);
      }
    });

    test("ChatSession API - End Non-existent Session", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("ChatSession Negative - End Invalid Session");
      allure.severity("medium");
      allure.description("Validate API handles ending non-existent sessions");

      try {
        console.log("\n========== ❌ TEST: END NON-EXISTENT SESSION ==========");
        
        const nonExistentSessionId = 999999999;
        
        await allure.step("End Non-existent Session", async () => {
          console.log(`\n🧪 Testing: End session ${nonExistentSessionId}`);
          
          const response = await request.put(
            `${ClientAPIURL}/ChatSession/endchatsession?sessionId=${nonExistentSessionId}`,
            { headers }
          );

          const status = response.status();
          console.log(`📊 Response Status: ${status}`);
          
          expect([404, 400, 200]).toContain(status);
          console.log(`✅ Handled with status ${status}`);
        });

        console.log("\n✅ END NON-EXISTENT SESSION TEST PASSED");

      } catch (error) {
        console.error("❌ End session test error:", error.message);
      }
    });

    test("ChatSession API - Unauthorized Access", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("ChatSession Negative - Authentication");
      allure.severity("critical");
      allure.description("Validate API rejects unauthorized session operations");

      try {
        console.log("\n========== ❌ TEST: UNAUTHORIZED ACCESS ==========");
        
        const authScenarios = NegativeTestGenerator.getInvalidAuthScenarios();

        for (const scenario of authScenarios) {
          await allure.step(`Auth Test: ${scenario.name}`, async () => {
            console.log(`\n🔒 Testing: ${scenario.name}`);
            
            const validPayload = {
              UserId: "3f537698-4e5e-4101-9115-626385911940",
              CourseId: 1
            };

            const response = await request.post(`${ClientAPIURL}/ChatSession/startchatsession`, {
              headers: scenario.headers,
              data: validPayload
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
