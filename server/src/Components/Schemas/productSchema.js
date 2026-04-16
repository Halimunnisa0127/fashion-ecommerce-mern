// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: Number,
  description: String,
  category: String,
  image: String,
  rating: Object
}, { timestamps: true });

// ✅ FIXED LINE
module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);