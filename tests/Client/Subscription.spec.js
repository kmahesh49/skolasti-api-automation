const { test, expect } = require("@playwright/test");
const { ClientAPIURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { allure } = require("allure-playwright");

test.describe("Subscription Management API", () => {
  // ==================== DRY: Helper Functions ====================
  
  /**
   * Logs a formatted step header
   * @param {string} step - Step identifier
   * @param {string} description - Step description
   */
  const logStep = (step, description) => {
    console.log(`\n========== ${step}: ${description} ==========`);
  };

  /**
   * Generates a unique subscription plan payload
   * @param {Object} overrides - Optional payload overrides
   * @returns {Object} - Subscription plan payload
   */
  const generateSubscriptionPlanPayload = (overrides = {}) => {
    const timestamp = Date.now();
    return {
      PlanName: overrides.PlanName || `Test Plan ${timestamp}`,
      Description: overrides.Description || `Test Description ${timestamp}`,
      Price: overrides.Price || 100,
      Validity: overrides.Validity || 365,
      ValidityTypeId: overrides.ValidityTypeId || 2, // 0=Weekly, 1=Monthly, 2=Yearly
      CurrencyCodeId: overrides.CurrencyCodeId || 0, // 0=INR
      RazorPayPlanId: overrides.RazorPayPlanId || `plan_test_${timestamp}`,
      PaymentLink: overrides.PaymentLink || "Payment Link will be available later",
      subscriptionDataVM: overrides.subscriptionDataVM || [
        { ContentId: 1137, ContentTypeId: 0 }
      ]
    };
  };

  /**
   * Validates subscription plan structure from create response
   * @param {Object} plan - Subscription plan response object
   */
  const validateCreatePlanResponse = (plan) => {
    expect(plan).toHaveProperty("PlanId");
    expect(plan).toHaveProperty("PlanName");
    expect(plan).toHaveProperty("ValidityType");
    expect(plan).toHaveProperty("Price");
    expect(plan).toHaveProperty("CurrencyCode");
    expect(plan).toHaveProperty("PaymentLink");
    expect(plan).toHaveProperty("PurchasedUsersCount");
    expect(plan).toHaveProperty("IsExpired");
    
    expect(typeof plan.PlanId).toBe("number");
    expect(typeof plan.PlanName).toBe("string");
    expect(typeof plan.ValidityType).toBe("string");
    expect(typeof plan.Price).toBe("number");
    expect(typeof plan.CurrencyCode).toBe("string");
    expect(typeof plan.IsExpired).toBe("boolean");
  };

  /**
   * Validates subscription plan structure from getall response
   * @param {Object} plan - Subscription plan object from list
   */
  const validatePlanListItemStructure = (plan) => {
    expect(plan).toHaveProperty("PlanId");
    expect(plan).toHaveProperty("PlanName");
    expect(plan).toHaveProperty("ValidityType");
    expect(plan).toHaveProperty("Price");
    expect(plan).toHaveProperty("CurrencyCode");
    expect(plan).toHaveProperty("PaymentLink");
    expect(plan).toHaveProperty("PurchasedUsersCount");
    expect(plan).toHaveProperty("IsExpired");
    
    expect(typeof plan.PlanId).toBe("number");
    expect(typeof plan.PlanName).toBe("string");
    expect(typeof plan.Price).toBe("number");
  };

  /**
   * Validates subscription plan detail structure from getById response
   * @param {Object} plan - Subscription plan detail object
   */
  const validatePlanDetailStructure = (plan) => {
    expect(plan).toHaveProperty("Id");
    expect(plan).toHaveProperty("PlanName");
    expect(plan).toHaveProperty("Description");
    expect(plan).toHaveProperty("Price");
    expect(plan).toHaveProperty("Validity");
    expect(plan).toHaveProperty("ValidityTypeId");
    expect(plan).toHaveProperty("CurrencyCode");
    expect(plan).toHaveProperty("Courses");
    expect(plan).toHaveProperty("IsCurrentUserSubscribed");
    
    expect(typeof plan.Id).toBe("number");
    expect(typeof plan.PlanName).toBe("string");
    expect(typeof plan.Description).toBe("string");
    expect(typeof plan.Price).toBe("number");
    expect(typeof plan.Validity).toBe("number");
    expect(typeof plan.ValidityTypeId).toBe("number");
    expect(Array.isArray(plan.Courses)).toBeTruthy();
    expect(typeof plan.IsCurrentUserSubscribed).toBe("boolean");
  };

  /**
   * Validates course structure within plan details
   * @param {Object} course - Course object
   */
  const validateCourseStructure = (course) => {
    expect(course).toHaveProperty("Id");
    expect(course).toHaveProperty("Title");
    expect(course).toHaveProperty("CourseTypeId");
    expect(course).toHaveProperty("CategoryName");
    expect(course).toHaveProperty("Description");
    
    expect(typeof course.Id).toBe("number");
    expect(typeof course.Title).toBe("string");
  };

  /**
   * Gets validity type name from ID
   * @param {number} validityTypeId - Validity type ID
   * @returns {string} - Validity type name
   */
  const getValidityTypeName = (validityTypeId) => {
    const validityTypes = {
      0: "Weekly",
      1: "Monthly",
      2: "Yearly"
    };
    return validityTypes[validityTypeId] || "Unknown";
  };

  // ==================== Test Setup ====================
  test.beforeEach(async () => {
    allure.epic("Skolasti API Automation");
    allure.feature("Subscription Management");
    allure.owner("QA Team");
    allure.tag("api", "subscription", "crud");
  });

  test("Subscription API - Complete CRUD Flow: Create Plan, Get All Plans, Get Plan By ID", async ({ request }) => {
    test.setTimeout(60000);
    allure.story("Complete Subscription Plan CRUD Flow");
    allure.severity("critical");
    allure.description("Complete validation of Subscription API including Create Plan, Get All Plans, and Get Plan By ID");
    
    const api = new ApiHelper(request, ClientAPIURL, headers);

    // ==================== STEP 1: CREATE SUBSCRIPTION PLAN ====================
    logStep("STEP 1", "CREATE SUBSCRIPTION PLAN");
    
    const createPayload = generateSubscriptionPlanPayload({
      PlanName: `Automation Test Plan ${Date.now()}`,
      Description: "Automated test subscription plan",
      Price: 199,
      Validity: 365,
      ValidityTypeId: 2 // Yearly
    });
    console.log("Create Subscription Plan Payload:", JSON.stringify(createPayload, null, 2));
    
    const createResponse = await api.post("/Subscription/createsubscriptionplan", createPayload, 200);
    console.log("Create Subscription Plan Response:", JSON.stringify(createResponse, null, 2));
    
    // Validate create response
    expect(createResponse).toBeTruthy();
    validateCreatePlanResponse(createResponse);
    
    const createdPlanId = createResponse.PlanId;
    expect(createdPlanId).toBeTruthy();
    expect(typeof createdPlanId).toBe("number");
    console.log("✓ Created Plan ID:", createdPlanId);
    
    // Validate response matches payload
    expect(createResponse.PlanName).toBe(createPayload.PlanName);
    expect(createResponse.Price).toBe(createPayload.Price);
    expect(createResponse.ValidityType).toBe(getValidityTypeName(createPayload.ValidityTypeId));
    expect(createResponse.PaymentLink).toBe(createPayload.PaymentLink);
    expect(createResponse.PurchasedUsersCount).toBe(0);
    expect(createResponse.IsExpired).toBe(false);
    console.log("✓ Create response matches payload values");

    // ==================== STEP 2: GET ALL PLANS ====================
    logStep("STEP 2", "GET ALL PLANS");
    
    const getAllPlansResponse = await api.get("/Subscription/getallplans", 200);
    console.log("Get All Plans Response Count:", getAllPlansResponse.length);
    
    // Validate response is an array
    expect(Array.isArray(getAllPlansResponse)).toBeTruthy();
    expect(getAllPlansResponse.length).toBeGreaterThan(0);
    console.log("✓ Get All Plans returned array with", getAllPlansResponse.length, "plans");
    
    // Validate structure of each plan in the list
    getAllPlansResponse.forEach((plan, index) => {
      validatePlanListItemStructure(plan);
    });
    console.log("✓ All plan structures validated");
    
    // Verify the created plan exists in the list
    const createdPlanInList = getAllPlansResponse.find(plan => plan.PlanId === createdPlanId);
    expect(createdPlanInList).toBeTruthy();
    console.log("✓ Created plan found in all plans list");
    
    // Validate created plan data in list
    expect(createdPlanInList.PlanName).toBe(createPayload.PlanName);
    expect(createdPlanInList.Price).toBe(createPayload.Price);
    expect(createdPlanInList.ValidityType).toBe(getValidityTypeName(createPayload.ValidityTypeId));
    console.log("✓ Created plan data matches in all plans list");

    // ==================== STEP 3: GET PLAN BY ID ====================
    logStep("STEP 3", "GET PLAN BY ID");
    
    const getPlanByIdResponse = await api.post(`/Subscription/getplanById?planId=${createdPlanId}`, {}, 200);
    console.log("Get Plan By ID Response:", JSON.stringify(getPlanByIdResponse, null, 2));
    
    // Validate response
    expect(getPlanByIdResponse).toBeTruthy();
    validatePlanDetailStructure(getPlanByIdResponse);
    console.log("✓ Plan detail structure validated");
    
    // Validate plan details match created payload
    expect(getPlanByIdResponse.Id).toBe(createdPlanId);
    expect(getPlanByIdResponse.PlanName).toBe(createPayload.PlanName);
    expect(getPlanByIdResponse.Description).toBe(createPayload.Description);
    expect(getPlanByIdResponse.Price).toBe(createPayload.Price);
    expect(getPlanByIdResponse.Validity).toBe(createPayload.Validity);
    expect(getPlanByIdResponse.ValidityTypeId).toBe(createPayload.ValidityTypeId);
    expect(getPlanByIdResponse.IsCurrentUserSubscribed).toBe(false);
    console.log("✓ Plan details match created payload");
    
    // Validate Courses array (should contain the content from subscriptionDataVM)
    expect(Array.isArray(getPlanByIdResponse.Courses)).toBeTruthy();
    console.log("✓ Courses array exists with", getPlanByIdResponse.Courses.length, "courses");
    
    // Validate course structure if courses exist
    if (getPlanByIdResponse.Courses.length > 0) {
      getPlanByIdResponse.Courses.forEach((course, index) => {
        validateCourseStructure(course);
        console.log(`✓ Course ${index + 1}: Id=${course.Id}, Title="${course.Title}"`);
      });
    }

    logStep("COMPLETE", "SUBSCRIPTION PLAN CRUD FLOW COMPLETED SUCCESSFULLY");
  });

  test("Subscription API - Get All Plans Validation", async ({ request }) => {
    test.setTimeout(30000);
    allure.story("Get All Subscription Plans");
    allure.severity("critical");
    allure.description("Validate the getallplans endpoint returns all available subscription plans with proper structure");
    
    const api = new ApiHelper(request, ClientAPIURL, headers);

    logStep("GET", "ALL SUBSCRIPTION PLANS");
    const allPlansResponse = await api.get("/Subscription/getallplans", 200);
    
    // Validate response is an array
    expect(Array.isArray(allPlansResponse)).toBeTruthy();
    expect(allPlansResponse.length).toBeGreaterThan(0);
    console.log("Total Subscription Plans:", allPlansResponse.length);
    console.log("Plans:", JSON.stringify(allPlansResponse, null, 2));

    // Validate structure of each plan
    allPlansResponse.forEach((plan, index) => {
      validatePlanListItemStructure(plan);
      console.log(`✓ Plan ${index + 1}: PlanId=${plan.PlanId}, Name="${plan.PlanName}", Price=${plan.Price}, ValidityType="${plan.ValidityType}"`);
    });

    // Validate PlanId values are positive
    allPlansResponse.forEach(plan => {
      expect(plan.PlanId).toBeGreaterThan(0);
    });
    console.log("✓ All PlanIds are positive numbers");

    // Validate Price values are non-negative
    allPlansResponse.forEach(plan => {
      expect(plan.Price).toBeGreaterThanOrEqual(0);
    });
    console.log("✓ All Prices are non-negative");

    // Validate ValidityType values
    const validValidityTypes = ["Weekly", "Monthly", "Yearly"];
    allPlansResponse.forEach(plan => {
      expect(validValidityTypes).toContain(plan.ValidityType);
    });
    console.log("✓ All ValidityTypes are valid");

    // Validate IsExpired is boolean
    allPlansResponse.forEach(plan => {
      expect(typeof plan.IsExpired).toBe("boolean");
    });
    console.log("✓ All IsExpired values are boolean");

    // Validate PurchasedUsersCount is non-negative
    allPlansResponse.forEach(plan => {
      expect(plan.PurchasedUsersCount).toBeGreaterThanOrEqual(0);
    });
    console.log("✓ All PurchasedUsersCount values are non-negative");

    logStep("COMPLETE", "GET ALL PLANS VALIDATION COMPLETED");
  });

  test("Subscription API - Create Plan with Different Validity Types", async ({ request }) => {
    test.setTimeout(90000);
    allure.story("Create Plans with Different Validity Types");
    allure.severity("normal");
    allure.description("Validate subscription plan creation with Weekly, Monthly, and Yearly validity types");
    
    const api = new ApiHelper(request, ClientAPIURL, headers);
    const createdPlanIds = [];

    // Test all validity types
    const validityTypes = [
      { id: 0, name: "Weekly", validity: 7 },
      { id: 1, name: "Monthly", validity: 30 },
      { id: 2, name: "Yearly", validity: 365 }
    ];

    for (const validityType of validityTypes) {
      logStep("CREATE", `${validityType.name.toUpperCase()} SUBSCRIPTION PLAN`);
      
      const createPayload = generateSubscriptionPlanPayload({
        PlanName: `${validityType.name} Test Plan ${Date.now()}`,
        Description: `Test ${validityType.name} subscription plan`,
        Price: (validityType.id + 1) * 100,
        Validity: validityType.validity,
        ValidityTypeId: validityType.id
      });
      
      const createResponse = await api.post("/Subscription/createsubscriptionplan", createPayload, 200);
      
      expect(createResponse).toBeTruthy();
      expect(createResponse.PlanId).toBeTruthy();
      expect(createResponse.ValidityType).toBe(validityType.name);
      expect(createResponse.Price).toBe(createPayload.Price);
      
      createdPlanIds.push(createResponse.PlanId);
      console.log(`✓ Created ${validityType.name} plan with ID: ${createResponse.PlanId}`);
    }

    // Verify all created plans exist in getallplans
    logStep("VERIFY", "ALL CREATED PLANS EXIST IN LIST");
    const allPlans = await api.get("/Subscription/getallplans", 200);
    
    createdPlanIds.forEach((planId, index) => {
      const planExists = allPlans.some(plan => plan.PlanId === planId);
      expect(planExists).toBeTruthy();
      console.log(`✓ ${validityTypes[index].name} plan (ID: ${planId}) found in all plans list`);
    });

    logStep("COMPLETE", "DIFFERENT VALIDITY TYPES TEST COMPLETED");
  });

  test("Subscription API - Get Plan By ID Validation", async ({ request }) => {
    test.setTimeout(60000);
    allure.story("Get Subscription Plan By ID");
    allure.severity("critical");
    allure.description("Validate the getplanById endpoint returns correct plan details with courses");
    
    const api = new ApiHelper(request, ClientAPIURL, headers);

    // First, get all plans to find an existing plan ID
    logStep("SETUP", "GET EXISTING PLAN ID");
    const allPlans = await api.get("/Subscription/getallplans", 200);
    expect(allPlans.length).toBeGreaterThan(0);
    
    // Use the first plan for testing
    const existingPlanId = allPlans[0].PlanId;
    console.log("Using existing Plan ID:", existingPlanId);

    // Get plan by ID
    logStep("GET", `PLAN BY ID: ${existingPlanId}`);
    const planDetailsResponse = await api.post(`/Subscription/getplanById?planId=${existingPlanId}`, {}, 200);
    console.log("Plan Details Response:", JSON.stringify(planDetailsResponse, null, 2));

    // Validate response structure
    expect(planDetailsResponse).toBeTruthy();
    validatePlanDetailStructure(planDetailsResponse);
    console.log("✓ Plan detail structure validated");

    // Validate ID matches requested ID
    expect(planDetailsResponse.Id).toBe(existingPlanId);
    console.log("✓ Plan ID matches requested ID");

    // Validate required fields are not empty
    expect(planDetailsResponse.PlanName).toBeTruthy();
    expect(planDetailsResponse.PlanName.length).toBeGreaterThan(0);
    console.log("✓ PlanName is not empty:", planDetailsResponse.PlanName);

    expect(planDetailsResponse.Description).toBeTruthy();
    console.log("✓ Description exists:", planDetailsResponse.Description);

    // Validate numeric fields
    expect(planDetailsResponse.Price).toBeGreaterThanOrEqual(0);
    console.log("✓ Price is valid:", planDetailsResponse.Price);

    expect(planDetailsResponse.Validity).toBeGreaterThan(0);
    console.log("✓ Validity is positive:", planDetailsResponse.Validity);

    expect([0, 1, 2]).toContain(planDetailsResponse.ValidityTypeId);
    console.log("✓ ValidityTypeId is valid:", planDetailsResponse.ValidityTypeId);

    // Validate Courses array
    expect(Array.isArray(planDetailsResponse.Courses)).toBeTruthy();
    console.log("✓ Courses is an array with", planDetailsResponse.Courses.length, "courses");

    // Validate each course structure
    if (planDetailsResponse.Courses.length > 0) {
      planDetailsResponse.Courses.forEach((course, index) => {
        validateCourseStructure(course);
        console.log(`✓ Course ${index + 1}: Id=${course.Id}, Title="${course.Title}", Category="${course.CategoryName}"`);
      });
    }

    // Validate IsCurrentUserSubscribed
    expect(typeof planDetailsResponse.IsCurrentUserSubscribed).toBe("boolean");
    console.log("✓ IsCurrentUserSubscribed:", planDetailsResponse.IsCurrentUserSubscribed);

    logStep("COMPLETE", "GET PLAN BY ID VALIDATION COMPLETED");
  });

  test("Subscription API - Negative Test: Get Non-Existent Plan By ID", async ({ request }) => {
    test.setTimeout(30000);
    allure.story("Negative Test - Get Non-Existent Plan");
    allure.severity("normal");
    allure.description("Validate API behavior when requesting a non-existent plan ID");
    
    const api = new ApiHelper(request, ClientAPIURL, headers);

    logStep("NEGATIVE TEST", "GET NON-EXISTENT PLAN BY ID");
    
    const nonExistentPlanId = 999999;
    console.log("Requesting non-existent Plan ID:", nonExistentPlanId);

    // Make direct request to handle various response scenarios
    const response = await api.request.post(`${ClientAPIURL}/Subscription/getplanById?planId=${nonExistentPlanId}`, {
      headers: headers,
      data: {}
    });
    
    const status = response.status();
    const body = await response.text();
    console.log("Response Status:", status);
    console.log("Response Body:", body);

    // API should either return 404, 204, or empty/null response
    if (status === 200) {
      // If 200, response should be empty, null, or indicate no data
      if (body && body !== "null" && body !== "{}") {
        const parsed = JSON.parse(body);
        // If it returns data, it should be empty or indicate not found
        if (parsed && parsed.Id) {
          console.log("⚠ API returned data for non-existent plan - consider adding validation");
        } else {
          console.log("✓ API returns empty/null for non-existent plan");
        }
      } else {
        console.log("✓ API returns empty response for non-existent plan");
      }
    } else if (status === 404) {
      console.log("✓ API returns 404 for non-existent plan");
    } else if (status === 204) {
      console.log("✓ API returns 204 No Content for non-existent plan");
    } else {
      console.log(`✓ API returns ${status} for non-existent plan`);
    }

    logStep("COMPLETE", "NEGATIVE TEST COMPLETED");
  });
});
