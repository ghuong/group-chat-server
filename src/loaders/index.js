const express = require("express");
const http = require("http");
const expressLoader = require("./express");
const socketIoLoader = require("./socketIo");
const logger = require("./logger");
// const config = require("../config");

/**
 * Startup process of app is separated into testable modules
 * @returns the fully configured http.Server instance
 */
module.exports = async ({ app } = { app: express() }) => {
  await expressLoader({ app });
  logger.info("✌️ Express loaded");

  // Wrap express app in http.Server
  const httpServer = http.createServer(app);

  await socketIoLoader({ httpServer });
  logger.info("✌️ Socket.IO loaded");

  return httpServer;
};
