function makeSocketIoWrapper({ ioServer, socket, roomId, namespace }) {
  const disconnect = () => {
    socket.leave(roomId);
  };

  const sendToClient = (event, ...args) => socket.emit(event, ...args);

  const sendToAllExceptSender = (event, ...args) =>
    socket.broadcast.emit(event, ...args);

  const sendToAllInRoomExceptSender = (event, ...args) =>
    socket.to(roomId).emit(event, ...args);

  const sendToAllInRoom = (event, ...args) =>
    ioServer.in(roomId).emit(event, ...args);

  const sendToAllInNamespace = (event, ...args) =>
    ioServer.of(namespace).emit(event, ...args);

  const sendToAllInRoomInNamespace = (event, ...args) =>
    ioServer
      .of(namespace)
      .to(roomId)
      .emit(event, ...args);

  // private message:
  //! Warning: `socket.to(socket.id).emit()` will NOT work, as it will send to everyone (but sender) in the room `socket.id`
  const sendToSocketId = (event, socketId, ...args) =>
    ioServer.to(`${socketId}`).emit(event, ...args);

  // e.g. socket.emit("question", "do you think so?", (answer) => { <etc.> });
  const sendWithAcknowledgement = (event, question, ack) =>
    socket.emit(event, question, ack);

  // send message that might be dropped if client is not ready to receive messages
  const sendVolatile = (event, ...args) => socket.volatile.emit(event, ...args);

  // when using multiple nodes
  const sendToAllOnThisNode = (event, ...args) =>
    ioServer.local.emit(event, ...args);

  const sendToAllConnectedClients = (event, ...args) =>
    ioServer.emit(event, ...args);

  return {
    disconnect,
    sendToClient,
    sendToAllExceptSender,
    sendToAllInRoomExceptSender,
    sendToAllInRoom,
    sendToAllInNamespace,
    sendToAllInRoomInNamespace,
    sendToSocketId,
    sendWithAcknowledgement,
    sendVolatile,
    sendToAllOnThisNode,
    sendToAllConnectedClients,
  };
}

module.exports = makeSocketIoWrapper;
