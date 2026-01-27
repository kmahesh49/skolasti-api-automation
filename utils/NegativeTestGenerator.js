const { faker } = require("@faker-js/faker");

/**
 * Negative Test Generator Utility
 * Generates invalid payloads, authentication scenarios, and validation errors
 * for comprehensive negative testing
 */
class NegativeTestGenerator {
  /**
   * Generate invalid authentication scenarios
   * @returns {Array<Object>} Array of invalid auth scenarios
   */
  static getInvalidAuthScenarios() {
    return [
      {
        name: "No Authorization Header",
        headers: { "Content-Type": "application/json" },
        expectedStatus: 401,
        expectedError: "Unauthorized"
      },
      {
        name: "Invalid Bearer Token",
        headers: {
          "Authorization": "Bearer invalid_token_12345",
          "Content-Type": "application/json"
        },
        expectedStatus: 401,
        expectedError: "Unauthorized"
      },
      {
        name: "Expired Token",
        headers: {
          "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDk0NTkyMDB9.expired",
          "Content-Type": "application/json"
        },
        expectedStatus: 401,
        expectedError: "Token expired"
      },
      {
        name: "Malformed Authorization Header",
        headers: {
          "Authorization": "InvalidFormat token123",
          "Content-Type": "application/json"
        },
        expectedStatus: 401,
        expectedError: "Invalid authorization format"
      }
    ];
  }

  /**
   * Generate invalid string field scenarios
   * @param {string} fieldName - Name of the field
   * @param {number} maxLength - Maximum allowed length
   * @param {number} minLength - Minimum allowed length
   * @returns {Array<Object>} Array of invalid scenarios
   */
  static getInvalidStringScenarios(fieldName, maxLength = 200, minLength = 2) {
    return [
      {
        name: `${fieldName} - Empty String`,
        value: "",
        expectedError: `${fieldName} is required`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Null Value`,
        value: null,
        expectedError: `${fieldName} cannot be null`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Exceeds Max Length (${maxLength})`,
        value: faker.string.alpha(maxLength + 50),
        expectedError: `${fieldName} must not exceed ${maxLength} characters`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Below Min Length (${minLength})`,
        value: faker.string.alpha(minLength - 1),
        expectedError: `${fieldName} must be at least ${minLength} characters`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Special Characters Only`,
        value: "@#$%^&*()",
        expectedError: `${fieldName} contains invalid characters`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - SQL Injection Attempt`,
        value: "'; DROP TABLE users; --",
        expectedError: "Invalid input detected",
        expectedStatus: 400
      },
      {
        name: `${fieldName} - XSS Attempt`,
        value: "<script>alert('XSS')</script>",
        expectedError: "Invalid input detected",
        expectedStatus: 400
      }
    ];
  }

  /**
   * Generate invalid numeric field scenarios
   * @param {string} fieldName - Name of the field
   * @param {number} min - Minimum allowed value
   * @param {number} max - Maximum allowed value
   * @returns {Array<Object>} Array of invalid scenarios
   */
  static getInvalidNumericScenarios(fieldName, min = 1, max = 100) {
    return [
      {
        name: `${fieldName} - Negative Number`,
        value: -1,
        expectedError: `${fieldName} must be positive`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Zero (if not allowed)`,
        value: 0,
        expectedError: `${fieldName} must be greater than 0`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Exceeds Maximum (${max})`,
        value: max + 100,
        expectedError: `${fieldName} must not exceed ${max}`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Below Minimum (${min})`,
        value: min - 1,
        expectedError: `${fieldName} must be at least ${min}`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - String Instead of Number`,
        value: "not_a_number",
        expectedError: `${fieldName} must be a valid number`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Decimal (if integer required)`,
        value: 3.14159,
        expectedError: `${fieldName} must be an integer`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Null Value`,
        value: null,
        expectedError: `${fieldName} is required`,
        expectedStatus: 400
      }
    ];
  }

  /**
   * Generate invalid ID scenarios
   * @param {string} fieldName - Name of the ID field
   * @returns {Array<Object>} Array of invalid scenarios
   */
  static getInvalidIdScenarios(fieldName = "id") {
    return [
      {
        name: `${fieldName} - Non-existent ID`,
        value: 999999999,
        expectedError: `${fieldName} not found`,
        expectedStatus: 404
      },
      {
        name: `${fieldName} - Negative ID`,
        value: -1,
        expectedError: `Invalid ${fieldName}`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Zero ID`,
        value: 0,
        expectedError: `Invalid ${fieldName}`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - String Instead of Number`,
        value: "invalid_id",
        expectedError: `${fieldName} must be a number`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Null ID`,
        value: null,
        expectedError: `${fieldName} is required`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - UUID Format (if not supported)`,
        value: faker.string.uuid(),
        expectedError: `Invalid ${fieldName} format`,
        expectedStatus: 400
      }
    ];
  }

  /**
   * Generate invalid email scenarios
   * @returns {Array<Object>} Array of invalid email scenarios
   */
  static getInvalidEmailScenarios() {
    return [
      {
        name: "Email - Missing @ Symbol",
        value: "invalidemail.com",
        expectedError: "Invalid email format",
        expectedStatus: 400
      },
      {
        name: "Email - Missing Domain",
        value: "test@",
        expectedError: "Invalid email format",
        expectedStatus: 400
      },
      {
        name: "Email - Missing Local Part",
        value: "@example.com",
        expectedError: "Invalid email format",
        expectedStatus: 400
      },
      {
        name: "Email - Multiple @ Symbols",
        value: "test@@example.com",
        expectedError: "Invalid email format",
        expectedStatus: 400
      },
      {
        name: "Email - Special Characters",
        value: "test!#$%@example.com",
        expectedError: "Invalid email format",
        expectedStatus: 400
      },
      {
        name: "Email - Spaces",
        value: "test user@example.com",
        expectedError: "Invalid email format",
        expectedStatus: 400
      }
    ];
  }

  /**
   * Generate invalid date/time scenarios
   * @param {string} fieldName - Name of the date field
   * @returns {Array<Object>} Array of invalid scenarios
   */
  static getInvalidDateScenarios(fieldName = "date") {
    return [
      {
        name: `${fieldName} - Invalid Format`,
        value: "invalid-date",
        expectedError: `${fieldName} must be a valid ISO 8601 date`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Past Date (if future required)`,
        value: "2020-01-01T00:00:00Z",
        expectedError: `${fieldName} must be in the future`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Null Value`,
        value: null,
        expectedError: `${fieldName} is required`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Empty String`,
        value: "",
        expectedError: `${fieldName} is required`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Invalid Month`,
        value: "2026-13-01T00:00:00Z",
        expectedError: `${fieldName} contains invalid month`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Invalid Day`,
        value: "2026-01-32T00:00:00Z",
        expectedError: `${fieldName} contains invalid day`,
        expectedStatus: 400
      }
    ];
  }

