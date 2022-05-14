const makeSocketService = (
  event,
  { user, roomId, data },
  socketIoWrapper
) => {
  const USER_LEFT_ROOM_EVENT = "userDisconnected";

  return {
    event,
    getRoomId: () => roomId, // TODO: remove
    getUser: () => user,
    getMessage: () => data.body,
    disconnect: () => socketIoWrapper.disconnect(),
    sendToAllInRoom: () => socketIoWrapper.sendToAllInRoom(event, data),
    sendTo: (recipientSocketId, payload = data) => socketIoWrapper.sendToSocketId(event, recipientSocketId, payload),
    announceDisconnectionToAllInRoom: () =>
      socketIoWrapper.sendToAllInRoom(USER_LEFT_ROOM_EVENT, user),
  };
};

module.exports = makeSocketService;
