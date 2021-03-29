const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("@models/user");
const config = require("@config");

module.exports = function (app) {
  app.use("/users", router);

  router.get("/", async (req, res) => {
    const users = await User.find({});
    res.json(users);
  });

  router.post("/", async (req, res) => {
    // TODO: refactor logic into user's service
    if (!req.body.password) {
      return res.status(400).json({ error: "Password is required." });
    } else if (req.body.password.length < config.auth.minPasswordLength) {
      return res.status(400).json({
        error: `Password must be at least ${config.auth.minPasswordLength} characters long.`,
      });
    }

    const passwordHash = await bcrypt.hash(req.body.password, config.auth.saltRounds);
    const user = new User({
      username: req.body.username,
      name: req.body.name,
      passwordHash
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  });
};