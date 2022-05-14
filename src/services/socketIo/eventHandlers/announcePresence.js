/**
 * Handler to announce our presence to a specific recipient user
 * @param {Object} connectionSettings holds ioServer, socket, roomId
 */
function handleAnnouncePresence(socketService, recipientUser, myUser) {
  socketService.sendTo(recipientUser.id, myUser);
}

module.exports = handleAnnouncePresence;
