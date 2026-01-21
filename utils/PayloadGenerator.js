import { faker } from "@faker-js/faker";
const { DateTime } = require("luxon");

/**
 * Payload Generator class for creating test data
 */
class PayloadGenerator {
  /**
   * Generate Quiz payload with dynamic data (legacy method)
   * @param {Object} overrides - Optional overrides for specific fields
   * @returns {Object} - Quiz payload
   */
  static generateQuizPayload(overrides = {}) {
    const defaults = {
      Title: faker.lorem.words(6),
      NumberOfRetake: faker.number.int({ min: 1, max: 5 }),
      PassScoreInPertcentage: faker.number.int({ min: 1, max: 100 }),
      TotalQuestions: faker.number.int({ min: 1, max: 50 }),
      TotalScore: faker.number.int({ min: 1, max: 500 }),
      IsOptional: faker.datatype.boolean(),
      QuizLevels: [
        {
          LevelId: faker.number.int({ min: 0, max: 10 }),
          NumberOfQuestions: faker.number.int({ min: 1, max: 20 }),
          PassScoreInPertcentage: faker.number.int({ min: 1, max: 100 }),
          PointsPerQuestion: faker.number.int({ min: 1, max: 50 })
        },
        {
          LevelId: faker.number.int({ min: 0, max: 10 }),
          NumberOfQuestions: faker.number.int({ min: 1, max: 20 }),
          PassScoreInPertcentage: faker.number.int({ min: 1, max: 100 }),
          PointsPerQuestion: faker.number.int({ min: 1, max: 50 })
        },
        {
          LevelId: faker.number.int({ min: 0, max: 10 }),
          NumberOfQuestions: faker.number.int({ min: 1, max: 20 }),
          PassScoreInPertcentage: faker.number.int({ min: 1, max: 100 }),
          PointsPerQuestion: faker.number.int({ min: 1, max: 50 })
        }
      ]
    };

    return { ...defaults, ...overrides };
  }

  /**
   * Generate Quiz Create payload for ClientAPI
   * @param {Object} overrides - Optional overrides for specific fields
   * @returns {Object} - Quiz create payload
   */
  static generateQuizCreatePayload(overrides = {}) {
    const defaults = {
      Title: `Automated Quiz ${faker.lorem.words(3)} ${Date.now()}`,
      NumberOfRetake: 3,
      PassScoreInPertcentage: "70",
      TotalQuestions: 6,
      TotalScore: 110,
      IsOptional: true,
      QuizLevels: [
        {
          LevelId: 0, // Easy
          NumberOfQuestions: 1,
          PassScoreInPertcentage: 70,
          PointsPerQuestion: 10
        },
        {
          LevelId: 1, // Medium
          NumberOfQuestions: 2,
          PassScoreInPertcentage: 70,
          PointsPerQuestion: 20
        },
        {
          LevelId: 2, // Hard
          NumberOfQuestions: 3,
          PassScoreInPertcentage: 70,
          PointsPerQuestion: 20
        }
      ]
    };

    return { ...defaults, ...overrides };
  }

  /**
   * Generate Quiz Update payload for ClientAPI
   * @param {number} quizId - The quiz ID to update
   * @param {string} originalTitle - The original title for reference
   * @param {Object} overrides - Optional overrides for specific fields
   * @returns {Object} - Quiz update payload
   */
  static generateQuizUpdatePayload(quizId, originalTitle, overrides = {}) {
    const defaults = {
      Id: quizId,
      Title: `${originalTitle} - Updated`,
      NumberOfRetake: 3,
      PassScoreInPertcentage: "80",
      TotalQuestions: 7,
      TotalScore: 120,
      IsOptional: true,
      QuizLevels: [
        {
          LevelId: 0, // Easy
          NumberOfQuestions: 2,
          PassScoreInPertcentage: 80,
          PointsPerQuestion: 10
        },
        {
          LevelId: 1, // Medium
          NumberOfQuestions: 2,
          PassScoreInPertcentage: 80,
          PointsPerQuestion: 20
        },
        {
          LevelId: 2, // Hard
          NumberOfQuestions: 3,
          PassScoreInPertcentage: 80,
          PointsPerQuestion: 20
        }
      ]
    };

    return { ...defaults, ...overrides };
  }

  /**
   * Generate GetAllQuizzes payload for ClientAPI
   * @param {number} pageNumber - Page number (default: 1)
   * @param {number} pageSize - Page size (default: 20)
   * @returns {Object} - GetAllQuizzes payload
   */
  static generateGetAllQuizzesPayload(pageNumber = 1, pageSize = 20) {
    return {
      PageNumber: pageNumber,
      PageSize: pageSize
    };
  }

