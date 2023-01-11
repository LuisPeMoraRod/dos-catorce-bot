const mssgHandler = require("../../src/mssg-handler");

// handler function recognized by Netlify Functions
exports.handler = async (e) => {
  return await mssgHandler(e);
};
