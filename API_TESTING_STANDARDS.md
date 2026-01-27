# API Testing Standards & Guidelines

> **Created:** January 23, 2026  
> **Version:** 1.0  
> **Purpose:** Ensure consistent, reliable API testing practices across all test files

---

## 🎯 Core Principle

**Never mask real failures to show passing tests.**

API tests should expose bugs, not hide them. If an API returns an error code (400, 500, etc.) in a positive test scenario, the test should **FAIL** and alert the team to fix the backend, not accept the error to make the test pass.

---

## ✅ Valid Status Code Acceptance

### When to Accept Multiple Status Codes

**Only in these specific scenarios:**

### 1. Empty Data Scenarios (204 No Content)
```javascript
// ✅ CORRECT - 204 is a valid success response for empty collections
const badges = await api.post("/Badges/getalluserbadges", payload, [200, 204]);
const certificates = await api.post("/Certificates/getallusercertificates", payload, [200, 204]);
```

**Why?** 
- 200: Data exists, returned successfully
- 204: No data exists (valid empty collection)
- Both are **successful responses**, not errors
- **Important:** This applies to GET ALL / collection queries, NOT GET by ID

**Distinction:**
- ✅ `getalluserbadges` → Can return 204 (user has 0 badges) 
- ❌ `getbadgebyid?id=123` → Should return 404 if not found (not 204)

### 2. Cache Invalidation / No-Content Operations
```javascript
// ✅ CORRECT - Cache operations may return 204
const response = await api.post("/Category/invalidatecategorycaches", {}, [200, 204]);
```

### 3. Create/Update Operations (201 Created)
```javascript
// ✅ CORRECT - Some APIs return 200, others return 201 for creation
const created = await api.post("/UserNotification/createnotificationpreferences", payload, [200, 201]);
```

**Why?**
- 200: Resource created successfully
- 201: Resource created (with Location header)
- Both indicate **successful creation**

### 4. GET After CREATE Pattern
```javascript
// ✅ CORRECT - After creating a resource, GET by ID should return 200 ONLY
const createdPlan = await api.create("/Subscription/createsubscriptionplan", payload, 200);
const planId = createdPlan.PlanId;

// Should expect 200 ONLY (we just created it, it MUST exist)
const planDetails = await api.post(`/Subscription/getplanById?planId=${planId}`, paginationPayload, 200);
```

**Why?**
- We just CREATED the resource
- It MUST exist in the database
- Should return 200 with data
- **Never accept 204** here - if it returns 204, that's a bug

**Distinction:**
- ✅ GET resource we just created → Expect 200 only
- ✅ GET ALL resources (collection) → Accept [200, 204] if empty is valid
- ❌ GET resource by random ID we didn't create → Should return 404 if not found (not 204)

---

## ❌ Invalid Status Code Acceptance

### NEVER Accept Error Codes in Positive Tests

```javascript
// ❌ WRONG - Accepting 500 error in positive test
const session = await api.post("/ChatSession/startchatsession", payload, [200, 500]);
if (session === null) {
  console.log("⚠️ Skipping due to 500 error");
  return; // This masks the bug!
}

// ❌ WRONG - Accepting 400 error in positive test
const preference = await api.post("/UserNotification/createnotificationpreferences", payload, [200, 201, 400]);
if (preference === null) {
  // Conditional logic to handle failure
  return; // This defeats the purpose of testing!
}

// ❌ WRONG - Accepting 400 error in positive test
const progress = await api.post("/Course/updatewatchprogress", payload, [200, 400]);
```

**Why This is Wrong:**
- 400 = Bad Request (client error - payload issue)
- 500 = Internal Server Error (backend bug)
- These are **REAL BUGS** that need dev team attention
- Tests should FAIL to alert the team
- Accepting these errors makes tests useless

---

## 🧪 Negative Test Cases

### Proper Error Validation in Negative Tests

Negative tests should **expect and validate specific error codes**, not accept both success and error codes.

