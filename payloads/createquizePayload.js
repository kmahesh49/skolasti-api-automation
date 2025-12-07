// ...existing code...
module.exports = {
  createQuizePayload: ({
    Title = "Test",
    NumberOfRetake = 1,
    PassScoreInPertcentage = "80",
    TotalQuestions = 6,
    TotalScore = 100,
    IsOptional = true,
    QuizLevels = [
      { LevelId: 0, NumberOfQuestions: 2, PassScoreInPertcentage: 80, PointsPerQuestion: 10 },
      { LevelId: 1, NumberOfQuestions: 2, PassScoreInPertcentage: 80, PointsPerQuestion: 10 },
      { LevelId: 2, NumberOfQuestions: 2, PassScoreInPertcentage: 80, PointsPerQuestion: 30 }
    ]
  } = {}) => ({
    Title,
    NumberOfRetake,
    PassScoreInPertcentage,
    TotalQuestions,
    TotalScore,
    IsOptional,
    QuizLevels
  })
};
// ...existing code...