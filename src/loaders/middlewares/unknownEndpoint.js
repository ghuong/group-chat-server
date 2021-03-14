// unknown endpoint middleware
module.exports = (req, res) => {
  return res.status(404).send({ error: "Unknown endpoint" });
};