  /**
   * Generate Course payload with dynamic data
   * @param {Object} overrides - Optional overrides for specific fields
   * @returns {Object} - Course payload
   */
  static generateCoursePayload(overrides = {}) {
    const courseTypes = ["offline", "online"];
    const courseLevels = ["beginner", "intermediate", "advanced"];

    const defaults = {
      aiText: faker.lorem.sentence(),
      title: faker.lorem.words(3),
      titlePlaceholder: faker.lorem.words(5),
      courseType: faker.helpers.arrayElement(courseTypes),
      courseTypeLabel: "Course Type",
      courseCategoryLabel: "Category",
      courseCategory: "0",
      courseLevelLabel: "Course Level",
      courseLevel: faker.helpers.arrayElement(courseLevels),
      courseLevelId: faker.number.int({ min: 1, max: 3 }),
      description: faker.lorem.paragraph(),
      descriptionPlaceholder: "Course Description Goes here",
      skillsSectionLabel: "What skills students will gain from this course?",
      skills: ["", "", "", ""],
      skillsPlaceholders: [
        "e.g., JavaScript fundamentals, DOM manipulation",
        "e.g., ES6+ features, async programming",
        "e.g., React.js basics, component lifecycle",
        "e.g., State management, hooks usage"
      ],
      courseTypeId: 1,
      categories: [
        {
          Id: 0,
          PlaylistCategoryName: "Leadership",
          PlaylistCategoryDescription: "Entertainment",
          CreatedDate: "2025-02-14T05:41:21.1666667",
          UpdatedDate: "2025-02-14T05:41:21.17",
          Playlists: []
        },
        {
          Id: 1,
          PlaylistCategoryName: "Technology",
          PlaylistCategoryDescription: "Technology",
          CreatedDate: "2025-02-18T14:03:19.4966667",
          UpdatedDate: "2025-02-18T14:03:19.4966667",
          Playlists: []
        },
        {
          Id: 2,
          PlaylistCategoryName: "Soft Skills",
          PlaylistCategoryDescription: "Soft Skills",
          CreatedDate: "2025-02-18T14:03:19.5066667",
          UpdatedDate: "2025-02-18T14:03:19.5066667",
          Playlists: []
        },
        {
          Id: 3,
          PlaylistCategoryName: "Production",
          PlaylistCategoryDescription: "Production",
          CreatedDate: "2025-02-18T14:03:19.51",
          UpdatedDate: "2025-02-18T14:03:19.51",
          Playlists: []
        },
        {
          Id: 4,
          PlaylistCategoryName: "Learning",
          PlaylistCategoryDescription: "Learning",
          CreatedDate: "2025-02-18T14:03:19.5166667",
          UpdatedDate: "2025-02-18T14:03:19.5166667",
          Playlists: []
        },
        {
          Id: 5,
          PlaylistCategoryName: "Life style",
          PlaylistCategoryDescription: "Life style",
          CreatedDate: "2025-02-25T13:40:00.28",
          UpdatedDate: "2025-02-25T13:40:00.28",
          Playlists: []
        },
        {
          Id: 6,
          PlaylistCategoryName: "LIfestyle",
          PlaylistCategoryDescription: "LIfestyle",
          CreatedDate: "2025-03-28T13:15:35.69",
          UpdatedDate: "2025-03-28T13:15:35.69",
          Playlists: []
        }
      ],
      CategoryId: 0,
      existingSkills: [],
      Createddate: DateTime.now().toISO(),
      UpdatedDate: DateTime.now().toISO(),
      state: "saved",
      IsActive: true
    };

    return { ...defaults, ...overrides };
  }

  /**
   * Generate date range payload for getAllCourse
   * @param {number} daysBack - Number of days to go back from today (default: 4)
   * @param {Object} overrides - Optional overrides for pagination fields
   * @returns {Object} - GetAllCourse payload with date range
   */
  static generateGetAllCoursesPayload(daysBack = 4, overrides = {}) {
    const endDate = DateTime.now();
    const startDate = endDate.minus({ days: daysBack });

    const defaults = {
      PageNumber: 1,
      PageSize: 20,
      IncludeAllPage: true,
      SortField: "",
      SortType: "",
      FilterField: "",
      FilterText: "",
      StartDate: startDate.toISO(),
      EndDate: endDate.toISO()
    };

    return { ...defaults, ...overrides };
  }

