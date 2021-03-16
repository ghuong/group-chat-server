const config = require("../../config");
const disconnect = require("./eventHandlers/disconnect");
const newChatMessage = require("./eventHandlers/newChatMessage");
const makeSocketService = require("./socketService");

/**
 * Handle socketIO event
 * @param {String} event name of event
 * @param {*} connectionSettings
 */
const eventHandler = (event, connectionSettings) => {
  const socketService = makeSocketService(event, connectionSettings);

  const events = config.socketIo.events;
  switch (event) {
    case events.DISCONNECT:
      return disconnect(socketService);
    case events.NEW_CHAT_MESSAGE:
      return newChatMessage(socketService);
  }
};

module.exports = eventHandler;