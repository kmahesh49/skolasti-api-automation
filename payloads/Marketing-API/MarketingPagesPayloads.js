/**
 * Payloads for Marketing API - Marketing Pages endpoints
 * Base URL: /api/Marketingpages
 */

module.exports = {
  // POST /api/Marketingpages/marketingpages
  createMarketingPage: {
    validRequest: {
      PageName: "Test Marketing Page",
      IsPageVisible: true,
      IsPublished: true
    },
    duplicatePage: {
      PageName: "Home Page", // Assuming this might exist
      IsPageVisible: true,
      IsPublished: true
    },
    invalidData: {
      PageName: "", // Empty name
      IsPageVisible: true,
      IsPublished: true
    }
  },

  // PUT /api/Marketingpages/marketingpages
  updateMarketingPage: {
    validRequest: {
      Id: 1,
      PageName: "Updated Marketing Page",
      IsPageVisible: true,
      IsPublished: true
    },
    invalidId: {
      Id: 99999,
      PageName: "Non-existent Page",
      IsPageVisible: true,
      IsPublished: false
    },
    noChanges: {
      Id: 1,
      PageName: "Same Name",
      IsPageVisible: true,
      IsPublished: true
    }
  }
};