```javascript
// ❌ WRONG - Accepting both success and error
test("Invalid pagination", async () => {
  const response = await api.post("/Badges/getalluserbadges", invalidPayload);
  expect([200, 400]).toContain(response.status); // This doesn't properly test!
});

// ✅ CORRECT - Expect only error codes
test("Invalid pagination", async () => {
  const response = await api.post("/Badges/getalluserbadges", invalidPayload);
  expect(response.status).toBe(400); // Should only return 400 for bad data
});

// ✅ CORRECT - Accept multiple error codes if API is inconsistent
test("Invalid user ID", async () => {
  const response = await api.get("/Certificates/getcertificatebyid?userId=invalid");
  expect([400, 404]).toContain(response.status); // Either bad request OR not found
  // Note: 200 is NOT included!
});
```

**Key Principle:** Negative tests should expect **only error codes**, never success codes mixed with errors.

---

## 📊 Status Code Reference

### Success Codes (2xx)
- **200 OK**: Request succeeded, data returned
- **201 Created**: Resource created successfully
- **204 No Content**: Request succeeded, no data to return

### Client Error Codes (4xx)
- **400 Bad Request**: Invalid payload, validation failed
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource doesn't exist
- **422 Unprocessable Entity**: Validation error (semantic)

### Server Error Codes (5xx)
- **500 Internal Server Error**: Backend bug (code crash)
- **502 Bad Gateway**: Gateway/proxy issue
- **503 Service Unavailable**: Service temporarily down

---

## � CRUD Testing Pattern

### Standard CRUD Flow (6-Step Pattern)

All CRUD operations should follow this mandatory sequence:

```javascript
test.describe('Resource CRUD Flow', () => {
  let createdResourceId;

  // Step 1: CREATE - Create the resource
  test('Step 1: CREATE - POST /api/Resource/create', async ({ request }) => {
    const response = await request.post(`${baseURL}/Resource/create`, {
      headers: config.headers,
      data: payloads.createResource
    });
    expect([200, 201]).toContain(response.status());
    
    const body = await response.json();
    createdResourceId = body.Id || body.id;
    console.log(`Created Resource ID: ${createdResourceId}`);
  });

  // Step 2: GET - Verify the created resource (EXPECT 200 ONLY)
  test('Step 2: GET - GET /api/Resource/getbyid', async ({ request }) => {
    test.skip(!createdResourceId, 'Skipping: No resource ID from create');
    
    const response = await request.get(`${baseURL}/Resource/getbyid?id=${createdResourceId}`, {
      headers: config.headers
    });
    expect(response.status()).toBe(200); // MUST return 200 - we just created it!
  });

  // Step 3: UPDATE - Update the resource
  test('Step 3: UPDATE - PUT /api/Resource/update', async ({ request }) => {
    test.skip(!createdResourceId, 'Skipping: No resource ID from create');
    
    const updatePayload = { ...payloads.updateResource, Id: createdResourceId };
    const response = await request.put(`${baseURL}/Resource/update`, {
      headers: config.headers,
      data: updatePayload
    });
    expect([200, 201]).toContain(response.status());
  });

  // Step 4: GET - Verify the update (EXPECT 200 ONLY)
  test('Step 4: GET - Verify update - GET /api/Resource/getbyid', async ({ request }) => {
    test.skip(!createdResourceId, 'Skipping: No resource ID from create');
    
    const response = await request.get(`${baseURL}/Resource/getbyid?id=${createdResourceId}`, {
      headers: config.headers
    });
    expect(response.status()).toBe(200); // MUST return 200 - we just updated it!
  });

  // Step 5: DELETE - Delete the resource
  test('Step 5: DELETE - DELETE /api/Resource/delete/{id}', async ({ request }) => {
    test.skip(!createdResourceId, 'Skipping: No resource ID from create');
    
    const response = await request.delete(`${baseURL}/Resource/delete/${createdResourceId}`, {
      headers: config.headers
    });
    expect([200, 204]).toContain(response.status()); // Both are valid for DELETE
  });

  // Step 6: GET - Verify deletion (EXPECT 204 or 404)
  test('Step 6: GET - Verify deletion - GET /api/Resource/getbyid (expect 204/404)', async ({ request }) => {
    test.skip(!createdResourceId, 'Skipping: No resource ID from create');
    
    const response = await request.get(`${baseURL}/Resource/getbyid?id=${createdResourceId}`, {
      headers: config.headers
    });
    expect([204, 404]).toContain(response.status()); // Resource should be gone
  });
});
```

