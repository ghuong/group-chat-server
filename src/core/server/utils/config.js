require("dotenv").config();

const PORT = process.env.PORT;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

module.exports = {
  PORT,
  NEW_CHAT_MESSAGE_EVENT
};
