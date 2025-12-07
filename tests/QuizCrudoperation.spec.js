const { test, expect, request } = require("@playwright/test");
// Removed incorrect import statement for faker
const { baseURL, headers } = require("../config/config.js");
// const RequestBody = require('../payloads/Dynamic_Payload.json');
import { faker, Faker } from "@faker-js/faker";
const { DateTime } = require("luxon");



test("Create a quiz, get quiz details, update quiz, get updated quiz details, delete quiz and verify deletion", async ({ request }) => {
  
  const Title1= faker.lorem.words(6);
  const NumberOfRetake= faker. number. int({ min: 1, max: 5 });
  const PassScoreInPertcentage= faker. number. int({ min: 1, max: 100 });
  const TotalQuestions= faker. number. int({ min: 1, max: 50 });
  const TotalScore= faker. number. int({ min: 1, max: 500 });
  const IsOptional= faker. datatype. boolean();
  const LevelId1= faker. number. int({ min: 0, max: 10 });
  const NumberOfQuestions1= faker. number. int({ min: 1, max: 20 });
  const PassScoreInPertcentage1= faker. number. int({ min: 1, max: 100 });
  const PointsPerQuestion1= faker. number. int({ min: 1, max: 50 });
  const LevelId2= faker. number. int({ min: 0, max: 10 });
  const NumberOfQuestions2= faker. number. int({ min: 1, max: 20 });
  const PassScoreInPertcentage2= faker. number. int({ min: 1, max: 100 });
  const PointsPerQuestion2= faker. number. int({ min: 1, max: 50 });
  const LevelId3= faker. number. int({ min: 0, max: 10 });
  const NumberOfQuestions3= faker. number. int({ min: 1, max: 20 });
  const PassScoreInPertcentage3= faker. number. int({ min: 1, max: 100 });
  const PointsPerQuestion3= faker. number. int({ min: 1, max: 50 });

   const response = await request.post( 
    `${baseURL}/QuizAndAssessmentAdmin/createquiz`,
    {
      headers,
      data: 
      {
    "Title": Title1,
    "NumberOfRetake": NumberOfRetake,
    "PassScoreInPertcentage": PassScoreInPertcentage,
    "TotalQuestions": TotalQuestions,
    "TotalScore": TotalScore,
    "IsOptional": IsOptional,
    "QuizLevels": [
        {
            "LevelId": LevelId1,
            "NumberOfQuestions": NumberOfQuestions1,
            "PassScoreInPertcentage": PassScoreInPertcentage1,
            "PointsPerQuestion": PointsPerQuestion1
        },
        {
            "LevelId": LevelId2,
            "NumberOfQuestions": NumberOfQuestions2,
            "PassScoreInPertcentage": PassScoreInPertcentage2,
            "PointsPerQuestion": PointsPerQuestion2
        },
        {
            "LevelId": LevelId3,
            "NumberOfQuestions": NumberOfQuestions3,
            "PassScoreInPertcentage": PassScoreInPertcentage3,
            "PointsPerQuestion": PointsPerQuestion3
        }
    ]
}
    }
  );

  // Defensive check for empty response
  let responseBody;
  try {
    responseBody = await response.json();
  } catch (err) {
    responseBody = null;
    console.error('Failed to parse JSON response:', err);
    console.error('Raw response text:', await response.text());
  }
  console.log(responseBody);

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  // Use correct property name for QuizId (case sensitive)
  const QId = responseBody.QuizId;
  console.log("Response Body:", responseBody);
  console.log("Quiz ID:", QId);

  // Defensive check for getquizdetails response with retry logic
  let getresponse, getText, getJson;
  let attempts = 0;
  const maxAttempts = 15;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  while (attempts < maxAttempts) {
    getresponse = await request.get(`${baseURL}/QuizAndAssessmentAdmin/getquizdetails?quizId=${QId}`, { headers });
    getText = await getresponse.text();
    console.log(`Attempt ${attempts + 1}: Raw response from getquizdetails:`, getText);
    console.log(`Attempt ${attempts + 1}: Status:`, getresponse.status());
    if (getresponse.status() === 200) {
      try {
        getJson = JSON.parse(getText);
        console.log("Quiz Details:", getJson);
        expect(getresponse.status()).toBe(200);
        break;
      } catch (err) {
        console.error("Failed to parse JSON from getquizdetails:", err);
        expect(getresponse.status()).toBe(200); // This will fail, but logs error
        break;
      }
    } else if (getresponse.status() === 204) {
      console.log("No content returned for quiz details (204). Retrying...");
      attempts++;
      if (attempts < maxAttempts) await delay(1000); // wait 1 second before retry
      else expect(getresponse.status()).toBe(204);
    } else {
      // Unexpected status, break and fail
      expect(getresponse.status()).toBe(200);
      break;
    }
  }
  expect(getresponse.ok()).toBeTruthy();
  expect(getresponse.status()).toBe(200);
  // Update the quiz with new dynamic data  

   const UpdatedTitle1= faker.lorem.words(4);
  const UpdatedNumberOfRetake= faker. number. int({ min: 1, max: 5 });
  const UpdatedPassScoreInPertcentage= faker. number. int({ min: 1, max: 100 });
  const UpdatedTotalQuestions= faker. number. int({ min: 1, max: 50 });
  const UpdatedTotalScore= faker. number. int({ min: 1, max: 500 });
  const UpdatedIsOptional= faker. datatype. boolean();
  const UpdatedLevelId1= faker. number. int({ min: 0, max: 10 });
  const UpdatedNumberOfQuestions1= faker. number. int({ min: 1, max: 20 });
  const UpdatedPassScoreInPertcentage1= faker. number. int({ min: 1, max: 100 });
  const UpdatedPointsPerQuestion1= faker. number. int({ min: 1, max: 50 });
  const UpdatedLevelId2= faker. number. int({ min: 0, max: 10 });
  const UpdatedNumberOfQuestions2= faker. number. int({ min: 1, max: 20 });
  const UpdatedPassScoreInPertcentage2= faker. number. int({ min: 1, max: 100 });
  const UpdatedPointsPerQuestion2= faker. number. int({ min: 1, max: 50 });
  const UpdatedLevelId3= faker. number. int({ min: 0, max: 10 });
  const UpdatedNumberOfQuestions3= faker. number. int({ min: 1, max: 20 });
  const UpdatedPassScoreInPertcentage3= faker. number. int({ min: 1, max: 100 });
  const UpdatedPointsPerQuestion3= faker. number. int({ min: 1, max: 50 });

  const Putresponse = await request.put(`${baseURL}/QuizAndAssessmentAdmin/updatequiz`, { headers, data: 
     {
      "Id": QId,
    "Title": UpdatedTitle1,
    "NumberOfRetake": UpdatedNumberOfRetake,
    "PassScoreInPertcentage": UpdatedPassScoreInPertcentage,
    "TotalQuestions": UpdatedTotalQuestions,
    "TotalScore": UpdatedTotalScore,
    "IsOptional": UpdatedIsOptional,
    "QuizLevels": [
        {
            "LevelId": UpdatedLevelId1,
            "NumberOfQuestions": UpdatedNumberOfQuestions1,
            "PassScoreInPertcentage": UpdatedPassScoreInPertcentage1,
            "PointsPerQuestion": UpdatedPointsPerQuestion1
        },
        {
            "LevelId": UpdatedLevelId2,
            "NumberOfQuestions": UpdatedNumberOfQuestions2,
            "PassScoreInPertcentage": UpdatedPassScoreInPertcentage2,
            "PointsPerQuestion": UpdatedPointsPerQuestion2
        },
        {
            "LevelId": UpdatedLevelId3,
            "NumberOfQuestions": UpdatedNumberOfQuestions3,
            "PassScoreInPertcentage": UpdatedPassScoreInPertcentage3,
            "PointsPerQuestion": UpdatedPointsPerQuestion3
        }
    ]
}
     });
  const putresponce = await Putresponse.text();
let putJson;
  try {
    putJson = JSON.parse(putresponce);
    console.log("Quiz Details:", putJson);
  } catch (err) {
    console.error("Failed to parse JSON from getquizdetails:", err);
    console.error("Raw response from getquizdetails:", putresponce);
  }
  console.log("Status:", Putresponse.status());
  expect(Putresponse.ok()).toBeTruthy();
  expect(Putresponse.status()).toBe(200);

   // Defensive check for getquizdetails response
  const getresponseafterput = await request.get(`${baseURL}/QuizAndAssessmentAdmin/getquizdetails?quizId=${QId}`, { headers });
  const getTextafterput = await getresponseafterput.text();
  try {
    const getJson = JSON.parse(getTextafterput);
    console.log("Quiz Details:", getJson);
  } catch (err) {
    console.error("Failed to parse JSON from getquizdetails:", err);
    console.error("Raw response from getquizdetails:", getTextafterput);
  }
  console.log("Status:", getresponseafterput.status());
  expect(getresponseafterput.ok()).toBeTruthy();
  expect(getresponseafterput.status()).toBe(200);

  // ------------------ DELETE ---------------------
  
  console.log("Deleting quiz with id:", QId);
  
  const deleteResponse = await request.delete(
    `${baseURL}/QuizAndAssessmentAdmin/deletequiz?quizId=${QId}`,
    {
      headers: headers
    }
  );
  
  // Validate status
  console.log("DELETE Status:", deleteResponse.status());
  expect(deleteResponse.ok()).toBeTruthy();
  expect(deleteResponse.status()).toBe(204);
  
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
  // FINAL GET — CHECK QUIZ IS DELETED
  // --------------------------------------------
  console.log("Verifying quiz is deleted:", QId);
  
  const finalGetResponse = await request.get(
    `${baseURL}/QuizAndAssessmentAdmin/getquizdetails?quizId=${QId}`,
    { headers }
  );
  
  console.log("Final GET Status:", finalGetResponse.status());
  
  // For deleted items, many APIs return 404 or 400 or empty
  expect(finalGetResponse.status()).not.toBe(200);
  
  const finalRaw = await finalGetResponse.text();
  console.log("Final GET Response after delete:", finalRaw);
  
});
