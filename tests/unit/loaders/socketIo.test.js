const ioClient = require("socket.io-client");
const http = require("http");
const ioLoader = require("../../../src/loaders/socketIo/socketIoLoader"); //* this is what we're testing

let httpServer;
let httpServerAddr;
let ioServer;
let eventEmitter;
let socket;

const startServer = async (done) => {
  httpServer = await http.createServer().listen();
  httpServerAddr = await httpServer.address();

  eventEmitter = { emit: jest.fn((event, connectionSettings) => connectionSettings) };
  const handleOnConnect = () => {};
  const events = ["pandemic", "christmas"];

  ioServer = await ioLoader({ httpServer, eventEmitter, events, handleOnConnect });
  done && done();
};

const closeServer = (done) => {
  ioServer.close();
  httpServer.close();
  done && done();
};

const connectClient = (done) => {
  // Do not hardcode server port and address, square brackets are used for IPv6
  socket = ioClient.connect(
    `http://[${httpServerAddr.address}]:${httpServerAddr.port}`,
    {
      "reconnection delay": 0,
      "reopen delay": 0,
      "force new connection": true,
      transports: ["websocket"],
    }
  );
  socket.on("connect", () => {
    done(); //* extremely important to call this in here (not outside) to guarantee that client has connected!
  });
};

const disconnectClient = (done) => {
  if (socket.connected) {
    socket.disconnect();
  }
  done && done();
};

afterEach((done) => disconnectClient(done));

describe("Socket.IO server", () => {
  let ioServerSocket;

  beforeAll(async (done) => {
    await startServer();

    ioServer.on("connection", (mySocket) => {
      ioServerSocket = mySocket;
    });

    connectClient(done);
  });

  afterAll((done) => closeServer(done));

  test("allows connections", () => {
    expect(ioServerSocket).toBeDefined();
    expect(socket).toBeDefined();
    expect(socket.id).toBe(ioServerSocket.id);
  });
});

describe("Socket.IO server with connected client", () => {
  beforeAll((done) => startServer(done));
  afterAll((done) => closeServer(done));
  beforeEach((done) => connectClient(done));

  test("can communicate with it", (done) => {
    // once connected, emit Hello World
    ioServer.emit("echo", "Hello World");
    socket.once("echo", (message) => {
      expect(message).toBe("Hello World");
      done();
    });
  });

  test("should communicate with waiting for socket.io handshakes", (done) => {
    // Emit something from Client to Server
    socket.emit("christmas", "a holiday");
    socket.emit("pandemic", "a pandemic");
    socket.emit("unknown", "n/a"); // ignored
    socket.emit("unknown", "n/a"); // ignored
    socket.emit("unknown", "n/a"); // ignored
    // Use timeout to wait for socket.io server handshakes
    setTimeout(() => {
      // Put your server side expect() here
      expect(eventEmitter.emit.mock.calls.length).toBe(3);
      expect(eventEmitter.emit.mock.calls[0][0]).toBe("disconnect");
      expect(eventEmitter.emit.mock.calls[1][0]).toBe("christmas");
      expect(eventEmitter.emit.mock.calls[2][0]).toBe("pandemic");

      const returnValue = eventEmitter.emit.mock.results[2].value;
      expect(returnValue.ioServer).toEqual(ioServer);
      expect(returnValue.socket.id).toBe(socket.id);
      expect(returnValue.event).toBe("pandemic");
      expect(returnValue.data).toBe("a pandemic");

      done();
    }, 50);
  });
});
