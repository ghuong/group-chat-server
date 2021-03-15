const EventEmitter = require("events");
const config = require("../../config");
const logger = require("../logger");
const socketIoLoader = require("./socketIoLoader");
const subscribersLoader = require("../../subscribers/socketIo");

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
  const eventEmitter = new EventEmitter();

  const ioServer = await socketIoLoader({
    httpServer,
    handleOnConnect,
    events: config.socketIo.events,
    eventEmitter,
  });

  // set up subscribers to handle socketIO events
  await subscribersLoader({ eventEmitter });

  return ioServer;
};
