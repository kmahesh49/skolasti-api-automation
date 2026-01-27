// Course API Payloads
// Base URL: https://courseapi.skillrok.com/api
// Authentication: Bearer token + clientid

const timestamp = Date.now();

// =============================================================================
// AUDIO MODULE PAYLOADS
// =============================================================================

const createAudio = [
  {
    "Title": `Test Audio ${timestamp}`,
    "Description": "Test audio description for automated testing",
    "Transcript": "This is a test audio transcript",
    "AudioUrl": "https://example.com/test-audio.mp3",
    "AudioLength": 120.5,
    "ClientId": "6cffdd62-8649-4d9d-86fe-3066ee447082",
    "IsActive": true,
    "IsPublished": true
  }
];

const updateAudio = {
  "Id": 0, // To be replaced with actual ID
  "Title": `Updated Audio ${timestamp}`,
  "Description": "Updated audio description",
  "Transcript": "Updated transcript",
  "AudioUrl": "https://example.com/updated-audio.mp3",
  "AudioLength": 150.0,
  "ClientId": "6cffdd62-8649-4d9d-86fe-3066ee447082",
  "IsActive": true,
  "IsPublished": true
};

// =============================================================================
// CONTENT DOCUMENT MODULE PAYLOADS
// =============================================================================

const createContentDocument = [
  {
    "Title": `Test Document ${timestamp}`,
    "Url": "https://example.com/test-doc.pdf",
    "CdnUrl": "https://cdn.example.com/test-doc.pdf",
    "ContentRefId": 1,
    "ContentRefTypeId": 1,
    "FileName": `test-doc-${timestamp}.pdf`,
    "FileId": `file-${timestamp}`,
    "Extension": ".pdf",
    "DocumentSize": 1024.5,
    "IsActive": true,
    "IsPublished": true
  }
];

const updateContentDocument = [
  {
    "Id": 0, // To be replaced with actual ID
    "Title": `Updated Document ${timestamp}`,
    "Url": "https://example.com/updated-doc.pdf",
    "CdnUrl": "https://cdn.example.com/updated-doc.pdf",
    "FileName": `updated-doc-${timestamp}.pdf`,
    "FileId": `file-${timestamp}-updated`,
    "Extension": ".pdf",
    "DocumentSize": 2048.0,
    "IsActive": true,
    "IsPublished": true
  }
];

// =============================================================================
// COURSE MODULE PAYLOADS
// =============================================================================

const pagination = {
  "PageNumber": 1,
  "PageSize": 10,
  "IncludeAllPage": false,
  "SortField": "Id",
  "SortType": "ASC"
};

const createCourse = {
  "Title": `Test Course ${timestamp}`,
  "CourseTypeId": 1,
  "CategoryId": 1,
  "CourseLevelId": 1,
  "Description": "This is a comprehensive test course for automated testing",
  "ThumbnailUrl": "https://example.com/course-thumbnail.jpg",
  "ClientId": "6cffdd62-8649-4d9d-86fe-3066ee447082",
  "IsActive": true,
  "IsPublished": true
};

const updateCourse = {
  "Id": 0, // To be replaced with actual ID
  "Title": `Updated Course ${timestamp}`,
  "CourseTypeId": 1,
  "CategoryId": 1,
  "CourseLevelId": 2,
  "Description": "Updated course description",
  "ThumbnailUrl": "https://example.com/updated-thumbnail.jpg",
  "ClientId": "6cffdd62-8649-4d9d-86fe-3066ee447082",
  "IsActive": true,
  "IsPublished": true
};

// =============================================================================
// COURSE SECTION MODULE PAYLOADS
// =============================================================================

const createCourseSection = {
  "Title": `Test Section ${timestamp}`,
  "Description": "Test section description",
  "CourseId": 0, // To be replaced with actual course ID
  "ClientId": "6cffdd62-8649-4d9d-86fe-3066ee447082",
  "IsActive": true,
  "IsVisible": true,
  "IsPublished": true
};

const updateCourseSection = {
  "Id": 0, // To be replaced with actual ID
  "Title": `Updated Section ${timestamp}`,
  "Description": "Updated section description",
  "CourseId": 0, // To be replaced with actual course ID
  "ClientId": "6cffdd62-8649-4d9d-86fe-3066ee447082",
  "IsActive": true,
  "IsVisible": true,
  "IsPublished": true
};

// =============================================================================
// COURSE LESSION MODULE PAYLOADS
// =============================================================================

const createCourseLession = [
  {
    "CourseSectionId": 0, // To be replaced with actual section ID
    "LearningItemId": 1,
    "LearningItemTypeId": 1,
    "Title": `Test Lesson ${timestamp}`,
    "Description": "Test lesson description",
    "Points": 10,
    "ClientId": "6cffdd62-8649-4d9d-86fe-3066ee447082",
    "IsActive": true,
    "IsPublished": true,
    "IsCompleted": false
  }
];

