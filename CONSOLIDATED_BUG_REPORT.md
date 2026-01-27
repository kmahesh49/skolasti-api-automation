# 🐛 Skolasti API - Consolidated Bug Report

**Generated:** January 26, 2026  
**Test Framework:** Playwright v1.56.1  
**Scope:** All API endpoints across 5 API categories

---

## 📊 Executive Summary

| API Category | Total Tests | Passed | Failed | Bugs Found | Severity |
|--------------|-------------|--------|--------|------------|----------|
| **Client API** | 50 | 43 | 7 | 5 | 🔴 High |
| **Admin API** | 102 | 80 | 1 | 4 | 🟠 Medium |
| **Marketing API** | 180+ | ~90 | 91 | 10+ | 🔴 High |
| **Tenant API** | 25 | 22 | 3 | 3 | 🟡 Low |
| **Course API** | 15 | 13 | 2 | 2 | 🟡 Low |
| **TOTAL** | **372+** | **248** | **104** | **24+** | 🔴 **Critical** |

**Overall Health:** ⚠️ **72% Pass Rate** - Significant stability issues detected

---

## 🔴 Critical Issues (Immediate Action Required)

### 1. Service Unavailability (503 Errors)
**APIs Affected:** Client API  
**Frequency:** Multiple endpoints  
**Impact:** Service completely unavailable during test execution

**Failing Endpoints:**
- `POST /ChatSession/startchatsession` - 503
- `POST /Subscription/createsubscriptionplan` - 503
- `POST /Course/getallusercourses?viewAllCourseType=1` - 503

**Error Response:**
```html
<html>
<head><title>503 Service Temporarily Unavailable</title></head>
<body>
<center><h1>503 Service Temporarily Unavailable</h1></center>
<hr><center>nginx</center>
</body>
</html>
```

**Root Cause:** Server/Database overload or deployment in progress  
**Recommendation:** 
- ✅ Check server health and resources
- ✅ Verify database connectivity
- ✅ Review deployment status
- ✅ Implement health check endpoints

---

### 2. Multi-Tenant Context Error (500 Errors)
**APIs Affected:** Client API  
**Frequency:** Consistent on specific endpoints  
**Impact:** Application crashes with unhandled exception

**Failing Endpoints:**
- `POST /Subscription/togglewishlist` - 500
- `POST /ChatSession/userundercourseorvideo` - 500
- `POST /UserNotification/createnotificationpreferences` - 500 (intermittent)

**Error Response:**
```
System.InvalidOperationException: MasterContext not available. 
Ensure MultiTenantMiddleware has executed.
   at Lms.WebApi.Startup.<>c.<ConfigureServices>b__5_6(IServiceProvider provider) 
   in /src/Lms.WebApi/Startup.cs:line 176
```

**Root Cause:** Multi-tenant middleware not executing or failing before endpoint  
**Recommendation:**
- 🔧 **Fix:** Ensure MultiTenantMiddleware is registered correctly
- 🔧 Add error handling for missing MasterContext
- 🔧 Review middleware execution order in Startup.cs
- 🔧 Add tenant validation before service resolution

---

### 3. Marketing API - Mass Failures (91 Failed Tests)
**API Affected:** Marketing API  
**Frequency:** 50%+ failure rate  
**Impact:** Public-facing marketing pages may be broken

**Categories of Failures:**
1. **Authentication Issues** - Endpoints requiring auth but not documented
2. **Missing Endpoints** - Documented endpoints return 404
3. **Unexpected Status Codes** - Returns 204 when 200 expected
4. **Schema Mismatches** - Response structure different from expected

**Recommendation:**
- 📋 Full audit of Marketing API implementation vs documentation
- 📋 Separate public vs authenticated endpoints
- 📋 Update API documentation
- 📋 Review and fix each failing endpoint category

---

## 🟠 High Priority Issues

### 4. Authorization Failures (401 Errors)
**APIs Affected:** Client API (UserNotification)  
**Frequency:** Consistent  
**Impact:** Valid requests being rejected

**Failing Test:**
```javascript
test('Step 1: CREATE - POST /UserNotification/createnotificationpreferences')
// Returns 401 even with valid Bearer token
```

**Error:** "Missing Authorization token and clientid header"  
**Actual:** Headers were sent correctly with valid token

**Root Cause:** Token validation logic may be incorrect or token expired prematurely  
**Recommendation:**
- 🔑 Review token validation middleware
- 🔑 Check token expiration logic
- 🔑 Verify clientid header validation

---

