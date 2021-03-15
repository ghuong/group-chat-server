const dotenv = require("dotenv");

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT, 10),

  /**
   * That long string from your mongo service
   */
  // databaseURL: process.env.MONGODB_URI,

  /**
   * API configs
   */
  api: {
    prefix: "/api",
  },

  /**
   * Where built client's static assets are stored
   */
  buildFolder: "build/web",

  /**
   * SocketIO configs
   */
  socketIo: {
    events: {
      NEW_CHAT_MESSAGE_EVENT: "newChatMessage",
    }
  }
};
