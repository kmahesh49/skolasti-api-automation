const { test, expect } = require("@playwright/test");
const { CoursebaseURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { PayloadGenerator } = require("../../utils/PayloadGenerator.js");
const { allure } = require("allure-playwright");

test.describe("Course Skills API", () => {
  test.beforeEach(async () => {
    allure.epic("Skolasti API Automation");
    allure.feature("Course Skills Management");
    allure.owner("QA Team");
    allure.tag("api", "course-skills", "crud");
  });

  test("Course Skills - Complete CRUD Operations", async ({ request }) => {
    test.setTimeout(120000);
    allure.story("Course Skills CRUD");
    allure.severity("critical");
    allure.description("Complete validation of Course Skills API including create, get all, update, and delete operations");
    
    const api = new ApiHelper(request, CoursebaseURL, headers);

    // ==================== CREATE COURSE (Prerequisite) ====================
    const createCoursePayload = PayloadGenerator.generateCoursePayload();
    const createCourseResponse = await api.create("/Course/createcourse", createCoursePayload, 200);
    const courseId = createCourseResponse.Id;
    console.log("Created Course ID:", courseId);

    // ==================== CREATE COURSE SKILLS ====================
    const createSkillsPayload = PayloadGenerator.generateCourseSkillsPayload(courseId, 4);
    const createSkillsResponse = await api.create("/CourseSkill/createcourseskill", createSkillsPayload, 200);
    
    const skillIds = createSkillsResponse.map(skill => skill.Id);
    console.log("Created Course Skill IDs:", skillIds);

    // ==================== GET ALL COURSE SKILLS BY COURSE ID ====================
    const allCourseSkills = await api.get(`/CourseSkill/getallcourseskillbycourseid?courseId=${courseId}`, 200);
    console.log("Total course skills retrieved:", allCourseSkills.length);
    
    expect(Array.isArray(allCourseSkills)).toBeTruthy();
    expect(allCourseSkills.length).toBe(4);
    
    // Verify all created skill IDs exist in the response
    skillIds.forEach(skillId => {
      const skillExists = allCourseSkills.some(skill => skill.Id === skillId);
      console.log(`Created skill ID ${skillId} exists in skills list:`, skillExists);
      expect(skillExists).toBeTruthy();
    });

    // ==================== UPDATE COURSE SKILLS ====================
    const updateSkillsPayload = PayloadGenerator.generateCourseSkillsUpdatePayload(courseId, 4);
    await api.update("/CourseSkill/updatecourseskill", updateSkillsPayload, 201);
    console.log("Course skills updated successfully");

    // ==================== GET ALL COURSE SKILLS AFTER UPDATE ====================
    const skillsAfterUpdate = await api.get(`/CourseSkill/getallcourseskillbycourseid?courseId=${courseId}`, 200);
    console.log("Course skills after update retrieved successfully");
    
    // Verify skill IDs still exist after update
    skillIds.forEach(skillId => {
      const skillExists = skillsAfterUpdate.some(skill => skill.Id === skillId);
      expect(skillExists).toBeTruthy();
    });

    // ==================== DELETE COURSE SKILLS ====================
    await api.delete(`/CourseSkill/deletebyidcourseskill/${courseId}`, 204);
    console.log("Course skills deleted successfully");

    // ==================== CLEANUP: DELETE COURSE ====================
    await api.delete(`/course/deletebyidcourse/${courseId}`, 204);
    console.log("Course deleted successfully");
  });
});
