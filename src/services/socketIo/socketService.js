const makeSocketIoWrapper = require("./socketIoWrapper");

const makeSocketService = (event, { ioServer, socket, roomId, data }) => {
  const _socketIo = makeSocketIoWrapper({ ioServer, socket, roomId });

  const getRoomId = () => roomId; //TODO: remove
  const getMessage = () => data.body;
  const getUserId = () => socket.id; //TODO: give proper user id

  return {
    event,
    getRoomId,
    getUserId,
    getMessage,
    disconnect: _socketIo.disconnect,
    sendToAllInRoom: () => _socketIo.sendToAllInRoom(event, data),
  };
};

module.exports = makeSocketService;
