const { Sequelize } = require("sequelize");

const {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
} = require("../../config");

const DB = {};

const connectDB = () =>
  new Promise(async (resolve, reject) => {
    try {
      const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
        host: DB_HOST,
        port: DB_PORT,
        dialect: "postgres",
        logging: false,
      });
      await sequelize.authenticate();
      console.log("Database connected".cyan);
      DB.connection = sequelize;
      resolve(sequelize);
    } catch (e) {
      reject(`Error while connecting db ${e}`);
    }
  });

module.exports = { connectDB, DB };
