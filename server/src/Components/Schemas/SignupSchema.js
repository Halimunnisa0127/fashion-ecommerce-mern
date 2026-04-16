// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema(
//   {
//     Username: { type: String, required: true, lowercase: true },
//     Email: {
//       type: String, // The type is String
//       required: true, // Makes the field mandatory
//       unique: true, // Ensures no two documents have the same email
//       lowercase: true, // Converts the email to lowercase before saving
//       match: [
//         /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//         "Please fill a valid email address",
//       ],
//     },
//     Userpassword: { type: String, required: true },
//     otp: String,
//     otpExpiry: Date,

//   }
// );
// console.log("UserSchema:", userSchema);

// module.exports = mongoose.model("SignUp", userSchema);

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
    timestamps: true // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("SignUp", userSchema);
