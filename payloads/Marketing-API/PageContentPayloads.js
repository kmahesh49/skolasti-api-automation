/**
 * Payloads for Marketing API - Page Content endpoints
 * Includes Dynamic, Static, and Product Content
 */

module.exports = {
  // POST /api/PageSectionDynamicContent/pagesectiondynamiccontent
  // Note: This endpoint uses multipart/form-data
  createDynamicContent: {
    validRequest: {
      Pagesectionid: 1,
      Heading: "Test Dynamic Content",
      Description: "Test description for dynamic content",
      Subheading: "Test Subheading",
      Subdescription: "Test subdescription",
      Rating: 4.5,
      Isvisible: true,
      IsPublished: true
    },
    missingRequired: {
      Heading: "Test Dynamic Content",
      Description: "Missing section ID"
    }
  },

  // POST /api/PageSectionStaticContent/pagesectionstaticcontent
  // Note: This endpoint uses multipart/form-data
  createStaticContent: {
    validRequest: {
      Pagesectionid: 1,
      Heading: "Test Static Content",
      Description: "Test description for static content",
      Buttontext: "Learn More",
      Buttonurl: "https://example.com",
      Isvisible: true,
      IsPublished: true
    },
    invalidUrl: {
      Pagesectionid: 1,
      Heading: "Test Static Content",
      Description: "Test description",
      Buttontext: "Click",
      Buttonurl: "invalid-url",
      Isvisible: true,
      IsPublished: true
    }
  },

  // POST /api/SectionProductContent/sectionproductcontent
  createProductContent: {
    validRequest: {
      Pagesectionid: 1,
      Contentid: 1,
      Contenttypeid: 1,
      IsPublished: true
    },
    invalidSectionId: {
      Pagesectionid: 99999,
      Contentid: 1,
      Contenttypeid: 1,
      IsPublished: true
    },
    invalidContentId: {
      Pagesectionid: 1,
      Contentid: 99999,
      Contenttypeid: 1,
      IsPublished: true
    }
  },

  // POST /api/SectionProductDetails/sectionproductdetails
  createProductDetails: {
    validRequest: {
      SectionProductContentid: 1,
      Contenttitle: "Test Product",
      Contenttypename: "Course",
      ContentCategory: "Technology",
      Price: 99.99,
      Curencycode: "USD",
      Thumbnailurl: "https://example.com/thumbnail.jpg",
      Rating: 4.8,
      IsPublished: true
    },
    invalidPrice: {
      SectionProductContentid: 1,
      Contenttitle: "Test Product",
      Contenttypename: "Course",
      ContentCategory: "Technology",
      Price: -10,
      Curencycode: "USD",
      Rating: 4.8,
      IsPublished: true
    }
  }
};
