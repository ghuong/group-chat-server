const config = require("@config");
const logger = require("@logger");
const handleEvent = require("@services/socketIo");
const socketIoLoader = require("./socketIoLoader");

/**
 * Handler for when new client connects to SocketIO server
 * @param {Socket} socket
 * @returns an Object with custom settings for the connection
 */
function handleOnConnect(socket, ioServer) {
  const USER_JOINED_ROOM_EVENT = "userConnected";

  // Join a conversation
  const { roomId, username } = socket.handshake.query;
  socket.join(roomId);
  logger.info("Client connected to room", roomId);

  // broadcast to all in room that we just joined
  const user = {
    name: username,
    id: socket.id, // TODO: change to something else
  };
  ioServer.in(roomId).emit(USER_JOINED_ROOM_EVENT, user);

  return { roomId, user };
};

/**
 * Configures Socket.IO on the server
 * @param {http.Server} httpServer the http server instance
 */
async function loadSocketIo({ httpServer }) {
  const ioServer = await socketIoLoader({
    httpServer,
    handleOnConnect,
    handleEvent,
    events: Object.values(config.socketIo.events),
  });

  return ioServer;
};

module.exports = loadSocketIo;
