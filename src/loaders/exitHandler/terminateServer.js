// Credit: https://blog.heroku.com/best-practices-nodejs-errors

const logger = require("../logger");

/**
 * An exit handler for terminating server
 * @param {http.Server} server
 * @param {{ coredump, timeout }} options
 *   @param {Boolean} coredump should coredump?
 *   @param {Number} timeout timeout in ms
 * @returns exit handler that terminates server gracefully
 */
const terminateServer = (server, options = { coredump: false, timeout: 500 }) => {
  // Exit function
  const exit = (code) => {
    options.coredump ? process.abort() : process.exit(code);
  };

  return (code, reason) => (err, promise) => {
    if (err && err instanceof Error) {
      // Log error information, use a proper logging library here :)
      logger.error(err.message, `\n${err.stack}`);
    }

    // Attempt a graceful shutdown
    server.close(exit);
    setTimeout(exit, options.timeout).unref();
  };
};

module.exports = terminateServer;
