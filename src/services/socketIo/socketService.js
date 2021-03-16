const makeSocketService = (event, { ioServer, socket, roomId, data }) => {
  const disconnect = () => socket.leave(roomId);
  const forwardToAllInRoom = () => ioServer.in(roomId).emit(event, data);

  const getRoomId = () => roomId; //TODO: remove
  const getMessage = () => data.body;
  const getUserId = () => socket.id;

  return {
    event,
    getRoomId,
    getUserId,
    getMessage,
    disconnect,
    forwardToAllInRoom,
  };
};

module.exports = makeSocketService;
