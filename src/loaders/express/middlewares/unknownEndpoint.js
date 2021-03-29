// unknown endpoint middleware
function unknownEndpoint(req, res) {
  return res.status(404).send({ error: "Unknown endpoint" });
};

module.exports = unknownEndpoint;
