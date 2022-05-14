const config = require("@config");

// Event handlers
const disconnect = require("./eventHandlers/disconnect");
const newChatMessage = require("./eventHandlers/newChatMessage");

const makeSocketService = require("./socketService");
const makeSocketIoWrapper = require("./socketIoWrapper");

/**
 * Handle socketIO event
 * @param {String} event name of event
 * @param {*} connectionSettings object containing ioServer, socket, roomId, data
 */
function handleEvent(event, { ioServer, socket, roomId, data, username }) {
  const socketService = makeSocketService(
    event,
    {
      userId: socket.id, // TODO: pass in an actual user id
      roomId,
      data,
      username,
    },
    makeSocketIoWrapper({ ioServer, socket, roomId })
  );

  const events = config.socketIo.events;
  switch (event) {
    case events.DISCONNECT:
      return disconnect(socketService);
    case events.NEW_CHAT_MESSAGE:
      return newChatMessage(socketService);
  }
};

module.exports = handleEvent;