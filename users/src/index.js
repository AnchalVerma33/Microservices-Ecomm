const express = require("express");
require("colors");
const { PORT } = require("./config");
const connectMongoDB = require("./database/connect");
const expressApp = require("./express-engine");


const StartServer = async () => {
  try {
    const app = express();
    await connectMongoDB();
    expressApp(app);
    app.listen(PORT, () => {
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