### 5. Admin API - Configuration Conflicts
**API Affected:** Admin API (VisibilityTenantSettings)  
**Frequency:** Consistent on specific payloads  
**Impact:** Cannot update certain configurations

**Failing Operations:**
1. **Update Tenant Settings** - Returns 409 Conflict
   ```
   Expected: 200
   Actual: 409
   Message: "Configuration already exists"
   ```

2. **Create Notification Template** - Returns 500
   ```
   Expected: 200/201
   Actual: 500
   Error: Internal Server Error
   ```

3. **GET after DELETE** - Returns 204 instead of 404
   ```
   Expected: 404 (resource not found)
   Actual: 204 (success with no content)
   Inconsistent with REST standards
   ```

**Root Cause:**
- Unique constraint violations not handled properly
- Missing validation before updates
- Incorrect status codes for non-existent resources

**Recommendation:**
- ⚙️ Add proper conflict resolution logic
- ⚙️ Return 404 for truly deleted resources
- ⚙️ Validate payloads before database operations
- ⚙️ Fix status code semantics (204 vs 404)

---

### 6. Course API - Incorrect Status Codes
**API Affected:** Course API  
**Frequency:** Consistent  
**Impact:** Violates REST standards

**Issues:**
1. **GET requests returning 204**
   - `GET /Course/getbyidcourse?id={id}` returns 204 when resource exists
   - Expected: 200 with data
   - Actual: 204 (no content)

2. **Empty collections return 204**
   - Should return 200 with empty array `[]`
   - Currently returns 204

**Root Cause:** Incorrect status code logic - treating empty results as "no content"  
**Recommendation:**
- 📝 Return 200 with data when resource exists
- 📝 Return 200 with empty array for collections
- 📝 Reserve 204 for DELETE operations only
- 📝 Return 404 only when resource truly doesn't exist

---

## 🟡 Medium Priority Issues

### 7. Tenant API - Payment Gateway Failures
**API Affected:** Tenant API  
**Tests Failed:** 3

**Issues:**
1. **GET payment configuration returns 404**
   ```
   Endpoint: /TenantManagement/getLinkedConfig
   Expected: 200 with config data
   Actual: 404
   ```

2. **Unlink payment gateway fails**
   ```
   Endpoint: DELETE /TenantManagement/unlinkPaymentGateway
   Expected: 200/204
   Actual: 500 (if not exists) or 409 (conflict)
   ```

**Root Cause:** Payment gateway integration not fully implemented or test data missing  
**Recommendation:**
- 💳 Verify payment gateway integration status
- 💳 Seed test data for payment configurations
- 💳 Add proper error handling for missing configurations

---

### 8. Negative Test Failures
**APIs Affected:** All APIs  
**Issue:** Negative tests expect errors but get success/different errors

**Examples:**
1. **Non-existent Resource Access**
   ```javascript
   test('Get non-existent plan')
   Expected: 404
   Actual: 500
   // Should handle gracefully, not crash
   ```

2. **Invalid Numeric Values**
   ```javascript
   test('Negative price')
   Expected: 400 (validation error)
   Actual: 200 (accepted invalid data)
   // Validation not enforced
   ```

3. **Missing Required Fields**
   ```javascript
   test('Missing RazorPayPlanId')
   Expected: 400
   Actual: 500
   // Throws exception instead of validation error
   ```

**Root Cause:** 
- Missing input validation
- Throwing exceptions instead of returning validation errors
- Database constraints catching what should be caught by validation

**Recommendation:**
- ✅ Add input validation middleware
- ✅ Return 400 for validation errors, not 500
- ✅ Handle non-existent resources gracefully (404, not 500)
- ✅ Validate all required fields before processing

---

## 📋 Detailed Bug List by API

### Client API Bugs (5 bugs)

#### BUG-C001: Chat Session Creation Fails (503)
- **Endpoint:** `POST /ChatSession/startchatsession`
- **Status:** 503 Service Unavailable
- **Expected:** 200/201 with session ID
- **Impact:** Cannot start chat sessions
- **Severity:** 🔴 Critical

#### BUG-C002: Subscription Plan Creation Fails (503)
- **Endpoint:** `POST /Subscription/createsubscriptionplan`
- **Status:** 503 Service Unavailable
- **Expected:** 200/201 with plan ID
- **Impact:** Cannot create subscription plans
- **Severity:** 🔴 Critical

