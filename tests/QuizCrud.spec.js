const { test } = require("@playwright/test");
const { baseURL, headers } = require("../config/config.js");
const { ApiHelper } = require("../utils/ApiHelper.js");
const { PayloadGenerator } = require("../utils/PayloadGenerator.js");

test("Quiz CRUD Operations: Create → Get → Update → Get → Delete → Verify", async ({ request }) => {
  const api = new ApiHelper(request, baseURL, headers);

  // ==================== CREATE ====================
  const createPayload = PayloadGenerator.generateQuizPayload();
  const createResponse = await api.create("/QuizAndAssessmentAdmin/createquiz", createPayload, 200);
  
  const quizId = createResponse.QuizId;
  console.log("Created Quiz ID:", quizId);

  // ==================== GET ====================
  const getResponse = await api.get(`/QuizAndAssessmentAdmin/getquizdetails?quizId=${quizId}`, 200);
  console.log("Quiz details retrieved successfully");

  // ==================== UPDATE ====================
  const updatePayload = PayloadGenerator.generateQuizPayload({ Id: quizId });
  const updateResponse = await api.update("/QuizAndAssessmentAdmin/updatequiz", updatePayload, 200);
  console.log("Quiz updated successfully");

  // ==================== GET AFTER UPDATE ====================
  const getAfterUpdateResponse = await api.get(`/QuizAndAssessmentAdmin/getquizdetails?quizId=${quizId}`, 200);
  console.log("Updated quiz details retrieved successfully");

  // ==================== DELETE ====================
  await api.delete(`/QuizAndAssessmentAdmin/deletequiz?quizId=${quizId}`, 204);
  console.log("Quiz deleted successfully");

  // ==================== VERIFY DELETION ====================
  await api.verifyDeleted(`/QuizAndAssessmentAdmin/getquizdetails?quizId=${quizId}`);
  console.log("Quiz deletion verified");
});
