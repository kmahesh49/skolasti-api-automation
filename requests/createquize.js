const { baseURL, headers } = require("../config/config");
const { createQuizePayload } = require("../payloads/createquizePayload");

module.exports = {
  createQuize: async (requestContext, payloadOptions = {}) => {
    const payload = createQuizePayload(payloadOptions);
    return await requestContext.post(`${baseURL}/quize`, {
      headers,
      data: payload
    });
  }
};