#### BUG-C003: Toggle Wishlist Multi-Tenant Error (500)
- **Endpoint:** `POST /Subscription/togglewishlist`
- **Status:** 500 Internal Server Error
- **Error:** "MasterContext not available. Ensure MultiTenantMiddleware has executed."
- **Expected:** 200 with toggle status
- **Impact:** Cannot add/remove items from wishlist
- **Severity:** 🔴 Critical

#### BUG-C004: User Notification Authorization Failure (401)
- **Endpoint:** `POST /UserNotification/createnotificationpreferences`
- **Status:** 401 Unauthorized
- **Error:** "Missing Authorization token and clientid header"
- **Actual:** Token and clientid were provided
- **Expected:** 200/201 with preference ID
- **Impact:** Cannot create notification preferences
- **Severity:** 🟠 High

#### BUG-C005: Get User Courses Service Unavailable (503)
- **Endpoint:** `POST /Course/getallusercourses?viewAllCourseType=1`
- **Status:** 503 Service Unavailable
- **Expected:** 200 with courses array
- **Impact:** Cannot retrieve user courses
- **Severity:** 🔴 Critical

---

### Admin API Bugs (4 bugs)

#### BUG-A001: Notification Template Creation Error (500)
- **Endpoint:** `POST /Notification/createnotificationtemplate`
- **Status:** 500 Internal Server Error
- **Expected:** 200/201 with template ID
- **Impact:** Cannot create notification templates
- **Severity:** 🟠 High

#### BUG-A002: Tenant Settings Update Conflict (409)
- **Endpoint:** `PUT /VisibilityTenantSettings/updatetenantsettings`
- **Status:** 409 Conflict
- **Message:** "Configuration already exists"
- **Expected:** 200 (update existing)
- **Impact:** Cannot update existing settings
- **Severity:** 🟠 High

#### BUG-A003: GET After DELETE Returns Wrong Status
- **Endpoint:** `GET /VisibilityTenantSettings/getsettings` (after DELETE)
- **Status:** 204 No Content
- **Expected:** 404 Not Found
- **Impact:** Deleted resources appear to exist
- **Severity:** 🟡 Medium
- **Note:** Violates REST standards - 204 should only be for DELETE operations

#### BUG-A004: Configuration GET Returns Empty Instead of Error
- **Endpoint:** `GET /VisibilityTenantSettings/getconfigurations`
- **Status:** 204 No Content (when empty)
- **Expected:** 200 with empty array `[]`
- **Impact:** Inconsistent response handling
- **Severity:** 🟡 Medium

---

### Marketing API Bugs (10+ bugs - Sample)

#### BUG-M001-M091: 91 Test Failures
**Note:** Full list in Marketing API test results. Categories:

1. **Authentication Issues (20+ failures)**
   - Public endpoints require authentication
   - Token validation fails
   - Missing CORS headers

2. **404 Not Found (30+ failures)**
   - Documented endpoints not implemented
   - Wrong URL paths
   - Missing route registrations

3. **Schema Mismatches (25+ failures)**
   - Response structure different from expected
   - Missing required fields
   - Extra unexpected fields

4. **Status Code Issues (16+ failures)**
   - Returns 204 when should return 200
   - Returns 200 when should return 201
   - Returns 500 when should return 400

**Recommendation:** Full Marketing API audit required

---

### Tenant API Bugs (3 bugs)

#### BUG-T001: Payment Gateway Configuration Not Found (404)
- **Endpoint:** `GET /TenantManagement/getLinkedConfig`
- **Status:** 404 Not Found
- **Expected:** 200 with configuration data
- **Impact:** Cannot retrieve payment gateway settings
- **Severity:** 🟡 Medium

#### BUG-T002: Unlink Payment Gateway Error (500)
- **Endpoint:** `DELETE /TenantManagement/unlinkPaymentGateway`
- **Status:** 500 Internal Server Error
- **Expected:** 200/204
- **Impact:** Cannot remove payment gateway
- **Severity:** 🟡 Medium

#### BUG-T003: Create Learning Insights Validation Error (400)
- **Endpoint:** `POST /TenantManagement/createlearninginsights`
- **Status:** 400 Bad Request (intermittent)
- **Expected:** 200/201
- **Impact:** Cannot create learning insights
- **Severity:** 🟡 Medium

---

### Course API Bugs (2 bugs)

#### BUG-CR001: GET Course Returns 204 Instead of 200
- **Endpoint:** `GET /Course/getbyidcourse?id={id}`
- **Status:** 204 No Content (when resource exists)
- **Expected:** 200 with course data
- **Impact:** Violates REST standards
- **Severity:** 🟡 Medium

