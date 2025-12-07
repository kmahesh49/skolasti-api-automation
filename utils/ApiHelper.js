const { expect } = require("@playwright/test");

/**
 * API Helper class for reusable CRUD operations
 */
class ApiHelper {
  constructor(request, baseURL, headers) {
    this.request = request;
    this.baseURL = baseURL;
    this.headers = headers;
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
   * @param {number} expectedStatus - Expected status code (default: 200)
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

    expect(response.status()).toBe(expectedStatus);
    return responseBody;
  }

  /**
   * Validate array response with expected data structure
   * @param {Array} actualArray - Actual response array
   * @param {Array} expectedArray - Expected array with Id and Name properties
   * @param {string} itemType - Type of items being validated (for logging)
   */
  validateArrayData(actualArray, expectedArray, itemType = "item") {
    expect(Array.isArray(actualArray)).toBeTruthy();
    expect(actualArray.length).toBe(expectedArray.length);
    
    expectedArray.forEach((expectedItem, index) => {
      expect(actualArray[index]).toHaveProperty("Id", expectedItem.Id);
      expect(actualArray[index]).toHaveProperty("Name", expectedItem.Name);
      console.log(`✓ ${itemType} ${expectedItem.Id}: ${expectedItem.Name} validated`);
    });
    
    console.log(`All ${itemType}s validated successfully`);
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

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(expectedStatus);

    return responseBody;
  }

  /**
   * Get a resource with retry logic for eventual consistency
   * @param {string} endpoint - API endpoint
   * @param {number} expectedStatus - Expected status code (default: 200)
   * @param {number} maxRetries - Maximum retry attempts (default: 5)
   * @param {number} delayMs - Delay between retries in ms (default: 1000)
   * @returns {Object} - Response body
   */
  async get(endpoint, expectedStatus = 200, maxRetries = 5, delayMs = 1000) {
    console.log(`Getting resource from: ${endpoint}`);

    let response, responseBody;
    let attempts = 0;

    while (attempts < maxRetries) {
      response = await this.request.get(`${this.baseURL}${endpoint}`, {
        headers: this.headers
      });

      const rawText = await response.text();
      console.log(`Attempt ${attempts + 1}: Status:`, response.status());
      console.log(`Attempt ${attempts + 1}: Raw response:`, rawText);

      if (response.status() === expectedStatus) {
        try {
          if (rawText) {
            responseBody = JSON.parse(rawText);
          }
          console.log("Get Response:", responseBody);
          expect(response.status()).toBe(expectedStatus);
          break;
        } catch (err) {
          console.error("Failed to parse JSON:", err);
          expect(response.status()).toBe(expectedStatus);
          break;
        }
      } else if (response.status() === 204 && expectedStatus === 200) {
        console.log("No content (204). Retrying...");
        attempts++;
        if (attempts < maxRetries) {
          await new Promise(res => setTimeout(res, delayMs));
        } else {
          expect(response.status()).toBe(expectedStatus);
        }
      } else {
        expect(response.status()).toBe(expectedStatus);
        break;
      }
    }

    expect(response.ok()).toBeTruthy();
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

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(expectedStatus);

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

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(expectedStatus);

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
    expect(response.status()).not.toBe(200);
  }
}

module.exports = { ApiHelper };
