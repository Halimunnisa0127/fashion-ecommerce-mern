const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Payment = require("../Schemas/paymentSchema");
const Product = require("../Schemas/productSchema");
const verifyToken = require("../middleware/auth");

// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ CREATE ORDER
router.post("/create-order", verifyToken, async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items provided" });
        }

        const productIds = items.map((item) => item.productId);

        const products = await Product.find({
            _id: { $in: productIds },
        });

        let totalAmount = 0;

        items.forEach((item) => {
            const product = products.find(
                (p) => p._id.toString() === item.productId
            );

            if (!product) throw new Error("Product not found");

            totalAmount += product.price * item.quantity;
        });

        const order = await razorpay.orders.create({
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        res.json({
            success: true,
            id: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({ message: "Failed to create order" });
    }
});

// ✅ VERIFY PAYMENT
router.post("/verify-payment", verifyToken, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            items,
        } = req.body;

        // 🔐 Signature verify
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid payment" });
        }

        // 🔁 Prevent duplicate
        const existing = await Payment.findOne({
            paymentId: razorpay_payment_id,
        });

        if (existing) {
            return res.json({ success: true, message: "Already processed" });
        }

        // 💳 Get real payment from Razorpay
        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        const paidAmount = payment.amount / 100;

        // 🔁 Recalculate expected amount from DB
        const productIds = items.map((item) => item.productId);

        const products = await Product.find({
            _id: { $in: productIds },
        });

        let expectedAmount = 0;

        items.forEach((item) => {
            const product = products.find(
                (p) => p._id.toString() === item.productId
            );

            if (!product) throw new Error("Product not found");

            expectedAmount += product.price * item.quantity;
        });

        if (paidAmount !== expectedAmount) {
            return res.status(400).json({
                success: false,
                message: "Amount mismatch",
            });
        }

        // ✅ Save payment record — using req.user.id (set by auth middleware)
        await Payment.create({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            amount: paidAmount,
            userId: req.user.id,
            items,
            status: "success",
        });

        res.json({ success: true });
    } catch (error) {
        console.error("Verify error:", error);
        res.status(500).json({ message: "Verification failed" });
    }
});

module.exports = router;