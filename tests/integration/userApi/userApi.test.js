require("../../testHelper");

const mongoose = require("mongoose");

const apiHelper = require("../apiHelper");
const usersHelper = require("@helpers/users");

let api;

beforeAll(async () => {
  api = await apiHelper();
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => await usersHelper.initUsersDb());

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await usersHelper.usersInDb();

    const newUser = {
      username: "leo55",
      name: "Lionel",
      password: "thelionking",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersHelper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });
});

afterAll(() => mongoose.connection.close());
