const makeSocketService = (
  event,
  { userId, roomId, data, username },
  socketIoWrapper
) => {
  const USER_LEFT_ROOM_EVENT = "userDisconnected";

  return {
    event,
    getRoomId: () => roomId, // TODO: remove
    getUserId: () => userId,
    getMessage: () => data.body,
    disconnect: () => socketIoWrapper.disconnect(),
    sendToAllInRoom: () => socketIoWrapper.sendToAllInRoom(event, data),
    announceDisconnectionToAllInRoom: () =>
      socketIoWrapper.sendToAllInRoom(USER_LEFT_ROOM_EVENT, username),
  };
};

module.exports = makeSocketService;
