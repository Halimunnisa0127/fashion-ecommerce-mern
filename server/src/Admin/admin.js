// routes/admin.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../../../fashion-ecommerce-app/my-backend-app/Components/Schemas/SignupSchema.js");
const Product = require("../../../../fashion-ecommerce-app/my-backend-app/Components/Schemas/productSchema.js");
const Order = require("../../../../fashion-ecommerce-app/my-backend-app/Components/Schemas/orderSchema.js");
const verifyToken = require("../../../../fashion-ecommerce-app/my-backend-app/Components/middleware/auth.js");
const verifyAdmin = require("../../../../fashion-ecommerce-app/my-backend-app/Components/middleware/admin.js");

// DASHBOARD STATS 
router.get("/admin/stats", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-Userpassword -otp -otpExpiry");

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "Username Email");

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders
      },
      recentUsers,
      recentOrders
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// USER MANAGEMENT
// Get all users
router.get("/admin/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select("-Userpassword -otp -otpExpiry")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single user
router.get("/admin/users/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-Userpassword -otp -otpExpiry");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user role
router.put("/admin/users/:id/role", verifyToken, verifyAdmin, async (req, res) => {
  const { role } = req.body;

  try {
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-Userpassword -otp -otpExpiry");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "User role updated successfully",
      user
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/admin/users/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PRODUCT MANAGEMENT=
// Get all products (admin view)
router.get("/admin/products", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create product
router.post("/admin/products", verifyToken, verifyAdmin, async (req, res) => {
  const { title, price, description, category, image, stock, rating } = req.body;

  try {
    if (!title || !price || !description) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const product = new Product({
      title,
      price,
      description,
      category: category || "Uncategorized",
      image: image || "https://via.placeholder.com/300",
      stock: stock || 0,
      rating: rating || 0
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update product
router.put("/admin/products/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { title, price, description, category, image, stock, rating } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (title) product.title = title;
    if (price) product.price = price;
    if (description) product.description = description;
    if (category) product.category = category;
    if (image) product.image = image;
    if (stock !== undefined) product.stock = stock;
    if (rating) product.rating = rating;

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete product
router.delete("/admin/products/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ORDER MANAGEMENT
// Get all orders
router.get("/admin/orders", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "Username Email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update order status
router.put("/admin/orders/:id/status", verifyToken, verifyAdmin, async (req, res) => {
  const { status } = req.body;

  try {
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("userId", "Username Email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order status updated",
      order
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ACTIVITY LOGS
router.get("/admin/activities", verifyToken, verifyAdmin, async (req, res) => {
  try {
    // Get recent user registrations
    const recentRegistrations = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("Username Email createdAt role");

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "Username Email");

    // Get recent product additions
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      activities: {
        registrations: recentRegistrations,
        orders: recentOrders,
        products: recentProducts
      }
    });
  } catch (error) {
    console.error("Activities error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;