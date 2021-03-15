const terminateServer = require("./terminateServer");

module.exports = async ({ server }) => {
  const exitHandler = terminateServer(server);

  process.on("uncaughtException", exitHandler(1, "Unexpected Error"));
  process.on("unhandledRejection", exitHandler(1, "Unhandled Promise"));
  process.on("SIGTERM", exitHandler(0, "SIGTERM"));
  process.on("SIGINT", exitHandler(0, "SIGINT"));
};
