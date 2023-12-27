const express = require("express");
const { PORT } = require("./config");
require("colors");

const { connectDB } = require("./database/connect");
const {
  Models,
} = require("./database/models");
const expressApp = require("./express-engine");

const StartServer = async () => {
  try {
    const app = express();
    const dbConnection = await connectDB();
    const models = new Models(dbConnection);
    await models.migrate(false);
    expressApp(app);
    const mail = await new SendEmail();
    app
      .listen(PORT, () => {
        console.log(`Customer server running to port ${PORT}`.yellow);
        console.log(`http://localhost:${PORT}`.yellow);
      })
      .on("error", (err) => {
        throw new Error(err);
      });
  } catch (e) {
    process.exit(0);
  }
};

StartServer();
