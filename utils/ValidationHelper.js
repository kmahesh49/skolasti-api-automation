const { expect } = require("@playwright/test");

/**
 * Validation Helper Utility
 * Provides schema validation, data type validators, and assertion helpers
 * for comprehensive API response validation
 */
class ValidationHelper {
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate UUID format
   * @param {string} uuid - UUID to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  static isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Validate ISO 8601 date format
   * @param {string} dateString - Date string to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  static isValidISODate(dateString) {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
    if (!isoDateRegex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Validate phone number format (international)
   * @param {string} phone - Phone number to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  static isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate string length
   * @param {string} str - String to validate
   * @param {number} min - Minimum length
   * @param {number} max - Maximum length
   * @returns {Object} - Validation result
   */
  static validateStringLength(str, min, max) {
    const length = str ? str.length : 0;
    return {
      isValid: length >= min && length <= max,
      actualLength: length,
      minRequired: min,
      maxAllowed: max,
      message: length < min 
        ? `String length ${length} is below minimum ${min}`
        : length > max 
        ? `String length ${length} exceeds maximum ${max}`
        : "Valid"
    };
  }

  /**
   * Validate numeric range
   * @param {number} value - Number to validate
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {Object} - Validation result
   */
  static validateNumericRange(value, min, max) {
    return {
      isValid: value >= min && value <= max,
      actualValue: value,
      minRequired: min,
      maxAllowed: max,
      message: value < min 
        ? `Value ${value} is below minimum ${min}`
        : value > max 
        ? `Value ${value} exceeds maximum ${max}`
        : "Valid"
    };
  }

  /**
   * Validate required fields in object
   * @param {Object} obj - Object to validate
   * @param {Array<string>} requiredFields - Array of required field names
   * @returns {Object} - Validation result
   */
  static validateRequiredFields(obj, requiredFields) {
    const missingFields = [];
    const nullFields = [];
    
    requiredFields.forEach(field => {
      if (!(field in obj)) {
        missingFields.push(field);
      } else if (obj[field] === null || obj[field] === undefined) {
        nullFields.push(field);
      }
    });

    return {
      isValid: missingFields.length === 0 && nullFields.length === 0,
      missingFields,
      nullFields,
      message: missingFields.length > 0 
        ? `Missing required fields: ${missingFields.join(', ')}`
        : nullFields.length > 0 
        ? `Null/undefined fields: ${nullFields.join(', ')}`
        : "All required fields present"
    };
  }

  /**
   * Validate object schema
   * @param {Object} obj - Object to validate
   * @param {Object} schema - Schema definition
   * @returns {Object} - Validation result
   */
  static validateSchema(obj, schema) {
    const errors = [];
    
    for (const [key, expectedType] of Object.entries(schema)) {
      if (!(key in obj)) {
        errors.push(`Missing field: ${key}`);
        continue;
      }

      const actualType = typeof obj[key];
      const value = obj[key];

      // Check for null/undefined
      if (value === null || value === undefined) {
        if (expectedType !== "null" && expectedType !== "undefined") {
          errors.push(`Field '${key}' is null/undefined, expected ${expectedType}`);
        }
        continue;
      }

      // Check for array
      if (expectedType === "array") {
        if (!Array.isArray(value)) {
          errors.push(`Field '${key}' is ${actualType}, expected array`);
        }
        continue;
      }

      // Check for date
      if (expectedType === "date") {
        if (!this.isValidISODate(value)) {
          errors.push(`Field '${key}' is not a valid ISO date`);
        }
        continue;
      }

      // Check for email
      if (expectedType === "email") {
        if (!this.isValidEmail(value)) {
          errors.push(`Field '${key}' is not a valid email`);
        }
        continue;
      }

      // Check for UUID
      if (expectedType === "uuid") {
        if (!this.isValidUUID(value)) {
          errors.push(`Field '${key}' is not a valid UUID`);
        }
        continue;
      }

      // Check basic types
      if (actualType !== expectedType) {
        errors.push(`Field '${key}' is ${actualType}, expected ${expectedType}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      message: errors.length === 0 ? "Schema valid" : `Schema validation failed: ${errors.join('; ')}`
    };
  }

  /**
   * Validate array structure
   * @param {Array} arr - Array to validate
   * @param {Object} itemSchema - Schema for array items
   * @param {number} minLength - Minimum array length (optional)
   * @param {number} maxLength - Maximum array length (optional)
   * @returns {Object} - Validation result
   */
  static validateArray(arr, itemSchema = null, minLength = null, maxLength = null) {
    const errors = [];

    // Check if it's an array
    if (!Array.isArray(arr)) {
      return {
        isValid: false,
        errors: ["Value is not an array"],
        message: "Value is not an array"
      };
    }

    // Check length constraints
    if (minLength !== null && arr.length < minLength) {
      errors.push(`Array length ${arr.length} is below minimum ${minLength}`);
    }
    if (maxLength !== null && arr.length > maxLength) {
      errors.push(`Array length ${arr.length} exceeds maximum ${maxLength}`);
    }

    // Validate each item against schema if provided
    if (itemSchema) {
      arr.forEach((item, index) => {
        const itemValidation = this.validateSchema(item, itemSchema);
        if (!itemValidation.isValid) {
          errors.push(`Item[${index}]: ${itemValidation.message}`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      arrayLength: arr.length,
      message: errors.length === 0 ? "Array valid" : `Array validation failed: ${errors.join('; ')}`
    };
  }

  /**
   * Create detailed assertion message
   * @param {string} endpoint - API endpoint
   * @param {string} method - HTTP method
   * @param {number} expectedStatus - Expected status code
   * @param {number} actualStatus - Actual status code
   * @param {Object} payload - Request payload (optional)
   * @param {Object} response - Response body (optional)
   * @returns {string} - Formatted assertion message
   */
  static createAssertionMessage(endpoint, method, expectedStatus, actualStatus, payload = null, response = null) {
    let message = `
╔════════════════════════════════════════════════════════════════════════════╗
║                          API TEST FAILURE DETAILS                          ║
╚════════════════════════════════════════════════════════════════════════════╝

📍 ENDPOINT: ${method} ${endpoint}
❌ EXPECTED STATUS: ${expectedStatus}
⚠️  ACTUAL STATUS: ${actualStatus}

`;

    if (payload) {
      message += `📤 REQUEST PAYLOAD:
${JSON.stringify(payload, null, 2)}

`;
    }

    if (response) {
      message += `📥 RESPONSE BODY:
${JSON.stringify(response, null, 2)}

`;
    }

    message += `
🔍 FAILURE CATEGORY: ${this.categorizeStatusCode(actualStatus)}
💡 DEBUGGING HINTS: ${this.getDebuggingHints(actualStatus)}
`;

    return message;
  }

  /**
   * Categorize status code into failure type
   * @param {number} statusCode - HTTP status code
   * @returns {string} - Failure category
   */
  static categorizeStatusCode(statusCode) {
    if (statusCode >= 400 && statusCode < 500) {
      const categories = {
        400: "Bad Request - Invalid input data",
        401: "Unauthorized - Authentication failed",
        403: "Forbidden - Insufficient permissions",
        404: "Not Found - Resource does not exist",
        405: "Method Not Allowed - HTTP method not supported",
        409: "Conflict - Resource already exists or state conflict",
        422: "Unprocessable Entity - Validation failed",
        429: "Too Many Requests - Rate limit exceeded"
      };
      return categories[statusCode] || "Client Error (4xx)";
    }
    
    if (statusCode >= 500 && statusCode < 600) {
      const categories = {
        500: "Internal Server Error - Server-side issue",
        502: "Bad Gateway - Upstream server error",
        503: "Service Unavailable - Server temporarily down",
        504: "Gateway Timeout - Upstream server timeout"
      };
      return categories[statusCode] || "Server Error (5xx)";
    }

    return "Unknown Status Code";
  }

  /**
   * Get debugging hints based on status code
   * @param {number} statusCode - HTTP status code
   * @returns {string} - Debugging suggestions
   */
  static getDebuggingHints(statusCode) {
    const hints = {
      400: "Check request payload format, data types, and required fields",
      401: "Verify authentication token is valid and not expired",
      403: "Ensure user has proper permissions for this operation",
      404: "Confirm resource ID exists in the database",
      405: "Verify HTTP method (GET/POST/PUT/DELETE) is correct",
      409: "Check if resource already exists or has conflicting state",
      422: "Review validation rules: string length, numeric ranges, formats",
      429: "Implement rate limiting delays or retry logic",
      500: "Contact backend team - server-side error occurred",
      502: "Check upstream service availability",
      503: "Service may be under maintenance - retry later",
      504: "Increase timeout or check upstream service performance"
    };
    
    return hints[statusCode] || "Review API documentation and server logs";
  }

  /**
   * Assert with detailed error reporting
   * @param {Function} assertion - Assertion function
   * @param {string} endpoint - API endpoint
   * @param {string} method - HTTP method
   * @param {number} expectedStatus - Expected status code
   * @param {number} actualStatus - Actual status code
   * @param {Object} payload - Request payload
   * @param {Object} response - Response body
   */
  static assertWithDetails(assertion, endpoint, method, expectedStatus, actualStatus, payload, response) {
    try {
      assertion();
    } catch (error) {
      const detailedMessage = this.createAssertionMessage(
        endpoint,
        method,
        expectedStatus,
        actualStatus,
        payload,
        response
      );
      throw new Error(detailedMessage);
    }
  }

  /**
   * Validate pagination response structure
   * @param {Object} response - API response
   * @returns {Object} - Validation result
   */
  static validatePaginationResponse(response) {
    const errors = [];

    // Check if response is an array (some APIs return arrays directly)
    if (Array.isArray(response)) {
      return {
        isValid: true,
        isPaginatedArray: false,
        message: "Response is a simple array (not paginated object)"
      };
    }

    // Check for common pagination fields
    const paginationFields = ['data', 'items', 'results'];
    const hasDataField = paginationFields.some(field => field in response);

    if (!hasDataField && !Array.isArray(response)) {
      errors.push("Response does not contain standard data field (data/items/results)");
    }

    // Check for pagination metadata
    const metadataFields = ['page', 'pageNumber', 'pageSize', 'total', 'totalPages', 'hasNext', 'hasPrevious'];
    const hasMetadata = metadataFields.some(field => field in response);

    return {
      isValid: errors.length === 0,
      isPaginatedObject: hasDataField && hasMetadata,
      errors,
      message: errors.length === 0 ? "Valid pagination structure" : errors.join('; ')
    };
  }

  /**
   * Create test data validation report
   * @param {Object} validationResults - Collection of validation results
   * @returns {string} - Formatted report
   */
  static createValidationReport(validationResults) {
    const totalChecks = Object.keys(validationResults).length;
    const passedChecks = Object.values(validationResults).filter(r => r.isValid).length;
    const failedChecks = totalChecks - passedChecks;

    let report = `
╔════════════════════════════════════════════════════════════════════════════╗
║                       VALIDATION REPORT SUMMARY                            ║
╚════════════════════════════════════════════════════════════════════════════╝

✅ PASSED: ${passedChecks}/${totalChecks}
❌ FAILED: ${failedChecks}/${totalChecks}
📊 SUCCESS RATE: ${((passedChecks / totalChecks) * 100).toFixed(2)}%

`;

    // Add failed validations details
    if (failedChecks > 0) {
      report += `\n❌ FAILED VALIDATIONS:\n`;
      Object.entries(validationResults).forEach(([key, result]) => {
        if (!result.isValid) {
          report += `\n  • ${key}: ${result.message}\n`;
          if (result.errors && result.errors.length > 0) {
            result.errors.forEach(error => {
              report += `    - ${error}\n`;
            });
          }
        }
      });
    }

    return report;
  }
}

module.exports = { ValidationHelper };
