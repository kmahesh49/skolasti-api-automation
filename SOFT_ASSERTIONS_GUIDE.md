# Soft Assertions Guide

## Overview
The API automation framework now supports **soft assertions**, which allow tests to continue execution even when assertions fail. All failures are collected and reported at the end of the test.

## How It Works

### Traditional Hard Assertions (OLD)
```javascript
// Test stops immediately if this fails
expect(response.status()).toBe(200);
// These lines won't execute if above fails
await api.update(...);
await api.delete(...);
```

### Soft Assertions (NEW)
```javascript
// All API calls execute even if some fail
await api.create(...);  // Fails but continues
await api.get(...);     // Executes
await api.update(...);  // Executes
await api.delete(...);  // Executes

// At the end, all failures are reported together
api.assertAll();  // Throws error with all failures
```

## Usage Example

```javascript
const { test } = require("@playwright/test");
const { ApiHelper } = require("../../utils/ApiHelper.js");

test("Course CRUD with soft assertions", async ({ request }) => {
  const api = new ApiHelper(request, CoursebaseURL, headers);

  // CREATE - even if this fails, test continues
  const createResponse = await api.create("/Course/createcourse", payload, 200);
  const courseId = createResponse.Id;

  // GET - executes even if CREATE failed
  const getResponse = await api.get(`/Course/getbyidcourse?id=${courseId}`, 200);

  // UPDATE - executes even if GET failed
  await api.update("/Course/updatecourse", updatePayload, 201);

  // DELETE - executes even if UPDATE failed
  await api.delete(`/course/deletebyidcourse/${courseId}`, 204);

  // VERIFY DELETION - executes even if DELETE failed
  await api.verifyDeleted(`/Course/getbyidcourse?id=${courseId}`);

  // ⚠️ IMPORTANT: Call assertAll() at the end
  // This checks all soft assertions and fails the test if any failed
  api.assertAll();
});
```

## Benefits

### 1. Complete Test Execution
- All API calls execute regardless of intermediate failures
- Get complete picture of which APIs work and which don't
- Better debugging with full execution logs

### 2. Detailed Failure Reports
```
❌ TEST FAILED WITH 3 ASSERTION(S):

1. GET /Course/getbyidcourse?id=123 should return status 200, got 404
   Error: Expected: 200, Received: 404

2. UPDATE /Course/updatecourse should return status 201, got 500
   Error: Expected: 201, Received: 500

3. DELETE /course/deletebyidcourse/123 should be successful (2xx status)
   Error: Expected: true, Received: false
```

### 3. Better Allure Reports
- All steps shown in report (passed and failed)
- Clear visibility of which operations succeeded
- Failed assertions highlighted with details

## Console Output

### During Execution
```
✓ PASS: CREATE /Course/createcourse should return status 200, got 200
✗ FAIL: GET /Course/getbyidcourse?id=123 should return status 200, got 404
  Error: Expected values to be strictly equal
✓ PASS: UPDATE /Course/updatecourse should return status 201, got 201
✓ PASS: DELETE /course/deletebyidcourse/123 should return status 204, got 204
```

### At End
```
❌ TEST FAILED WITH 1 ASSERTION(S):
1. GET /Course/getbyidcourse?id=123 should return status 200, got 404
   Error: Expected values to be strictly equal
```

## Important Notes

### ⚠️ Always Call `assertAll()`
```javascript
// ❌ BAD - Failures are silently ignored
await api.create(...);
await api.get(...);
// Test ends here - failures not reported!

// ✅ GOOD - Failures are reported
await api.create(...);
await api.get(...);
api.assertAll(); // Reports all failures
```

### Null/Undefined Safety
Even if an API fails and returns null/undefined, subsequent calls will attempt to execute:
```javascript
const createResponse = await api.create(...); // Returns null on failure
const courseId = createResponse?.Id; // Use optional chaining

await api.get(`/Course/getbyidcourse?id=${courseId}`, 200); // Still executes
```

### Works With All ApiHelper Methods
- ✅ `api.create()`
- ✅ `api.get()`
- ✅ `api.update()`
- ✅ `api.delete()`
- ✅ `api.post()`
- ✅ `api.verifyDeleted()`
- ✅ `api.validateArrayData()`

## Migration Guide

### Before (Hard Assertions)
```javascript
const api = new ApiHelper(request, baseURL, headers);
await api.create(...); // Stops here if fails
await api.get(...);
await api.update(...);
await api.delete(...);
```

### After (Soft Assertions)
```javascript
const api = new ApiHelper(request, baseURL, headers);
await api.create(...); // Continues even if fails
await api.get(...);
await api.update(...);
await api.delete(...);
api.assertAll(); // Add this line at the end
```

## Configuration

Soft assertions are enabled by default in all ApiHelper methods. No configuration needed!

The Playwright config also enables:
- `fullyParallel: true` - Tests run in parallel
- `retries: 0` - See failures immediately (can be increased)
- `trace: 'retain-on-failure'` - Debug traces for failed tests

## Example Test Files

See these files for complete examples:
- `tests/Course/Course.spec.js` - Course CRUD with soft assertions
- `tests/Course/Audio.spec.js` - Audio operations
- `tests/Course/Document.spec.js` - Document operations
- `tests/Course/CourseLesson.spec.js` - Lesson operations

All test files should call `api.assertAll()` at the end of each test.