### CRUD Pattern Rules

1. **Step 1 (CREATE)**: Accept `[200, 201]` - Both indicate successful creation
2. **Step 2 (GET after CREATE)**: Accept `200` ONLY - Resource MUST exist (we just created it)
3. **Step 3 (UPDATE)**: Accept `[200, 201]` - Both indicate successful update
4. **Step 4 (GET after UPDATE)**: Accept `200` ONLY - Resource MUST exist (we just updated it)
5. **Step 5 (DELETE)**: Accept `[200, 204]` - Both are valid for deletion
6. **Step 6 (GET after DELETE)**: Accept `[204, 404]` - Resource should be gone

### Critical Status Code Rules

**Never accept 204 in Steps 2 and 4 (GET after CREATE/UPDATE):**
- ❌ WRONG: `expect([200, 204]).toContain(response.status())` in Step 2/4
- ✅ CORRECT: `expect(response.status()).toBe(200)` in Step 2/4
- **Why?** If API returns 204 after successful CREATE/UPDATE, that's a BUG to be documented, not accommodated

**Only accept 204 in Step 6 (GET after DELETE):**
- ✅ CORRECT: `expect([204, 404]).toContain(response.status())` in Step 6
- **Why?** Both 204 and 404 indicate resource no longer exists

### Test Dependencies

Use `test.skip()` to handle dependencies:
```javascript
test.skip(!createdResourceId, 'Skipping: No resource ID from create');
```

This ensures:
- Tests don't fail if previous steps failed
- Clear indication of which step broke the flow
- Better debugging experience

---

## 📝 Decision Matrix

| Scenario | Accept Status Codes | Example |
|----------|-------------------|---------|
| **CRUD Step 1 (CREATE)** | `[200, 201]` | POST create resource |
| **CRUD Step 2 (GET after CREATE)** | `200` ONLY | GET resource we just created |
| **CRUD Step 3 (UPDATE)** | `[200, 201]` | PUT update resource |
| **CRUD Step 4 (GET after UPDATE)** | `200` ONLY | GET resource we just updated |
| **CRUD Step 5 (DELETE)** | `[200, 204]` | DELETE resource |
| **CRUD Step 6 (GET after DELETE)** | `[204, 404]` | Verify resource deleted |
| **Positive Test - Empty Collection** | `[200, 204]` | Get all badges (user has none) |
| **Positive Test - GET by ID (not created)** | `[200, 404]` | Query hardcoded ID that might not exist |
| **Positive Test - Cache Operation** | `[200, 204]` | Invalidate cache |
| **Negative Test - Bad Data** | `400` or `422` only | Invalid pagination |
| **Negative Test - Not Found** | `404` only | Non-existent resource |
| **Negative Test - Ambiguous** | `[400, 404]` | Could be bad request OR not found |
| **Positive Test - Backend Bug** | ❌ NEVER accept `500` | Let test fail! |
| **Positive Test - Validation** | ❌ NEVER accept `400` | Let test fail! |
| **GET after CREATE/UPDATE** | ❌ NEVER accept `204` | Let test fail - it's a bug! |

---

## 🔧 Fixing Masked Failures

### Step 1: Identify Inappropriate Acceptance

Search for patterns like:
```javascript
[200, 500]   // ❌ Accepting server errors
[200, 400]   // ❌ Accepting validation errors (in positive tests)
[200, 201, 400]  // ❌ Accepting validation errors (in positive tests)
```

### Step 2: Revert to Strict Validation

```javascript
// Before (WRONG)
const response = await api.post("/endpoint", payload, [200, 500]);
if (response === null) {
  console.log("⚠️ Skipping due to error");
  return;
}

// After (CORRECT)
const response = await api.post("/endpoint", payload, 200);
// Test will fail if API returns 500 - this is GOOD!
```

### Step 3: Document Real Bugs

When tests fail after fixing:
1. Don't change the test back to accept errors
2. Document the bug in a bug report
3. Share with dev team
4. Wait for backend fix
5. Re-run tests - they'll pass naturally

