require("module-alias").addAliases({
  "@root": `${__dirname}/..`,
  "@config": __dirname,
  "@logger": `${__dirname}/../loaders/logger`,
  "@models": `${__dirname}/../models`,
  "@services": `${__dirname}/../services`,
});

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV ||= "development";

if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");

  const envFound = dotenv.config();
  if (envFound.error) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  }
}

module.exports = {
  /**
   * Node Environment
   */
  env: process.env.NODE_ENV,

  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT, 10),

  /**
   * That long string from your mongo service
   */
  databaseURL:
    process.env.NODE_ENV === "test"
      ? process.env.TEST_MONGODB_URI
      : process.env.MONGODB_URI,

  /**
   * API configs
   */
  api: {
    prefix: "/api",
  },

  /**
   * User Auth related configs
   */
  auth: {
    saltRounds: 10,
    minPasswordLength: 8,
  },

  /**
   * Where built client's static assets are stored
   */
  buildFolder: "build/client",

  /**
   * SocketIO configs
   */
  socketIo: {
    events: {
      DISCONNECT: "disconnect",
      NEW_CHAT_MESSAGE: "newChatMessage",
      ANNOUNCE_PRESENCE: "announcePresence",
    },
  },
};
