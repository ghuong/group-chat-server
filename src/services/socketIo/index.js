const config = require("@config");

// Event handlers
const disconnect = require("./eventHandlers/disconnect");
const newChatMessage = require("./eventHandlers/newChatMessage");
const announcePresence = require("./eventHandlers/announcePresence");

const makeSocketService = require("./socketService");
const makeSocketIoWrapper = require("./socketIoWrapper");

/**
 * Handle socketIO event
 * @param {String} event name of event
 * @param {*} connectionSettings object containing ioServer, socket, roomId, data
 */
function handleEvent(event, { ioServer, socket, roomId, data, user }) {
  const socketService = makeSocketService(
    event,
    {
      user,
      roomId,
      data,
    },
    makeSocketIoWrapper({ ioServer, socket, roomId })
  );

  const events = config.socketIo.events;
  switch (event) {
    case events.DISCONNECT:
      return disconnect(socketService);
    case events.NEW_CHAT_MESSAGE:
      return newChatMessage(socketService);
    case events.ANNOUNCE_PRESENCE:
      return announcePresence(socketService, data.recipientUser, user);
  }
};

module.exports = handleEvent;