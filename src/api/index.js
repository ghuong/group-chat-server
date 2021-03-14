const info = require("./routes/info");
// const auth = require("./routes/auth");
// const user = require("./routes/user");

// guaranteed to get dependencies
module.exports = () => {
  const app = require("express").Router();
  info(app);
  // auth(app);
  // user(app);

  return app;
};