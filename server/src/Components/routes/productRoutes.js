// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.js");
const verifyAdmin = require("../middleware/admin.js");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

// Public routes (anyone can view products)
router.get("/", getProducts);
router.get("/:id", getProduct);

// Admin only routes (only admin can modify products)
router.post("/", verifyToken, verifyAdmin, createProduct);
router.put("/:id", verifyToken, verifyAdmin, updateProduct);
router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);

module.exports = router;