// Schemas/SignupSchema.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    Username: { type: String, required: true, lowercase: true },
    Email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    Phone: { type: String, required: true },
    Userpassword: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }, // Add this
    otp: { type: String },
    otpExpiry: { type: Date },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true 
  }
);

module.exports = mongoose.model("SignUp", userSchema);
