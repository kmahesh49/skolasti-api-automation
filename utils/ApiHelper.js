const { expect, test } = require("@playwright/test");

/**
 * API Helper class for reusable CRUD operations with soft assertions
 */
class ApiHelper {
  constructor(request, baseURL, headers) {
    this.request = request;
    this.baseURL = baseURL;
    this.headers = headers;
    this.softAssertions = [];
  }

  /**
   * Soft assertion wrapper - records failures but continues execution
   * @param {Function} assertion - Assertion function to execute
   * @param {string} description - Description of what's being asserted
   */
  softAssert(assertion, description) {
    try {
      assertion();
      console.log(`✓ PASS: ${description}`);
    } catch (error) {
      console.error(`✗ FAIL: ${description}`);
      console.error(`  Error: ${error.message}`);
      this.softAssertions.push({
        description,
        error: error.message,
        stack: error.stack
      });
    }
  }

  /**
   * Check all soft assertions and fail test if any failed
   * Call this at the end of your test to report all failures
   */
  assertAll() {
    if (this.softAssertions.length > 0) {
      const failureReport = this.softAssertions.map((failure, index) => 
        `\n${index + 1}. ${failure.description}\n   Error: ${failure.error}`
      ).join('\n');
      
      console.error(`\n❌ TEST FAILED WITH ${this.softAssertions.length} ASSERTION(S):`);
      console.error(failureReport);
      
      throw new Error(`Test completed with ${this.softAssertions.length} failed assertion(s):${failureReport}`);
    } else {
      console.log('\n✅ ALL ASSERTIONS PASSED');
    }
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
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @param {number|Array<number>} expectedStatus - Expected status code(s) (default: 200)
   * @returns {Object} - Response body
   */
  async post(endpoint, data, expectedStatus = 200) {
    console.log(`POST request to: ${endpoint}`);
    console.log("Payload:", JSON.stringify(data, null, 2));

    const response = await this.request.post(`${this.baseURL}${endpoint}`, {
      headers: this.headers,
      data: data
    });

    const responseBody = await this.parseResponse(response);
    console.log("POST Response:", responseBody);

    const expectedStatusArray = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
    const actualStatus = response.status();
    
    this.softAssert(() => expect(expectedStatusArray).toContain(actualStatus), 
      `POST ${endpoint} should return status ${expectedStatusArray.join(' or ')}, got ${actualStatus}`);
    
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
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @param {number} expectedStatus - Expected status code (default: 200)
   * @returns {Object} - Response body
   */
  async create(endpoint, data, expectedStatus = 200) {
    console.log(`Creating resource at: ${endpoint}`);
    console.log("Payload:", JSON.stringify(data, null, 2));

    const response = await this.request.post(`${this.baseURL}${endpoint}`, {
      headers: this.headers,
      data: data
    });

    const responseBody = await this.parseResponse(response);
    console.log("Create Response:", responseBody);

    this.softAssert(() => expect(response.ok()).toBeTruthy(), 
      `CREATE ${endpoint} should be successful (2xx status)`);
    
    this.softAssert(() => expect(response.status()).toBe(expectedStatus), 
      `CREATE ${endpoint} should return status ${expectedStatus}, got ${response.status()}`);

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
   * @param {number} expectedStatus - Expected status code (default: 204)
   * @returns {Object|null} - Response body (if any)
   */
  async delete(endpoint, expectedStatus = 204) {
    console.log(`Deleting resource at: ${endpoint}`);

    const response = await this.request.delete(`${this.baseURL}${endpoint}`, {
      headers: this.headers
    });

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
