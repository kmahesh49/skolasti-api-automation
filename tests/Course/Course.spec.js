const { test, expect } = require("@playwright/test");
const { CoursebaseURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { PayloadGenerator } = require("../../utils/PayloadGenerator.js");
const { allure } = require("allure-playwright");

test.describe("Course API", () => {
  test.beforeEach(async () => {
    allure.epic("Skolasti API Automation");
    allure.feature("Course Management");
    allure.owner("QA Team");
    allure.tag("api", "course", "crud");
  });

  test("Course - Complete CRUD Operations", async ({ request }) => {
    test.setTimeout(120000);
    allure.story("Course CRUD Operations");
    allure.severity("critical");
    allure.description("Complete validation of Course API including create, get, update, delete, and get all operations");
    
    const api = new ApiHelper(request, CoursebaseURL, headers);

    // ==================== VALIDATE COURSE LEVELS ====================
    console.log("Fetching course levels...");
    const courseLevels = await api.get("/Course/courseslevels", 200);
    const expectedLevels = PayloadGenerator.getExpectedCourseLevels();
    api.validateArrayData(courseLevels, expectedLevels, "Level");

    // ==================== VALIDATE COURSE TYPES ====================
    console.log("Fetching course types...");
    const courseTypes = await api.get("/Course/coursestypes", 200);
    const expectedTypes = PayloadGenerator.getExpectedCourseTypes();
    api.validateArrayData(courseTypes, expectedTypes, "Type");

    // ==================== CREATE ====================
    const createPayload = PayloadGenerator.generateCoursePayload();
    const createResponse = await api.create("/Course/createcourse", createPayload, [200, 201]);
    
    const courseId = createResponse?.Id;
    console.log("=".repeat(50));
    console.log("CREATE RESPONSE DETAILS:");
    console.log("Full Response:", JSON.stringify(createResponse, null, 2));
    console.log("Extracted Course ID:", courseId);
    console.log("=".repeat(50));
    
    // Add small delay to allow API to fully persist/index the course
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ==================== GET ALL COURSES (Verify Created Course Exists) ====================
    const getAllCoursesPayload = PayloadGenerator.generateGetAllCoursesPayload(4);
    console.log("Fetching all courses with date range:", getAllCoursesPayload.StartDate, "to", getAllCoursesPayload.EndDate);
    
    const allCourses = await api.post("/Course/getallcourse?courseType=1", getAllCoursesPayload, 200);
    console.log("Total courses retrieved:", allCourses?.length || 0);
    
    api.softAssert(() => expect(Array.isArray(allCourses)).toBeTruthy(), 
      "Get all courses should return an array");
    
    // Verify the created course exists in the list and check if ID matches
    if (courseId && allCourses) {
      const createdCourse = allCourses.find(course => course.Id === courseId);
      const createdCourseExists = createdCourse !== undefined;
      console.log(`Created course ID ${courseId} exists in all courses list:`, createdCourseExists);
      
      if (!createdCourseExists && allCourses.length > 0) {
        // Check if there's a course with a different ID that was just created
        const mostRecentCourse = allCourses[0]; // Assuming sorted by creation date
        console.warn(`WARNING: Course ID mismatch! Expected ID ${courseId}, but most recent course has ID ${mostRecentCourse.Id}`);
        console.log("Most recent course details:", JSON.stringify(mostRecentCourse, null, 2));
      }
      
      api.softAssert(() => expect(createdCourseExists).toBeTruthy(), 
        `Created course ${courseId} should exist in all courses list`);
    }

    // ==================== GET ====================
    const getResponse = await api.get(`/Course/getbyidcourse?id=${courseId}`, 200);
    console.log("Course details retrieved successfully");

    // ==================== UPDATE ====================
    const updatePayload = PayloadGenerator.generateCoursePayload({ Id: courseId });
    const updateResponse = await api.update("/Course/updatecourse", updatePayload, [200, 201]);
    console.log("Course updated successfully");
    
    // Add small delay to allow API to fully persist/index the updates
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ==================== GET AFTER UPDATE ====================
    const getAfterUpdateResponse = await api.get(`/Course/getbyidcourse?id=${courseId}`, 200);
    console.log("Updated course details retrieved successfully");

    // ==================== DELETE ====================
    await api.delete(`/course/deletebyidcourse/${courseId}`, [200, 204]);
    console.log("Course deleted successfully");

    // ==================== VERIFY DELETION ====================
    await api.verifyDeleted(`/Course/getbyidcourse?id=${courseId}`);
    console.log("Course deletion verified");

    // ==================== ASSERT ALL ====================
    // Check all soft assertions - test will fail here if any assertion failed
    api.assertAll();
  });
});
