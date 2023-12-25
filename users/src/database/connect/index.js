const mongoose = require('mongoose');
const { MONGO_DB_URI } = require("../../config");

async function connectMongoDB() {
  try {
    // Connect to MongoDB
    const mongoConnect = await mongoose.connect(MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Connected to MongoDB port : ${mongoConnect.connections[0].port}`.cyan);
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

module.exports = connectMongoDB;
