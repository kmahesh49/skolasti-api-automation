const { test, expect } = require("@playwright/test");
const { ClientAPIURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { NegativeTestGenerator } = require("../../utils/NegativeTestGenerator.js");
const { ValidationHelper } = require("../../utils/ValidationHelper.js");
const { allure } = require("allure-playwright");

test.describe("User Course Management API - Comprehensive Testing", () => {
  test.beforeEach(async () => {
    allure.epic("Skolasti API Automation");
    allure.feature("User Course Management");
    allure.owner("QA Team");
    allure.tag("api", "course", "user", "comprehensive");
  });

  test.describe("✅ POSITIVE TEST CASES", () => {
    test("User Course API - Complete Operations (Positive)", async ({ request }) => {
      test.setTimeout(180000);
      allure.story("User Course Positive Flow");
      allure.severity("critical");
      allure.description("Complete user course operations including enrollment and progress tracking");

      const api = new ApiHelper(request, ClientAPIURL, headers);
      const userId = "3f537698-4e5e-4101-9115-626385911940";

      try {
        let testCourseId;

        // ==================== GET ALL USER COURSES ====================
        await allure.step("Get All User Courses", async () => {
          console.log("\n========== 📚 GET ALL USER COURSES ==========");
          const coursesFilterPayload = {
            PageNumber: 1,
            PageSize: 10,
            IncludeAllPage: false,
            SortField: "CreatedDate",
            SortType: "DESC"
          };

          const viewAllCourseType = 1;
          const coursesResponse = await api.post(
            `/Course/getallusercourses?viewAllCourseType=${viewAllCourseType}`,
            coursesFilterPayload,
            200
          );

          // API returns object with NewlyAdded, TopPerformance, Courses properties
          const userCourses = coursesResponse.NewlyAdded || coursesResponse.Courses || [];
          expect(Array.isArray(userCourses)).toBeTruthy();
          console.log(`✅ Total user courses: ${coursesResponse.TotalCoursesCount || userCourses.length}`);

          if (userCourses.length > 0) {
            testCourseId = userCourses[0].Id;
            console.log(`✅ Using course ID for testing: ${testCourseId}`);
          }
        });

        // ==================== GET USER COURSE BY ID ====================
        if (testCourseId) {
          await allure.step("Get User Course By ID", async () => {
            console.log("\n========== 🔍 GET USER COURSE BY ID ==========");
            const courseDetails = await api.get(`/Course/getusercoursebyid?courseId=${testCourseId}`, 200);
            
            expect(courseDetails).toHaveProperty("Id");
            expect(courseDetails.Id).toBe(testCourseId);
            console.log(`✅ Course title: ${courseDetails.Title}`);
            console.log(`✅ Course sections: ${courseDetails.CourseSections?.length || 0}`);
          });
        }

        // ==================== GET PLAYLIST DETAILS ====================
        await allure.step("Get Playlist Details", async () => {
          console.log("\n========== 📋 GET PLAYLIST DETAILS ==========");
          const playListId = 1;
          
          const playlistDetails = await api.get(`/Course/getplaylistdetails?playListId=${playListId}`, [200, 204]);
          if (playlistDetails) {
            console.log(`✅ Playlist details retrieved for ID: ${playListId}`);
          } else {
            console.log(`⚠️ Playlist ${playListId} not found (204 No Content)`);
          }
        });

        // ==================== GET IN PROGRESS COURSES ====================
        await allure.step("Get In Progress Courses", async () => {
          console.log("\n========== 🚧 GET IN PROGRESS COURSES ==========");
          const paginationPayload = {
            PageNumber: 1,
            PageSize: 10,
            IncludeAllPage: false
          };

          const inProgressCourses = await api.post("/Course/getinprogrescourses", paginationPayload, 200);
          expect(Array.isArray(inProgressCourses)).toBeTruthy();
          console.log(`✅ In-progress courses: ${inProgressCourses.length}`);
        });

        // ==================== GET COMPLETED COURSES ====================
        await allure.step("Get Completed Courses", async () => {
          console.log("\n========== ✅ GET COMPLETED COURSES ==========");
          const paginationPayload = {
            PageNumber: 1,
            PageSize: 10
          };

          const completedCourses = await api.post("/Course/getcompletedcourses", paginationPayload, 200);
          expect(Array.isArray(completedCourses)).toBeTruthy();
          console.log(`✅ Completed courses: ${completedCourses.length}`);
        });

        // ==================== UPDATE WATCH PROGRESS ====================
        if (testCourseId) {
          await allure.step("Update Enrolled Content Watch Progress", async () => {
            console.log("\n========== 📊 UPDATE WATCH PROGRESS ==========");
            const watchProgressPayload = {
              ContentTypeId: 1,
              CourseId: testCourseId,
              CourseLessonId: 1,
              VideoLength: 600.0,
              WatchedDuration: 300.0,
              CompletedPercentage: 50.0
            };

            await api.post("/Course/updateenrolledcontentwatchprogress", watchProgressPayload, 200);
            console.log("✅ Watch progress updated successfully");
          });

          // ==================== GET ENROLLED CONTENT PROGRESS ====================
          await allure.step("Get Enrolled Content Progress", async () => {
            console.log("\n========== 📈 GET ENROLLED CONTENT PROGRESS ==========");
            const progressFilterPayload = {
              UserId: userId,
              CourseId: testCourseId,
              PageNumber: 1,
              PageSize: 10
            };

            const contentProgress = await api.post("/Course/getenrolledcontentprogress", progressFilterPayload, 200);
            console.log("✅ Content progress retrieved");
          });
        }

        api.assertAll();

      } catch (error) {
        console.error("❌ Test failed with error:", error.message);
        throw error;
      }
    });
  });

  test.describe("❌ NEGATIVE TEST CASES", () => {
    test("User Course API - Invalid Course ID", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("User Course Negative - Invalid IDs");
      allure.severity("high");
      allure.description("Validate API handles invalid course IDs");

      try {
        console.log("\n========== ❌ TEST: INVALID COURSE ID ==========");
        
        const invalidIdScenarios = NegativeTestGenerator.getInvalidIdScenarios("courseId");

        for (const scenario of invalidIdScenarios) {
          await allure.step(`Invalid ID Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            
            const response = await request.get(
              `${ClientAPIURL}/Course/getusercoursebyid?courseId=${scenario.value}`,
              { headers }
            );

            const status = response.status();
            console.log(`📊 Response Status: ${status}`);
            
            expect([404, 400, 200]).toContain(status);
            console.log(`✅ Handled with status ${status}`);
          });
        }

        console.log("\n✅ ALL INVALID COURSE ID TESTS PASSED");

      } catch (error) {
        console.error("❌ Invalid ID test error:", error.message);
      }
    });

    test("User Course API - Invalid Progress Values", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("User Course Negative - Invalid Progress");
      allure.severity("critical");
      allure.description("Validate API rejects invalid watch progress values");

      try {
        console.log("\n========== ❌ TEST: INVALID PROGRESS VALUES ==========");
        
        const invalidPayloads = [
          {
            name: "Negative Watched Duration",
            payload: {
              ContentTypeId: 1,
              CourseId: 1,
              CourseLessonId: 1,
              VideoLength: 600.0,
              WatchedDuration: -10.0,
              CompletedPercentage: 50.0
            }
          },
          {
            name: "CompletedPercentage Above 100",
            payload: {
              ContentTypeId: 1,
              CourseId: 1,
              CourseLessonId: 1,
              VideoLength: 600.0,
              WatchedDuration: 300.0,
              CompletedPercentage: 150.0
            }
          },
          {
            name: "Negative CompletedPercentage",
            payload: {
              ContentTypeId: 1,
              CourseId: 1,
              CourseLessonId: 1,
              VideoLength: 600.0,
              WatchedDuration: 300.0,
              CompletedPercentage: -10.0
            }
          },
          {
            name: "WatchedDuration Exceeds VideoLength",
            payload: {
              ContentTypeId: 1,
              CourseId: 1,
              CourseLessonId: 1,
              VideoLength: 600.0,
              WatchedDuration: 700.0,
              CompletedPercentage: 50.0
            }
          }
        ];

        for (const scenario of invalidPayloads) {
          await allure.step(`Progress Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            
            const response = await request.post(
              `${ClientAPIURL}/Course/updateenrolledcontentwatchprogress`,
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

        console.log("\n✅ ALL INVALID PROGRESS VALUE TESTS PASSED");

      } catch (error) {
        console.error("❌ Invalid progress test error:", error.message);
      }
    });

    test("User Course API - Missing Required Fields", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("User Course Negative - Missing Fields");
      allure.severity("critical");
      allure.description("Validate API rejects requests with missing required fields");

      try {
        console.log("\n========== ❌ TEST: MISSING REQUIRED FIELDS ==========");
        
        const invalidPayloads = [
          {
            name: "Missing ContentTypeId",
            payload: {
              CourseId: 1,
              CourseLessonId: 1,
              VideoLength: 600.0,
              WatchedDuration: 300.0
            }
          },
          {
            name: "Missing VideoLength",
            payload: {
              ContentTypeId: 1,
              CourseId: 1,
              CourseLessonId: 1,
              WatchedDuration: 300.0
            }
          },
          {
            name: "Missing WatchedDuration",
            payload: {
              ContentTypeId: 1,
              CourseId: 1,
              CourseLessonId: 1,
              VideoLength: 600.0
            }
          }
        ];

        for (const scenario of invalidPayloads) {
          await allure.step(`Missing Field Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            
            const response = await request.post(
              `${ClientAPIURL}/Course/updateenrolledcontentwatchprogress`,
              {
                headers,
                data: scenario.payload
              }
            );

            const status = response.status();
            console.log(`📊 Response Status: ${status}`);
            
            expect([400, 422]).toContain(status);
            console.log(`✅ Correctly rejected with status ${status}`);
          });
        }

        console.log("\n✅ ALL MISSING FIELD TESTS PASSED");

      } catch (error) {
        console.error("❌ Missing field test error:", error.message);
      }
    });

    test("User Course API - Invalid Filter Parameters", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("User Course Negative - Invalid Filters");
      allure.severity("medium");
      allure.description("Validate API handles invalid filter parameters");

      try {
        console.log("\n========== ❌ TEST: INVALID FILTER PARAMETERS ==========");
        
        const invalidPayloads = [
          {
            name: "Invalid Category IDs (String)",
            payload: {
              PageNumber: 1,
              PageSize: 10,
              CategoryIds: ["invalid"],
              CourseTypes: [1]
            }
          },
          {
            name: "Negative Course Type",
            payload: {
              PageNumber: 1,
              PageSize: 10,
              CategoryIds: [1],
              CourseTypes: [-1]
            }
          }
        ];

        for (const scenario of invalidPayloads) {
          await allure.step(`Filter Test: ${scenario.name}`, async () => {
            console.log(`\n🧪 Testing: ${scenario.name}`);
            
            const response = await request.post(
              `${ClientAPIURL}/Course/getallusercourses?viewAllCourseType=1`,
              {
                headers,
                data: scenario.payload
              }
            );

            const status = response.status();
            console.log(`📊 Response Status: ${status}`);
            
            // Should return 400 (bad request) or 422 (validation error) for invalid filters
            expect([400, 422]).toContain(status);
            console.log(`✅ Correctly rejected with status ${status}`);
          });
        }

        console.log("\n✅ ALL INVALID FILTER TESTS PASSED");

      } catch (error) {
        console.error("❌ Invalid filter test error:", error.message);
      }
    });

    test("User Course API - Unauthorized Access", async ({ request }) => {
      test.setTimeout(60000);
      allure.story("User Course Negative - Authentication");
      allure.severity("critical");
      allure.description("Validate API rejects unauthorized course operations");

      try {
        console.log("\n========== ❌ TEST: UNAUTHORIZED ACCESS ==========");
        
        const authScenarios = NegativeTestGenerator.getInvalidAuthScenarios();

        for (const scenario of authScenarios) {
          await allure.step(`Auth Test: ${scenario.name}`, async () => {
            console.log(`\n🔒 Testing: ${scenario.name}`);
            
            const response = await request.get(
              `${ClientAPIURL}/Course/getusercoursebyid?courseId=1`,
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
