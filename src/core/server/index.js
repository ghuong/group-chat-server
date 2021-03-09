const config = require("./utils/config");
const app = require("./app");
const http = require("http"); //? why do we need http module if using express?
const logger = require("./utils/logger");

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