---

## 📋 Code Review Checklist

Before committing test code:

- [ ] Positive tests accept only valid success codes (200, 201, 204)
- [ ] No 400/500 errors accepted in positive test flows
- [ ] Empty data scenarios properly handle 204 (if applicable)
- [ ] Negative tests expect only error codes (no 200 mixed in)
- [ ] No conditional logic to skip tests on errors
- [ ] No null checks to bypass test assertions
- [ ] Error responses properly documented in bug reports

---

## 🐛 Bug Reporting vs Test Fixing

### When Test Fails - Decision Tree

```
Test fails with unexpected status code
    │
    ├─→ Expected 200, got 500?
    │   └─→ Backend bug - Document and report
    │       Don't change test to accept 500
    │
    ├─→ Expected 200, got 400?
    │   └─→ Validation bug or missing test data
    │       Document requirements and report
    │       Don't change test to accept 400
    │
    ├─→ Expected 200, got 204?
    │   └─→ Empty data (valid scenario)
    │       Change test to accept [200, 204]
    │
    └─→ Expected 400, got 200?
        └─→ Negative test issue - Review test logic
            Should the test expect an error?
```

---

## 📊 CRUD Pattern Implementation Status

### ✅ Fully Implemented (Following 6-Step Pattern)
- **Course-API/CourseAPI.spec.js**: All 7 modules (Course, Audio, ContentDocument, CourseSection, CourseLession, CourseSkill, Video)
  - 48 tests across 7 modules
  - Proper status code validation (200 for GET, 204 only after DELETE)
  - Dependencies handled with `test.skip()`

### 🔄 Partial Implementation (Needs Standardization)
- **Client/QuizCrud.spec.js**: Has CRUD steps but may need status code validation review
- **Client/Subscription.spec.js**: Has CRUD flow but may need status code validation review
- **Tenant-API/Tenant.spec.js**: Has CRUD operations but needs standardization

