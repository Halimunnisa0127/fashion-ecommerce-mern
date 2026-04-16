// Database/Db.js
const mongoose = require('mongoose');
require("dotenv").config();

const connectDB = async () => {
  try {
    const user = process.env.DB_USER;
    const pass = encodeURIComponent(process.env.DB_PASSWORD);
    const host = process.env.DB_HOST;
    const db = process.env.DB_NAME;
    const uri = `mongodb+srv://${user}:${pass}@${host}/${db}?retryWrites=true&w=majority`;

    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

module.exports = connectDB;