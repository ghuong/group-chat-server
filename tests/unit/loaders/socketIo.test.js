const ioClient = require("socket.io-client");
const http = require("http");
const ioLoader = require("../../../src/loaders/socketIo/socketIoLoader");

let socket;
let httpServer;
let httpServerAddr;
let ioServer;
let eventEmitter;

const startServer = async (done) => {
  httpServer = await http.createServer().listen();
  httpServerAddr = await httpServer.address();
  const handleOnConnect = () => {};
  eventEmitter = { emit: jest.fn() };
  ioServer = await ioLoader({ httpServer, eventEmitter, handleOnConnect });
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
    expect(socket.id).toEqual(ioServerSocket.id);
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
    socket.emit("example", "some messages");
    // Use timeout to wait for socket.io server handshakes
    setTimeout(() => {
      // Put your server side expect() here
      done();
    }, 50);
  });
});
