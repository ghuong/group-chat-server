const socketIo = require("socket.io");

/**
 * Configures a SocketIO server
 * * Destructured params:
 * @param {http.Server} httpServer the http server instance
 * @param {Function} handleOnConnect handler when client connects: (socket) => Object with connection settings
 * @param {Function} handleOnDisconnect handler when client disconnects: (connectionSettings) => {...}
 * @param {Array} listeners an array of custom listeners, where listener is an Object:
 * {
 *   event: name of the event
 *   handler: handler for event (connectionSettings) => {...}
 * }
 * * {Object} connectionSettings: contains: ioServer, socket, roomId, and data (for custom listeners)
 */
module.exports = async ({
  httpServer,
  handleOnConnect,
  handleOnDisconnect,
  listeners = [],
}) => {
  if (!handleOnConnect || !handleOnDisconnect)
    throw new Error("Missing args to Socket.IO Loader");

  const ioServer = socketIo(httpServer, {
    cors: {
      origin: "*", // ? is this safe?
      methods: ["GET", "POST"],
    },
  });

  ioServer.on("connection", (socket) => {
    const connectionSettings = { ...handleOnConnect(socket), ioServer, socket };

    listeners.forEach(({ event, handler }) =>
      socket.on(event, (data) =>
        handler({ ...connectionSettings, event, data })
      )
    );

    socket.on("disconnect", () => handleOnDisconnect(connectionSettings));
  });
};