const updateCourseLession = {
  "Id": 0, // To be replaced with actual ID
  "CourseSectionId": 0, // To be replaced with actual section ID
  "LearningItemId": 1,
  "LearningItemTypeId": 1,
  "Title": `Updated Lesson ${timestamp}`,
  "Description": "Updated lesson description",
  "Points": 15,
  "ClientId": "6cffdd62-8649-4d9d-86fe-3066ee447082",
  "IsActive": true,
  "IsPublished": true,
  "IsCompleted": false
};

// =============================================================================
// COURSE SKILL MODULE PAYLOADS
// =============================================================================

const createCourseSkill = [
  {
    "Title": `Test Skill ${timestamp}`,
    "CourseId": 0, // To be replaced with actual course ID
    "ClientId": "6cffdd62-8649-4d9d-86fe-3066ee447082",
    "IsActive": true,
    "IsPublished": true
  }
];

const updateCourseSkill = [
  {
    "Id": 0, // To be replaced with actual ID
    "Title": `Updated Skill ${timestamp}`,
    "CourseId": 0, // To be replaced with actual course ID
    "ClientId": "6cffdd62-8649-4d9d-86fe-3066ee447082",
    "IsActive": true,
    "IsPublished": true
  }
];

// =============================================================================
// VIDEO MODULE PAYLOADS
// =============================================================================

const createVideo = {
  "Videos": [
    {
      "FileId": `video-${timestamp}`,
      "FileName": `test-video-${timestamp}.mp4`,
      "CategoryId": 1,
      "IsVrEnabled": false,
      "IsPublic": true,
      "VideoType": 1,
      "CdnUrl": "https://cdn.example.com/test-video.mp4",
      "IsSharingAllowed": true,
      "Points": 50
    }
  ]
};

const updateVideo = {
  "UpdateVideos": [
    {
      "Id": 0, // To be replaced with actual ID
      "Name": `Updated Video ${timestamp}`,
      "Title": `Updated Video Title ${timestamp}`,
      "FileName": `updated-video-${timestamp}.mp4`,
      "FileId": `video-${timestamp}-updated`,
      "Tags": "test, updated, automation",
      "CategoryId": 1,
      "IsActive": true,
      "IsPublic": true,
      "Description": "Updated video description",
      "Transcript": "Updated video transcript",
      "VideoLength": 300.0,
      "Points": 75,
      "VideoType": 1,
      "CdnUrl": "https://cdn.example.com/updated-video.mp4"
    }
  ]
};

const updateUserNotes = {
  "UserId": "d5977325-cbd8-4b05-914d-b429dc515 44b", // Test user ID
  "VideoId": 0, // To be replaced with actual video ID
  "Notes": "These are my test notes for the video"
};

// =============================================================================
// NEGATIVE TEST PAYLOADS
// =============================================================================

const invalidAudio = [
  {
    "Title": "", // Empty title
    "AudioLength": -10 // Negative length
  }
];

const invalidCourse = {
  "Title": "", // Empty title
  "CategoryId": 99999, // Non-existent category
  "CourseLevelId": 99999 // Non-existent level
};

const invalidCourseSection = {
  "Title": "", // Empty title (required field)
  "Description": "", // Empty description (required field)
  "CourseId": 99999 // Non-existent course
};

const invalidCourseLession = [
  {
    "CourseSectionId": 99999, // Non-existent section
    "Title": "" // Empty title
  }
];

const invalidCourseSkill = [
  {
    "Title": "", // Empty title (required field)
    "CourseId": 99999 // Non-existent course
  }
];

const invalidVideo = {
  "Videos": [
    {
      "FileName": "", // Empty filename (required)
      "CategoryId": 99999, // Non-existent category
      "VideoType": 999 // Invalid video type
    }
  ]
};

const invalidUpdateNotes = {
  "UserId": "", // Empty user ID (required)
  "VideoId": 99999, // Non-existent video
  "Notes": "A".repeat(6000) // Exceeds maxLength of 5000
};

// =============================================================================
// EXPORTS
// =============================================================================

module.exports = {
  // Audio
  createAudio,
  updateAudio,
  
  // Content Document
  createContentDocument,
  updateContentDocument,
  
  // Course
  pagination,
  createCourse,
  updateCourse,
  
  // Course Section
  createCourseSection,
  updateCourseSection,
  
  // Course Lession
  createCourseLession,
  updateCourseLession,
  
  // Course Skill
  createCourseSkill,
  updateCourseSkill,
  
  // Video
  createVideo,
  updateVideo,
  updateUserNotes,
  
  // Negative tests
  invalidAudio,
  invalidCourse,
  invalidCourseSection,
  invalidCourseLession,
  invalidCourseSkill,
  invalidVideo,
  invalidUpdateNotes
};
