require("../testHelper");

const bcrypt = require("bcryptjs");

const config = require("@root/config");
const User = require("@root/models/user");

const USER_PASSWORD = "sekret";

/**
 * Initialize the Users database
 */
const initUsersDb = async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash(USER_PASSWORD, config.auth.saltRounds);
  const user = new User({ username: "root", passwordHash });
  await user.save();
};

/**
 * @returns all users as JSON objects
 */
const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initUsersDb,
  usersInDb,
};
