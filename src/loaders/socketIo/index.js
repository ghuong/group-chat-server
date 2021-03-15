const config = require("../../config");
const logger = require("../logger");
const socketIoLoader = require("./socketIoLoader");

/**
 * Configures Socket.IO on the server
 * @param {http.Server} httpServer the http server instance
 */
module.exports = async ({ httpServer }) => {
  const handleOnConnect = (socket) => {
    // Join a conversation
    const { roomId } = socket.handshake.query;
    socket.join(roomId);
    logger.info("Client connected to room", roomId);

    return { roomId };
  };

  const handleOnDisconnect = ({ socket, roomId }) => {
    // Leave the room if user closes socket
    logger.info("Client disconnected from room", roomId);
    socket.leave(roomId);
  };

  const listeners = [
    {
      event: config.socketIo.events.NEW_CHAT_MESSAGE_EVENT,
      handler: ({ ioServer, socket, roomId, event, data }) => {
        logger.info(
          `Received from: Room '${roomId}',`,
          `Socket '${socket.id.substring(0, 6)}..':`,
          `"${data.body.substring(0, 30)}"`
        );
        ioServer.in(roomId).emit(event, data);
      }
    },
  ];

  await socketIoLoader({
    httpServer,
    handleOnConnect,
    handleOnDisconnect,
    listeners
  });
};
