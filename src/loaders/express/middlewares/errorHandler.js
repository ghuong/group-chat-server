const logger = require("@logger");

// Error handler middleware (must be the last middleware used)
module.exports = (err, req, res, next) => {
  logger.error(err.message);

  switch (err.name) {
    /**
     * Handle 401 thrown by express-jwt library
     * ? What is that?
     */
    // case "UnauthorizedError":
    //   return res.status(err.status).send({ error: err.message }).end();
    case "CastError":
      return res.status(400).send({ error: "Malformatted id" }).end();
    case "ValidationError":
      return res.status(400).json({ error: err.message }).end();
  }

  if (res.headersSent) {
    return next(err);
  } else {
    //TODO: needs to render correct page on client
    return res.status(err.status || 500).render("500");
  }
};
