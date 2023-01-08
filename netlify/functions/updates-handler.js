const mssgHandler = require("../../src/mssg-handler");

// handler recognized by Netlify Functions
exports.handler = async (e) => {
  const res = await mssgHandler(e);
  return res;
};
