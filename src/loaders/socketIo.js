const socketIo = require("socket.io");
const logger = require("./logger");
const config = require("../config");

module.exports = ({ httpServer }) => {
  const events = config.socketIo.events;

  const io = socketIo(httpServer, {
    cors: {
      origin: "*", // ? is this safe?
      methods: ["GET", "POST"],
    },
  });

  // TODO: extract business logic to service layer
  io.on("connection", (socket) => {
    // Join a conversation
    const { roomId } = socket.handshake.query;
    socket.join(roomId);
    logger.info("Client connected to room", roomId);

    // Listen for new messages
    socket.on(events.NEW_CHAT_MESSAGE_EVENT, (data) => {
      logger.info(
        `Received from socket ${
          socket.id
        } in room ${roomId}: "${data.body.substring(
          0,
          20
        )}..."\nBroadcasting...`
      );
      io.in(roomId).emit(events.NEW_CHAT_MESSAGE_EVENT, data);
    });

    // Leave the room if user closes socket
    socket.on("disconnect", () => {
      logger.info("Client disconnected from room", roomId);
      socket.leave(roomId);
    });
  });
};