# Group Chat Server

Live at [group-chat-gary.herokuapp.com](https://group-chat-gary.herokuapp.com).

![screenshot](https://live.staticflickr.com/65535/52065497752_d90374b334_h.jpg)

## About

This the Node.js (Express) server component for a real-time group chat web app. It exposes a [Socket.io](https://socket.io/) server, allowing clients to keep open a two-way socket connection through which they can broadcast messages to one another in real-time. There is a corresponding [React web client](https://github.com/ghuong/group-chat-client).

## Getting Started

### Prerequisites

1. Have `npm` installed

2. `git clone` both this server project, and the corresponding [React web client project](https://github.com/ghuong/group-chat-client) into the same directory (but _not_ one inside the other):

```git
git clone https://github.com/ghuong/group-chat-server.git
git clone https://github.com/ghuong/group-chat-client.git
```

3. Read the [client's README](https://github.com/ghuong/group-chat-client) to prepare it (basically run `npm install`)

4. Have MongoDB running locally (or edit `MONGODB_URI` environment variable in `.env` file)

### Installing

For a quick start, run this in the server project's directory:

```bash
npm run quickstart
```

This will:

1. Install dependencies:

```bash
npm install
```

2. Create a basic `.env` file based on the provided `.env.example` (development environment variables):

```bash
cp .env.example .env
```

3. Build the client project (see Prerequisites), and copy it into `build/client/` folder:

```bash
npm run build:ui
```

4. Run tests (make sure they pass):

```bash
npm test
```

5. Start server at http://localhost:4001:

```bash
npm start
```

See `package.json` for other npm scripts.

## Project Structure

```
src/
│   server.js    # App entry point
└───loaders/     # Split the startup process into (testable) modules
│   └───index.js    # Loaders entry point
└───api/         # Express route controllers for all endpoints
└───config/      # Environment variables and configuration
└───models/      # Database models
└───services/    # All of the business logic is here
```

```
src/services/socketIo/      # Defines `handleEvent` to handle Socket.io events
│   index.js                # `handleEvent` entry point
│   socketIoApiWrapper.js   # Easier-to-use wrapper for Socket.io API
│   socketService.js        # Methods that interact with socketIo API (through the wrapper), on behalf of eventHandlers
└───eventHandlers/          # Specific event handler implementations (which should merely make calls to socketService)
```

## License

[MIT License](https://github.com/ghuong/group-chat-server/blob/main/LICENSE)

## Acknowledgements

- [Bulletproof Node.js Architecture](https://github.com/santiq/bulletproof-nodejs)
- [Graceful Exit Handler](https://blog.heroku.com/best-practices-nodejs-errors)
