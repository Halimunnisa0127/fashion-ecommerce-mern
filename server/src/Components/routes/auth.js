// routes/auth.js - Complete working version
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../Schemas/SignupSchema.js");
const sendEmail = require("../utils/mail");

// SIGNUP 
router.post("/signup", async (req, res) => {
  const { Username, Email, Phone, Userpassword, ConfirmUserpassword } = req.body;

  try {
    if (!Username || !Email || !Phone || !Userpassword || !ConfirmUserpassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (Userpassword !== ConfirmUserpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (Userpassword.length < 6) {
      return res.status(400).json({ message: "Password too weak" });
    }

    const existingUser = await User.findOne({
      $or: [{ Username }, { Email }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(Userpassword, 10);

    const user = await User.create({
      Username,
      Phone,
      Email,
      Userpassword: hashed,
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        username: user.Username,
        email: user.Email,
        phone: user.Phone,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// LOGIN 
// routes/auth.js - Update login route to return role
router.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const user = await User.findOne({ Email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(Password, user.Userpassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.Email, role: user.role || "user" },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.Username,
        phone: user.Phone,
        email: user.Email,
        role: user.role || "user"  // Include role in response
      },
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// FORGOT PASSWORD
// routes/auth.js - Update the forgot-password route
// routes/auth.js - Professional version


router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Find user (case-insensitive)
    const user = await User.findOne({
      Email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    if (!user) {
      // Security: Don't reveal if email exists
      return res.status(200).json({
        success: true,
        message: "If an account exists, an OTP has been sent"
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP for security (optional but recommended)
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

    // Save to database
    user.otp = hashedOTP; // Store hashed OTP
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    // Send email
    const emailResult = await sendEmail(email, `Your OTP is: ${otp}`);

    res.status(200).json({
      success: true,
      message: "If an account exists, an OTP has been sent",
      ...(process.env.NODE_ENV === 'development' && { debug: { otp } }) // Only in dev
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again."
    });
  }
});

// Verify OTP route with hashed comparison
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({
      Email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    // Check expiry
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one."
      });
    }

    // Verify hashed OTP
    const hashedInputOTP = crypto.createHash('sha256').update(otp).digest('hex');

    if (user.otp !== hashedInputOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Mark as verified (optional)
    user.otpVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully"
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  console.log("🔄 Reset password request:", req.body);

  const { email, newPassword } = req.body;

  try {
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Find user
    let user = await User.findOne({ Email: email });
    if (!user) {
      user = await User.findOne({ email: email });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.Userpassword = hashedPassword;

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();
    console.log(" Password reset successful for:", email);

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error(" Reset password error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;