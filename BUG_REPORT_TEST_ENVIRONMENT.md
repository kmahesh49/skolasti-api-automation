# 🐛 Bug Report - TEST Environment Issues

**Date**: January 23, 2026  
**Environment**: TEST (https://clientapi.skillrok.com/api)  
**Reporter**: QA Team  

---

## 🔴 CRITICAL BUGS

### Bug #1: ChatSession API - Backend Service Not Configured
**Priority**: CRITICAL  
**Status**: Blocking entire ChatSession feature  

#### Description
All ChatSession API endpoints return 500 Internal Server Error due to missing dependency injection configuration.

#### Error Message
```
System.InvalidOperationException: Unable to resolve service for type 'Lms.Stream.Services.Interface.IChatSessionService' 
while attempting to activate 'Lms.Admin.WebApi.Controllers.ChatSessionController'.
```

#### Affected Endpoints
- ❌ `POST /ChatSession/startchatsession` - 500
- ❌ `POST /ChatSession/qna` - 500
- ❌ `POST /ChatSession/qnabysessionid` - 500
- ❌ `POST /ChatSession/userundercourseorvideo` - 500
- ❌ `POST /ChatSession/sessionsundercourseorvideoofuser` - 500
- ❌ `PUT /ChatSession/endchatsession` - 500

#### Impact
- **User Impact**: Complete chat session functionality unavailable
- **Test Impact**: Cannot test chat/Q&A features
- **Business Impact**: Live sessions with Q&A disabled

#### Steps to Reproduce
```bash
# Set environment
$env:ENV="test"

# Run test
npx playwright test tests/Client-API/ChatSession.spec.js --workers=1
```

**Expected**: 200 OK with session data  
**Actual**: 500 Internal Server Error

#### Root Cause
`IChatSessionService` is not registered in the TEST environment's dependency injection container.

#### Fix Required
1. Register `IChatSessionService` in Startup.cs for TEST environment
2. Ensure all dependencies are properly configured
3. Verify database connection strings
4. Test all ChatSession endpoints

#### Test File Affected
- `tests/Client-API/ChatSession.spec.js` - All positive tests fail

---

## 🟠 HIGH PRIORITY BUGS

### Bug #2: UserNotification API - Notification Categories Missing in TEST Database
**Priority**: HIGH  
**Status**: Blocking notification feature testing  

#### Description
Creating notification preferences fails because notification category IDs 1, 2, 3 don't exist in TEST database.

#### Error Message
```
Unable to create notification prefernces.
(Note: typo in error message - "prefernces" should be "preferences")
```

#### HTTP Status
`400 Bad Request`

#### Affected Endpoints
- ❌ `POST /UserNotification/createnotificationpreferences?userId={userId}&notificationCategoryId=1` - 400
- ❌ `POST /UserNotification/createnotificationpreferences?userId={userId}&notificationCategoryId=2` - 400
- ❌ `POST /UserNotification/createnotificationpreferences?userId={userId}&notificationCategoryId=3` - 400

#### Steps to Reproduce
```bash
# Test payload
POST /UserNotification/createnotificationpreferences?userId=3f537698-4e5e-4101-9115-626385911940&notificationCategoryId=1
Body: {}

# Result: 400 Bad Request
```

**Expected**: 201 Created with preference data  
**Actual**: 400 Bad Request

#### Root Cause
Notification categories table is empty or missing required seed data in TEST environment.

#### Fix Required
1. **Seed notification categories** in TEST database:
   ```sql
   INSERT INTO NotificationCategories (Id, Name, Description) VALUES
   (1, 'Course Updates', 'Notifications about course changes'),
   (2, 'System Messages', 'Important system notifications'),
   (3, 'User Activity', 'User engagement notifications');
   ```
2. Run database migration/seed script
3. Verify categories exist: `SELECT * FROM NotificationCategories`
4. Fix typo in error message: "prefernces" → "preferences"

#### Test File Affected
- `tests/Client-API/UserNotification.spec.js` - Both positive tests fail

---

### Bug #3: UserCourse API - Watch Progress Update Failing
**Priority**: HIGH  
**Status**: Blocking course progress tracking  

#### Description
Updating enrolled content watch progress fails with 400 error, preventing course completion tracking.

#### Error Message
```
Unable to update enrolled content watch progress
```

#### HTTP Status
`400 Bad Request`

#### Affected Endpoint
- ❌ `POST /Course/updateenrolledcontentwatchprogress` - 400

#### Test Payload
```json
{
  "ContentTypeId": 1,
  "CourseId": 72,
  "CourseLessonId": 1,
  "VideoLength": 600.0,
  "WatchedDuration": 300.0,
  "CompletedPercentage": 50.0
}
```

#### Steps to Reproduce
```bash
# Get a valid course ID first
POST /Course/getallusercourses?viewAllCourseType=1
# Use CourseId from response (e.g., 72)

# Try to update watch progress
POST /Course/updateenrolledcontentwatchprogress
{
  "ContentTypeId": 1,
  "CourseId": 72,
  "CourseLessonId": 1,
  "VideoLength": 600,
  "WatchedDuration": 300,
  "CompletedPercentage": 50
}

# Result: 400 Bad Request
```

**Expected**: 200 OK with updated progress  
**Actual**: 400 Bad Request

#### Root Cause Analysis
One of the following:
1. **CourseLessonId 1 doesn't exist** in the TEST database
2. **User not enrolled** in the course
3. **Invalid ContentTypeId** or lesson doesn't support progress tracking
4. **Validation rules** different in TEST environment

#### Fix Required
1. **Verify lesson exists**: Check if CourseLessonId 1 exists for CourseId 72
2. **Create valid test data**:
   - Ensure course has at least one lesson
   - Enroll test user in the course
   - Verify lesson is progress-trackable
3. **Alternatively**: Update test to use dynamic lesson ID from course details
4. **Add better error message**: Specify which field is invalid

#### Test File Affected
- `tests/Client-API/UserCourse.spec.js` - Watch progress test fails

---

## ✅ VALID SCENARIOS (Not Bugs)

### Empty Data Responses (204 No Content)
These are **correct** responses and should be accepted in tests:

#### Badges API
- ✅ `POST /Badges/getalluserbadges` → 204 when user has no badges
- **Reason**: User hasn't earned any badges yet (valid empty state)

#### Certificates API
- ✅ `GET /Certificates/getallusercertificates` → 204 when no certificates
- ✅ `GET /Certificates/getcertificatebyid` → 204 when certificate doesn't exist
- **Reason**: User hasn't completed any certifications yet (valid empty state)

#### UserCourse API
- ✅ `GET /Course/getplaylistdetails?playListId=1` → 204 when playlist doesn't exist
- **Reason**: Playlist hasn't been created yet (valid empty state)

---

## 📋 Test Data Requirements for TEST Environment

### Required Database Seeds

#### 1. Notification Categories
```sql
-- NotificationCategories table
INSERT INTO NotificationCategories (Id, Name, Description, IsActive) VALUES
(1, 'Course Updates', 'Notifications about course changes and updates', 1),
(2, 'System Messages', 'Important system-wide notifications', 1),
(3, 'User Activity', 'User engagement and activity notifications', 1);
```

#### 2. Chat Session Service Configuration
```csharp
// In Startup.cs (TEST environment)
services.AddScoped<IChatSessionService, ChatSessionService>();
services.AddScoped<IChatSessionRepository, ChatSessionRepository>();
// Ensure database connection string is valid for TEST
```

#### 3. Course Lesson Data
```sql
-- Ensure courses have lessons with valid IDs
-- For testing course progress tracking
INSERT INTO CourseLessons (Id, CourseSectionId, LearningItemId, Title, IsActive) 
VALUES (1, <valid_section_id>, <valid_item_id>, 'Introduction Lesson', 1);
```

---

## 🔧 How to Fix Tests (After Bugs Are Fixed)

Once the development team fixes these bugs, the tests should pass without modification. The tests were **correctly** expecting:

1. **ChatSession endpoints**: 200 OK (not 500)
2. **UserNotification creation**: 200/201 (not 400)
3. **UserCourse watch progress**: 200 OK (not 400)

**No test changes needed** - the bugs are in the API/database, not the tests.

---

## 📊 Test Execution Summary

### Before Bug Fixes
- **Total Tests**: 46
- **Passing**: ~30 (estimated)
- **Failing**: ~16 (estimated)
- **Pass Rate**: ~65%

### Critical Failures
- ❌ All ChatSession tests (6 tests)
- ❌ UserNotification preferences (2 tests)
- ❌ UserCourse watch progress (1 test)

### After Bug Fixes (Expected)
- **Total Tests**: 46
- **Passing**: 46
- **Failing**: 0
- **Pass Rate**: 100% ✅

---

## 🎯 Action Items

### For Development Team
- [ ] Fix Bug #1: Configure ChatSession service in TEST
- [ ] Fix Bug #2: Seed notification categories in TEST database
- [ ] Fix Bug #3: Fix course watch progress validation or seed proper test data
- [ ] Fix typo: "prefernces" → "preferences" in error message

### For QA Team
- [ ] Generate new auth token (current token expired: 2026-01-23T08:35:02Z)
- [ ] Re-run tests after dev fixes bugs
- [ ] Verify all 46 tests pass
- [ ] Update test data requirements document

### For DevOps
- [ ] Ensure TEST environment has same database seed scripts as DEV
- [ ] Verify all service dependencies are configured
- [ ] Add health check endpoints for critical services
- [ ] Document TEST environment setup process

---

## 📞 Contact

For questions about this bug report, contact the QA Team or refer to:
- Test Files: `tests/Client-API/*.spec.js`
- Environment Config: `config/config.js`
- Documentation: `ENVIRONMENT_DIFFERENCES.md`

---

**Generated**: January 23, 2026  
**Next Review**: After bugs are fixed and tests re-run
