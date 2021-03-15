const ioClient = require("socket.io-client");
const http = require("http");
const ioLoader = require("../../../src/loaders/socketIo/socketIoLoader");

let socket;
let httpServer;
let httpServerAddr;
let ioServer;
let eventEmitter;

const startServer = async () => {
  console.log("Starting server...");
  httpServer = await http.createServer().listen();
  httpServerAddr = await httpServer.address();
  const handleOnConnect = () => {};
  eventEmitter = { emit: jest.fn() };
  ioServer = await ioLoader({ httpServer, eventEmitter, handleOnConnect });
  console.log("...and server started!");
};

const closeServer = () => {
  console.log("Closing server...");
  ioServer.close();
  httpServer.close();
  ioServer = null;
  httpServer = null;
  eventEmitter = null;
  console.log("...and server closed!");
};

const connectClient = (done) => {
  console.log("Connecting client...");
  // Do not hardcode server port and address, square brackets are used for IPv6
  socket = ioClient.connect(
    `http://[${httpServerAddr.address}]:${httpServerAddr.port}`,
    {
      "reconnection delay": 0,
      "reopen delay": 0,
      "force new connection": true,
      // transports: ["websocket"],
    }
  );
  socket.on("connect", () => {
    console.log("...and client connected!", socket.id);
    done();
  });
};

const disconnectClient = () => {
  console.log("Disconnecting client...");
  if (socket.connected) {
    socket.disconnect();
  }
  socket = null;
  console.log("...and client disconnected!");
};

afterEach((done) => {
  console.log("afterEach disconnecting client...");
  disconnectClient();
  console.log("...and afterEach done!");
  done();
});

describe("Socket.IO server", () => {
  let testResult;

  beforeAll(async (done) => {
    console.log("beforeAll(1) starting server...");
    startServer().then(() => {
      ioServer.on("connection", (mySocket) => {
        testResult = mySocket;
      });

      connectClient(done);
      // console.log("...and beforeAll(1) done!");
      // done();
    });
    // console.log("Starting server...");
    // httpServer = await http.createServer().listen();
    // httpServerAddr = await httpServer.address();
    // const handleOnConnect = () => {};
    // eventEmitter = { emit: jest.fn() };
    // ioServer = await ioLoader({ httpServer, eventEmitter, handleOnConnect });
    // console.log("...and server started!");

    console.log("...and beforeAll(1) done!");
  });

  afterAll((done) => {
    console.log("afterAll(1) closing server...");
    closeServer();
    console.log("...and afterAll(1) done!");
    done();
  });

  test("allows connections", () => {
    console.log("result id", testResult.id);
    console.log("socket id", socket.id);
    expect(testResult).toBeDefined();
    expect(socket).toBeDefined();
    expect(socket.id).toEqual(testResult.id);
    // done();
  });
});

describe("Socket.IO server with connected client", () => {
  beforeAll(async (done) => {
    console.log("beforeAll(2) starting server...");
    startServer().then(() => {
      console.log("...beforeAll(2) done!");
      done();
    });
    // console.log("Starting server...");
    // httpServer = await http.createServer().listen();
    // httpServerAddr = await httpServer.address();
    // const handleOnConnect = () => {};
    // eventEmitter = { emit: jest.fn() };
    // ioServer = await ioLoader({ httpServer, eventEmitter, handleOnConnect });
    // console.log("...and server started!");

    // console.log("...and beforeAll(2) done!");
    // done();
  });
  afterAll((done) => {
    console.log("afterAll(2) closing server...");
    closeServer();
    console.log("...afterAll(2) done!");
    done();
  });
  beforeEach((done) => {
    console.log("beforeEach(2) connecting client...");
    connectClient(done);
  });

  test("can communicate with it", (done) => {
    console.log("Test 2 starting...");
    // once connected, emit Hello World
    ioServer.emit("echo", "Hello World");
    socket.once("echo", (message) => {
      // Check that the message matches
      expect(message).toBe("Hello World");
      console.log("...and test 2 done!");
      done();
    });
  });

  test("should communicate with waiting for socket.io handshakes", (done) => {
    console.log("Test 3 starting...");
    // Emit sth from Client do Server
    socket.emit("example", "some messages");
    // Use timeout to wait for socket.io server handshakes
    setTimeout(() => {
      // Put your server side expect() here
      console.log("...and test 3 done!");
      done();
    }, 50);
  });
});
