const disconnect = require("./disconnect");
const newChatMessage = require("./newChatMessage");

/**
 * Set up subscribers to listen for socketIO events
 * * Destructured params:
 * @param {EventEmitter} eventEmitter emitter for socketIO events
 */
module.exports = ({ eventEmitter }) => {
  // set up subscribers
  disconnect(eventEmitter);
  newChatMessage(eventEmitter);
};
