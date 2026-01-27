const { test, expect } = require('@playwright/test');
const config = require('../../config/config');
const payloads = require('../../payloads/Course-API/CourseAPIPayloads');

const baseURL = config.CourseAPIURL;

// ============================================================================
// COURSE MODULE - CRUD FLOW
// ============================================================================
test.describe('Course API - Course Module CRUD Flow', () => {
  let createdCourseId;

  test.describe('Lookup Endpoints', () => {
    test('GET /api/Course/coursecontenttypes', async ({ request }) => {
      const response = await request.get(`${baseURL}/Course/coursecontenttypes`, {
        headers: config.courseHeaders
      });
      expect(response.status()).toBe(200);
    });

    test('GET /api/Course/coursestypes', async ({ request }) => {
      const response = await request.get(`${baseURL}/Course/coursestypes`, {
        headers: config.courseHeaders
      });
      expect(response.status()).toBe(200);
    });

    test('GET /api/Course/courseslevels', async ({ request }) => {
      const response = await request.get(`${baseURL}/Course/courseslevels`, {
        headers: config.courseHeaders
      });
      expect(response.status()).toBe(200);
    });
  });

  test('Step 1: CREATE - POST /api/Course/createcourse', async ({ request }) => {
    const response = await request.post(`${baseURL}/Course/createcourse`, {
      headers: config.courseHeaders,
      data: payloads.createCourse
    });
    expect([200, 201]).toContain(response.status());
    
    if (response.status() === 200 || response.status() === 201) {
      const body = await response.json();
      createdCourseId = body.Id || body.id;
      console.log(`Created Course ID: ${createdCourseId}`);
    }
  });

  test('Step 2: GET - GET /api/Course/getbyidcourse', async ({ request }) => {
    test.skip(!createdCourseId, 'Skipping: No course ID from create');
    
    const response = await request.get(`${baseURL}/Course/getbyidcourse?id=${createdCourseId}`, {
      headers: config.courseHeaders
    });
    expect(response.status()).toBe(200);
  });

  test('Step 3: UPDATE - PUT /api/Course/updatecourse', async ({ request }) => {
    test.skip(!createdCourseId, 'Skipping: No course ID from create');
    
    const updatePayload = { ...payloads.updateCourse, Id: createdCourseId };
    const response = await request.put(`${baseURL}/Course/updatecourse`, {
      headers: config.courseHeaders,
      data: updatePayload
    });
    expect([200, 201]).toContain(response.status());
  });

  test('Step 4: GET - Verify update - GET /api/Course/getbyidcourse', async ({ request }) => {
    test.skip(!createdCourseId, 'Skipping: No course ID from create');
    
    const response = await request.get(`${baseURL}/Course/getbyidcourse?id=${createdCourseId}`, {
      headers: config.courseHeaders
    });
    expect(response.status()).toBe(200);
  });

  test('Step 5: DELETE - DELETE /api/Course/deletebyidcourse/{id}', async ({ request }) => {
    test.skip(!createdCourseId, 'Skipping: No course ID from create');
    
    const response = await request.delete(`${baseURL}/Course/deletebyidcourse/${createdCourseId}`, {
      headers: config.courseHeaders
    });
    expect([200, 204]).toContain(response.status());
  });

  test('Step 6: GET - Verify deletion - GET /api/Course/getbyidcourse (expect 204/404)', async ({ request }) => {
    test.skip(!createdCourseId, 'Skipping: No course ID from create');
    
    const response = await request.get(`${baseURL}/Course/getbyidcourse?id=${createdCourseId}`, {
      headers: config.courseHeaders
    });
    expect([204, 404]).toContain(response.status());
  });
});

