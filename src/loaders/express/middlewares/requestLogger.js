const morgan = require("morgan");
const config = require("@config");

morgan.token("body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  } else {
    return "";
  }
});

module.exports = morgan(
  (tokens, request, response) => [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, "content-length"),
    "-",
    tokens["response-time"](request, response),
    "ms",
    tokens.body(request, response),
  ].join(" "),
  {
    skip: (req, res) => config.env === "test",
  }
);
