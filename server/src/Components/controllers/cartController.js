const Cart = require("../Schemas/cartSchema");

//  GET
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId })
            .populate("items.productId");

        //  IMPORTANT FIX
        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [],
            });
        }

        res.json(cart.items);

    } catch (error) {
        console.error("GET CART ERROR:", error);
        res.status(500).json({ message: "Failed to fetch cart" });
    }
};
//  ADD
exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;

        if (!productId || !require("mongoose").Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
        }

        // Robust finding (handles null productId or mismatched types)
        const index = cart.items.findIndex(
            (item) => {
                if (!item.productId) return false;
                const idStr = item.productId.id ? item.productId.id.toString() : item.productId.toString();
                return idStr === productId;
            }
        );

        if (index > -1) {
            cart.items[index].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        const updated = await Cart.findById(cart._id).populate("items.productId");
        res.json(updated.items);

    } catch (error) {
        console.error("ADD TO CART ERROR details:", error);
        res.status(500).json({ message: "Add failed", error: error.message });
    }
};

// UPDATE
exports.updateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
        const { quantity } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find(
            (i) => i.productId && i.productId.toString() === productId
        );

        if (item) {
            item.quantity = quantity;
        }

        await cart.save();
        const updated = await Cart.findById(cart._id).populate("items.productId");
        res.json(updated.items);

    } catch (error) {
        console.error("UPDATE ERROR:", error);
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};

// DELETE
exports.deleteCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.json([]);

        cart.items = cart.items.filter(
            (item) => item.productId && item.productId.toString() !== productId
        );

        await cart.save();
        const updated = await Cart.findById(cart._id).populate("items.productId");
        res.json(updated.items);

    } catch (error) {
        console.error("DELETE ERROR:", error);
        res.status(500).json({ message: "Delete failed", error: error.message });
    }
};