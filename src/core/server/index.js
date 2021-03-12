const config = require("./utils/config");
const app = require("./app");
const http = require("http");
const socketIo = require("socket.io");
const logger = require("./utils/logger");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // ? is this safe?
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // Join a conversation
  // const { roomId } = socket.handshake.query;
  // socket.join(roomId);
  logger.info("Client connected");

  // Listen for new messages
  socket.on(config.NEW_CHAT_MESSAGE_EVENT, (data) => {
    logger.info(`New message received: '${data}' (Forwarding to others...)`);
    io.emit(config.NEW_CHAT_MESSAGE_EVENT, data);
  });

  // Leave the room if user closes socket
  socket.on("disconnect", () => {
    logger.info("Client disconnected");
    // socket.leave(roomId);
  });
});

server.listen(config.PORT, () => {
  logger.info(`Server listening on port ${config.PORT}`);
});
