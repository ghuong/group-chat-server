# Group Chat Server

## About

This the server component for an anonymous real-time group chat. There is a corresponding [web client](https://github.com/ghuong/group-chat-client).

## Getting Started

### Prerequisites

1. Have npm installed

2. Clone the matching web client project into the same directory containing the server project (but not inside the server project):

```git
git clone https://github.com/ghuong/group-chat-client.git
```

3. Read the client project's documentation and prepare it.

### Installing

First, run this to install dependencies and configure a .env file:

```bash
npm setup
```

Then verify all tests pass:

```bash
npm test
```

Build the client code, and copy it into this project's /build with this script:

```bash
npm run build:ui
```

Start server on localhost:4001 using nodemon:

```bash
npm run dev
```

See package.json for available npm scripts.

## Usage

Add notes about how to use the system.

## License

[MIT License](https://github.com/ghuong/simmud/blob/main/LICENSE)