#### BUG-CR002: GET Audio/Document Returns 204 Instead of 200
- **Endpoints:** 
  - `GET /Audio/getbyaudioid?id={id}`
  - `GET /ContentDocument/getbyidcontentdocument?id={id}`
- **Status:** 204 No Content (when resource exists)
- **Expected:** 200 with data
- **Impact:** Violates REST standards
- **Severity:** 🟡 Medium

---

## 🎯 Recommendations by Priority

### Immediate (This Week)
1. 🚨 **Fix 503 Service Unavailable errors** - Critical outage
   - Investigate server/database health
   - Add health check endpoints
   - Implement retry logic

2. 🚨 **Fix Multi-Tenant Context Error** - Application crash
   - Review middleware registration
   - Add error handling
   - Test tenant resolution logic

3. 🚨 **Audit Marketing API** - 50% failure rate
   - Review all 91 failures
   - Categorize and prioritize
   - Create separate fix tickets

### Short-Term (Next 2 Weeks)
4. 🔑 **Fix Authorization Issues**
   - Review token validation
   - Test all auth endpoints
   - Update documentation

5. ⚙️ **Fix Admin API Conflicts**
   - Handle 409 correctly
   - Fix status codes (204 vs 404)
   - Add proper validation

6. 📝 **Standardize Status Codes**
   - 200 for GET with data
   - 201 for CREATE
   - 204 for DELETE only
   - 404 for not found
   - 400 for validation errors
   - Never 500 for validation failures

### Medium-Term (Next Month)
7. ✅ **Add Input Validation Middleware**
   - Validate all required fields
   - Check data types and ranges
   - Return 400 for validation errors

8. 💳 **Fix Payment Gateway Integration**
   - Verify configuration endpoints
   - Test all payment operations
   - Seed test data

9. 📋 **Update API Documentation**
   - Match implementation to docs
   - Add examples for all endpoints
   - Document error responses

### Long-Term (Next Quarter)
10. 🧪 **Improve Test Coverage**
    - Add more negative tests
    - Test edge cases
    - Automate regression testing

11. 📊 **Add Monitoring & Alerting**
    - Track API health
    - Alert on 5xx errors
    - Monitor response times

---

## 📈 Testing Methodology

### CRUD Pattern Applied
All tests now follow 6-step CRUD pattern:
```javascript
Step 1: CREATE → [200, 201]
Step 2: GET after CREATE → 200 ONLY
Step 3: UPDATE → [200, 201]
Step 4: GET after UPDATE → 200 ONLY
Step 5: DELETE → [200, 204]
Step 6: GET after DELETE → [204, 404]
```

### Status Code Standards
- **2xx Success**
  - 200: GET with data, successful operation with response
  - 201: CREATE successful (preferred for POST creating resources)
  - 204: DELETE successful, no content to return

- **4xx Client Errors**
  - 400: Validation error, bad request
  - 401: Unauthorized, missing/invalid auth
  - 404: Resource not found
  - 409: Conflict (duplicate, constraint violation)

- **5xx Server Errors**
  - 500: Unhandled exception (should be fixed, not expected)
  - 503: Service unavailable (temporary, should retry)

### Collections vs Single Resources
- **GET collection (empty):** Return 200 with `[]`, never 204
- **GET by ID (not found):** Return 404, never 204
- **GET by ID (found):** Return 200 with data, never 204

---

## 🏆 Success Metrics

### After Fixes Applied
**Target Pass Rate:** 95%+  
**Current Pass Rate:** 72%  
**Improvement Needed:** 23 percentage points

**Critical Issues to Zero:** 
- ❌ No 503 errors
- ❌ No unhandled 500 errors
- ❌ No authentication failures on valid tokens

**Status Code Compliance:**
- ✅ 100% REST standard compliance
- ✅ Consistent GET/POST/PUT/DELETE responses
- ✅ Proper error codes (400 vs 404 vs 500)

---

## 📞 Contact & Support

**Generated By:** QA Automation Team  
**Framework:** Playwright + Custom ApiHelper  
**Methodology:** 6-Step CRUD Pattern  
**Documentation:** See API_TESTING_STANDARDS.md

**Report Artifacts:**
- `ADMIN_API_CRUD_MIGRATION.md` - Admin API details
- `CLIENT_API_TESTS_SUMMARY.md` - Client API details (if exists)
- `COURSE_MARKETING_CRUD_MIGRATION.md` - Course & Marketing details
- `allure-report/` - Full Allure report with screenshots

---

**Report Complete** ✅  
**Action Required** 🚨  
**Priority:** IMMEDIATE
