const { baseURL, headers } = require("../config/config");

module.exports = {
  getUsers: async (requestContext, pageNo = 1) => {
    return await requestContext.get(`${baseURL}/users?page=${pageNo}`, {
      headers
    });
  }
};
