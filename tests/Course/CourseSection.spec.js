const { test, expect } = require("@playwright/test");
const { CoursebaseURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { PayloadGenerator } = require("../../utils/PayloadGenerator.js");
const { allure } = require("allure-playwright");

test.describe("Course Section API", () => {
  test.beforeEach(async () => {
    allure.epic("Skolasti API Automation");
    allure.feature("Course Section Management");
    allure.owner("QA Team");
    allure.tag("api", "course-section", "crud");
  });

  test("Course Section - Complete CRUD Operations", async ({ request }) => {
    test.setTimeout(120000);
    allure.story("Course Section CRUD");
    allure.severity("critical");
    allure.description("Complete validation of Course Section API including create, get all, update, and delete operations");
    
    const api = new ApiHelper(request, CoursebaseURL, headers);

    // ==================== CREATE COURSE (Prerequisite) ====================
    const createCoursePayload = PayloadGenerator.generateCoursePayload();
    const createCourseResponse = await api.create("/Course/createcourse", createCoursePayload, [200, 201]);
    const courseId = createCourseResponse.Id;
    console.log("Created Course ID:", courseId);

    // ==================== CREATE COURSE SECTION ====================
    const createSectionPayload = PayloadGenerator.generateCourseSectionPayload(courseId);
    const createSectionResponse = await api.create("/CourseSection/createcoursesection", createSectionPayload, [200, 201]);
    
    const courseSectionId = createSectionResponse.Id;
    console.log("Created Course Section ID:", courseSectionId);

    // ==================== GET ALL COURSE SECTIONS BY COURSE ID ====================
    const allCourseSections = await api.get(`/CourseSection/getallcoursesectionbycourseid?courseId=${courseId}`, 200);
    console.log("Total course sections retrieved:", allCourseSections.length);
    
    expect(Array.isArray(allCourseSections)).toBeTruthy();
    
    // Verify the created course section exists in the list
    const createdSectionExists = allCourseSections.some(section => section.Id === courseSectionId);
    console.log(`Created course section ID ${courseSectionId} exists in sections list:`, createdSectionExists);
    expect(createdSectionExists).toBeTruthy();

    // ==================== UPDATE COURSE SECTION ====================
    const updateSectionPayload = PayloadGenerator.generateCourseSectionPayload(courseId, { Id: courseSectionId });
    const updateSectionResponse = await api.update("/CourseSection/updatecoursesection", updateSectionPayload, [200, 201]);
    console.log("Course section updated successfully");

    // ==================== GET ALL SECTIONS AFTER UPDATE ====================
    const sectionsAfterUpdate = await api.get(`/CourseSection/getallcoursesectionbycourseid?courseId=${courseId}`, 200);
    console.log("Course sections after update retrieved successfully");

    // ==================== DELETE COURSE SECTION ====================
    await api.delete(`/CourseSection/deletebyidcoursesection/${courseSectionId}`, [200, 204]);
    console.log("Course section deleted successfully");

    // ==================== CLEANUP: DELETE COURSE ====================
    await api.delete(`/course/deletebyidcourse/${courseId}`, [200, 204]);
    console.log("Course deleted successfully");
  });
});
