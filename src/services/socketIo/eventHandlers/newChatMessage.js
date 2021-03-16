const logger = require("../../../loaders/logger");

const handleNewChatMessage = (event, { ioServer, socket, roomId, data }) => {
  logger.info(
    `Received from: Room '${roomId}',`,
    `Socket '${socket.id.substring(0, 6)}..':`,
    `"${data.body.substring(0, 30)}"`
  );
  ioServer.in(roomId).emit(event, data); // broadcast message to everyone in same room
};

module.exports = handleNewChatMessage;
