// UserManagement API Payloads
// Admin API - User management, roles, and profile operations

module.exports = {
  // Pagination for listing
  pagination: {
    PageNumber: 1,
    PageSize: 10,
    IncludeAllPage: false,
    SortField: "name",
    SortType: "asc"
  },

  paginationWithFilter: {
    PageNumber: 1,
    PageSize: 10,
    IncludeAllPage: false,
    FilterField: "email",
    FilterText: "test",
    SortField: "name",
    SortType: "desc"
  },

  paginationInvalid: {
    PageNumber: 0, // Invalid: minimum is 1
    PageSize: 25, // Invalid: maximum is 20
    IncludeAllPage: false
  },

  // Update User Role
  updateUserRole: {
    UserId: "3f537698-4e5e-4101-9115-626385911940",
    RoleId: 2
  },

  updateUserRoleInvalid: {
    UserId: "", // Empty user ID
    RoleId: 2
  },

  // Bulk Invite User
  bulkInviteUsers: [
    {
      RegistrationUrl: "https://test.skillrok.com/register",
      UserEmailId: "newuser1@test.com",
      RoleId: 1
    },
    {
      RegistrationUrl: "https://test.skillrok.com/register",
      UserEmailId: "newuser2@test.com",
      RoleId: 2
    }
  ],

  bulkInviteUsersSingle: [
    {
      RegistrationUrl: "https://test.skillrok.com/register",
      UserEmailId: "singleuser@test.com",
      RoleId: 1
    }
  ],

  bulkInviteUsersInvalid: [
    {
      RegistrationUrl: "https://test.skillrok.com/register",
      UserEmailId: "invalid-email" // Invalid email format
    }
  ],

  // Invite User (single)
  inviteUser: {
    EmailId: "inviteduser@test.com",
    ClientId: "bbf5b899-4a34-4474-a0ab-5b69d9c51f92",
    TenantId: "6cffdd62-8649-4d9d-86fe-3066ee447082",
    Domian: "test.skillrok.com",
    RoleId: 1
  },

  inviteUserMinimal: {
    EmailId: "minimalinvite@test.com"
  },

  inviteUserInvalid: {
    EmailId: "", // Empty email
    ClientId: "test"
  },

  // Update User Profile
  updateUserProfile: {
    UserId: "3f537698-4e5e-4101-9115-626385911940",
    Name: "Updated User Name",
    FirstName: "Updated",
    LastName: "Name",
    LanguageId: 1,
    Email: "updated@test.com",
    ContactNumber: "+1234567890",
    Profession: "Software Engineer",
    OrganizationName: "Test Company",
    Expirence: "5 years",
    Bio: "Test bio updated",
    Website: "https://test.com",
    Learninginsights: ["JavaScript", "Python", "API Testing"],
    Preferences: ["Video Courses", "Interactive Labs"],
    ProfileUpdateType: 1
  },

  updateUserProfileMinimal: {
    UserId: "3f537698-4e5e-4101-9115-626385911940",
    FirstName: "Minimal Update"
  },

  updateUserProfileInvalid: {
    UserId: "", // Empty required field
    Name: "Invalid"
  },

  // Update Preferred Language
  updateLanguage: {
    UserId: "3f537698-4e5e-4101-9115-626385911940",
    LanguageId: 1
  },

  updateLanguageInvalid: {
    UserId: "3f537698-4e5e-4101-9115-626385911940",
    LanguageId: -1 // Invalid language ID
  },

  // Upload Profile Picture (multipart/form-data)
  // Note: File upload will use Playwright's setInputFiles() method
  uploadProfilePicture: {
    userId: "3f537698-4e5e-4101-9115-626385911940"
    // FileContent will be handled separately in test
  }
};
