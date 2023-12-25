const express = require("express");
const cors = require("cors");
const ErrorHandler = require("./utils/errors/error-handler");
const { user } = require("./api");

module.exports = (app) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  user(app);
  app.use(ErrorHandler);
};
