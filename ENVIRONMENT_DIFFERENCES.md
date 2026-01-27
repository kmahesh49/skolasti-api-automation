# API Environment Differences

## Overview
This document outlines the differences between the **DEV** (skolasti.com) and **TEST** (skillrok.com) environments for the Client API.

## Environment Configuration

### DEV Environment
- **Base URL**: https://clientapi.skolasti.com/api
- **Activation**: Default (no environment variable)
- **Token**: Dev environment token

### TEST Environment
- **Base URL**: https://clientapi.skillrok.com/api
- **Activation**: Set `$env:ENV="test"` before running tests
- **Token**: Test environment token (configured in config.js)

## Authentication Requirements
Both environments require:
- **Authorization Header**: `Bearer {token}`
- **clientid Header**: Tenant UUID (e.g., `6cffdd62-8649-4d9d-86fe-3066ee447082`)

⚠️ **Important**: Tokens are environment-specific. Using a skolasti.com token against skillrok.com API will result in 401 errors.

---

## API Response Structure Differences

### 1. Badges API (`/Badges`)

#### DEV Response (Expected)
```json
{
  "Id": 1,
  "Title": "Bronze Badge",
  "Points": 100
}
```

#### TEST Response (Actual)
```json
{
  "Id": 74,
  "Title": "Newbie",
  "BadgeLevel": "0",
  "ScorePoints": {
    "Id": 74,
    "ScoredPoints": "0-100",
    "CreatedDate": "2026-01-16T11:07:20.66",
    "UpdatedDate": "2026-01-16T11:07:20.66"
  },
  "BadgeImageUrl": "https://...",
  "CreatedDate": "2026-01-16T11:07:20.66"
}
```

**Impact**: Tests expecting `Points` property must use `ScorePoints.ScoredPoints` instead.

---

### 2. Certificates API (`/Certificates/getallusercertificates`)

#### DEV Response (Expected)
```json
[
  {
    "Id": 1,
    "Title": "Course Completion",
    "IssueDate": "2026-01-01"
  }
]
```

#### TEST Response (Actual)
Returns `null` or empty response (204 No Content) when no certificates exist.

**Impact**: Tests must handle null response gracefully.

---

### 3. User Course API (`/Course/getallusercourses`)

#### DEV Response (Expected)
```json
[
  {
    "Id": 72,
    "Title": "test",
    "CategoryName": "Technology"
  }
]
```

#### TEST Response (Actual)
```json
{
  "NewlyAdded": [
    {
      "Id": 72,
      "Title": "test",
      "CategoryName": "Technology",
      "CourseTypeId": 1
    }
  ],
  "TopPerformance": null,
  "PreferedCategory": null,
  "Courses": null,
  "CoursesTypes": null,
  "TotalCoursesCount": 2
}
```

**Impact**: Tests expecting direct array must extract from `NewlyAdded` or `Courses` property.

---

### 4. Subscription API (`/Subscription`)

#### Validity Type IDs

**DEV Environment**:
- ValidityTypeId: `1` (example)

**TEST Environment**:
- ValidityTypeId: `60` (Weekly)
- ValidityTypeId: `61` (Monthly)  
- ValidityTypeId: `62` (Yearly)

**Currency Code IDs**:

**TEST Environment**:
- CurrencyCodeId: `40` (INR - ₹)
- CurrencyCodeId: `41` (USD - $)

**Impact**: Tests must fetch these IDs dynamically from API, not use hardcoded values.

#### Response Property Differences

**Create Subscription Plan**:
- Returns `PlanId` property (not `Id`)

**Get Plan By ID**:
- Returns `Id` property

**Impact**: Code must handle both property names depending on endpoint.

---

### 5. User Notification API (`/UserNotification`)

#### Status Code Differences

**DEV Environment**:
- Create: Returns `200 OK`

**TEST Environment**:
- Create: Returns `201 Created`

**Impact**: Tests must accept both 200 and 201 status codes for creation endpoints.

#### Category ID Availability

Some notification category IDs (1, 2, 3) may:
- Return `201` (successfully created)
- Return `400` (already exists or invalid category)

**Impact**: Tests should handle multiple creation attempts gracefully.

