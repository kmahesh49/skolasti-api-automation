import { faker } from "@faker-js/faker";
const { DateTime } = require("luxon");

/**
 * Payload Generator class for creating test data
 */
class PayloadGenerator {
  /**
   * Generate Quiz payload with dynamic data
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
      CreatedBy: "f7103da6-fc7a-4cfd-880b-89616e6deeea",
      UpdatedBy: "f7103da6-fc7a-4cfd-880b-89616e6deeea",
      Createddate: DateTime.now().toISO(),
      UpdatedDate: DateTime.now().toISO(),
      state: "saved"
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
      CreatedBy: "f7103da6-fc7a-4cfd-880b-89616e6deeea",
      UpdatedBy: "f7103da6-fc7a-4cfd-880b-89616e6deeea",
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
      Title: faker.music.songName(),
      Description: "",
      Transcript: "",
      audioType: 2,
      AudioUrl: "http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
      AudioLength: 0,
      FileName: "Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
      Extension: "mp3",
      CreatedDate: DateTime.now().toISO(),
      UpdatedDate: DateTime.now().toISO(),
      AudioSize: 0,
      TenantId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      ClientId: "",
      IsActive: true,
      IsDeleted: false,
      IsPublished: false
    };

    return [{ ...defaults, ...overrides }];
  }

  /**
   * Generate Audio update payload
   * @param {number} audioId - Audio ID to update
   * @param {string} title - Audio title
   * @param {Object} overrides - Optional overrides for specific fields
   * @returns {Object} - Audio update payload
   */
  static generateAudioUpdatePayload(audioId, title, overrides = {}) {
    const defaults = {
      Id: audioId,
      Title: title,
      Description: `<p>${faker.lorem.sentence()}</p>`,
      Transcript: "",
      AudioLength: 0,
      TenantId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      ClientId: null,
      IsActive: null,
      IsDeleted: false,
      IsPublished: false,
      CreatedDate: DateTime.now().toISO(),
      UpadatedDate: DateTime.now().toISO(),
      Documents: [],
      Points: 0,
      ContentRefTypeId: 2
    };

    return { ...defaults, ...overrides };
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
      CreatedBy: "f7103da6-fc7a-4cfd-880b-89616e6deeea",
      UpdatedBy: "f7103da6-fc7a-4cfd-880b-89616e6deeea"
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
    const videoDefaults = {
      FileId: faker.string.alphanumeric(32),
      FileName: faker.system.fileName().replace(/\.[^/.]+$/, ""),
      CategoryId: 1,
      IsVrEnabled: false,
      IsPublic: true,
      VideoType: 2,
      CdnUrl: `/videos/${faker.string.alphanumeric(32)}.m3u8`,
      IsSharingAllowed: true,
      Points: 0
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
    const defaults = {
      TenantId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      Id: 0,
      Title: faker.lorem.words(2),
      Url: "https://www.gurukultti.org/admin/notice/javascript.pdf",
      CdnUrl: "https://www.gurukultti.org/admin/notice/javascript.pdf",
      ContentRefId: faker.number.int({ min: 1000, max: 9999 }),
      ContentRefTypeId: 1,
      FileName: "javascript.pdf",
      FileId: faker.string.alphanumeric(32),
      Extension: "pdf",
      CreatedDate: DateTime.now().toISO(),
      UpdatedDate: DateTime.now().toISO(),
      DocumentSize: faker.number.int({ min: 100, max: 1000 }),
      ClientId: "",
      IsActive: true,
      IsDeleted: true,
      IsPublished: true
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
    const defaults = {
      TenantId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      Id: documentId,
      Title: title,
      Url: "https://www.gurukultti.org/admin/notice/javascript.pdf",
      CdnUrl: "https://www.gurukultti.org/admin/notice/javascript.pdf",
      ContentRefId: faker.number.int({ min: 1000, max: 9999 }),
      ContentRefTypeId: 1,
      FileName: "javascript.pdf",
      FileId: faker.string.alphanumeric(32),
      Extension: "pdf",
      CreatedDate: DateTime.now().toISO(),
      UpdatedDate: DateTime.now().toISO(),
      DocumentSize: faker.number.int({ min: 100, max: 1000 }),
      ClientId: "",
      IsActive: true,
      IsDeleted: true,
      IsPublished: true
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
        TenantId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        ...overrides
      });
    }
    return skills;
  }
}

module.exports = { PayloadGenerator };