// ============================================================================
// AUDIO MODULE - CRUD FLOW
// ============================================================================
test.describe('Course API - Audio Module CRUD Flow', () => {
  let createdAudioId;

  test('Step 1: CREATE - POST /api/Audio/createaudio', async ({ request }) => {
    const response = await request.post(`${baseURL}/Audio/createaudio`, {
      headers: config.courseHeaders,
      data: payloads.createAudio
    });
    expect([200, 201]).toContain(response.status());
    
    if (response.status() === 200 || response.status() === 201) {
      const body = await response.json();
      createdAudioId = Array.isArray(body) ? body[0]?.Id : body?.Id;
      console.log(`Created Audio ID: ${createdAudioId}`);
    }
  });

  test('Step 2: GET - GET /api/Audio/getbyaudioid', async ({ request }) => {
    test.skip(!createdAudioId, 'Skipping: No audio ID from create');
    
    const response = await request.get(`${baseURL}/Audio/getbyaudioid?id=${createdAudioId}`, {
      headers: config.courseHeaders
    });
    expect(response.status()).toBe(200);
  });

  test('Step 3: UPDATE - PUT /api/Audio/updateaudio', async ({ request }) => {
    test.skip(!createdAudioId, 'Skipping: No audio ID from create');
    
    const updatePayload = { ...payloads.updateAudio, Id: createdAudioId };
    const audioType = 1;
    const response = await request.put(`${baseURL}/Audio/updateaudio?audioType=${audioType}`, {
      headers: config.courseHeaders,
      data: updatePayload
    });
    expect([200, 201]).toContain(response.status());
  });

  test('Step 4: GET - Verify update - GET /api/Audio/getbyaudioid', async ({ request }) => {
    test.skip(!createdAudioId, 'Skipping: No audio ID from create');
    
    const response = await request.get(`${baseURL}/Audio/getbyaudioid?id=${createdAudioId}`, {
      headers: config.courseHeaders
    });
    expect(response.status()).toBe(200);
  });

  test('Step 5: DELETE - DELETE /api/Audio/deletebyidaudio/{id}', async ({ request }) => {
    test.skip(!createdAudioId, 'Skipping: No audio ID from create');
    
    const response = await request.delete(`${baseURL}/Audio/deletebyidaudio/${createdAudioId}`, {
      headers: config.courseHeaders
    });
    expect([200, 204]).toContain(response.status());
  });

  test('Step 6: GET - Verify deletion - GET /api/Audio/getbyaudioid (expect 204/404)', async ({ request }) => {
    test.skip(!createdAudioId, 'Skipping: No audio ID from create');
    
    const response = await request.get(`${baseURL}/Audio/getbyaudioid?id=${createdAudioId}`, {
      headers: config.courseHeaders
    });
    expect([204, 404]).toContain(response.status());
  });
});

// ============================================================================
// CONTENT DOCUMENT MODULE - CRUD FLOW
// ============================================================================
test.describe('Course API - ContentDocument Module CRUD Flow', () => {
  let createdDocumentId;

  test('Step 1: CREATE - POST /api/ContentDocument/createcontentdocument', async ({ request }) => {
    const response = await request.post(`${baseURL}/ContentDocument/createcontentdocument`, {
      headers: config.courseHeaders,
      data: payloads.createContentDocument
    });
    expect([200, 201]).toContain(response.status());
    
    if (response.status() === 200 || response.status() === 201) {
      const body = await response.json();
      createdDocumentId = Array.isArray(body) ? body[0]?.Id : body?.Id;
      console.log(`Created ContentDocument ID: ${createdDocumentId}`);
    }
  });

  test('Step 2: GET - GET /api/ContentDocument/getbyidcontentdocument', async ({ request }) => {
    test.skip(!createdDocumentId, 'Skipping: No document ID from create');
    
    const response = await request.get(`${baseURL}/ContentDocument/getbyidcontentdocument?id=${createdDocumentId}`, {
      headers: config.courseHeaders
    });
    expect(response.status()).toBe(200);
  });

  test('Step 3: UPDATE - PUT /api/ContentDocument/updatecontentdocument', async ({ request }) => {
    test.skip(!createdDocumentId, 'Skipping: No document ID from create');
    
    const updatePayload = payloads.updateContentDocument.map(doc => ({
      ...doc,
      Id: createdDocumentId
    }));
    const documentType = 1;
    const response = await request.put(`${baseURL}/ContentDocument/updatecontentdocument?documentType=${documentType}`, {
      headers: config.courseHeaders,
      data: updatePayload
    });
    expect([200, 201]).toContain(response.status());
  });

  test('Step 4: GET - Verify update - GET /api/ContentDocument/getbyidcontentdocument', async ({ request }) => {
    test.skip(!createdDocumentId, 'Skipping: No document ID from create');
    
    const response = await request.get(`${baseURL}/ContentDocument/getbyidcontentdocument?id=${createdDocumentId}`, {
      headers: config.courseHeaders
    });
    expect(response.status()).toBe(200);
  });

  test('Step 5: DELETE - DELETE /api/ContentDocument/deletebyidcontentdocument/{id}', async ({ request }) => {
    test.skip(!createdDocumentId, 'Skipping: No document ID from create');
    
    const response = await request.delete(`${baseURL}/ContentDocument/deletebyidcontentdocument/${createdDocumentId}`, {
      headers: config.courseHeaders
    });
    expect([200, 204]).toContain(response.status());
  });

  test('Step 6: GET - Verify deletion - GET /api/ContentDocument/getbyidcontentdocument (expect 204/404)', async ({ request }) => {
    test.skip(!createdDocumentId, 'Skipping: No document ID from create');
    
    const response = await request.get(`${baseURL}/ContentDocument/getbyidcontentdocument?id=${createdDocumentId}`, {
      headers: config.courseHeaders
    });
    expect([204, 404]).toContain(response.status());
  });
});

