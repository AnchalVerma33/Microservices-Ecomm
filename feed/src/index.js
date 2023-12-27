const express = require("express");
const { PORT } = require("./config");
require("colors");
const { connectToCassandra } = require("./database/connect");
const expressApp = require("./express-engine");


const StartServer = async () => {
  try {
    const app = express();
    const dbConnection = await connectToCassandra();
    expressApp(app);
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
