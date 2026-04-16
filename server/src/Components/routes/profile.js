// routes/profile.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../Schemas/SignupSchema.js");
const verifyToken = require("../middleware/auth.js");

// ✅ GET user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-Userpassword -otp -otpExpiry -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      username: user.Username,
      email: user.Email,
      phone: user.Phone, // ✅ Added phone
      role: user.role || "user",
      createdAt: user.createdAt || new Date(),
    });

  } catch (error) {
    console.error("PROFILE GET ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE profile
router.put("/profile", verifyToken, async (req, res) => {
  const { username, email, phone } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update username
    if (username && username !== user.Username) {
      // Check if username already taken
      const existingUser = await User.findOne({ Username: username.toLowerCase() });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({ message: "Username already taken" });
      }
      user.Username = username;
    }
    
    // Update email
    if (email && email !== user.Email) {
      const existingUser = await User.findOne({ Email: email.toLowerCase() });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({ message: "Email already registered" });
      }
      user.Email = email;
    }

    // ✅ Update phone
    if (phone) {
      user.Phone = phone;
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.Username,
        email: user.Email,
        phone: user.Phone,
        role: user.role || "user"
      }
    });
    
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ CHANGE password (Uncommented and fixed)
router.put("/profile/change-password", verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Verify current password - Note: using user.Userpassword
    const isValidPassword = await bcrypt.compare(currentPassword, user.Userpassword);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    
    // Hash and save new password
    user.Userpassword = await bcrypt.hash(newPassword, 10);
    await user.save();
    
    res.json({
      success: true,
      message: "Password changed successfully"
    });
    
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE account
router.delete("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;