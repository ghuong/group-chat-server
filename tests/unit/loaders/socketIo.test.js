const ioClient = require("socket.io-client");
const http = require("http");
const EventEmitter = require("events");
const ioLoader = require("../../../src/loaders/socketIo/socketIoLoader"); //* this is what we're testing

let httpServer;
let httpServerAddr;
let ioServer;
let eventEmitter;
let socket;

const startServer = async (done, customEventEmitter) => {
  httpServer = await http.createServer().listen();
  httpServerAddr = await httpServer.address();

  eventEmitter = customEventEmitter || {
    emit: jest.fn((event, connectionSettings) => connectionSettings),
  };

  const handleOnConnect = () => ({ foo: "bar" });
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

  test("can receive communications", (done) => {
    // Emit somethings from Client to Server
    socket.emit("christmas", "a holiday");
    socket.emit("pandemic", "a pandemic");
    socket.emit("unknown", "n/a"); // ignored
    socket.emit("unknown", "n/a"); // ignored
    socket.emit("unknown", "n/a"); // ignored
    socket.emit("christmas", "a holiday");
    // Use timeout to wait for socket.io server handshakes
    setTimeout(() => {
      // expect server to re-emit each socket event
      const mockEmit = eventEmitter.emit.mock;
      expect(mockEmit.calls.length).toBe(4);
      expect(mockEmit.calls[0][0]).toBe("disconnect"); // first call, first arg
      expect(mockEmit.calls[1][0]).toBe("christmas"); // second call, first arg
      expect(mockEmit.calls[2][0]).toBe("pandemic");
      expect(mockEmit.calls[3][0]).toBe("christmas");

      const returnedSecondArg = mockEmit.results[2].value; // third call's return value
      // our mocked emit function just returns the second arg
      expect(returnedSecondArg.ioServer).toEqual(ioServer);
      expect(returnedSecondArg.socket.id).toBe(socket.id);
      expect(returnedSecondArg.event).toBe("pandemic");
      expect(returnedSecondArg.data).toBe("a pandemic");
      expect(returnedSecondArg.foo).toBe("bar");

      done();
    }, 50);
  });
});

describe("Socket.IO server using EventEmitter", () => {
  beforeAll((done) => startServer(done, new EventEmitter()));
  afterAll((done) => closeServer(done));
  beforeEach((done) => connectClient(done));

  test("can re-emit events to subscribers", (done) => {
    socket.emit("christmas", "a holiday");
    eventEmitter.on("christmas", (connectionSettings) => {
      expect(connectionSettings.ioServer).toEqual(ioServer);
      expect(connectionSettings.socket.id).toBe(socket.id);
      expect(connectionSettings.event).toBe("christmas");
      expect(connectionSettings.data).toBe("a holiday");
      expect(connectionSettings.foo).toBe("bar");
      done();
    });
  });
});