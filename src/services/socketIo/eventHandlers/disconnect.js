const logger = require("@logger");

/**
 * Handler for when client disconnects from SocketIO server
 * @param {Object} connectionSettings holds ioServer, socket, roomId
 */
function handleOnDisconnect(socketService) {
  // Leave the room if user closes socket
  logger.info("Client disconnected from room", socketService.getRoomId());
  socketService.disconnect();
};

module.exports = handleOnDisconnect;
