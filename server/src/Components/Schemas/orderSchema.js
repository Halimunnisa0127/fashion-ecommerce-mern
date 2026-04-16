
// Schemas/orderSchema.js (or Components/Schemas/orderSchema.js)
const mongoose = require("mongoose");

// ✅ Check if model already exists before creating
const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "SignUp", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        title: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: "COD" },
    paymentId: { type: String },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite
module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);