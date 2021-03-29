// const { defaults } = require("jest-config");

module.exports = {
  "testEnvironment": "node",
  "moduleNameMapper": {
    "^@root(.*)$": "<rootDir>/src/$1",
    "^@helpers(.*)$": "<rootDir>/tests/helpers/$1"
  }
};
