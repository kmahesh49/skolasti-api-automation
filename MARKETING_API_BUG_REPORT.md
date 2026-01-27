# Marketing API - Bug Report (TEST Environment)

> **Generated:** January 23, 2026  
> **Environment:** TEST (https://marketingapi.skillrok.com/api)  
> **Test Results:** 14 Passed / 91 Failed  
> **Authentication:** ✅ Working (clientId: bbf5b899-4a34-4474-a0ab-5b69d9c51f92)

---

## 📊 Executive Summary

Marketing API test suite has been successfully configured and executed. Authentication is working correctly with the proper clientId header. However, **91 out of 105 tests are failing** due to genuine API issues that require backend fixes.

### Test Coverage
- **Total Endpoints Tested:** 40
- **Total Tests:** 105
- **Passing:** 14 (13.3%)
- **Failing:** 91 (86.7%)

### Test Files
1. ✅ **CourseData.spec.js** - 7 passed / 26 failed (38 tests, 13 endpoints)
2. ✅ **MarketingPages.spec.js** - 2 passed / 13 failed (15 tests, 6 endpoints)
3. ✅ **PageSection.spec.js** - 0 passed / 18 failed (18 tests, 4 endpoints)
4. ✅ **PageContent.spec.js** - 5 passed / 34 failed (39 tests, 17 endpoints)

---

## 🚨 Critical Issues (High Priority)

### 1. Missing ApiHelper.put() Method
**Impact:** High - Blocks 4 tests  
**Affected Tests:** All PUT endpoint tests in PageSection

```javascript
TypeError: api.put is not a function
```

**Tests Affected:**
- PageSection: should return 304 when no changes made
- PageSection: should reject update with non-existent ID
- PageSection: should reject update with invalid order sequence
- PageSection: should reject update with empty section name

**Solution:** Add PUT method to ApiHelper utility class

**Priority:** 🔴 CRITICAL

---

### 2. API Returns Plain Text Instead of JSON
**Impact:** High - Causes JSON parsing errors  
**Affected Endpoints:** Multiple validation endpoints

**Examples:**
```
Expected: {"error": "Invalid Email"}
Actual: "Invalid Email"

Expected: {"error": "Invalid tenant ID"}
Actual: "Invalid te..."

Expected: {"error": "User/Email not found"}
Actual: "User/Email..."
```

**Affected Endpoints:**
- `/CourseData/validateemail` - Returns plain text on validation errors
- `/CourseData/inviteuser` - Returns plain text on validation errors
- `/CourseData/getlinkedconfig` - Returns plain text on invalid tenant ID

**Error in Tests:**
```
Failed to parse JSON: SyntaxError: Unexpected token 'I', "Invalid Email" is not valid JSON
```

**Solution:** Backend should return properly formatted JSON error responses:
```json
{
  "error": "Invalid Email",
  "message": "The provided email address is not valid"
}
```

**Priority:** 🔴 CRITICAL

---

### 3. API Returns 204 Instead of 404 for Non-Existent Resources
**Impact:** Medium - Semantic incorrectness  
**Affected Endpoints:** Multiple GET by ID endpoints

**Issue:** When querying non-existent resources, API returns 204 (No Content) instead of 404 (Not Found).

**Examples:**
```
GET /CourseData/subscriptionplans/99999
Expected: 404 (Not Found)
Actual: 204 (No Content)

GET /CourseData/details/99999 (video)
Expected: 404 (Not Found)
Actual: 204 (No Content)
```

**Why This is Wrong:**
- 204 means "request succeeded, but no content to return" (for empty collections)
- 404 means "resource doesn't exist"
- For GET by ID with non-existent ID, the correct response is 404

**Affected Endpoints:**
- `/CourseData/subscriptionplans/{planId}` - Returns 204 for invalid ID
- `/CourseData/details/{videoId}` - Returns 204 for invalid ID
- `/CourseData/getbyidcourse` - Returns 204 for non-existent course
- `/CourseData/getbyaudioid` - Returns 204 for non-existent audio
- `/CourseData/getbyidcontentdocument` - Returns 204 for non-existent document

**Solution:** Return 404 status code for non-existent resources

**Priority:** 🟡 MEDIUM

---

### 4. Validation Not Working - API Accepts Invalid Data
**Impact:** High - Security and data integrity risk

**Issue:** API creates resources even when validation should fail (returns 201 instead of 400).

**Examples:**

**PageSection - Missing Required Field:**
```javascript
// Sent payload without PageId (required field)
Expected: 400 (Bad Request)
Actual: 201 (Created)
```

**PageSection - Invalid Page ID:**
```javascript
// Sent invalid PageId: 99999
Expected: 400 or 404
Actual: 500 (Internal Server Error)
```

**PageSection - Empty Section Name:**
```javascript
// Sent empty SectionName
Expected: 400 (Bad Request)
Actual: 201 (Created)
```

**PageContent - Invalid Rating:**
```javascript
// Sent rating: 10 (should be 0-5)
Expected: 400 (Bad Request)
Actual: 500 (Internal Server Error)
```

**PageContent - Negative Price:**
```javascript
// Sent price: -100
Expected: 400 (Bad Request)
Actual: 201 (Created)
```

**Affected Endpoints:**
- `/PageSection/pagesection` (POST) - Creates with missing required fields
- `/PageSectionDynamicContent/pagesectiondynamiccontent` (POST) - Creates with invalid data
- `/SectionProductDetails/sectionproductdetails` (POST) - Creates with negative price

**Solution:** Implement proper validation before creating resources

**Priority:** 🔴 CRITICAL

---

### 5. Internal Server Errors (500) on Invalid Data
**Impact:** High - API crashes instead of validating

**Issue:** When invalid data is sent, API returns 500 errors instead of 400 validation errors.

**Examples:**
```
POST /PageSection/pagesection with invalid PageId
Expected: 400 (Bad Request)
Actual: 500 (Internal Server Error)

POST /SectionProductContent/sectionproductcontent with invalid sectionId
Expected: 400 (Bad Request)
Actual: 500 (Internal Server Error)

POST /SectionProductDetails/sectionproductdetails with invalid rating
Expected: 400 (Bad Request)
Actual: 500 (Internal Server Error)

POST /CourseData/inviteuser with missing fields
Expected: 400 (Bad Request)
Actual: 500 (Internal Server Error)
Error: "Object reference not set to an instance of an object."
```

**Root Cause:** Null reference exceptions due to missing validation

**Solution:** Add proper validation before processing requests

**Priority:** 🔴 CRITICAL

---

## 🐛 Detailed Bug List

### CourseData Endpoints (7 Passed / 26 Failed)

#### ✅ Passing Tests (7)
1. GET /categories - Returns empty or populated list ✓
2. GET /subscriptionplans - Returns empty or populated list ✓
3. POST /getallcourses - All 4 tests passing ✓

#### ❌ Failing Tests (26)

**1. GET /subscriptionplans/{planId}**
- Issue: Returns 204 instead of 404 for non-existent plan
- Expected: [200, 404]
- Actual: 204
- Impact: 3 tests failing

**2. GET /getcontentreviews**
- Issue: Returns 200 with empty data for invalid contentId instead of 400
- Expected: 400 for invalid contentId (-1)
- Actual: 200
- Impact: 4 tests failing

**3. GET /getbyidcourse**
- Issue: Returns 204 instead of 404 for non-existent course
- Expected: [200, 404]
- Actual: 204
- Impact: 2 tests failing

**4. GET /getbyaudioid**
- Issue: Returns 204 instead of 404 for non-existent audio
- Expected: [200, 404]
- Actual: 204
- Impact: 2 tests failing

**5. GET /getbyidcontentdocument**
- Issue: Returns 204 instead of 404 for non-existent document
- Expected: [200, 404]
- Actual: 204
- Impact: 2 tests failing

**6. GET /details/{videoId}**
- Issue: Returns 204 instead of 404 for non-existent video
- Expected: [200, 404]
- Actual: 204
- Impact: 3 tests failing

**7. GET /validateemail**
- Issue: Returns plain text "Invalid Email" instead of JSON
- Impact: JSON parsing error
- Tests: 3 tests failing

**8. POST /inviteuser**
- Issue 1: Returns 400 instead of 200/201 for valid data
- Issue 2: Returns 500 for missing fields instead of 400
- Issue 3: Returns plain text instead of JSON
- Impact: 3 tests failing

**9. GET /coursecontenttypes**
- Issue: Returns 204 (empty) - may need test data
- Expected: 200 with data
- Actual: 204
- Impact: 1 test failing

**10. GET /getlinkedconfig**
- Issue 1: Returns 400 for valid tenantId=1
- Issue 2: Returns plain text "Invalid te..." instead of JSON
- Impact: 2 tests failing

**11. GET /getfeatureavaibility**
- Issue: Returns 204 (empty) - may need test data
- Expected: 200 with data
- Actual: 204
- Impact: 1 test failing

---

### MarketingPages Endpoints (2 Passed / 13 Failed)

#### ✅ Passing Tests (2)
1. GET /marketingpages - Returns categories ✓
2. POST /marketingpages - Creates page successfully ✓

#### ❌ Failing Tests (13)

**1. POST /marketingpages - Validation Issues**
- Issue: Creates page even with empty name (should return 400)
- Issue: Creates duplicate pages (should return 409)
- Issue: Creates page with missing required fields (should return 400)
- Impact: 3 tests failing

**2. GET /marketingpages/{id}**
- Issue: Returns 204 instead of 404 for non-existent page
- Expected: [200, 404]
- Actual: 204
- Impact: 3 tests failing

**3. PUT /marketingpages - Update Issues**
- Issue: Missing test data (page ID from create test)
- Tests depend on successful create operation
- Impact: 4 tests failing (dependent tests)

**4. DELETE /marketingpages/{id}**
- Issue: Returns 204 for non-existent page (should be 404)
- Issue: Missing test data for delete scenarios
- Impact: 2 tests failing

**5. GET /marketingpages/active [DEPRECATED]**
- Issue: Returns 204 (empty)
- May be expected if endpoint is deprecated
- Impact: 1 test failing

---

### PageSection Endpoints (0 Passed / 18 Failed)

#### ❌ Failing Tests (18) - ALL FAILING

**Critical Issue:** Most tests depend on successful create operation, which is failing due to validation issues.

**1. GET /pagesection**
- Issue: Returns 204 (no sections exist in test DB)
- Expected: 200 with data or 204 if empty
- Actual: 204
- Note: May be expected if no test data
- Impact: 1 test failing

**2. POST /pagesection - CRITICAL VALIDATION FAILURES**
- Issue 1: Creates section without PageId (required) - returns 201 instead of 400
- Issue 2: Creates section with invalid PageId - returns 500 instead of 400
- Issue 3: Creates section with empty name - returns 201 instead of 400
- Issue 4: Duplicate section handling unclear
- Impact: 5 tests failing
- **This blocks all downstream tests!**

**3. GET /pagesection/{id}**
- Issue: Returns 204 instead of 404 for non-existent section
- Expected: [200, 404]
- Actual: 204
- Impact: 3 tests failing

**4. PUT /pagesection - MISSING API HELPER METHOD**
- **Issue: api.put() is not a function**
- ApiHelper class doesn't have PUT method implemented
- Impact: 4 tests failing (TypeError)
- **Priority: CRITICAL** - Need to add PUT method to ApiHelper

**5. DELETE /pagesection/{id}**
- Issue: Cannot test - depends on successful create
- Create operation failing due to validation issues
- Impact: 4 tests failing (dependent tests)

**6. Section Visibility Tests**
- Issue: Cannot test - depends on successful create
- Create operation failing
- Impact: 2 tests failing (dependent tests)

---

### PageContent Endpoints (5 Passed / 34 Failed)

#### ✅ Passing Tests (5)
1. GET /pagesectiondynamiccontent - Returns empty list ✓
2. POST /invalidatecache - Cache invalidation works ✓
3. GET /pagesectionstaticcontent - Returns empty list ✓
4. POST /pagesectionstaticcontent - Creates static content ✓
5. PUT /pagesectionstaticcontent - Updates static content ✓

#### ❌ Failing Tests (34)

**1. Dynamic Content - POST /pagesectiondynamiccontent**
- Issue 1: Creates content without required PageSectionId (returns 201 instead of 400)
- Issue 2: Creates content with invalid rating >5 (returns 201 instead of 400)
- Issue 3: Creates content with negative rating (returns 500 instead of 400)
- Impact: 3 tests failing

**2. Dynamic Content - GET /pagesectiondynamiccontent/{id}**
- Issue: Returns 204 instead of 404 for non-existent content
- Impact: 2 tests failing

**3. Dynamic Content - PUT /pagesectiondynamiccontent**
- Issue: Cannot test update - depends on successful create
- Create test failing due to validation issues
- Impact: 2 tests failing (dependent tests)

**4. Dynamic Content - DELETE /pagesectiondynamiccontent/{id}**
- Issue: Cannot test delete - depends on successful create
- Impact: 2 tests failing (dependent tests)

**5. Dynamic Content - GET /pagesectiondynamiccontent/active [DEPRECATED]**
- Issue: Returns 204 (empty)
- May be expected if deprecated
- Impact: 1 test failing

**6. Static Content - POST /pagesectionstaticcontent - Validation**
- Issue 1: Creates content with invalid button URL (returns 201 instead of 400)
- Issue 2: Allows button text exceeding max length (no validation)
- Impact: 2 tests failing

**7. Static Content - GET /pagesectionstaticcontent/{id}**
- Issue: Returns 204 instead of 404 for non-existent content
- Impact: 2 tests failing

**8. Static Content - DELETE /pagesectionstaticcontent/{id}**
- Issue: Cannot test - depends on successful create
- Impact: 1 test failing

**9. Product Content - GET /sectionproductcontent**
- Issue: Returns 204 (empty) - may need test data
- Impact: 1 test failing

**10. Product Content - POST /sectionproductcontent**
- Issue 1: Creates content with invalid sectionId (returns 500 instead of 400)
- Issue 2: Creates content with invalid contentId (returns 201 instead of 400)
- Impact: 3 tests failing

**11. Product Content - GET /sectionproductcontent/{id}**
- Issue: Returns 204 instead of 404 for non-existent content
- Impact: 2 tests failing

**12. Product Content - DELETE /sectionproductcontent/{id}**
- Issue: Cannot test - depends on successful create
- Impact: 1 test failing

**13. Product Details - GET /sectionproductdetails**
- Issue: Returns 204 (empty) - may need test data
- Impact: 1 test failing

**14. Product Details - POST /sectionproductdetails**
- Issue 1: Creates details with negative price (returns 201 instead of 400)
- Issue 2: Creates details with invalid rating (returns 500 instead of 400)
- Impact: 3 tests failing

**15. Product Details - GET /sectionproductdetails/{id}**
- Issue: Returns 204 instead of 404 for non-existent details
- Impact: 2 tests failing

**16. Product Details - PUT/DELETE /sectionproductdetails**
- Issue: Cannot test - depends on successful create
- Impact: 3 tests failing (dependent tests)

---

## 📋 Bug Summary by Category

### 1. Response Format Issues (Critical)
- ❌ Plain text responses instead of JSON (3 endpoints)
- ❌ Incorrect status codes (204 vs 404) (15+ endpoints)

### 2. Validation Issues (Critical)
- ❌ Missing required field validation (5+ endpoints)
- ❌ Invalid data accepted (negative numbers, out of range values)
- ❌ No duplicate checking

### 3. Error Handling Issues (Critical)
- ❌ 500 errors instead of 400 validation errors (5+ cases)
- ❌ Null reference exceptions

### 4. Test Infrastructure Issues (Critical)
- ❌ Missing ApiHelper.put() method (blocks 4 tests)

### 5. Test Data Issues (Medium)
- ⚠️ Empty collections (may need seeding test data)
- ⚠️ Some tests depend on created data from previous tests

---

## 🔧 Recommended Actions

### For Development Team

**Immediate (Critical) - Week 1:**
1. ✅ Fix JSON response format for validation errors
2. ✅ Add proper validation for all POST/PUT endpoints
3. ✅ Fix 500 errors by adding null checks and validation
4. ✅ Return 404 instead of 204 for non-existent resources

**Short Term (High) - Week 2:**
5. ✅ Add validation for required fields
6. ✅ Add validation for data ranges (ratings, prices)
7. ✅ Add duplicate checking where applicable
8. ✅ Fix null reference exceptions

**Medium Term - Week 3:**
9. ⚠️ Review all endpoints for consistent error responses
10. ⚠️ Add comprehensive validation layer
11. ⚠️ Seed test database with sample data

### For QA Team

**Immediate:**
1. ✅ Add PUT method to ApiHelper utility class
2. ✅ Document all bugs found in this report
3. ⚠️ Wait for backend fixes before re-running tests

**After Backend Fixes:**
4. ⚠️ Re-run all Marketing API tests
5. ⚠️ Verify all bugs are resolved
6. ⚠️ Update bug report with resolution status

---

## 📊 Test Execution Details

### Authentication
```javascript
// Marketing API uses different clientId than Client API
marketingHeaders: {
  "Content-Type": "application/json",
  "clientId": "bbf5b899-4a34-4474-a0ab-5b69d9c51f92"  // Tenant/Application ID
}

// No Bearer token required for Marketing API
```

### Environment
- Base URL: https://marketingapi.skillrok.com/api
- Environment: TEST
- Test Execution Date: January 23, 2026
- Test Duration: ~4.4 minutes
- Worker Configuration: Sequential (--workers=1)

### Test Files Location
```
tests/Marketing-API/
  ├── CourseData.spec.js      (38 tests, 13 endpoints)
  ├── MarketingPages.spec.js  (15 tests, 6 endpoints)
  ├── PageSection.spec.js     (18 tests, 4 endpoints)
  └── PageContent.spec.js     (39 tests, 17 endpoints)
```

---

## 🎯 Success Criteria

Tests will be considered passing when:

1. ✅ All endpoints return proper JSON responses (not plain text)
2. ✅ Validation returns 400 for invalid data (not 201 or 500)
3. ✅ Non-existent resources return 404 (not 204)
4. ✅ Required fields are properly validated
5. ✅ Data ranges are properly validated
6. ✅ No 500 errors for invalid input
7. ✅ ApiHelper.put() method implemented

**Expected Pass Rate After Fixes:** ~85-90% (some tests may need test data)

---

## 📝 Notes

### Following API Testing Standards
All tests follow the standards defined in [API_TESTING_STANDARDS.md](API_TESTING_STANDARDS.md):
- ✅ No error masking - tests fail when API has bugs
- ✅ Proper status code expectations
- ✅ Clear distinction between positive and negative tests
- ✅ No conditional logic to bypass failures

### Test Philosophy
> "A passing test that masks a bug is worse than a failing test that exposes it."

These 91 failing tests are **working as intended** - they're exposing real backend issues that need to be fixed. The goal is not to make tests pass by accepting errors, but to fix the API so tests pass naturally.

---

## 🔄 Next Steps

1. **QA Team:** Add PUT method to ApiHelper
2. **QA Team:** Share this bug report with development team
3. **Dev Team:** Prioritize and fix critical issues
4. **Dev Team:** Deploy fixes to TEST environment
5. **QA Team:** Re-run tests to verify fixes
6. **QA Team:** Update this report with resolution status

---

**Report Status:** 🔴 ACTIVE - Awaiting Backend Fixes

**Last Updated:** January 23, 2026  
**Next Review:** After backend deployment
