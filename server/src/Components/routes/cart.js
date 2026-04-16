const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.js");
const Cart = require("../Schemas/cartSchema");


const {
  addToCart,
  getCart,
  updateCart,
  deleteCartItem
} = require("../controllers/cartController");

// DEBUG (remove later)

console.log("controllers:", {
  addToCart,
  getCart,
  updateCart,
  deleteCartItem
});

// ROUTES
router.get("/", verifyToken, getCart);
router.post("/", verifyToken, addToCart);
router.put("/:productId", verifyToken, updateCart);
router.delete("/:productId", verifyToken, deleteCartItem);

// clear cart
router.delete("/", verifyToken, async (req, res) => {
  await Cart.findOneAndUpdate(
    { userId: req.user.id },
    { items: [] }
  );
  res.json([]);
});

module.exports = router;





