require("express-async-errors");
const express = require("express");
const http = require("http");
const expressLoader = require("./express");
const socketIoLoader = require("./socketIo");
const logger = require("./logger");
// const config = require("../config");
const exitHandler = require("./exitHandler");

/**
 * Startup process of app is separated into testable modules
 * @returns the fully configured http.Server instance
 */
module.exports = async ({ app } = { app: express() }) => {
  await expressLoader({ app });
  logger.info("✌️ Express loaded");

  const httpServer = http.createServer(app); // wrap app in server

  const ioServer = await socketIoLoader({ httpServer });
  logger.info("✌️ Socket.IO loaded");

  await exitHandler({ httpServer, ioServer });
  logger.info("✌️ Exit Handler loaded");

  return httpServer;
};
