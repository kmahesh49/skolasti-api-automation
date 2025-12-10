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
    const createResponse = await api.create("/Course/createcourse", createPayload, 200);
    
    const courseId = createResponse?.Id;
    console.log("Created Course ID:", courseId);

    // ==================== GET ALL COURSES (Verify Created Course Exists) ====================
    const getAllCoursesPayload = PayloadGenerator.generateGetAllCoursesPayload(4);
    console.log("Fetching all courses with date range:", getAllCoursesPayload.StartDate, "to", getAllCoursesPayload.EndDate);
    
    const allCourses = await api.post("/Course/getallcourse?courseType=1", getAllCoursesPayload, 200);
    console.log("Total courses retrieved:", allCourses?.length || 0);
    
    api.softAssert(() => expect(Array.isArray(allCourses)).toBeTruthy(), 
      "Get all courses should return an array");
    
    // Verify the created course exists in the list
    if (courseId && allCourses) {
      const createdCourseExists = allCourses.some(course => course.Id === courseId);
      console.log(`Created course ID ${courseId} exists in all courses list:`, createdCourseExists);
      api.softAssert(() => expect(createdCourseExists).toBeTruthy(), 
        `Created course ${courseId} should exist in all courses list`);
    }

    // ==================== GET ====================
    const getResponse = await api.get(`/Course/getbyidcourse?id=${courseId}`, 200);
    console.log("Course details retrieved successfully");

    // ==================== UPDATE ====================
    const updatePayload = PayloadGenerator.generateCoursePayload({ Id: courseId });
    const updateResponse = await api.update("/Course/updatecourse", updatePayload, 201);
    console.log("Course updated successfully");

    // ==================== GET AFTER UPDATE ====================
    const getAfterUpdateResponse = await api.get(`/Course/getbyidcourse?id=${courseId}`, 200);
    console.log("Updated course details retrieved successfully");

    // ==================== DELETE ====================
    await api.delete(`/course/deletebyidcourse/${courseId}`, 204);
    console.log("Course deleted successfully");

    // ==================== VERIFY DELETION ====================
    await api.verifyDeleted(`/Course/getbyidcourse?id=${courseId}`);
    console.log("Course deletion verified");

    // ==================== ASSERT ALL ====================
    // Check all soft assertions - test will fail here if any assertion failed
    api.assertAll();
  });
});
