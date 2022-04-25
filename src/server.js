const config = require("./config");
const logger = require("@logger");

(async () => {
  logger.info("Hello world!");

  const httpServer = await require("./loaders")();

  httpServer.listen(config.port, () => {
    logger.info(`
        ################################################
        🛡️  Server listening on port: ${config.port} 🛡️
        ################################################
      `);
  });
})();
