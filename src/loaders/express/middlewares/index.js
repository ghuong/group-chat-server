const config = require("@config");

const unknownEndpoint = require("./unknownEndpoint");
const errorHandler = require("./errorHandler");

module.exports = {
  unknownEndpoint,
  errorHandler,
};

if (config.env === "development") {
  const requestLogger = require("./requestLogger");

  module.exports.requestLogger = requestLogger;
}
