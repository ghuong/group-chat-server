const config = require("@config");
const disconnect = require("./eventHandlers/disconnect");
const newChatMessage = require("./eventHandlers/newChatMessage");
const makeSocketService = require("./socketService");
const makeSocketIoWrapper = require("./socketIoWrapper");

/**
 * Handle socketIO event
 * @param {String} event name of event
 * @param {*} connectionSettings object containing ioServer, socket, roomId, data
 */
const eventHandler = (event, { ioServer, socket, roomId, data }) => {
  const socketService = makeSocketService(
    event,
    {
      userId: socket.id, // TODO: pass in an actual user id
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
  }
};

module.exports = eventHandler;