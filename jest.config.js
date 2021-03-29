// const { defaults } = require("jest-config");

module.exports = {
  testEnvironment: "node",
  moduleNameMapper: {
    "^@root(.*)$": "<rootDir>/src/$1",
    "^@config$": "<rootDir>/src/config",
    "^@logger$": "<rootDir>/src/loaders/logger",
    "^@models(.*)$": "<rootDir>/src/models/$1",
    "^@services(.*)$": "<rootDir>/src/services/$1",
    "^@helpers(.*)$": "<rootDir>/tests/helpers/$1",
  },
};
