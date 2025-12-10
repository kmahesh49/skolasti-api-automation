const { test, expect } = require("@playwright/test");
const { CoursebaseURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { PayloadGenerator } = require("../../utils/PayloadGenerator.js");
const { allure } = require("allure-playwright");

test.describe("Course Lesson API", () => {
  test.beforeEach(async () => {
    allure.epic("Skolasti API Automation");
    allure.feature("Course Lesson Management");
    allure.owner("QA Team");
    allure.tag("api", "course-lesson", "crud");
  });

  test("Course Lesson (Audio) - Complete CRUD Operations", async ({ request }) => {
    test.setTimeout(120000);
    allure.story("Course Lesson with Audio CRUD");
    allure.severity("critical");
    allure.description("Complete validation of Course Lesson API with Audio content");
    
    const api = new ApiHelper(request, CoursebaseURL, headers);

    // ==================== CREATE PREREQUISITES ====================
    const createCoursePayload = PayloadGenerator.generateCoursePayload();
    const createCourseResponse = await api.create("/Course/createcourse", createCoursePayload, 200);
    const courseId = createCourseResponse.Id;
    console.log("Created Course ID:", courseId);

    const createSectionPayload = PayloadGenerator.generateCourseSectionPayload(courseId);
    const createSectionResponse = await api.create("/CourseSection/createcoursesection", createSectionPayload, 200);
    const courseSectionId = createSectionResponse.Id;
    console.log("Created Course Section ID:", courseSectionId);

    const createAudioPayload = PayloadGenerator.generateAudioPayload();
    const createAudioResponse = await api.create("/Audio/createaudio", createAudioPayload, 200);
    const audioId = createAudioResponse[0].Id;
    const audioTitle = createAudioPayload[0].Title;
    console.log("Created Audio ID:", audioId);

    // ==================== CREATE COURSE LESSON (AUDIO) ====================
    const createLessonPayload = PayloadGenerator.generateCourseLessonPayload(
      courseSectionId,
      audioId,
      2, // LearningItemTypeId: 2 = Audio
      audioTitle
    );
    const createLessonResponse = await api.create("/CourseLession/createcourselession", createLessonPayload, 200);
    
    const lessonId = createLessonResponse[0].Id;
    console.log("Created Course Lesson ID:", lessonId);

    // ==================== GET COURSE LESSON ====================
    const getLessonResponse = await api.get(`/CourseLession/getbyidcourselession?id=${lessonId}`, 200);
    console.log("Course lesson details retrieved successfully");
    expect(getLessonResponse.Id).toBe(lessonId);
    expect(getLessonResponse.Title).toBe(audioTitle);
    expect(getLessonResponse.CourseSectionId).toBe(courseSectionId);
    expect(getLessonResponse.LearningItemId).toBe(audioId);
    expect(getLessonResponse.LearningItemTypeId).toBe(2);

    // ==================== GET ALL COURSE LESSONS ====================
    const allLessons = await api.get("/CourseLession/getallcourselession", 200);
    console.log("Total course lessons retrieved:", allLessons.length);
    expect(Array.isArray(allLessons)).toBeTruthy();
    
    const createdLessonExists = allLessons.some(lesson => 
      lesson.Id === lessonId && 
      lesson.CourseSectionId === courseSectionId && 
      lesson.LearningItemId === audioId
    );
    console.log(`Created lesson ID ${lessonId} exists and matched with section ${courseSectionId} and audio ${audioId}`);
    expect(createdLessonExists).toBeTruthy();

    // ==================== UPDATE COURSE LESSON ====================
    const updateLessonPayload = PayloadGenerator.generateCourseLessonUpdatePayload(
      lessonId,
      audioId,
      2,
      audioTitle
    );
    const updateLessonResponse = await api.update("/CourseLession/updatecourselession", updateLessonPayload, 201);
    console.log("Course lesson updated successfully");

    // ==================== DELETE COURSE LESSON ====================
    await api.delete(`/CourseLession/deletebyidcourselession/${lessonId}`, 204);
    console.log("Course lesson deleted successfully");

    // ==================== VERIFY LESSON DELETION ====================
    await api.verifyDeleted(`/CourseLession/getbyidcourselession?id=${lessonId}`);
    console.log("Course lesson deletion verified");

    // ==================== CLEANUP ====================
    await api.delete(`/Audio/deletebyidaudio/${audioId}`, 204);
    await api.delete(`/CourseSection/deletebyidcoursesection/${courseSectionId}`, 204);
    await api.delete(`/course/deletebyidcourse/${courseId}`, 204);
    console.log("Cleanup completed");
  });

  test("Course Lesson (Video) - Complete CRUD Operations", async ({ request }) => {
    test.setTimeout(120000);
    allure.story("Course Lesson with Video CRUD");
    allure.severity("critical");
    allure.description("Complete validation of Course Lesson API with Video content");
    
    const api = new ApiHelper(request, CoursebaseURL, headers);

    // ==================== CREATE PREREQUISITES ====================
    const createCoursePayload = PayloadGenerator.generateCoursePayload();
    const createCourseResponse = await api.create("/Course/createcourse", createCoursePayload, 200);
    const courseId = createCourseResponse.Id;
    console.log("Created Course ID:", courseId);

    const createSectionPayload = PayloadGenerator.generateCourseSectionPayload(courseId);
    const createSectionResponse = await api.create("/CourseSection/createcoursesection", createSectionPayload, 200);
    const courseSectionId = createSectionResponse.Id;
    console.log("Created Course Section ID:", courseSectionId);

    const createVideoPayload = PayloadGenerator.generateVideoPayload();
    const createVideoResponse = await api.create("/Video/create", createVideoPayload, 200);
    const videoId = createVideoResponse[0].VideoId;
    const videoFileName = createVideoPayload.Videos[0].FileName;
    console.log("Created Video ID:", videoId);

    // ==================== CREATE COURSE LESSON (VIDEO) ====================
    const createVideoLessonPayload = PayloadGenerator.generateCourseLessonPayload(
      courseSectionId,
      videoId,
      1, // LearningItemTypeId: 1 = Video
      videoFileName
    );
    const createVideoLessonResponse = await api.create("/CourseLession/createcourselession", createVideoLessonPayload, 200);
    
    const videoLessonId = createVideoLessonResponse[0].Id;
    console.log("Created Video Lesson ID:", videoLessonId);

    // ==================== GET COURSE LESSON (VIDEO) ====================
    const getVideoLessonResponse = await api.get(`/CourseLession/getbyidcourselession?id=${videoLessonId}`, 200);
    console.log("Video lesson details retrieved successfully");
    expect(getVideoLessonResponse.Id).toBe(videoLessonId);
    expect(getVideoLessonResponse.Title).toBe(videoFileName);
    expect(getVideoLessonResponse.CourseSectionId).toBe(courseSectionId);
    expect(getVideoLessonResponse.LearningItemId).toBe(videoId);
    expect(getVideoLessonResponse.LearningItemTypeId).toBe(1);

    // ==================== GET ALL COURSE LESSONS (VIDEO) ====================
    const allVideoLessons = await api.get("/CourseLession/getallcourselession", 200);
    console.log("Total course lessons retrieved for video:", allVideoLessons.length);
    
    const createdVideoLessonExists = allVideoLessons.some(lesson => 
      lesson.Id === videoLessonId && 
      lesson.CourseSectionId === courseSectionId && 
      lesson.LearningItemId === videoId
    );
    console.log(`Created video lesson ID ${videoLessonId} exists and matched with section ${courseSectionId} and video ${videoId}`);
    expect(createdVideoLessonExists).toBeTruthy();

    // ==================== UPDATE COURSE LESSON (VIDEO) ====================
    const updateVideoLessonPayload = PayloadGenerator.generateCourseLessonUpdatePayload(
      videoLessonId,
      videoId,
      1,
      videoFileName
    );
    await api.update("/CourseLession/updatecourselession", updateVideoLessonPayload, 201);
    console.log("Video lesson updated successfully");

    // ==================== DELETE COURSE LESSON (VIDEO) ====================
    await api.delete(`/CourseLession/deletebyidcourselession/${videoLessonId}`, 204);
    console.log("Video lesson deleted successfully");

    // ==================== VERIFY VIDEO LESSON DELETION ====================
    await api.verifyDeleted(`/CourseLession/getbyidcourselession?id=${videoLessonId}`);
    console.log("Video lesson deletion verified");

    // ==================== CLEANUP ====================
    await api.delete(`/CourseSection/deletebyidcoursesection/${courseSectionId}`, 204);
    await api.delete(`/course/deletebyidcourse/${courseId}`, 204);
    console.log("Cleanup completed");
  });

  test("Course Lesson (Document) - Complete CRUD Operations", async ({ request }) => {
    test.setTimeout(120000);
    allure.story("Course Lesson with Document CRUD");
    allure.severity("critical");
    allure.description("Complete validation of Course Lesson API with Document content");
    
    const api = new ApiHelper(request, CoursebaseURL, headers);

    // ==================== CREATE PREREQUISITES ====================
    const createCoursePayload = PayloadGenerator.generateCoursePayload();
    const createCourseResponse = await api.create("/Course/createcourse", createCoursePayload, 200);
    const courseId = createCourseResponse.Id;
    console.log("Created Course ID:", courseId);

    const createSectionPayload = PayloadGenerator.generateCourseSectionPayload(courseId);
    const createSectionResponse = await api.create("/CourseSection/createcoursesection", createSectionPayload, 200);
    const courseSectionId = createSectionResponse.Id;
    console.log("Created Course Section ID:", courseSectionId);

    const createDocumentPayload = PayloadGenerator.generateDocumentPayload();
    const createDocumentResponse = await api.create("/ContentDocument/createcontentdocument", createDocumentPayload, 200);
    const documentId = createDocumentResponse[0].Id;
    const documentTitle = createDocumentPayload[0].Title;
    console.log("Created Document ID:", documentId);

    // ==================== CREATE COURSE LESSON (DOCUMENT) ====================
    const createDocLessonPayload = PayloadGenerator.generateCourseLessonPayload(
      courseSectionId,
      documentId,
      3, // LearningItemTypeId: 3 = Document
      documentTitle
    );
    const createDocLessonResponse = await api.create("/CourseLession/createcourselession", createDocLessonPayload, 200);
    
    const docLessonId = createDocLessonResponse[0].Id;
    console.log("Created Document Lesson ID:", docLessonId);

    // ==================== GET COURSE LESSON (DOCUMENT) ====================
    const getDocLessonResponse = await api.get(`/CourseLession/getbyidcourselession?id=${docLessonId}`, 200);
    console.log("Document lesson details retrieved successfully");
    expect(getDocLessonResponse.Id).toBe(docLessonId);
    expect(getDocLessonResponse.Title).toBe(documentTitle);
    expect(getDocLessonResponse.CourseSectionId).toBe(courseSectionId);
    expect(getDocLessonResponse.LearningItemId).toBe(documentId);
    expect(getDocLessonResponse.LearningItemTypeId).toBe(3);

    // ==================== GET ALL COURSE LESSONS (DOCUMENT) ====================
    const allDocLessons = await api.get("/CourseLession/getallcourselession", 200);
    console.log("Total course lessons retrieved for document:", allDocLessons.length);
    
    const createdDocLessonExists = allDocLessons.some(lesson => 
      lesson.Id === docLessonId && 
      lesson.CourseSectionId === courseSectionId && 
      lesson.LearningItemId === documentId
    );
    console.log(`Created document lesson ID ${docLessonId} exists and matched with section ${courseSectionId} and document ${documentId}`);
    expect(createdDocLessonExists).toBeTruthy();

    // ==================== UPDATE COURSE LESSON (DOCUMENT) ====================
    const updateDocLessonPayload = PayloadGenerator.generateCourseLessonUpdatePayload(
      docLessonId,
      documentId,
      3,
      documentTitle
    );
    await api.update("/CourseLession/updatecourselession", updateDocLessonPayload, 201);
    console.log("Document lesson updated successfully");

    // ==================== DELETE COURSE LESSON (DOCUMENT) ====================
    await api.delete(`/CourseLession/deletebyidcourselession/${docLessonId}`, 204);
    console.log("Document lesson deleted successfully");

    // ==================== VERIFY DOCUMENT LESSON DELETION ====================
    await api.verifyDeleted(`/CourseLession/getbyidcourselession?id=${docLessonId}`);
    console.log("Document lesson deletion verified");

    // ==================== CLEANUP ====================
    await api.delete(`/ContentDocument/deletebyidcontentdocument/${documentId}`, 204);
    await api.delete(`/CourseSection/deletebyidcoursesection/${courseSectionId}`, 204);
    await api.delete(`/course/deletebyidcourse/${courseId}`, 204);
    console.log("Cleanup completed");
  });
});
