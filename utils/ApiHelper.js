const { expect, test } = require("@playwright/test");
const { allure } = require("allure-playwright");

/**
 * API Helper class for reusable CRUD operations with soft assertions
 * Enhanced with detailed error reporting and Allure integration
 */
class ApiHelper {
  constructor(request, baseURL, headers) {
    this.request = request;
    this.baseURL = baseURL;
    this.headers = headers;
    this.softAssertions = [];
    this.requestHistory = []; // Track all requests for debugging
  }

  /**
   * Log request details for debugging
   * @param {string} method - HTTP method
   * @param {string} endpoint - API endpoint
   * @param {Object} payload - Request payload
   * @param {Object} response - Response object
   */
  logRequestDetails(method, endpoint, payload, response) {
    const timestamp = new Date().toISOString();
    const requestLog = {
      timestamp,
      method,
      endpoint,
      fullUrl: `${this.baseURL}${endpoint}`,
      payload,
      status: response.status(),
      statusText: response.statusText()
    };
    
    this.requestHistory.push(requestLog);
    
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`🕐 ${timestamp}`);
    console.log(`📍 ${method} ${this.baseURL}${endpoint}`);
    console.log(`📊 Status: ${response.status()} ${response.statusText()}`);
    console.log(`${'═'.repeat(80)}\n`);
  }

  /**
   * Create detailed error report for Allure
   * @param {string} method - HTTP method
   * @param {string} endpoint - API endpoint
   * @param {number} expectedStatus - Expected status code
   * @param {number} actualStatus - Actual status code
   * @param {Object} payload - Request payload
   * @param {Object} response - Response body
   */
  async attachErrorDetailsToAllure(method, endpoint, expectedStatus, actualStatus, payload, response) {
    // Attach request details
    await allure.attachment(
      "Request Details",
      JSON.stringify({
        method,
        endpoint: `${this.baseURL}${endpoint}`,
        expectedStatus,
        actualStatus,
        timestamp: new Date().toISOString()
      }, null, 2),
      "application/json"
    );

    // Attach payload if exists
    if (payload) {
      await allure.attachment(
        "Request Payload",
        JSON.stringify(payload, null, 2),
        "application/json"
      );
    }

    // Attach response if exists
    if (response) {
      await allure.attachment(
        "Response Body",
        JSON.stringify(response, null, 2),
        "application/json"
      );
    }

    // Add debugging hints
    await allure.attachment(
      "Debugging Hints",
      this.getDebuggingHints(actualStatus),
      "text/plain"
    );
  }

  /**
   * Get debugging hints based on status code
   * @param {number} statusCode - HTTP status code
   * @returns {string} - Debugging suggestions
   */
  getDebuggingHints(statusCode) {
    const hints = {
      400: `🔍 BAD REQUEST (400)
      
Possible Causes:
• Missing required fields in payload
• Invalid data types (string instead of number, etc.)
• Field values outside allowed ranges
• Invalid format (email, date, UUID, etc.)

Action Items:
✓ Verify all required fields are present
✓ Check data types match API expectations
✓ Validate string lengths and numeric ranges
✓ Review API documentation for payload structure`,

      401: `🔒 UNAUTHORIZED (401)
      
Possible Causes:
• Missing Authorization header
• Invalid or expired JWT token
• Token signature verification failed
• Incorrect token format

Action Items:
✓ Check if token is included in headers
✓ Verify token hasn't expired (check 'exp' claim)
✓ Ensure token format is "Bearer {token}"
✓ Generate new token if current one is expired`,

      403: `⛔ FORBIDDEN (403)
      
Possible Causes:
• User lacks required permissions
• Resource access restricted
• Account suspended or inactive
• IP address blocked

Action Items:
✓ Verify user has correct role/permissions
✓ Check if resource requires special access
✓ Confirm account is active
✓ Review access control policies`,

      404: `🔍 NOT FOUND (404)
      
Possible Causes:
• Resource ID doesn't exist in database
• Incorrect endpoint URL
• Resource was previously deleted
• Typo in route path

Action Items:
✓ Confirm resource ID is correct
✓ Check if resource exists via GET all endpoint
✓ Verify endpoint path spelling
✓ Review recent DELETE operations`,

      409: `⚠️ CONFLICT (409)
      
Possible Causes:
• Duplicate entry (unique constraint violation)
• Resource already exists
• Concurrent modification conflict
• State transition not allowed

Action Items:
✓ Check for existing records with same identifier
✓ Verify resource isn't already created
✓ Review business logic constraints
✓ Use GET endpoint to check current state`,

      422: `❌ UNPROCESSABLE ENTITY (422)
      
Possible Causes:
• Validation rules failed
• Business logic constraints violated
• Related entities don't exist
• Invalid state transition

Action Items:
✓ Review validation error messages in response
✓ Check all foreign key references exist
✓ Verify data meets business rules
✓ Validate dependent resources are created first`,

      500: `🔥 INTERNAL SERVER ERROR (500)
      
Possible Causes:
• Unhandled exception on server
• Database connection failure
• Null pointer exceptions
• Configuration errors

Action Items:
✓ Contact backend development team
✓ Review server logs for stack traces
✓ Check if issue is reproducible
✓ Provide request payload to developers`,

      503: `🚫 SERVICE UNAVAILABLE (503)
      
Possible Causes:
• Server is under maintenance
• Database is down
• Service overloaded
• Deployment in progress

Action Items:
✓ Check service status page
✓ Retry request after delay
✓ Verify environment is operational
✓ Contact DevOps team if persistent`
    };

    return hints[statusCode] || `❓ UNKNOWN STATUS CODE (${statusCode})

Please refer to API documentation or contact backend team.`;
  }

  /**
   * Soft assertion wrapper - records failures but continues execution
   * Enhanced with detailed error context
   * @param {Function} assertion - Assertion function to execute
   * @param {string} description - Description of what's being asserted
   * @param {Object} context - Additional context (endpoint, payload, response)
   */
  softAssert(assertion, description, context = {}) {
    try {
      assertion();
      console.log(`✅ PASS: ${description}`);
    } catch (error) {
      console.error(`❌ FAIL: ${description}`);
      console.error(`   Error: ${error.message}`);
      
      const failureDetails = {
        description,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        ...context
      };
      
      this.softAssertions.push(failureDetails);
      
      // Log detailed context if available
      if (context.endpoint) {
        console.error(`   Endpoint: ${context.endpoint}`);
      }
      if (context.expectedStatus && context.actualStatus) {
        console.error(`   Expected Status: ${context.expectedStatus}`);
        console.error(`   Actual Status: ${context.actualStatus}`);
      }
    }
  }

  /**
   * Check all soft assertions and fail test if any failed
   * Enhanced with categorized failure report
   */
  assertAll() {
    if (this.softAssertions.length > 0) {
      // Categorize failures
      const statusCodeFailures = this.softAssertions.filter(f => f.actualStatus);
      const validationFailures = this.softAssertions.filter(f => !f.actualStatus);
      
      let failureReport = `
╔════════════════════════════════════════════════════════════════════════════╗
║                    TEST EXECUTION FAILURE SUMMARY                          ║
╚════════════════════════════════════════════════════════════════════════════╝

❌ Total Failures: ${this.softAssertions.length}
📊 Status Code Failures: ${statusCodeFailures.length}
✓ Validation Failures: ${validationFailures.length}

`;

      // Report status code failures
      if (statusCodeFailures.length > 0) {
        failureReport += `\n${'═'.repeat(80)}\n📊 STATUS CODE FAILURES:\n${'═'.repeat(80)}\n`;
        statusCodeFailures.forEach((failure, index) => {
          failureReport += `
${index + 1}. ${failure.description}
   Endpoint: ${failure.endpoint || 'N/A'}
   Expected: ${failure.expectedStatus || 'N/A'}
   Actual: ${failure.actualStatus || 'N/A'}
   Category: ${this.categorizeError(failure.actualStatus)}
   Error: ${failure.error}
   Time: ${failure.timestamp}
   
   ${this.getDebuggingHints(failure.actualStatus).split('\n').slice(0, 5).join('\n   ')}
`;
        });
      }

      // Report validation failures
      if (validationFailures.length > 0) {
        failureReport += `\n${'═'.repeat(80)}\n✓ VALIDATION FAILURES:\n${'═'.repeat(80)}\n`;
        validationFailures.forEach((failure, index) => {
          failureReport += `
${index + 1}. ${failure.description}
   Error: ${failure.error}
   Time: ${failure.timestamp}
`;
        });
      }

      failureReport += `\n${'═'.repeat(80)}\n📋 REQUEST HISTORY (Last 5):\n${'═'.repeat(80)}\n`;
      this.requestHistory.slice(-5).forEach((req, index) => {
        failureReport += `
${index + 1}. ${req.method} ${req.endpoint}
   Status: ${req.status}
   Time: ${req.timestamp}
`;
      });

      console.error(failureReport);
      throw new Error(`Test completed with ${this.softAssertions.length} failed assertion(s). See detailed report above.`);
    } else {
      console.log('\n✅ ALL ASSERTIONS PASSED - TEST SUCCESSFUL');
    }
  }

  /**
   * Categorize error by status code
   * @param {number} statusCode - HTTP status code
   * @returns {string} - Error category
   */
  categorizeError(statusCode) {
    if (statusCode >= 400 && statusCode < 500) {
      return "CLIENT ERROR (4xx)";
    } else if (statusCode >= 500 && statusCode < 600) {
      return "SERVER ERROR (5xx)";
    }
    return "UNKNOWN ERROR";
  }

  /**
   * Parse response with error handling
   * @param {Response} response - Playwright API response
   * @returns {Object|null} - Parsed JSON or null
   */
  async parseResponse(response) {
    const rawText = await response.text();
    console.log("Raw response:", rawText);
    console.log("Status code:", response.status());

    let responseBody = null;
    if (rawText) {
      try {
        responseBody = JSON.parse(rawText);
      } catch (err) {
        console.error("Failed to parse JSON:", err);
      }
    }
    return responseBody;
  }

  /**
   * POST request with custom payload (for search/filter operations)
   * Enhanced with detailed error tracking
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @param {number|Array<number>} expectedStatus - Expected status code(s) (default: 200)
   * @returns {Object} - Response body
   */
  async post(endpoint, data, expectedStatus = 200) {
    allure.step(`POST ${endpoint}`, async () => {
      console.log(`\n📤 POST request to: ${endpoint}`);
      console.log("📦 Payload:", JSON.stringify(data, null, 2));
    });

    // Handle multipart/form-data by converting JSON to FormData
    let requestData = data;
    let requestHeaders = this.headers;
    
    if (this.headers['Content-Type'] === 'multipart/form-data') {
      console.log("🔄 Converting JSON to FormData for multipart/form-data");
      const FormData = require('form-data');
      const formData = new FormData();
      
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          formData.append(key, data[key]);
        }
      }
      
      requestData = formData;
      // Remove Content-Type header - Playwright will set it automatically with boundary
      requestHeaders = { ...this.headers };
      delete requestHeaders['Content-Type'];
    }

    const response = await this.request.post(`${this.baseURL}${endpoint}`, {
      headers: requestHeaders,
      data: requestData
    });

    this.logRequestDetails('POST', endpoint, data, response);
    const responseBody = await this.parseResponse(response);
    console.log("📥 POST Response:", JSON.stringify(responseBody, null, 2));

    const expectedStatusArray = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
    const actualStatus = response.status();
    
    if (!expectedStatusArray.includes(actualStatus)) {
      await this.attachErrorDetailsToAllure('POST', endpoint, expectedStatusArray, actualStatus, data, responseBody);
    }
    
    this.softAssert(
      () => expect(expectedStatusArray).toContain(actualStatus), 
      `POST ${endpoint} should return status ${expectedStatusArray.join(' or ')}, got ${actualStatus}`,
      {
        method: 'POST',
        endpoint,
        expectedStatus: expectedStatusArray,
        actualStatus,
        payload: data,
        response: responseBody
      }
    );
    
    return responseBody;
  }

  /**
   * PUT request (update existing resource)
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @param {number|Array} expectedStatus - Expected status code(s) (default: 200)
   * @returns {Object} - Response body
   */
  async put(endpoint, data, expectedStatus = 200) {
    allure.step(`PUT ${endpoint}`, async () => {
      console.log(`\n🔄 PUT request to: ${endpoint}`);
      console.log("📦 Payload:", JSON.stringify(data, null, 2));
    });

    // Handle multipart/form-data by converting JSON to FormData
    let requestData = data;
    let requestHeaders = this.headers;
    
    if (this.headers['Content-Type'] === 'multipart/form-data') {
      console.log("🔄 Converting JSON to FormData for multipart/form-data");
      const FormData = require('form-data');
      const formData = new FormData();
      
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          formData.append(key, data[key]);
        }
      }
      
      requestData = formData;
      // Remove Content-Type header - Playwright will set it automatically with boundary
      requestHeaders = { ...this.headers };
      delete requestHeaders['Content-Type'];
    }

    const response = await this.request.put(`${this.baseURL}${endpoint}`, {
      headers: requestHeaders,
      data: requestData
    });

    this.logRequestDetails('PUT', endpoint, data, response);
    const responseBody = await this.parseResponse(response);
    console.log("📥 PUT Response:", JSON.stringify(responseBody, null, 2));

    const expectedStatusArray = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
    const actualStatus = response.status();
    
    if (!expectedStatusArray.includes(actualStatus)) {
      await this.attachErrorDetailsToAllure('PUT', endpoint, expectedStatusArray, actualStatus, data, responseBody);
    }
    
    this.softAssert(
      () => expect(expectedStatusArray).toContain(actualStatus), 
      `PUT ${endpoint} should return status ${expectedStatusArray.join(' or ')}, got ${actualStatus}`,
      {
        method: 'PUT',
        endpoint,
        expectedStatus: expectedStatusArray,
        actualStatus,
        payload: data,
        response: responseBody
      }
    );
    
    return responseBody;
  }

  /**
   * Validate array response with expected data structure
   * @param {Array} actualArray - Actual response array
   * @param {Array} expectedArray - Expected array with Id and Name properties
   * @param {string} itemType - Type of items being validated (for logging)
   */
  validateArrayData(actualArray, expectedArray, itemType = "item") {
    this.softAssert(() => expect(Array.isArray(actualArray)).toBeTruthy(), 
      `${itemType} response should be an array`);
    
    this.softAssert(() => expect(actualArray.length).toBe(expectedArray.length), 
      `${itemType} array should have ${expectedArray.length} items, got ${actualArray?.length || 0}`);
    
    expectedArray.forEach((expectedItem, index) => {
      this.softAssert(() => expect(actualArray[index]).toHaveProperty("Id", expectedItem.Id), 
        `${itemType}[${index}] should have Id: ${expectedItem.Id}`);
      
      this.softAssert(() => expect(actualArray[index]).toHaveProperty("Name", expectedItem.Name), 
        `${itemType}[${index}] should have Name: ${expectedItem.Name}`);
      
      console.log(`✓ ${itemType} ${expectedItem.Id}: ${expectedItem.Name} validated`);
    });
    
    console.log(`All ${itemType}s validation attempted`);
  }

  /**
   * Create a resource
   * Enhanced with detailed error tracking
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @param {number} expectedStatus - Expected status code (default: 200)
   * @returns {Object} - Response body
   */
  async create(endpoint, data, expectedStatus = 200) {
    allure.step(`CREATE ${endpoint}`, async () => {
      console.log(`\n✨ Creating resource at: ${endpoint}`);
      console.log("📦 Payload:", JSON.stringify(data, null, 2));
    });

    const response = await this.request.post(`${this.baseURL}${endpoint}`, {
      headers: this.headers,
      data: data
    });

    this.logRequestDetails('POST (CREATE)', endpoint, data, response);
    const responseBody = await this.parseResponse(response);
    console.log("📥 Create Response:", JSON.stringify(responseBody, null, 2));

    const actualStatus = response.status();
    
    if (actualStatus !== expectedStatus) {
      await this.attachErrorDetailsToAllure('POST (CREATE)', endpoint, expectedStatus, actualStatus, data, responseBody);
    }

    this.softAssert(
      () => expect(response.ok()).toBeTruthy(), 
      `CREATE ${endpoint} should be successful (2xx status)`,
      {
        method: 'POST (CREATE)',
        endpoint,
        expectedStatus,
        actualStatus,
        payload: data,
        response: responseBody
      }
    );
    
    this.softAssert(
      () => expect(response.status()).toBe(expectedStatus), 
      `CREATE ${endpoint} should return status ${expectedStatus}, got ${response.status()}`,
      {
        method: 'POST (CREATE)',
        endpoint,
        expectedStatus,
        actualStatus,
        payload: data,
        response: responseBody
      }
    );

    return responseBody;
  }

  /**
   * Get a resource with retry logic for eventual consistency
   * @param {string} endpoint - API endpoint
   * @param {number|Array<number>} expectedStatus - Expected status code(s) (default: 200)
   * @param {number} maxRetries - Maximum retry attempts (default: 5)
   * @param {number} delayMs - Delay between retries in ms (default: 1000)
   * @returns {Object} - Response body
   */
  async get(endpoint, expectedStatus = 200, maxRetries = 5, delayMs = 1000) {
    console.log(`Getting resource from: ${endpoint}`);

    const expectedStatusArray = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
    let response, responseBody;
    let attempts = 0;

    while (attempts < maxRetries) {
      response = await this.request.get(`${this.baseURL}${endpoint}`, {
        headers: this.headers
      });

      const rawText = await response.text();
      console.log(`Attempt ${attempts + 1}: Status:`, response.status());
      console.log(`Attempt ${attempts + 1}: Raw response:`, rawText);

      const actualStatus = response.status();
      
      if (expectedStatusArray.includes(actualStatus)) {
        try {
          if (rawText) {
            responseBody = JSON.parse(rawText);
          }
          console.log("Get Response:", responseBody);
          this.softAssert(() => expect(expectedStatusArray).toContain(actualStatus), 
            `GET ${endpoint} should return status ${expectedStatusArray.join(' or ')}, got ${actualStatus}`);
          break;
        } catch (err) {
          console.error("Failed to parse JSON:", err);
          this.softAssert(() => expect(expectedStatusArray).toContain(actualStatus), 
            `GET ${endpoint} should return status ${expectedStatusArray.join(' or ')}, got ${actualStatus}`);
          break;
        }
      } else if (actualStatus === 204 && expectedStatusArray.includes(200) && !expectedStatusArray.includes(204)) {
        console.log("No content (204). Retrying...");
        attempts++;
        if (attempts < maxRetries) {
          await new Promise(res => setTimeout(res, delayMs));
        } else {
          this.softAssert(() => expect(expectedStatusArray).toContain(actualStatus), 
            `GET ${endpoint} should return status ${expectedStatusArray.join(' or ')}, got ${actualStatus} after ${maxRetries} retries`);
        }
      } else {
        this.softAssert(() => expect(expectedStatusArray).toContain(actualStatus), 
          `GET ${endpoint} should return status ${expectedStatusArray.join(' or ')}, got ${actualStatus}`);
        break;
      }
    }

    this.softAssert(() => expect(response.ok()).toBeTruthy(), 
      `GET ${endpoint} should be successful (2xx status)`);
    
    return responseBody;
  }

  /**
   * Update a resource
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @param {number} expectedStatus - Expected status code (default: 200)
   * @returns {Object} - Response body
   */
  async update(endpoint, data, expectedStatus = 201) {
    console.log(`Updating resource at: ${endpoint}`);
    console.log("Payload:", JSON.stringify(data, null, 2));

    const response = await this.request.put(`${this.baseURL}${endpoint}`, {
      headers: this.headers,
      data: data
    });

    const responseBody = await this.parseResponse(response);
    console.log("Update Response:", responseBody);

    this.softAssert(() => expect(response.ok()).toBeTruthy(), 
      `UPDATE ${endpoint} should be successful (2xx status)`);
    
    this.softAssert(() => expect(response.status()).toBe(expectedStatus), 
      `UPDATE ${endpoint} should return status ${expectedStatus}, got ${response.status()}`);

    return responseBody;
  }

  /**
   * Delete a resource
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body (optional, for DELETE requests that require payload)
   * @param {number} expectedStatus - Expected status code (default: 204)
   * @returns {Object|null} - Response body (if any)
   */
  async delete(endpoint, data = null, expectedStatus = 204) {
    console.log(`Deleting resource at: ${endpoint}`);

    const requestOptions = {
      headers: this.headers
    };

    // Add body if provided (some DELETE endpoints require payload)
    if (data && Object.keys(data).length > 0) {
      requestOptions.data = data;
      console.log("Payload:", JSON.stringify(data, null, 2));
    }

    const response = await this.request.delete(`${this.baseURL}${endpoint}`, requestOptions);

    console.log("Delete Status:", response.status());

    let responseBody = null;
    const rawText = await response.text();
    if (rawText) {
      try {
        responseBody = JSON.parse(rawText);
        console.log("Delete Response:", responseBody);
      } catch (err) {
        console.error("DELETE JSON parse failed:", err);
        console.error("DELETE raw:", rawText);
      }
    }

    this.softAssert(() => expect(response.ok()).toBeTruthy(), 
      `DELETE ${endpoint} should be successful (2xx status)`);
    
    this.softAssert(() => expect(response.status()).toBe(expectedStatus), 
      `DELETE ${endpoint} should return status ${expectedStatus}, got ${response.status()}`);

    return responseBody;
  }

  /**
   * Verify resource is deleted (GET should fail)
   * @param {string} endpoint - API endpoint
   * @param {number} expectedStatus - Expected status code (default: 404)
   */
  async verifyDeleted(endpoint, expectedStatus = 404) {
    console.log(`Verifying resource is deleted: ${endpoint}`);

    const response = await this.request.get(`${this.baseURL}${endpoint}`, {
      headers: this.headers
    });

    console.log("Verify Deleted Status:", response.status());

    const rawText = await response.text();
    console.log("Verify Deleted Response:", rawText);

    // Deleted items should NOT return 200
    this.softAssert(() => expect(response.status()).not.toBe(200), 
      `Deleted resource ${endpoint} should not return 200, got ${response.status()}`);
  }
}

module.exports = { ApiHelper };
