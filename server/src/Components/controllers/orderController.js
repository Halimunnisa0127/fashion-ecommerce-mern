// controllers/orderController.js
const Order = require("../Schemas/orderSchema.js");
const Cart = require("../Schemas/cartSchema.js");

// ✅ CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { method, paymentId } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((acc, item) => {
      return acc + (item.productId?.price || item.price || 0) * item.quantity;
    }, 0);

    // Create order
    const order = new Order({
      userId,
      items: cart.items.map(item => ({
        productId: item.productId?._id || item.productId,
        title: item.productId?.title || item.title,
        price: item.productId?.price || item.price,
        quantity: item.quantity,
        image: item.productId?.image || item.image,
      })),
      totalAmount,
      paymentMethod: method || "COD",
      paymentId: paymentId || null,
      status: method === "COD" ? "pending" : "processing",
    });

    await order.save();

    // Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: "Order failed", error: error.message });
  }
};

// ✅ GET USER ORDERS
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'title price image'); // ✅ Add populate
    res.json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ✅ GET SINGLE ORDER
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'title price image'); // ✅ Add populate
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("GET ORDER ERROR:", error);
    res.status(500).json({ message: "Error fetching order" });
  }
};