const config = require("./utils/config");
const app = require("./app");
const http = require("http");
const socketIo = require("socket.io");
const logger = require("./utils/logger");

const server = http.createServer(app);
const io = socketIo(server);

let interval;

io.on("connection", (socket) => {
  logger.info("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);

  socket.on("disconnect", () => {
    logger.info("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = (socket) => {
  const response = new Date();
  socket.emit("FromAPI", response);
};

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
