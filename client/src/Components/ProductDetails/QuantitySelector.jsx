import React from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { updateCartItem, removeFromCart } from "../../features/products/cartSlice";

const QuantitySelector = ({ product, cartItem, tempQty, setTempQty, onAddToCart }) => {
    const dispatch = useDispatch();

    if (!cartItem) {
        return (
            <div className="flex items-center">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center border border-gray-300 rounded-lg"
                >
                    <button
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                        onClick={() => tempQty > 1 && setTempQty(tempQty - 1)}
                        disabled={tempQty <= 1}
                    >
                        –
                    </button>

                    <motion.span
                        key={tempQty}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="px-4 py-2 text-lg font-semibold"
                    >
                        {tempQty}
                    </motion.span>

                    <button
                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                        onClick={() => setTempQty(tempQty + 1)}
                    >
                        +
                    </button>
                </motion.div>

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onAddToCart}
                    className="ml-4 flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
                >
                    Add to Cart
                </motion.button>
            </div>
        );
    }

    return (
        <div className="flex items-center">
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center border border-gray-300 rounded-lg"
            >
                <button
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    onClick={() => {
                        if (cartItem.quantity > 1) {
                            dispatch(updateCartItem({
                                productId: product.id || product._id,
                                quantity: cartItem.quantity - 1
                            }));
                        } else {
                            dispatch(removeFromCart(product.id));
                        }
                    }}
                >
                    –
                </button>

                <motion.span
                    key={cartItem.quantity}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="px-4 py-2 text-lg font-semibold"
                >
                    {cartItem.quantity}
                </motion.span>

                <button
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    onClick={() => dispatch(updateCartItem({
                        productId: product.id || product._id,
                        quantity: cartItem.quantity + 1
                    }))}
                >
                    +
                </button>
            </motion.div>

            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => dispatch(removeFromCart(product.id))}
                className="ml-4 flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
            >
                Remove from Cart
            </motion.button>
        </div>
    );
};

export default QuantitySelector;