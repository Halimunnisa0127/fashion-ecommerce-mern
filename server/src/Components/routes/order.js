// Components/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const {
    createOrder,
    getOrders,
    getOrderById,
} = require("../controllers/orderController");

// ✅ Place order
router.post("/order", verifyToken, createOrder);

// ✅ Get all orders
router.get("/orders", verifyToken, getOrders);

// ✅ Get single order
router.get("/order/:id", verifyToken, getOrderById);

module.exports = router;