### ⚠️ Needs CRUD Pattern Implementation
Files using different patterns that should be updated:
- **Admin-API/** (4 files): FeatureFlag, Notification, UserManagement, VisibilityTenantSettings
- **Client-API/** (8 files): Badges, Categories, Certificates, ChatSession, Sessions, Subscription, UserCourse, UserNotification
- **Course/** (8 files): Audio, Course, CourseCrud, CourseLesson, CourseSection, CourseSkills, Document, Video
- **Marketing-API/** (4 files): CourseData, MarketingPages, PageContent, PageSection

### 📋 Migration Checklist

When updating test files to CRUD pattern:

1. **Structure**:
   - [ ] Group tests into `test.describe('Module CRUD Flow', () => {})`
   - [ ] Use shared variables for IDs: `let createdResourceId;`
   - [ ] Label tests as Step 1-6 with clear descriptions

2. **Status Codes**:
   - [ ] Step 1 (CREATE): Accept `[200, 201]`
   - [ ] Step 2 (GET after CREATE): Accept `200` ONLY
   - [ ] Step 3 (UPDATE): Accept `[200, 201]`
   - [ ] Step 4 (GET after UPDATE): Accept `200` ONLY
   - [ ] Step 5 (DELETE): Accept `[200, 204]`
   - [ ] Step 6 (GET after DELETE): Accept `[204, 404]`

3. **Dependencies**:
   - [ ] Add `test.skip(!createdResourceId, 'Skipping: No resource ID from create')` to Steps 2-6
   - [ ] Log created IDs: `console.log(`Created Resource ID: ${id}`)`

4. **Error Handling**:
   - [ ] Remove acceptance of 500 errors in positive tests
   - [ ] Remove acceptance of 400 errors in positive tests
   - [ ] Remove acceptance of 204 in Steps 2 and 4
   - [ ] Let tests fail to expose bugs

---

## 🎓 Examples from Our Project

### ✅ Correct Implementations

**1. Badges with Empty State**
```javascript
// File: Badges.spec.js, Line 67
const userBadges = await api.post("/Badges/getalluserbadges", userBadgesPayload, [200, 204]);
// ✅ Correct: User might have no badges (204 is valid)
```

**2. Certificates with Empty State**
```javascript
// File: Certificates.spec.js, Line 38
const certificates = await api.post("/Certificates/getallusercertificates", paginationPayload, [200, 204]);
// ✅ Correct: User might have no certificates (204 is valid)
```

**3. Notification Preferences Creation**
```javascript
// File: UserNotification.spec.js, Line 38 (After Fix)
const createdPreference = await api.post("/UserNotification/createnotificationpreferences", payload, [200, 201]);
// ✅ Correct: Both 200 and 201 indicate successful creation
```

**4. Negative Test - Invalid Pagination**
```javascript
// File: Badges.spec.js, Line 155 (After Fix)
const status = response.status();
expect(status).toBe(400); // Should return 400 for invalid pagination
// ✅ Correct: Negative test expects only error code
```

### ❌ Mistakes We Fixed

**1. ChatSession - Accepting 500 Errors**
```javascript
// BEFORE (WRONG)
const sessionResponse = await api.post("/ChatSession/startchatsession", payload, [200, 500]);
if (sessionResponse === null) {
  console.log("⚠️ Skipping due to 500 error");
  return;
}

// AFTER (CORRECT)
const sessionResponse = await api.post("/ChatSession/startchatsession", payload, 200);
// Test properly fails, exposing backend service configuration bug
```

**2. UserNotification - Accepting 400 Errors**
```javascript
// BEFORE (WRONG)
const createdPreference = await api.post("/UserNotification/createnotificationpreferences", payload, [200, 201, 400]);
if (createdPreference === null) {
  // Skip test
  return;
}

// AFTER (CORRECT)
const createdPreference = await api.post("/UserNotification/createnotificationpreferences", payload, [200, 201]);
// Test properly fails, exposing missing categories in TEST database
```

**3. Negative Tests - Accepting Success Codes**
```javascript
// BEFORE (WRONG)
expect([200, 400]).toContain(status); // Accepts both success and error

// AFTER (CORRECT)
expect(status).toBe(400); // Expects only error for invalid data
```

---

## 🔄 Continuous Improvement

### For Future Test Development

1. **Start Strict**: Always write tests to expect only valid success codes
2. **Fail Fast**: Let tests fail if API has bugs
3. **Document Bugs**: Create bug reports, don't modify tests
4. **Add 204 Only When Needed**: Only after confirming empty data is valid
5. **Review Regularly**: Check for inappropriate error acceptance patterns

### Common Questions

**Q: Test is failing with 500 error, what should I do?**  
A: Don't change the test. Document the bug and report to dev team. The test is doing its job by failing.

**Q: Can I accept [200, 404] in a GET request?**  
A: Only in negative tests. In positive tests, expect 200 only. If resource doesn't exist, it's a test data issue, not a reason to accept 404.

**Q: API sometimes returns 200, sometimes 201 for creation. What to do?**  
A: Accept [200, 201] since both indicate successful creation. This is valid for CREATE operations only.

**Q: User has no data, API returns 204. Should I accept it?**  
A: Yes, accept [200, 204] for retrieval operations where empty data is a valid business scenario (badges, certificates, playlists, etc.).

---

## 📚 Related Documents

- [BUG_REPORT_TEST_ENVIRONMENT.md](BUG_REPORT_TEST_ENVIRONMENT.md) - Current bugs found in TEST environment
- [SOFT_ASSERTIONS_GUIDE.md](SOFT_ASSERTIONS_GUIDE.md) - When to use soft vs hard assertions
- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - Overall project structure and setup

---

## 🎯 Success Metrics

A well-tested API suite should:
- ✅ Expose backend bugs through test failures
- ✅ Clearly distinguish between valid empty states and errors
- ✅ Provide actionable bug reports when tests fail
- ✅ Pass consistently after backend bugs are fixed
- ❌ NOT hide errors to show green status
- ❌ NOT accept multiple status codes without clear justification

---

**Remember:** The goal of testing is to find bugs, not to achieve 100% pass rate by accepting errors!

*"A passing test that masks a bug is worse than a failing test that exposes it."*
