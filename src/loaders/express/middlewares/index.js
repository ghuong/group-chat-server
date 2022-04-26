const config = require("@config");

const unknownEndpoint = require("./unknownEndpoint");
const errorHandler = require("./errorHandler");

module.exports = {
  unknownEndpoint,
  errorHandler,
};

console.log(`config.env: ${config.env}`);
if (config.env === "development") {
  console.log("require(./requestLogger)");
  const requestLogger = require("./requestLogger");

  module.exports.requestLogger = requestLogger;
}
