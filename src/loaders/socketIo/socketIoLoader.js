const socketIo = require("socket.io");

/**
 * Starts a SocketIO server, and registers handlers for socket events
 * * Destructured params:
 * @param {http.Server} httpServer the http server instance to be wrapped
 * @param {Function} handleOnConnect handler when client connects: (socket) => Object with connection settings
 * @param {Function} eventHandler handler for all other socket events: (event, connectionSettings) => ...
 * @param {Array<String>} events list of names of events accepted by eventHandler
 * {
 *   event: name of the event
 *   handler: handler for event (connectionSettings) => {...}
 * }
 * * {Object} connectionSettings: contains: ioServer, socket, roomId, and data (for custom listeners)
 */
async function loadSocketIoServer({
  httpServer,
  handleOnConnect,
  eventHandler = () => {},
  events = [],
}) {
  const ioServer = socketIo(httpServer, {
    cors: {
      origin: "*", // ? is this safe?
      methods: ["GET", "POST"],
    },
  });

  ioServer.on("connection", (socket) => {
    if (!handleOnConnect) {
      handleOnConnect = (socket) => {
        socket.join();
        return {};
      };
    };

    const connectionSettings = { ...handleOnConnect(socket), ioServer, socket };

    events.forEach((event) => {
      socket.on(event, (data) =>
        eventHandler(event, { ...connectionSettings, data })
      );
    });
  });

  return ioServer;
};

module.exports = loadSocketIoServer;