  /**
   * Get expected course levels data
   * @returns {Array} - Array of expected course levels
   */
  static getExpectedCourseLevels() {
    return [
      { Id: 1, Name: "Beginner" },
      { Id: 2, Name: "Intermediate" },
      { Id: 3, Name: "Advanced" }
    ];
  }

  /**
   * Get expected course types data
   * @returns {Array} - Array of expected course types
   */
  static getExpectedCourseTypes() {
    return [
      { Id: 1, Name: "Offline" },
      { Id: 2, Name: "Online" },
      { Id: 3, Name: "DigitalDownload" }
    ];
  }

  /**
   * Generate Course Section payload with dynamic data
   * @param {number} courseId - Course ID to associate with the section
   * @param {Object} overrides - Optional overrides for specific fields
   * @returns {Object} - Course Section payload
   */
  static generateCourseSectionPayload(courseId, overrides = {}) {
    const defaults = {
      Title: faker.lorem.words(3),
      Description: faker.lorem.sentence(),
      CourseId: courseId,
      IsActive: true,
      IsVisible: true,
      Createddate: DateTime.now().toISO(),
      UpdatedDate: DateTime.now().toISO()
    };

    return { ...defaults, ...overrides };
  }

  /**
   * Generate Audio payload with dynamic data (returns array as API expects)
   * @param {Object} overrides - Optional overrides for specific fields
   * @returns {Array} - Audio payload array
   */
  static generateAudioPayload(overrides = {}) {
    const defaults = {
      Id: 0,
      Title: faker.music.songName() + ".mp3",
      Description: "",
      Transcript: "",
      audioType: 1,
      AudioUrl: "",
      AudioLength: 0,
      FileName: faker.music.songName() + ".mp3",
      Extension: "mp3",
      CreatedDate: DateTime.now().toISO(),
      UpdatedDate: DateTime.now().toISO(),
      AudioSize: faker.number.int({ min: 100000, max: 2000000 }),
      IsActive: true,
      IsDeleted: false,
      IsPublished: false
    };

    return [{ ...defaults, ...overrides }];
  }

  /**
   * Generate Audio update payload (returns array as API expects)
   * @param {number} audioId - Audio ID to update
   * @param {string} title - Audio title
   * @param {Object} overrides - Optional overrides for specific fields
   * @returns {Array} - Audio update payload array
   */
  static generateAudioUpdatePayload(audioId, title, overrides = {}) {
    const defaults = {
      Id: audioId,
      Title: title,
      Description: `<p>${faker.lorem.sentence()}</p>`,
      Transcript: "",
      audioType: 1,
      AudioUrl: "",
      AudioLength: 0,
      FileName: title,
      Extension: "mp3",
      CreatedDate: DateTime.now().toISO(),
      UpdatedDate: DateTime.now().toISO(),
      AudioSize: faker.number.int({ min: 100000, max: 2000000 }),
      IsActive: true,
      IsDeleted: false,
      IsPublished: false
    };

    return [{ ...defaults, ...overrides }];
  }

  /**
   * Generate Course Lesson payload with dynamic data (returns array as API expects)
   * @param {number} courseSectionId - Course Section ID
   * @param {number} learningItemId - Learning Item ID (Audio/Video/Document ID)
   * @param {number} learningItemTypeId - Learning Item Type (1=Video, 2=Audio, 3=Document, 4=Quiz)
   * @param {string} title - Lesson title
   * @param {Object} overrides - Optional overrides for specific fields
   * @returns {Array} - Course Lesson payload array
   */
  static generateCourseLessonPayload(courseSectionId, learningItemId, learningItemTypeId, title, overrides = {}) {
    const defaults = {
      Title: title,
      CourseSectionId: courseSectionId,
      LearningItemTypeId: learningItemTypeId,
      LearningItemId: learningItemId,
      IsActive: true
    };

    return [{ ...defaults, ...overrides }];
  }

  /**
   * Generate Course Lesson update payload
   * @param {number} lessonId - Lesson ID to update
   * @param {number} learningItemId - Learning Item ID (Audio/Video/Document ID)
   * @param {number} learningItemTypeId - Learning Item Type (1=Video, 2=Audio, 3=Document, 4=Quiz)
   * @param {string} title - Lesson title
   * @param {Object} overrides - Optional overrides for specific fields
   * @returns {Object} - Course Lesson update payload
   */
  static generateCourseLessonUpdatePayload(lessonId, learningItemId, learningItemTypeId, title, overrides = {}) {
    const defaults = {
      Id: lessonId,
      Title: title,
      Description: `<p>${faker.lorem.sentence()}</p>`,
      LearningItemTypeId: learningItemTypeId,
      LearningItemId: learningItemId,
      UpdatedBy: "f7103da6-fc7a-4cfd-880b-89616e6deeea"
    };

    return { ...defaults, ...overrides };
  }

