const express = require("express");
const cors = require("cors");
const routes = require("../../api");
const config = require("@config");
const healthCheckEndpointsLoader = require("./healthCheckEndpoints");
const middlewares = require("./middlewares");

/**
 * Express Loader
 * @param {express.Application} app
 */
async function loadExpressApp({ app }) {
  // Health Check endpoints
  await healthCheckEndpointsLoader({ app });

  // Middleware to serve static assets
  // Express only serves static assets in production
  if (config.env === "production") {
    app.use(express.static(config.buildFolder));
  }

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable("trust proxy");

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  //? Maybe not needed anymore ?
  // app.use(require("method-override")());

  // Middleware that JSONifies raw string of req.body
  app.use(express.json());

  // Load API Request Logger
  if (config.env === "development") {
    app.use(middlewares.requestLogger);
  }

  // Load API Routes
  app.use(config.api.prefix, routes());

  // Catch 404 unknown endpoints
  app.use(middlewares.unknownEndpoint);

  // Error Handler
  app.use(middlewares.errorHandler);
}

module.exports = loadExpressApp;
