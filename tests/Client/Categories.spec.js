const { test, expect } = require("@playwright/test");
const { ClientAPIURL, headers } = require("../../config/config.js");
const { ApiHelper } = require("../../utils/ApiHelper.js");
const { allure } = require("allure-playwright");

test.describe("Category Management API", () => {
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
   * Expected base categories that should always exist
   */
  const getExpectedCategories = () => [
    { Id: 0, CategoryName: "Leadership", Description: "Entertainment" },
    { Id: 1, CategoryName: "Technology", Description: "Technology" },
    { Id: 2, CategoryName: "Soft Skills", Description: "Soft Skills" },
    { Id: 3, CategoryName: "Production", Description: "Production" },
    { Id: 4, CategoryName: "Learning", Description: "Learning" },
    { Id: 5, CategoryName: "Life style", Description: "Life style" },
    { Id: 6, CategoryName: "LIfestyle", Description: "LIfestyle" }
  ];

  /**
   * Expected base playlist categories that should always exist
   */
  const getExpectedPlaylistCategories = () => [
    { Id: 0, PlaylistCategoryName: "Leadership", PlaylistCategoryDescription: "Entertainment" },
    { Id: 1, PlaylistCategoryName: "Technology", PlaylistCategoryDescription: "Technology" },
    { Id: 2, PlaylistCategoryName: "Soft Skills", PlaylistCategoryDescription: "Soft Skills" },
    { Id: 3, PlaylistCategoryName: "Production", PlaylistCategoryDescription: "Production" },
    { Id: 4, PlaylistCategoryName: "Learning", PlaylistCategoryDescription: "Learning" },
    { Id: 5, PlaylistCategoryName: "Life style", PlaylistCategoryDescription: "Life style" },
    { Id: 6, PlaylistCategoryName: "LIfestyle", PlaylistCategoryDescription: "LIfestyle" }
  ];

  /**
   * Validates category structure
   * @param {Object} category - Category object to validate
   */
  const validateCategoryStructure = (category) => {
    expect(category).toHaveProperty("Id");
    expect(category).toHaveProperty("CategoryName");
    expect(category).toHaveProperty("Description");
    expect(category).toHaveProperty("CreatedDate");
    expect(category).toHaveProperty("UpdatedDate");
    expect(category).toHaveProperty("Videos");
    expect(category).toHaveProperty("Courses");
    
    expect(typeof category.Id).toBe("number");
    expect(typeof category.CategoryName).toBe("string");
    expect(typeof category.Description).toBe("string");
    expect(Array.isArray(category.Videos)).toBeTruthy();
    expect(Array.isArray(category.Courses)).toBeTruthy();
  };

  /**
   * Validates playlist category structure
   * @param {Object} category - Playlist category object to validate
   */
  const validatePlaylistCategoryStructure = (category) => {
    expect(category).toHaveProperty("Id");
    expect(category).toHaveProperty("PlaylistCategoryName");
    expect(category).toHaveProperty("PlaylistCategoryDescription");
    expect(category).toHaveProperty("CreatedDate");
    expect(category).toHaveProperty("UpdatedDate");
    expect(category).toHaveProperty("Playlists");
    expect(category).toHaveProperty("TenantId");
    
    expect(typeof category.Id).toBe("number");
    expect(typeof category.PlaylistCategoryName).toBe("string");
    expect(typeof category.PlaylistCategoryDescription).toBe("string");
    expect(Array.isArray(category.Playlists)).toBeTruthy();
  };

  // ==================== Test Setup ====================
  test.beforeEach(async () => {
    allure.epic("Skolasti API Automation");
    allure.feature("Category Management");
    allure.owner("QA Team");
    allure.tag("api", "category", "read");
  });

  test("Category API - Get All Categories", async ({ request }) => {
    test.setTimeout(30000);
    allure.story("Get All Categories");
    allure.severity("critical");
    allure.description("Validate the getallcategories endpoint returns all available categories with proper structure");
    
    const api = new ApiHelper(request, ClientAPIURL, headers);

    logStep("GET", "ALL CATEGORIES");
    const categoriesResponse = await api.get("/Category/getallcategories", 200);
    
    // Validate response is an array
    expect(Array.isArray(categoriesResponse)).toBeTruthy();
    expect(categoriesResponse.length).toBeGreaterThan(0);
    console.log("Total Categories:", categoriesResponse.length);
    console.log("Categories:", JSON.stringify(categoriesResponse, null, 2));

    // Validate required base categories exist
    const expectedCategories = getExpectedCategories();
    expectedCategories.forEach(expected => {
      const categoryExists = categoriesResponse.some(
        cat => cat.Id === expected.Id && cat.CategoryName === expected.CategoryName
      );
      expect(categoryExists).toBeTruthy();
      console.log(`✓ Required category "${expected.CategoryName}" (Id: ${expected.Id}) exists`);
    });

    // Validate structure of each category
    categoriesResponse.forEach((category, index) => {
      validateCategoryStructure(category);
      console.log(`✓ Category ${index}: Id=${category.Id}, Name="${category.CategoryName}"`);
    });

    // Validate Id values are non-negative
    categoriesResponse.forEach(category => {
      expect(category.Id).toBeGreaterThanOrEqual(0);
    });

    // Validate dates are valid ISO strings
    categoriesResponse.forEach(category => {
      expect(category.CreatedDate).toBeTruthy();
      expect(category.UpdatedDate).toBeTruthy();
      // Validate date format (ISO 8601)
      expect(new Date(category.CreatedDate).toString()).not.toBe("Invalid Date");
      expect(new Date(category.UpdatedDate).toString()).not.toBe("Invalid Date");
    });

    logStep("COMPLETE", "GET ALL CATEGORIES VALIDATION COMPLETED");
  });

  test("Category API - Get All Playlist Categories", async ({ request }) => {
    test.setTimeout(30000);
    allure.story("Get All Playlist Categories");
    allure.severity("critical");
    allure.description("Validate the getallplaylistcategories endpoint returns all available playlist categories with proper structure");
    
    const api = new ApiHelper(request, ClientAPIURL, headers);

    logStep("GET", "ALL PLAYLIST CATEGORIES");
    const playlistCategoriesResponse = await api.get("/Category/getallplaylistcategories", 200);
    
    // Validate response is an array
    expect(Array.isArray(playlistCategoriesResponse)).toBeTruthy();
    expect(playlistCategoriesResponse.length).toBeGreaterThan(0);
    console.log("Total Playlist Categories:", playlistCategoriesResponse.length);
    console.log("Playlist Categories:", JSON.stringify(playlistCategoriesResponse, null, 2));

    // Validate required base playlist categories exist
    const expectedPlaylistCategories = getExpectedPlaylistCategories();
    expectedPlaylistCategories.forEach(expected => {
      const categoryExists = playlistCategoriesResponse.some(
        cat => cat.Id === expected.Id && cat.PlaylistCategoryName === expected.PlaylistCategoryName
      );
      expect(categoryExists).toBeTruthy();
      console.log(`✓ Required playlist category "${expected.PlaylistCategoryName}" (Id: ${expected.Id}) exists`);
    });

    // Validate structure of each playlist category
    playlistCategoriesResponse.forEach((category, index) => {
      validatePlaylistCategoryStructure(category);
      console.log(`✓ Playlist Category ${index}: Id=${category.Id}, Name="${category.PlaylistCategoryName}"`);
    });

    // Validate Id values are non-negative
    playlistCategoriesResponse.forEach(category => {
      expect(category.Id).toBeGreaterThanOrEqual(0);
    });

    // Validate dates are valid ISO strings
    playlistCategoriesResponse.forEach(category => {
      expect(category.CreatedDate).toBeTruthy();
      expect(category.UpdatedDate).toBeTruthy();
      expect(new Date(category.CreatedDate).toString()).not.toBe("Invalid Date");
      expect(new Date(category.UpdatedDate).toString()).not.toBe("Invalid Date");
    });

    // Validate TenantId can be null
    playlistCategoriesResponse.forEach(category => {
      // TenantId can be null or a value
      if (category.TenantId !== null) {
        console.log(`Category ${category.Id} has TenantId: ${category.TenantId}`);
      }
    });

    logStep("COMPLETE", "GET ALL PLAYLIST CATEGORIES VALIDATION COMPLETED");
  });

  test("Category API - Invalidate Category Caches", async ({ request }) => {
    test.setTimeout(30000);
    allure.story("Invalidate Category Caches");
    allure.severity("normal");
    allure.description("Validate the invalidatecategorycaches endpoint clears category caches successfully");
    
    const api = new ApiHelper(request, ClientAPIURL, headers);

    logStep("POST", "INVALIDATE CATEGORY CACHES");
    const invalidateCacheResponse = await api.post("/Category/invalidatecategorycaches", {}, 200);
    
    console.log("Invalidate Cache Response:", JSON.stringify(invalidateCacheResponse, null, 2));
    
    // Response validation - should return success indicator
    // The response could be boolean true, or an object with success status, or null/empty
    if (invalidateCacheResponse === true) {
      console.log("✓ Cache invalidation returned true");
    } else if (invalidateCacheResponse === null || invalidateCacheResponse === "") {
      console.log("✓ Cache invalidation completed (empty response)");
    } else if (typeof invalidateCacheResponse === 'object') {
      // Check for common success indicators
      if (invalidateCacheResponse.Success !== undefined) {
        expect(invalidateCacheResponse.Success).toBe(true);
        console.log("✓ Cache invalidation Success flag is true");
      }
      if (invalidateCacheResponse.Status !== undefined) {
        expect(invalidateCacheResponse.Status.toLowerCase()).not.toBe("fail");
        console.log("✓ Cache invalidation Status is not fail");
      }
      if (invalidateCacheResponse.Message !== undefined) {
        console.log("✓ Cache invalidation message:", invalidateCacheResponse.Message);
      }
      console.log("✓ Cache invalidation completed successfully");
    } else if (typeof invalidateCacheResponse === 'string') {
      // String response
      expect(invalidateCacheResponse.toLowerCase()).not.toContain("fail");
      expect(invalidateCacheResponse.toLowerCase()).not.toContain("error");
      console.log("✓ Cache invalidation response:", invalidateCacheResponse);
    }

    // Verify categories are still accessible after cache invalidation
    logStep("VERIFY", "CATEGORIES ACCESSIBLE AFTER CACHE INVALIDATION");
    
    const categoriesAfterInvalidate = await api.get("/Category/getallcategories", 200);
    expect(Array.isArray(categoriesAfterInvalidate)).toBeTruthy();
    expect(categoriesAfterInvalidate.length).toBeGreaterThan(0);
    console.log("✓ Categories still accessible after cache invalidation");
    console.log("Total categories:", categoriesAfterInvalidate.length);

    const playlistCategoriesAfterInvalidate = await api.get("/Category/getallplaylistcategories", 200);
    expect(Array.isArray(playlistCategoriesAfterInvalidate)).toBeTruthy();
    expect(playlistCategoriesAfterInvalidate.length).toBeGreaterThan(0);
    console.log("✓ Playlist categories still accessible after cache invalidation");
    console.log("Total playlist categories:", playlistCategoriesAfterInvalidate.length);

    logStep("COMPLETE", "INVALIDATE CATEGORY CACHES VALIDATION COMPLETED");
  });

  test("Category API - Categories and Playlist Categories Consistency", async ({ request }) => {
    test.setTimeout(30000);
    allure.story("Categories Consistency Check");
    allure.severity("normal");
    allure.description("Validate that categories and playlist categories have consistent base data");
    
    const api = new ApiHelper(request, ClientAPIURL, headers);

    logStep("GET", "BOTH CATEGORY TYPES FOR COMPARISON");
    
    // Get both category types
    const categories = await api.get("/Category/getallcategories", 200);
    const playlistCategories = await api.get("/Category/getallplaylistcategories", 200);
    
    console.log("Categories count:", categories.length);
    console.log("Playlist Categories count:", playlistCategories.length);

    // Validate base categories (Id 0-6) exist in both
    const baseIds = [0, 1, 2, 3, 4, 5, 6];
    
    baseIds.forEach(id => {
      const category = categories.find(c => c.Id === id);
      const playlistCategory = playlistCategories.find(c => c.Id === id);
      
      expect(category).toBeTruthy();
      expect(playlistCategory).toBeTruthy();
      
      // Names should match (CategoryName vs PlaylistCategoryName)
      expect(category.CategoryName).toBe(playlistCategory.PlaylistCategoryName);
      console.log(`✓ Id ${id}: "${category.CategoryName}" matches in both category types`);
    });

    // Validate both endpoints return non-empty arrays
    expect(categories.length).toBeGreaterThanOrEqual(7);
    expect(playlistCategories.length).toBeGreaterThanOrEqual(7);
    console.log("✓ Both category types have at least 7 entries (base categories)");

    logStep("COMPLETE", "CATEGORIES CONSISTENCY CHECK COMPLETED");
  });
});
