// Notification API Payloads
// Admin API - Notifications and notification templates management

module.exports = {
  // Create Notification
  createNotification: {
    Title: "Test Notification",
    RecipitentGroupIds: [1, 2],
    RecipitentUserIds: ["3f537698-4e5e-4101-9115-626385911940"],
    CategoryId: 1,
    TemplateId: 1,
    TypeID: 1
  },

  createNotificationMinimal: {
    Title: "Minimal Test Notification",
    CategoryId: 1,
    TemplateId: 1,
    TypeID: 1
  },

  createNotificationInvalid: {
    // Missing required Title field
    CategoryId: 1,
    TemplateId: 1,
    TypeID: 1
  },

  // Update Notification
  updateNotification: {
    NotificationId: 1,
    Title: "Updated Test Notification",
    RecipitentGroupIds: [1],
    RecipitentUserIds: ["3f537698-4e5e-4101-9115-626385911940"],
    CategoryId: 1,
    TemplateId: 1,
    TypeId: 1
  },

  updateNotificationInvalid: {
    NotificationId: 0, // Invalid ID
    Title: "Updated Notification",
    CategoryId: 1,
    TemplateId: 1,
    TypeId: 1
  },

  // Create Notification Templates (array)
  createNotificationTemplates: [
    {
      Title: "Welcome Email Template",
      Content: "Welcome to our platform! {{username}}",
      Placeholder: "{{username}}, {{email}}",
      Subject: "Welcome to Skolasti",
      CategoryName: "Welcome",
      Description: "Template for welcoming new users"
    },
    {
      Title: "Password Reset Template",
      Content: "Click here to reset: {{resetLink}}",
      Placeholder: "{{resetLink}}, {{email}}",
      Subject: "Password Reset Request",
      CategoryName: "Security"
    }
  ],

  createNotificationTemplatesSingle: [
    {
      Title: "Test Template",
      Content: "Test content {{placeholder}}",
      Placeholder: "{{placeholder}}",
      Subject: "Test Subject",
      CategoryName: "Test"
    }
  ],

  createNotificationTemplatesInvalid: [
    {
      // Missing required Title
      Content: "Invalid content",
      Placeholder: "{{test}}",
      Subject: "Invalid",
      CategoryName: "Invalid"
    }
  ],

  // Update Notification Templates
  updateNotificationTemplates: {
    Id: 1,
    Title: "Updated Template Title",
    Subject: "Updated Subject",
    Content: "Updated content with {{newPlaceholder}}",
    Placeholder: "{{newPlaceholder}}",
    IsActive: true,
    IsDeleted: false
  },

  updateNotificationTemplatesMinimal: {
    Id: 1
  },

  updateNotificationTemplatesInvalid: {
    Id: 0 // Invalid ID
  }
};
