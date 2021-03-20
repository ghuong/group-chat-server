const makeSocketService = (event, { userId, roomId, data }, socketIoWrapper) => {
  return {
    event,
    getRoomId: () => roomId, // TODO: remove
    getUserId: () => userId,
    getMessage: () => data.body,
    disconnect: () => socketIoWrapper.disconnect(),
    sendToAllInRoom: () => socketIoWrapper.sendToAllInRoom(event, data),
  };
};

module.exports = makeSocketService;
