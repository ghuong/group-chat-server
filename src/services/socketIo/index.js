const config = require("../../config");
const disconnect = require("./eventHandlers/disconnect");
const newChatMessage = require("./eventHandlers/newChatMessage");

/**
 * Handle socketIO event
 * @param {String} event name of event
 * @param {*} connectionSettings
 */
const eventHandler = (event, connectionSettings) => {
  const events = config.socketIo.events;
  switch (event) {
    case events.DISCONNECT:
      return disconnect(connectionSettings);
    case events.NEW_CHAT_MESSAGE:
      return newChatMessage(event, connectionSettings);
  }
};

module.exports = eventHandler;