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
  events,
  eventEmitter,
}) => {
  const ioServer = socketIo(httpServer, {
    cors: {
      origin: "*", // ? is this safe?
      methods: ["GET", "POST"],
    },
  });

  ioServer.on("connection", (socket) => {
    const connectionSettings = { ...handleOnConnect(socket), ioServer, socket };

    // No business logic here! Subscribers to these socketIO events are in subscribers/socketIo
    Object.values(events).forEach((event) => {
      socket.on(event, (data) =>
        eventEmitter.emit(event, { ...connectionSettings, event, data })
      );
    });

    socket.on("disconnect", () => eventEmitter.emit("disconnect", connectionSettings));
  });
};
