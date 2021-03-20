const makeSocketService = require("../../../../src/services/socketIo/socketService");

describe("Socket.IO Service", () => {
  const socketIoWrapper = {
    disconnect: jest.fn(),
    sendToAllInRoom: jest.fn(),
  };

  let socketService;

  beforeAll(() => {
    socketService = makeSocketService(
      "christmas",
      {
        userId: "Bob",
        roomId: "My Room",
        data: "My Data",
      },
      socketIoWrapper
    );
  });

  test("allows client to disconnect", () => {
    socketService.disconnect();
    expect(socketIoWrapper.disconnect.mock.calls.length).toBe(1);
  });
});