// ============================================================================
// COURSE SECTION MODULE - CRUD FLOW (Requires Course ID)
// ============================================================================
test.describe('Course API - CourseSection Module CRUD Flow', () => {
  let parentCourseId;
  let createdSectionId;

  test('Setup: Create parent course for section tests', async ({ request }) => {
    const response = await request.post(`${baseURL}/Course/createcourse`, {
      headers: config.courseHeaders,
      data: payloads.createCourse
    });
    
    if (response.status() === 200 || response.status() === 201) {
      const body = await response.json();
      parentCourseId = body.Id || body.id;
      console.log(`Created parent Course ID for sections: ${parentCourseId}`);
    }
  });

  test('Step 1: CREATE - POST /api/CourseSection/createcoursesection', async ({ request }) => {
    test.skip(!parentCourseId, 'Skipping: No parent course ID');
    
    const createPayload = { ...payloads.createCourseSection, CourseId: parentCourseId };
    const response = await request.post(`${baseURL}/CourseSection/createcoursesection`, {
      headers: config.courseHeaders,
      data: createPayload
    });
    expect([200, 201]).toContain(response.status());
    
    if (response.status() === 200 || response.status() === 201) {
      const body = await response.json();
      createdSectionId = body.Id || body.id;
      console.log(`Created CourseSection ID: ${createdSectionId}`);
    }
  });

  test('Step 2: GET - GET /api/CourseSection/getallcoursesectionbycourseid', async ({ request }) => {
    test.skip(!parentCourseId, 'Skipping: No parent course ID');
    
    const response = await request.get(`${baseURL}/CourseSection/getallcoursesectionbycourseid?courseId=${parentCourseId}`, {
      headers: config.courseHeaders
    });
    expect(response.status()).toBe(200);
  });

  test('Step 3: UPDATE - PUT /api/CourseSection/updatecoursesection', async ({ request }) => {
    test.skip(!createdSectionId || !parentCourseId, 'Skipping: No section or course ID');
    
    const updatePayload = { ...payloads.updateCourseSection, Id: createdSectionId, CourseId: parentCourseId };
    const response = await request.put(`${baseURL}/CourseSection/updatecoursesection`, {
      headers: config.courseHeaders,
      data: updatePayload
    });
    expect([200, 201]).toContain(response.status());
  });

  test('Step 4: GET - Verify update - GET /api/CourseSection/getallcoursesectionbycourseid', async ({ request }) => {
    test.skip(!parentCourseId, 'Skipping: No parent course ID');
    
    const response = await request.get(`${baseURL}/CourseSection/getallcoursesectionbycourseid?courseId=${parentCourseId}`, {
      headers: config.courseHeaders
    });
    expect(response.status()).toBe(200);
  });

  test('Step 5: DELETE - DELETE /api/CourseSection/deletebyidcoursesection/{id}', async ({ request }) => {
    test.skip(!createdSectionId, 'Skipping: No section ID from create');
    
    const response = await request.delete(`${baseURL}/CourseSection/deletebyidcoursesection/${createdSectionId}`, {
      headers: config.courseHeaders
    });
    expect([200, 204]).toContain(response.status());
  });

  test('Step 6: GET - Verify deletion - GET /api/CourseSection/getallcoursesectionbycourseid', async ({ request }) => {
    test.skip(!parentCourseId, 'Skipping: No parent course ID');
    
    const response = await request.get(`${baseURL}/CourseSection/getallcoursesectionbycourseid?courseId=${parentCourseId}`, {
      headers: config.courseHeaders
    });
    expect([204, 404]).toContain(response.status());
  });
});

