const messagesRouter = require("express").Router();
const messages = require("../data/messages");

// API Routes

// get all notes
messagesRouter.get("/", (req, res) => {
  res.json(messages);
});

module.exports = messagesRouter;
