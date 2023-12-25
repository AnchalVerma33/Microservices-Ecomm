const express = require("express");
const cors = require("cors");
// const { user, order, product } = require("./api");
const ErrorHandler = require("./utils/errors/error-handler");

module.exports = (app) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  // user(app);
  app.use(ErrorHandler);
};