// ============================================================================
// COURSE LESSION MODULE - CRUD FLOW (Requires Section ID)
// ============================================================================
test.describe('Course API - CourseLession Module CRUD Flow', () => {
  let parentCourseId;
  let parentSectionId;
  let createdLessionId;

  test('Setup: Create parent course and section for lession tests', async ({ request }) => {
    // Create course
    const courseResponse = await request.post(`${baseURL}/Course/createcourse`, {
      headers: config.courseHeaders,
      data: payloads.createCourse
    });
    
    if (courseResponse.status() === 200 || courseResponse.status() === 201) {
      const courseBody = await courseResponse.json();
      parentCourseId = courseBody.Id || courseBody.id;
      
      // Create section
      const sectionPayload = { ...payloads.createCourseSection, CourseId: parentCourseId };
      const sectionResponse = await request.post(`${baseURL}/CourseSection/createcoursesection`, {
        headers: config.courseHeaders,
        data: sectionPayload
      });
      
      if (sectionResponse.status() === 200 || sectionResponse.status() === 201) {
        const sectionBody = await sectionResponse.json();
        parentSectionId = sectionBody.Id || sectionBody.id;
        console.log(`Setup complete - Course ID: ${parentCourseId}, Section ID: ${parentSectionId}`);
      }
    }
  });

  test('Step 1: CREATE - POST /api/CourseLession/createcourselession', async ({ request }) => {
    test.skip(!parentSectionId, 'Skipping: No parent section ID');
    
    const createPayload = payloads.createCourseLession.map(lesson => ({
      ...lesson,
      CourseSectionId: parentSectionId
    }));
    const response = await request.post(`${baseURL}/CourseLession/createcourselession`, {
      headers: config.courseHeaders,
      data: createPayload
    });
    expect([200, 201]).toContain(response.status());
    
    if (response.status() === 200 || response.status() === 201) {
      const body = await response.json();
      createdLessionId = Array.isArray(body) ? body[0]?.Id : body?.Id;
      console.log(`Created CourseLession ID: ${createdLessionId}`);
    }
  });

  test('Step 2: GET - GET /api/CourseLession/getbyidcourselession', async ({ request }) => {
    test.skip(!createdLessionId, 'Skipping: No lession ID from create');
    
    const response = await request.get(`${baseURL}/CourseLession/getbyidcourselession?id=${createdLessionId}`, {
      headers: config.courseHeaders
    });
    expect(response.status()).toBe(200);
  });

  test('Step 3: UPDATE - PUT /api/CourseLession/updatecourselession', async ({ request }) => {
    test.skip(!createdLessionId || !parentSectionId, 'Skipping: No lession or section ID');
    
    const updatePayload = { ...payloads.updateCourseLession, Id: createdLessionId, CourseSectionId: parentSectionId };
    const response = await request.put(`${baseURL}/CourseLession/updatecourselession`, {
      headers: config.courseHeaders,
      data: updatePayload
    });
    expect([200, 201]).toContain(response.status());
  });

  test('Step 4: GET - Verify update - GET /api/CourseLession/getbyidcourselession', async ({ request }) => {
    test.skip(!createdLessionId, 'Skipping: No lession ID from create');
    
    const response = await request.get(`${baseURL}/CourseLession/getbyidcourselession?id=${createdLessionId}`, {
      headers: config.courseHeaders
    });
    expect(response.status()).toBe(200);
  });

  test('Step 5: DELETE - DELETE /api/CourseLession/deletebyidcourselession/{id}', async ({ request }) => {
    test.skip(!createdLessionId, 'Skipping: No lession ID from create');
    
    const response = await request.delete(`${baseURL}/CourseLession/deletebyidcourselession/${createdLessionId}`, {
      headers: config.courseHeaders
    });
    expect([200, 204]).toContain(response.status());
  });

  test('Step 6: GET - Verify deletion - GET /api/CourseLession/getbyidcourselession (expect 204/404)', async ({ request }) => {
    test.skip(!createdLessionId, 'Skipping: No lession ID from create');
    
    const response = await request.get(`${baseURL}/CourseLession/getbyidcourselession?id=${createdLessionId}`, {
      headers: config.courseHeaders
    });
    expect([204, 404]).toContain(response.status());
  });
});

