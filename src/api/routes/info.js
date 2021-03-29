const router = require("express").Router();

module.exports = function (app) {
  app.use("/info", router);

  router.get("/", (req, res) => {
    return res.send("This is a group chat server.").status(200);
  });
};
