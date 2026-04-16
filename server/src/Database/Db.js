// Database/Db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.DB_URL;

    if (!uri) {
      throw new Error("DB_URL is not defined in environment variables");
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");

  } catch (error) {
    console.error("❌ MongoDB connection failed:", {
      message: error.message,
    });

    process.exit(1); // stop app
  }
};

module.exports = connectDB;