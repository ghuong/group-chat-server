const mongoose = require("mongoose");
const config = require("@root/config");

async function connectDb() {
  const connection = await mongoose.connect(config.databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  return connection.connection.db;
}

module.exports = connectDb;
