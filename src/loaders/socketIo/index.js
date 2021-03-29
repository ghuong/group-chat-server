const config = require("@config");
const logger = require("@logger");
const eventHandler = require("@services/socketIo");
const socketIoLoader = require("./socketIoLoader");

/**
 * Handler for when new client connects to SocketIO server
 * @param {Socket} socket
 * @returns an Object with custom settings for the connection
 */
const handleOnConnect = (socket) => {
  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);
  logger.info("Client connected to room", roomId);

  return { roomId };
};

/**
 * Configures Socket.IO on the server
 * @param {http.Server} httpServer the http server instance
 */
module.exports = async ({ httpServer }) => {
  const ioServer = await socketIoLoader({
    httpServer,
    handleOnConnect,
    eventHandler,
    events: Object.values(config.socketIo.events),
  });

  return ioServer;
};