  /**
   * Generate Video payload (returns object with Videos array as API expects)
   * @param {Object} overrides - Optional overrides for specific fields
   * @returns {Object} - Video payload with Videos array
   */
  static generateVideoPayload(overrides = {}) {
    const fileId = faker.string.alphanumeric(32);
    const videoDefaults = {
      FileName: faker.system.fileName().replace(/\.[^/.]+$/, ""),
      state: "Uploading",
      FileId: fileId,
      IsSharingAllowed: true,
      IsPublic: true,
      VideoType: 2,
      CdnUrl: "",
      credentials: {
        policy: faker.string.alphanumeric(200),
        key: `orig/${faker.string.alphanumeric(13)}`,
        "x-amz-signature": faker.string.alphanumeric(64),
        "x-amz-algorithm": "AWS4-HMAC-SHA256",
        "x-amz-date": DateTime.now().toFormat("yyyyMMdd") + "T000000Z",
        "x-amz-credential": `AKIAJ2S2LBWKGN3W33GQ/${DateTime.now().toFormat("yyyyMMdd")}/ap-southeast-1/s3/aws4_request`,
        uploadLink: "https://vdo-ap-southeast.s3-accelerate.amazonaws.com"
      }
    };

    return {
      Videos: [{ ...videoDefaults, ...overrides }]
    };
  }

  /**
   * Generate Document payload (returns array as API expects)
   * @param {Object} overrides - Optional overrides for specific fields
   * @returns {Array} - Document payload array
   */
  static generateDocumentPayload(overrides = {}) {
    const fileName = `${faker.lorem.word()}.pdf`;
    const defaults = {
      Id: 0,
      Title: fileName,
      Url: "",
      CdnUrl: "",
      ContentRefId: faker.number.int({ min: 1000, max: 9999 }),
      ContentRefTypeId: 1,
      FileName: fileName,
      FileId: "",
      documentType: 1,
      Extension: "pdf",
      CreatedDate: DateTime.now().toISO(),
      UpdatedDate: DateTime.now().toISO(),
      DocumentSize: faker.number.int({ min: 100000, max: 1000000 }),
      IsActive: true,
      IsDeleted: false,
      IsPublished: false,
      BlobPath: `cdn/documents/${fileName}`,
      ContainerName: faker.string.alphanumeric(8)
    };

    return [{ ...defaults, ...overrides }];
  }

  /**
   * Generate Document update payload (returns array as API expects)
   * @param {number} documentId - Document ID to update
   * @param {string} title - Document title
   * @param {Object} overrides - Optional overrides for specific fields
   * @returns {Array} - Document update payload array
   */
  static generateDocumentUpdatePayload(documentId, title, overrides = {}) {
    const fileId = faker.string.alphanumeric(32);
    const defaults = {
      Id: documentId,
      Title: title,
      Url: "",
      CdnUrl: `${fileId}.pdf`,
      ContentRefId: faker.number.int({ min: 1000, max: 9999 }),
      ContentRefTypeId: 1,
      FileName: title,
      FileId: fileId,
      Extension: "pdf",
      CreatedDate: DateTime.now().toISO(),
      UpdatedDate: DateTime.now().toISO(),
      DocumentSize: faker.number.int({ min: 100000, max: 1000000 }),
      IsActive: true,
      IsDeleted: false,
      IsPublished: false
    };

    return [{ ...defaults, ...overrides }];
  }

  /**
   * Generate Course Skills payload (returns array as API expects)
   * @param {number} courseId - Course ID
   * @param {number} count - Number of skills to generate (default: 4)
   * @param {Object} overrides - Optional overrides for specific fields
   * @returns {Array} - Course Skills payload array
   */
  static generateCourseSkillsPayload(courseId, count = 4, overrides = {}) {
    const skills = [];
    for (let i = 0; i < count; i++) {
      skills.push({
        Title: faker.lorem.words(2),
        CourseId: courseId,
        IsActive: true,
        ...overrides
      });
    }
    return skills;
  }

