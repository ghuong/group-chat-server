const info = require("./routes/info");
// const auth = require("./routes/auth");
const users = require("./routes/users");

// guaranteed to get dependencies
function loadRoutes() {
  const app = require("express").Router();
  info(app);
  // auth(app);
  users(app);

  return app;
};

module.exports = loadRoutes;