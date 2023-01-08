const axios = require("axios").default;
const handler = require("../../src/handler");

exports.updatesHandler = async (event) => {
  const res = await handler(event);
  return res;
};
