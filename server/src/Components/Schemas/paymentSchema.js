// Schemas/PaymentSchema.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    paymentId: { type: String },
    signature: { type: String },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["created", "success", "failed"],
      default: "created",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "SignUp" },
    // Added items field — payment route saves items here
    items: [
      {
        productId: { type: String },
        quantity: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

// Prevent model overwrite
module.exports = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);