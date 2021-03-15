const config = require("../../config");
const logger = require("../../loaders/logger");

const handleNewChatMessage = ({ ioServer, socket, roomId, event, data }) => {
  logger.info(
    `Received from: Room '${roomId}',`,
    `Socket '${socket.id.substring(0, 6)}..':`,
    `"${data.body.substring(0, 30)}"`
  );
  ioServer.in(roomId).emit(event, data); // broadcast message to everyone in same room
};

module.exports = (eventEmitter) => {
  eventEmitter.on(
    config.socketIo.events.NEW_CHAT_MESSAGE_EVENT,
    handleNewChatMessage
  );
};