  /**
   * Generate Course Skills update payload (returns array as API expects)
   * @param {number} courseId - Course ID
   * @param {number} count - Number of skills to generate (default: 4)
   * @param {Object} overrides - Optional overrides for specific fields
   * @returns {Array} - Course Skills update payload array
   */
  static generateCourseSkillsUpdatePayload(courseId, count = 4, overrides = {}) {
    const skills = [];
    for (let i = 0; i < count; i++) {
      skills.push({
        Title: faker.lorem.words(2),
        CourseId: courseId,
        IsActive: true,
        ...overrides
      });
    }
    return skills;
  }

  // ==================== QUIZ QUESTION PAYLOADS ====================

  /**
   * Generate Question Create payload for Quiz
   * @param {string|number} quizId - The quiz ID to add question to
   * @param {Object} overrides - Optional overrides for specific fields
   * @returns {Object} - Question create payload
   */
  static generateQuestionCreatePayload(quizId, overrides = {}) {
    const questionTypes = ["Single Choice", "Multiple Choice"];
    const difficulties = ["Easy", "Medium", "Hard"];
    const difficultyLevelMap = { "Easy": 0, "Medium": 1, "Hard": 2 };
    
    const difficulty = overrides.Difficulty || faker.helpers.arrayElement(difficulties);
    
    const defaults = {
      QuizId: String(quizId),
      Question: `Test Question ${faker.lorem.words(5)} ${Date.now()}`,
      QuestionType: faker.helpers.arrayElement(questionTypes),
      Difficulty: difficulty,
      Points: faker.number.int({ min: 1, max: 10 }),
      QuestionLevelId: difficultyLevelMap[difficulty],
      Choices: [
        {
          Choice: faker.lorem.word(),
          isCorrectChoice: true
        },
        {
          Choice: faker.lorem.word(),
          isCorrectChoice: false
        }
      ]
    };

    return { ...defaults, ...overrides };
  }

  /**
   * Generate Question Update payload
   * @param {number} questionId - The question ID to update
   * @param {string|number} quizId - The quiz ID
   * @param {Array} existingChoices - Existing choice IDs to update
   * @param {Object} overrides - Optional overrides for specific fields
   * @returns {Object} - Question update payload
   */
  static generateQuestionUpdatePayload(questionId, quizId, existingChoices = [], overrides = {}) {
    const defaults = {
      QuestionId: questionId,
      QuizId: String(quizId),
      Question: `Updated Question ${faker.lorem.words(3)} ${Date.now()}`,
      QuestionType: "Single Choice",
      Difficulty: "Easy",
      Points: faker.number.int({ min: 5, max: 20 }),
      QuestionLevelId: 0,
      Choices: existingChoices.length >= 2 ? [
        {
          ChoiceId: existingChoices[0].ChoiceId,
          Choice: `Updated ${faker.lorem.word()}`,
          isCorrectChoice: true
        },
        {
          ChoiceId: existingChoices[1].ChoiceId,
          Choice: `Updated ${faker.lorem.word()}`,
          isCorrectChoice: false
        }
      ] : [
        {
          Choice: `Updated ${faker.lorem.word()}`,
          isCorrectChoice: true
        },
        {
          Choice: `Updated ${faker.lorem.word()}`,
          isCorrectChoice: false
        }
      ]
    };

    return { ...defaults, ...overrides };
  }

  /**
   * Generate Invalid Question payload for negative testing
   * @param {string|number} quizId - The quiz ID
   * @param {string} invalidType - Type of invalid payload ('missingQuestion', 'invalidQuizId', 'noChoices', 'noCorrectChoice')
   * @returns {Object} - Invalid question payload
   */
  static generateInvalidQuestionPayload(quizId, invalidType = 'missingQuestion') {
    const basePayload = {
      QuizId: String(quizId),
      Question: `Test Question ${Date.now()}`,
      QuestionType: "Single Choice",
      Difficulty: "Easy",
      Points: 5,
      QuestionLevelId: 0,
      Choices: [
        { Choice: "Option A", isCorrectChoice: true },
        { Choice: "Option B", isCorrectChoice: false }
      ]
    };

    switch (invalidType) {
      case 'missingQuestion':
        delete basePayload.Question;
        break;
      case 'invalidQuizId':
        basePayload.QuizId = "999999";
        break;
      case 'noChoices':
        basePayload.Choices = [];
        break;
      case 'noCorrectChoice':
        basePayload.Choices = [
          { Choice: "Option A", isCorrectChoice: false },
          { Choice: "Option B", isCorrectChoice: false }
        ];
        break;
      case 'emptyQuestion':
        basePayload.Question = "";
        break;
      case 'negativePoints':
        basePayload.Points = -5;
        break;
    }

    return basePayload;
  }
}

module.exports = { PayloadGenerator };
