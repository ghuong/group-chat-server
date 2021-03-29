const supertest = require("supertest");
const express = require("express");
const expressLoader = require("@root/loaders/express");
const mongooseLoader = require("@root/loaders/mongoose");

async function makeApi() {
  await mongooseLoader();

  const app = express();
  await expressLoader({ app });
  return supertest(app);
}

module.exports = makeApi;