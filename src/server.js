const config = require("./config");
const logger = require("./loaders/logger");

const startServer = async () => {
  const httpServer = await require("./loaders")();

  httpServer
    .listen(config.port, () => {
      logger.info(`
        ################################################
        🛡️  Server listening on port: ${config.port} 🛡️
        ################################################
      `);
    });
};

startServer();