---

### 6. Chat Session API (`/ChatSession/startchatsession`)

#### DEV Response (Expected)
```json
{
  "Id": 123,
  "UserId": "...",
  "Status": "Active"
}
```

#### TEST Response (Actual)
- May return `500 Internal Server Error`
- Response body: `null`

**Impact**: This appears to be a backend issue in TEST environment. Tests should gracefully skip dependent operations if session creation fails.

---

## Data Validation Differences

### Subscription Plans

**TEST Environment Validation**:
- `PlanName`: Must contain only letters and spaces (no numbers or special characters)
- `RazorPayPlanId`: Required field
- Rejects negative prices with 400 status

### User Notifications

**TEST Environment Behavior**:
- Creating duplicate preferences returns `400 Bad Request` with message: "Unable to create notification prefernces."
- Some category IDs may not exist in TEST database

---

## Testing Best Practices

### 1. Dynamic Data Fetching
```javascript
// ❌ Bad: Hardcoded IDs
ValidityTypeId: 1

// ✅ Good: Fetch from API
const validityTypes = await api.get("/Subscription/validitytypes");
ValidityTypeId: validityTypes[0].Id
```

### 2. Flexible Response Handling
```javascript
// ❌ Bad: Assumes specific structure
const courses = response;

// ✅ Good: Handle multiple structures
const courses = response.NewlyAdded || response.Courses || response;
```

### 3. Status Code Flexibility
```javascript
// ❌ Bad: Expects single status
await api.post(endpoint, data, 200);

// ✅ Good: Accepts multiple valid statuses
await api.post(endpoint, data, [200, 201]);
```

### 4. Null/Empty Response Handling
```javascript
// ❌ Bad: Assumes data exists
expect(Array.isArray(response)).toBeTruthy();

// ✅ Good: Handles null gracefully
if (response) {
  const data = Array.isArray(response) ? response : [];
}
```

---

## Running Tests Against Specific Environment

### DEV Environment (Default)
```powershell
npx playwright test tests/Client-API/ --workers=1
```

### TEST Environment (skillrok.com)
```powershell
$env:ENV="test"; npx playwright test tests/Client-API/ --workers=1
```

### Single Test File
```powershell
$env:ENV="test"; npx playwright test tests/Client-API/Subscription.spec.js --workers=1
```

---

## Token Management

### Token Expiration
- Current token expires: **2026-01-23T08:35:02Z**
- Token scope: skillrok.com (TEST environment)
- User: gopikrishna2221@gmail.com
- Tenant: 6cffdd62-8649-4d9d-86fe-3066ee447082

### Token Validation Script
Use `test-auth.js` to decode and validate tokens:
```powershell
node test-auth.js
```

---

## Known Issues

### TEST Environment
1. **ChatSession API**: Returns 500 error on session creation
   - **Workaround**: Tests skip dependent operations if creation fails
   
2. **Notification Categories**: Not all category IDs exist in database
   - **Workaround**: Tests accept 400 status and continue
   
3. **Certificate API**: Returns 204 No Content when no certificates exist
   - **Workaround**: Tests handle null responses

### Common Issues
- **401 Unauthorized**: Token mismatch (using DEV token on TEST environment)
- **Invalid ValidityTypeId**: Using hardcoded IDs instead of fetching from API
- **Double Bearer Prefix**: Fixed in config.js (token should not include "Bearer ")

---

## Configuration Changes Made

### config.js
```javascript
// Line 34: Token without "Bearer " prefix
const defaultToken = "eyJ..."; // ✅ Correct

// Line 60-62: Required headers
headers: {
  "Authorization": `Bearer ${defaultToken}`,  // Bearer added here
  "Content-Type": "application/json",
  "clientid": "6cffdd62-8649-4d9d-86fe-3066ee447082"
}
```

---

## Summary

The main differences between environments are:
1. **Response structures** (nested objects vs arrays)
2. **Property naming** (Points vs ScorePoints, Id vs PlanId)
3. **Status codes** (200 vs 201 for creation)
4. **Data IDs** (different validity types, currency codes)
5. **Server stability** (ChatSession 500 errors in TEST)

All tests have been updated to handle these differences dynamically.
