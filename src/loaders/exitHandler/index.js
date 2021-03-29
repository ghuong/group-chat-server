const terminateServer = require("./terminateServer");

async function loadExitHandler({ httpServer, ioServer }) {
  const exitHandler = terminateServer(httpServer, ioServer);

  process.on("uncaughtException", exitHandler(1, "Unexpected Error"));
  process.on("unhandledRejection", exitHandler(1, "Unhandled Promise"));
  process.on("SIGTERM", exitHandler(0, "SIGTERM"));
  process.on("SIGINT", exitHandler(0, "SIGINT"));
}

module.exports = loadExitHandler;