// ============================================================================
// COURSE SKILL MODULE - CRUD FLOW (Requires Course ID)
// ============================================================================
test.describe('Course API - CourseSkill Module CRUD Flow', () => {
  let parentCourseId;
  let createdSkillId;

  test('Setup: Create parent course for skill tests', async ({ request }) => {
    const response = await request.post(`${baseURL}/Course/createcourse`, {
      headers: config.courseHeaders,
      data: payloads.createCourse
    });
    
    if (response.status() === 200 || response.status() === 201) {
      const body = await response.json();
      parentCourseId = body.Id || body.id;
      console.log(`Created parent Course ID for skills: ${parentCourseId}`);
    }
  });

  test('Step 1: CREATE - POST /api/CourseSkill/createcourseskill', async ({ request }) => {
    test.skip(!parentCourseId, 'Skipping: No parent course ID');
    
    const createPayload = payloads.createCourseSkill.map(skill => ({
      ...skill,
      CourseId: parentCourseId
    }));
    const response = await request.post(`${baseURL}/CourseSkill/createcourseskill`, {
      headers: config.courseHeaders,
      data: createPayload
    });
    expect([200, 201]).toContain(response.status());
    
    if (response.status() === 200 || response.status() === 201) {
      const body = await response.json();
      createdSkillId = Array.isArray(body) ? body[0]?.Id : body?.Id;
      console.log(`Created CourseSkill ID: ${createdSkillId}`);
    }
  });

  test('Step 2: GET - GET /api/CourseSkill/getallcourseskillbycourseid', async ({ request }) => {
    test.skip(!parentCourseId, 'Skipping: No parent course ID');
    
    const response = await request.get(`${baseURL}/CourseSkill/getallcourseskillbycourseid?courseId=${parentCourseId}`, {
      headers: config.courseHeaders
    });
    expect(response.status()).toBe(200);
  });

  test('Step 3: UPDATE - PUT /api/CourseSkill/updatecourseskill', async ({ request }) => {
    test.skip(!createdSkillId || !parentCourseId, 'Skipping: No skill or course ID');
    
    const updatePayload = payloads.updateCourseSkill.map(skill => ({
      ...skill,
      Id: createdSkillId,
      CourseId: parentCourseId
    }));
    const response = await request.put(`${baseURL}/CourseSkill/updatecourseskill`, {
      headers: config.courseHeaders,
      data: updatePayload
    });
    expect([200, 201]).toContain(response.status());
  });

  test('Step 4: GET - Verify update - GET /api/CourseSkill/getallcourseskillbycourseid', async ({ request }) => {
    test.skip(!parentCourseId, 'Skipping: No parent course ID');
    
    const response = await request.get(`${baseURL}/CourseSkill/getallcourseskillbycourseid?courseId=${parentCourseId}`, {
      headers: config.courseHeaders
    });
    expect(response.status()).toBe(200);
  });

  test('Step 5: DELETE - DELETE /api/CourseSkill/deletebyidcourseskill/{id}', async ({ request }) => {
    test.skip(!createdSkillId, 'Skipping: No skill ID from create');
    
    const response = await request.delete(`${baseURL}/CourseSkill/deletebyidcourseskill/${createdSkillId}`, {
      headers: config.courseHeaders
    });
    expect([200, 204]).toContain(response.status());
  });

  test('Step 6: GET - Verify deletion - GET /api/CourseSkill/getallcourseskillbycourseid', async ({ request }) => {
    test.skip(!parentCourseId, 'Skipping: No parent course ID');
    
    const response = await request.get(`${baseURL}/CourseSkill/getallcourseskillbycourseid?courseId=${parentCourseId}`, {
      headers: config.courseHeaders
    });
    expect([204, 404]).toContain(response.status());
  });
});

