// Database/Db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.DB_URL;

    if (!uri) {
      throw new Error("DB_URL is not defined in environment variables");
    }

    await mongoose.connect(uri); // ✅ no options

    console.log("✅ MongoDB connected successfully");

  } catch (error) {
    console.error("❌ MongoDB connection failed:", {
      message: error.message,
    });

    process.exit(1);
  }
};

module.exports = connectDB;