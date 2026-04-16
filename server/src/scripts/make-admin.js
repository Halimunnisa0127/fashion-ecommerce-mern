// scripts/create-admin-direct.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// ✅ Import your existing connection function
const connectDB = require("../Database/Db.js");
const User = require("../Components/Schemas/SignupSchema.js");

const createAdmin = async () => {
  try {
    // Use your existing connectDB function
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    
    if (existingAdmin) {
      console.log("⚠️ Admin already exists:", existingAdmin.Email);
      console.log("Email:", existingAdmin.Email);
      console.log("Role:", existingAdmin.role);
      await mongoose.disconnect();
      process.exit();
    }
    
    // Create new admin user
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    
    const admin = new User({
      Username: "SuperAdmin",
      Email: "admin@example.com",
      Userpassword: hashedPassword,
      role: "admin"
    });
    
    await admin.save();
    
    console.log("\n✅ Admin created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email: admin@example.com");
    console.log("🔑 Password: Admin@123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n⚠️ Please change your password after first login!\n");
    
    await mongoose.disconnect();
    process.exit();
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
};

// Run the function
createAdmin();