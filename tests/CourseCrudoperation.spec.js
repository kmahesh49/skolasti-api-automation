const { test, expect, request } = require("@playwright/test");
// Removed incorrect import statement for faker
const { CoursebaseURL, headers } = require("../config/config.js");
// const RequestBody = require('../payloads/Dynamic_Payload.json');
const { faker } = require("@faker-js/faker");
const { DateTime } = require("luxon");
const { allure } = require("allure-playwright");

test.describe("Course CRUD Operations with Validation", () => {
  test.beforeEach(async () => {
    allure.epic("Skolasti API Automation");
    allure.feature("Course Management");
    allure.owner("QA Team");
    allure.tag("api", "course", "end-to-end");
  });

  test("Create a course, get course details, update course, get updated course details, delete course and verify deletion", async ({ request }) => {
    allure.story("Complete Course Lifecycle");
    allure.severity("critical");
    allure.description("End-to-end validation of course creation, retrieval, update, and deletion with detailed verification");
const Title1= faker.lorem.words(3);
const aiText1= faker.lorem.sentence();
const Createddate1= DateTime.now().toISO();
const UpdatedDate1= DateTime.now().toISO();
const description1= faker.lorem.paragraph();
const titlePlaceholder1= faker.lorem.words(5);
const courseType1= "offline" || "online";
const courseLevel1= "beginner" || "intermediate" || "advanced";
const LevelId1= faker.number.int({ min: 1, max: 3 });

   const response = await request.post( 
    `${CoursebaseURL}/Course/createcourse`,
    {
      headers,
      data: 
    {
  "aiText": aiText1,
  "title": Title1,
  "titlePlaceholder": titlePlaceholder1,
  "courseType": courseType1,
  "courseTypeLabel": "Course Type",
  "courseCategoryLabel": "Category",
  "courseCategory": "0",
  "courseLevelLabel": "Course Level",
  "courseLevel": courseLevel1,
  "courseLevelId": LevelId1,
  "description": description1,
  "descriptionPlaceholder": "Course Description Goes here",
  "skillsSectionLabel": "What skills students will gain from this course?",
  "skills": ["", "", "", ""],
  "skillsPlaceholders": [
    "e.g., JavaScript fundamentals, DOM manipulation",
    "e.g., ES6+ features, async programming",
    "e.g., React.js basics, component lifecycle",
    "e.g., State management, hooks usage"
  ],
  "courseTypeId": 1,
  "categories": [
    {
      "Id": 0,
      "PlaylistCategoryName": "Leadership",
      "CreatedDate": Createddate1,
      "UpdatedDate": UpdatedDate1,
      "PlaylistCategoryDescription": "Entertainment",
      "Playlists": []
    },
    {
      "Id": 1,
      "PlaylistCategoryName": "Technology",
      "CreatedDate": Createddate1,
      "UpdatedDate": UpdatedDate1,
      "PlaylistCategoryDescription": "Technology",
      "Playlists": []
    },
    {
      "Id": 2,
      "PlaylistCategoryName": "Soft Skills",
      "CreatedDate": Createddate1,
      "UpdatedDate": UpdatedDate1,
      "PlaylistCategoryDescription": "Soft Skills",
      "Playlists": []
    },
    {
      "Id": 3,
      "PlaylistCategoryName": "Production",
      "CreatedDate": Createddate1,
      "UpdatedDate": UpdatedDate1,
      "PlaylistCategoryDescription": "Production",
      "Playlists": []
    },
    {
      "Id": 4,
      "PlaylistCategoryName": "Learning",
      "CreatedDate": Createddate1,
      "UpdatedDate": UpdatedDate1,
      "PlaylistCategoryDescription": "Learning",
      "Playlists": []
    },
    {
      "Id": 5,
      "PlaylistCategoryName": "Life style",
      "CreatedDate": Createddate1,
      "UpdatedDate": UpdatedDate1,
      "PlaylistCategoryDescription": "Life style",
      "Playlists": []
    },
    {
      "Id": 6,
      "PlaylistCategoryName": "LIfestyle",
      "CreatedDate": Createddate1,
      "UpdatedDate": UpdatedDate1,
      "PlaylistCategoryDescription": "LIfestyle",
      "Playlists": []
    }
  ],
  "CategoryId": 0,
  "existingSkills": [],
  "Createddate": Createddate1,
  "UpdatedDate": UpdatedDate1,
  "state": "saved",
  "IsActive": true
}
    }
  );

  const rawText = await response.text();
  console.log("Raw response text:", rawText);
  console.log("Status code:", response.status());

  let responseBody = null;
  if (rawText) {
    try {
      responseBody = JSON.parse(rawText);
    } catch (err) {
      console.error("Failed to parse JSON:", err);
    }
  }
  console.log("Parsed response body:", responseBody);

  expect(response.ok()).toBeTruthy();
  expect([200, 201]).toContain(response.status());

  // Use correct property name for CourseId (case sensitive)
  const CID = responseBody.Id;
  console.log("Response Body:", responseBody);
  console.log("COurse Id:", CID);

  // Add small delay to allow API to fully persist/index the course
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Defensive check for getcoursedetails response
  const getresponse = await request.get(`${CoursebaseURL}/Course/getbyidcourse?id=${CID}`, { headers });
  const getText = await getresponse.text();
  console.log("Raw response from Course details:", getText);
  console.log("Status:", getresponse.status());

  if (getText) {
    try {
      const getJson = JSON.parse(getText);
      console.log("Course Details:", getJson);
    } catch (err) {
      console.error("Failed to parse JSON from coursedetails:", err);
    }
  }
  
  expect(getresponse.ok()).toBeTruthy();
  expect(getresponse.status()).toBe(200);
  // Update the course with new dynamic data  
const Title2= faker.lorem.words(3);
const aiText2= faker.lorem.sentence();
const Createddate2= DateTime.now().toISO();
const UpdatedDate2= DateTime.now().toISO();
const description2= faker.lorem.paragraph();
const titlePlaceholder2= faker.lorem.words(5);
const courseType2= "offline" || "online";
const courseLevel2= "beginner" || "intermediate" || "advanced";
const LevelId2= faker.number.int({ min: 1, max: 3 });
  const Putresponse = await request.put(`${CoursebaseURL}/Course/updatecourse`, { headers, data: 
     {
      Id: CID,
      CategoryId: 1,
    CreatedBy: "f7103da6-fc7a-4cfd-880b-89616e6deeea",
    Createddate: Createddate2,
    UpdatedBy: "f7103da6-fc7a-4cfd-880b-89616e6deeea",
    UpdatedDate: UpdatedDate2,
    aiText: aiText2,
    categories: [
      {
        Id: 0,
        PlaylistCategoryName: "Leadership",
        PlaylistCategoryDescription: "Entertainment",
        CreatedDate: Createddate2,
        UpdatedDate: UpdatedDate2,
        Playlists: []
      },
      {
        Id: 1,
        PlaylistCategoryName: "Technology",
        PlaylistCategoryDescription: "Technology",
        CreatedDate: Createddate2,
        UpdatedDate: UpdatedDate2,
        Playlists: []
      },
      {
        Id: 2,
        PlaylistCategoryName: "Soft Skills",
        PlaylistCategoryDescription: "Soft Skills",
        CreatedDate: Createddate2,
        UpdatedDate: UpdatedDate2,
        Playlists: []
      },
      {
        Id: 3,
        PlaylistCategoryName: "Production",
        PlaylistCategoryDescription: "Production",
        CreatedDate: Createddate2,
        UpdatedDate: UpdatedDate2,
        Playlists: []
      },
      {
        Id: 4,
        PlaylistCategoryName: "Learning",
        PlaylistCategoryDescription: "Learning",
        CreatedDate: Createddate2,
        UpdatedDate: UpdatedDate2,
        Playlists: []
      },
      {
        Id: 5,
        PlaylistCategoryName: "Life style",
        PlaylistCategoryDescription: "Life style",
        CreatedDate: Createddate2,
        UpdatedDate: UpdatedDate2,
        Playlists: []
      },
      {
        Id: 6,
        PlaylistCategoryName: "LIfestyle",
        PlaylistCategoryDescription: "LIfestyle",
        CreatedDate: Createddate2,
        UpdatedDate: UpdatedDate2,
        Playlists: []
      }
    ],
    courseCategory: "0",
    courseCategoryLabel: "Category",
    courseLevel: courseLevel2,
    courseLevelId: LevelId2,
    courseLevelLabel: "Course Level",
    courseType: courseType2,
    courseTypeId: 1,
    courseTypeLabel: "Course Type",
    description: description2,
    descriptionPlaceholder:   "Course Description Goes here",
    existingSkills: [],
    skills: ["", "", "", ""],
    skillsPlaceholders: [
      "e.g., JavaScript fundamentals, DOM manipulation",
      "e.g., ES6+ features, async programming",
      "e.g., React.js basics, component lifecycle",
      "e.g., State management, hooks usage"
    ],
    skillsSectionLabel: "What skills students will gain from this course?",
    state: "saved",
    title: Title2,
    titlePlaceholder: titlePlaceholder2
     }
     });
  const putresponce = await Putresponse.text();
let putJson;
  try {
    putJson = JSON.parse(putresponce);
    console.log("Course Details:", putJson);
  } catch (err) {
    console.error("Failed to parse JSON from getcoursedetails:", err);
    console.error("Raw response from getcoursedetails:", putresponce);
  }
  console.log("Status:", Putresponse.status());
  expect(Putresponse.ok()).toBeTruthy();
  expect([200, 201]).toContain(Putresponse.status());

   // Defensive check for getcoursedetails response
  const getresponseafterput = await request.get(`${CoursebaseURL}/Course/getbyidcourse?id=${CID}`, { headers });
  const getTextafterput = await getresponseafterput.text();
  try {
    const getJson = JSON.parse(getTextafterput);
    console.log("Course Details:", getJson);
  } catch (err) {
    console.error("Failed to parse JSON from getcoursedetails:", err);
    console.error("Raw response from getcoursedetails:", getTextafterput);
  }
  console.log("Status:", getresponseafterput.status());
  expect(getresponseafterput.ok()).toBeTruthy();
  expect(getresponseafterput.status()).toBe(200);

  // ------------------ DELETE ---------------------
  
  console.log("Deleting course with id:", CID);
  
  const deleteResponse = await request.delete(
    `${CoursebaseURL}/course/deletebyidcourse/${CID}`,
    {
      headers: headers
    }
  );
  
  // Validate status
  console.log("DELETE Status:", deleteResponse.status());
  expect(deleteResponse.ok()).toBeTruthy();
  expect([200, 204]).toContain(deleteResponse.status());
  
  // Read response
  let deleteJson;
  try {
    deleteJson = await deleteResponse.json();
    console.log("Delete Response:", deleteJson);
  } catch (err) {
    console.error("DELETE JSON parse failed:", err);
    console.error("DELETE raw:", await deleteResponse.text());
  }
  // --------------------------------------------
  // FINAL GET — CHECK course IS DELETED
  // --------------------------------------------
  console.log("Verifying course is deleted:", CID);
  
  const finalGetResponse = await request.get(
    `${CoursebaseURL}/Course/getbyidcourse?id=${CID}`,
    { headers }
  );
  
  console.log("Final GET Status:", finalGetResponse.status());
  
  // For deleted items, many APIs return 404 or 400 or empty
  expect(finalGetResponse.status()).not.toBe(200);
  
  const finalRaw = await finalGetResponse.text();
  console.log("Final GET Response after delete:", finalRaw);
  
  });
});