// ============================================================================
// VIDEO MODULE - CRUD FLOW
// ============================================================================
test.describe('Course API - Video Module CRUD Flow', () => {
  let createdVideoId;

  test('Step 1: CREATE - POST /api/Video/create', async ({ request }) => {
    const response = await request.post(`${baseURL}/Video/create`, {
      headers: config.courseHeaders,
      data: payloads.createVideo
    });
    expect([200, 201]).toContain(response.status());
    
    if (response.status() === 200 || response.status() === 201) {
      const body = await response.json();
      
      // Video API returns array with VideoId field
      if (Array.isArray(body) && body.length > 0) {
        createdVideoId = body[0].VideoId || body[0].videoId || body[0].Id || body[0].id;
      } else {
        createdVideoId = body.VideoId || body.videoId || body.Id || body.id;
      }
      console.log(`Created Video ID: ${createdVideoId}`);
    }
  });

  test('Step 2: GET - GET /api/Video/details/{videoId}', async ({ request }) => {
    test.skip(!createdVideoId, 'Skipping: No video ID from create');
    
    const response = await request.get(`${baseURL}/Video/details/${createdVideoId}`, {
      headers: config.courseHeaders
    });
    expect(response.status()).toBe(200);
  });

  test('Step 3: UPDATE - PUT /api/Video/update', async ({ request }) => {
    test.skip(!createdVideoId, 'Skipping: No video ID from create');
    
    const updatePayload = {
      UpdateVideos: payloads.updateVideo.UpdateVideos.map(video => ({
        ...video,
        Id: createdVideoId
      }))
    };
    const response = await request.put(`${baseURL}/Video/update`, {
      headers: config.courseHeaders,
      data: updatePayload
    });
    expect([200, 201]).toContain(response.status());
  });

  test('Step 4: GET - Verify update - GET /api/Video/details/{videoId}', async ({ request }) => {
    test.skip(!createdVideoId, 'Skipping: No video ID from create');
    
    const response = await request.get(`${baseURL}/Video/details/${createdVideoId}`, {
      headers: config.courseHeaders
    });
    expect(response.status()).toBe(200);
  });

  test('Step 5: DELETE - DELETE /api/Video/deletevideo', async ({ request }) => {
    test.skip(!createdVideoId, 'Skipping: No video ID from create');
    
    const response = await request.delete(`${baseURL}/Video/deletevideo?id=${createdVideoId}`, {
      headers: config.courseHeaders
    });
    expect([200, 204]).toContain(response.status());
  });

  test('Step 6: GET - Verify deletion - GET /api/Video/details/{videoId} (expect 204/404)', async ({ request }) => {
    test.skip(!createdVideoId, 'Skipping: No video ID from create');
    
    const response = await request.get(`${baseURL}/Video/details/${createdVideoId}`, {
      headers: config.courseHeaders
    });
    expect([204, 404]).toContain(response.status());
  });
});
