/**
 * Payloads for Marketing API - CourseData endpoints
 * Base URL: /api/CourseData
 */

module.exports = {
  // GET /api/CourseData/getcontentreviews query params
  getContentReviews: {
    validRequest: {
      contentId: 1,
      contentTypeId: 1,
      PageNumber: 1,
      PageSize: 10
    },
    invalidContentId: {
      contentId: -1,
      contentTypeId: 1,
      PageNumber: 1,
      PageSize: 10
    },
    invalidPagination: {
      contentId: 1,
      contentTypeId: 1,
      PageNumber: 25, // max is 20
      PageSize: 25    // max is 20
    }
  },

  // POST /api/CourseData/getallcourses
  getAllCourses: {
    validRequest: {
      PageNumber: 1,
      PageSize: 10,
      IncludeAllPage: false,
      SortField: "Title",
      SortType: "ASC"
    },
    withFilters: {
      PageNumber: 1,
      PageSize: 10,
      FilterField: "Title",
      FilterText: "Test",
      CategoryIds: [1, 2],
      CourseTypes: [1]
    },
    emptyFilters: {
      PageNumber: 1,
      PageSize: 10,
      IncludeAllPage: true
    }
  },

  // POST /api/CourseData/inviteuser
  inviteUser: {
    validRequest: {
      EmailId: "testuser@example.com",
      ClientId: "test-client-id",
      TenantId: "test-tenant-id",
      Domian: "skillrok.com",
      RoleId: 1
    },
    invalidEmail: {
      EmailId: "invalid-email",
      ClientId: "test-client-id",
      TenantId: "test-tenant-id",
      Domian: "skillrok.com",
      RoleId: 1
    },
    missingRequired: {
      EmailId: "testuser@example.com"
      // Missing other required fields
    }
  }
};
