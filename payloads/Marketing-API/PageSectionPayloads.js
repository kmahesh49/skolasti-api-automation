/**
 * Payloads for Marketing API - Page Section endpoints
 * Base URL: /api/PageSection
 */

module.exports = {
  // POST /api/PageSection/pagesection
  createPageSection: {
    validRequest: {
      Pageid: 1,
      Sectionname: "Test Section",
      Sectiontitle: "Test Section Title",
      Ordersequence: 1,
      Issectionvisible: true,
      IsPublished: true
    },
    missingPageId: {
      Sectionname: "Test Section",
      Sectiontitle: "Test Section Title",
      Ordersequence: 1,
      Issectionvisible: true,
      IsPublished: true
    },
    invalidPageId: {
      Pageid: 99999,
      Sectionname: "Test Section",
      Sectiontitle: "Test Section Title",
      Ordersequence: 1,
      Issectionvisible: true,
      IsPublished: true
    }
  },

  // PUT /api/PageSection/pagesection
  updatePageSection: {
    validRequest: {
      Id: 1,
      Pageid: 1,
      Sectionname: "Updated Section",
      Sectiontitle: "Updated Section Title",
      Ordersequence: 2,
      Issectionvisible: true,
      IsPublished: true
    },
    invalidId: {
      Id: 99999,
      Pageid: 1,
      Sectionname: "Non-existent Section",
      Sectiontitle: "Test",
      Ordersequence: 1,
      Issectionvisible: true,
      IsPublished: true
    }
  }
};