  /**
   * Generate invalid array scenarios
   * @param {string} fieldName - Name of the array field
   * @returns {Array<Object>} Array of invalid scenarios
   */
  static getInvalidArrayScenarios(fieldName = "items") {
    return [
      {
        name: `${fieldName} - Not an Array`,
        value: "not_an_array",
        expectedError: `${fieldName} must be an array`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Empty Array (if not allowed)`,
        value: [],
        expectedError: `${fieldName} cannot be empty`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Null Value`,
        value: null,
        expectedError: `${fieldName} is required`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Array with Null Items`,
        value: [null, null, null],
        expectedError: `${fieldName} contains invalid items`,
        expectedStatus: 400
      },
      {
        name: `${fieldName} - Array with Mixed Types`,
        value: [1, "string", true, null],
        expectedError: `${fieldName} contains inconsistent types`,
        expectedStatus: 400
      }
    ];
  }

  /**
   * Generate invalid quiz payload scenarios
   * @returns {Array<Object>} Array of invalid quiz payloads
   */
  static getInvalidQuizPayloads() {
    return [
      {
        name: "Missing Required Field - Title",
        payload: {
          PassScoreInPertcentage: 70,
          TotalQuestions: 10,
          TotalScore: 100,
          IsOptional: false
        },
        expectedError: "Title is required",
        expectedStatus: 400
      },
      {
        name: "Invalid PassScore - Negative",
        payload: {
          Title: "Test Quiz",
          PassScoreInPertcentage: -10,
          TotalQuestions: 10,
          TotalScore: 100,
          IsOptional: false
        },
        expectedError: "PassScoreInPertcentage must be between 1 and 100",
        expectedStatus: 400
      },
      {
        name: "Invalid PassScore - Exceeds 100",
        payload: {
          Title: "Test Quiz",
          PassScoreInPertcentage: 150,
          TotalQuestions: 10,
          TotalScore: 100,
          IsOptional: false
        },
        expectedError: "PassScoreInPertcentage must not exceed 100",
        expectedStatus: 400
      },
      {
        name: "Invalid TotalQuestions - Zero",
        payload: {
          Title: "Test Quiz",
          PassScoreInPertcentage: 70,
          TotalQuestions: 0,
          TotalScore: 100,
          IsOptional: false
        },
        expectedError: "TotalQuestions must be at least 1",
        expectedStatus: 400
      },
      {
        name: "Invalid TotalScore - Negative",
        payload: {
          Title: "Test Quiz",
          PassScoreInPertcentage: 70,
          TotalQuestions: 10,
          TotalScore: -50,
          IsOptional: false
        },
        expectedError: "TotalScore must be positive",
        expectedStatus: 400
      },
      {
        name: "Missing QuizLevels",
        payload: {
          Title: "Test Quiz",
          PassScoreInPertcentage: 70,
          TotalQuestions: 10,
          TotalScore: 100,
          IsOptional: false,
          QuizLevels: null
        },
        expectedError: "QuizLevels cannot be null",
        expectedStatus: 400
      }
    ];
  }

  /**
   * Generate invalid subscription plan payloads
   * @returns {Array<Object>} Array of invalid subscription payloads
   */
  static getInvalidSubscriptionPayloads() {
    return [
      {
        name: "Missing Required Field - PlanName",
        payload: {
          Description: "Test Plan",
          Price: 99.99,
          Validity: 30,
          ValidityTypeId: 1,
          CurrencyCodeId: 1,
          RazorPayPlanId: "plan_123"
        },
        expectedError: "PlanName is required",
        expectedStatus: 400
      },
      {
        name: "Invalid PlanName - Numbers Only",
        payload: {
          PlanName: "12345",
          Description: "Test Plan",
          Price: 99.99,
          Validity: 30,
          ValidityTypeId: 1,
          CurrencyCodeId: 1,
          RazorPayPlanId: "plan_123"
        },
        expectedError: "PlanName must contain alphabetic characters",
        expectedStatus: 400
      },
      {
        name: "Invalid Price - Negative",
        payload: {
          PlanName: "Test Plan",
          Description: "Test Plan",
          Price: -99.99,
          Validity: 30,
          ValidityTypeId: 1,
          CurrencyCodeId: 1,
          RazorPayPlanId: "plan_123"
        },
        expectedError: "Price must be positive",
        expectedStatus: 400
      },
      {
        name: "Invalid Price - Zero",
        payload: {
          PlanName: "Test Plan",
          Description: "Test Plan",
          Price: 0,
          Validity: 30,
          ValidityTypeId: 1,
          CurrencyCodeId: 1,
          RazorPayPlanId: "plan_123"
        },
        expectedError: "Price must be greater than 0",
        expectedStatus: 400
      },
      {
        name: "Invalid Validity - Zero Days",
        payload: {
          PlanName: "Test Plan",
          Description: "Test Plan",
          Price: 99.99,
          Validity: 0,
          ValidityTypeId: 1,
          CurrencyCodeId: 1,
          RazorPayPlanId: "plan_123"
        },
        expectedError: "Validity must be at least 1",
        expectedStatus: 400
      },
      {
        name: "Missing RazorPayPlanId",
        payload: {
          PlanName: "Test Plan",
          Description: "Test Plan",
          Price: 99.99,
          Validity: 30,
          ValidityTypeId: 1,
          CurrencyCodeId: 1
        },
        expectedError: "RazorPayPlanId is required",
        expectedStatus: 400
      }
    ];
  }

  /**
   * Generate invalid category payloads
   * @returns {Array<Object>} Array of invalid category payloads
   */
  static getInvalidCategoryPayloads() {
    return [
      {
        name: "Missing CategoryName",
        payload: [{}],
        expectedError: "CategoryName is required",
        expectedStatus: 400
      },
      {
        name: "CategoryName - Too Short (< 2 chars)",
        payload: [{
          CategoryName: "A"
        }],
        expectedError: "CategoryName must be at least 2 characters",
        expectedStatus: 400
      },
      {
        name: "CategoryName - Exceeds Max Length (> 200 chars)",
        payload: [{
          CategoryName: faker.string.alpha(250)
        }],
        expectedError: "CategoryName must not exceed 200 characters",
        expectedStatus: 400
      },
      {
        name: "CategoryName - Invalid Characters (Numbers)",
        payload: [{
          CategoryName: "Category123"
        }],
        expectedError: "CategoryName can only contain letters, spaces, and hyphens",
        expectedStatus: 400
      },
      {
        name: "CategoryName - Special Characters",
        payload: [{
          CategoryName: "Category@#$%"
        }],
        expectedError: "CategoryName can only contain letters, spaces, and hyphens",
        expectedStatus: 400
      },
      {
        name: "Empty Array",
        payload: [],
        expectedError: "At least one category is required",
        expectedStatus: 400
      }
    ];
  }

  /**
   * Generate boundary value test cases
   * @param {string} fieldName - Name of the field
   * @param {number} min - Minimum allowed value
   * @param {number} max - Maximum allowed value
   * @returns {Array<Object>} Array of boundary scenarios
   */
  static getBoundaryValueScenarios(fieldName, min, max) {
    return [
      {
        name: `${fieldName} - Below Boundary (${min - 1})`,
        value: min - 1,
        expectedResult: "FAIL",
        expectedStatus: 400
      },
      {
        name: `${fieldName} - At Lower Boundary (${min})`,
        value: min,
        expectedResult: "PASS",
        expectedStatus: 200
      },
      {
        name: `${fieldName} - Just Above Lower Boundary (${min + 1})`,
        value: min + 1,
        expectedResult: "PASS",
        expectedStatus: 200
      },
      {
        name: `${fieldName} - Just Below Upper Boundary (${max - 1})`,
        value: max - 1,
        expectedResult: "PASS",
        expectedStatus: 200
      },
      {
        name: `${fieldName} - At Upper Boundary (${max})`,
        value: max,
        expectedResult: "PASS",
        expectedStatus: 200
      },
      {
        name: `${fieldName} - Above Boundary (${max + 1})`,
        value: max + 1,
        expectedResult: "FAIL",
        expectedStatus: 400
      }
    ];
  }
}

module.exports = { NegativeTestGenerator };
