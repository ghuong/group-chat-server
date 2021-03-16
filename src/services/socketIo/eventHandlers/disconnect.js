const logger = require("../../../loaders/logger");

/**
 * Handler for when client disconnects from SocketIO server
 * @param {Object} connectionSettings holds ioServer, socket, roomId
 */
const handleOnDisconnect = ({ socket, roomId }) => {
  // Leave the room if user closes socket
  logger.info("Client disconnected from room", roomId);
  socket.leave(roomId);
};

module.exports = handleOnDisconnect;
