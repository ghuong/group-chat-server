const logger = require("@logger");

function handleNewChatMessage(socketService) {
  logger.info(
    `Received from: Room '${socketService.getRoomId()}',`,
    `Socket '${socketService.getUserId().substring(0, 6)}..':`,
    `"${socketService.getMessage().substring(0, 30)}"`
  );
  socketService.sendToAllInRoom(); // broadcast message to everyone in same room
};

module.exports = handleNewChatMessage;
