import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Reusable Shared Components
import PriceDisplay from '../Shared/PriceDisplay';
import StarRating from '../Shared/StarRating';
import WishlistButton from '../Shared/WishlistButton';
import Badge from '../Shared/Badge';

// Feature Specific Components
import { addToCart } from "../../features/products/cartSlice";
import { itemVariants } from './animations';
import QuantitySelector from './QuantitySelector';
import ProductFeatures from './ProductFeatures';

const ProductInfo = ({ product }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items: cart } = useSelector((state) => state.cart || { items: [] });
    const [tempQty, setTempQty] = useState(1);
    const [isUpdating, setIsUpdating] = useState(false);

    // Safeguard for missing product
    if (!product) return null;

    const cartItem = cart.find(item => item.id === product.id);

    const handleAddToCart = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please log in to add items to your cart.");
            navigate("/login");
            return;
        }

        setIsUpdating(true);
        try {
            await dispatch(
                addToCart({
                    productId: product.id || product._id,
                    quantity: tempQty,
                })
            ).unwrap();

            toast.success("Successfully added to bag!", {
                icon: '🛍️',
                style: {
                    borderRadius: '1rem',
                    background: '#111',
                    color: '#fff',
                }
            });
        } catch (err) {
            console.error("Add failed:", err);
            toast.error(err.message || "Failed to add to cart");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <motion.div
            variants={itemVariants}
            className="md:w-1/2 p-8 md:p-12 border-t md:border-t-0 md:border-l border-gray-100 bg-white"
        >
            {/* Header Area */}
            <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                    <Badge variant="success" className="mb-2">New Arrival</Badge>
                    <motion.p variants={itemVariants} className="text-[10px] font-black text-violet-600 uppercase tracking-[0.3em]">
                        {product.brand || "Luxury Collection"}
                    </motion.p>
                    <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight">
                        {product.name}
                    </motion.h2>
                </div>
            </div>

            {/* Price & Rating Section */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 py-6 border-y border-gray-50">
                <PriceDisplay 
                    price={product.price} 
                    originalPrice={product.originalPrice} 
                    discountPercent={product.discountPercent}
                    size="lg"
                />
                
                <StarRating 
                    rating={product.rating} 
                    count={product.reviewCount || 124} 
                    className="self-start sm:self-center"
                />
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants} className="mb-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">The Narrative</p>
                <p className="text-gray-600 leading-relaxed text-lg font-medium opacity-80">
                    {product.description}
                </p>
            </motion.div>

            {/* Action Zone */}
            <motion.div variants={itemVariants} className="space-y-8">
                <div className="p-6 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 flex flex-col sm:flex-row gap-6 items-center">
                    <div className="w-full sm:flex-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Selection Quantity</p>
                        <QuantitySelector
                            product={product}
                            cartItem={cartItem}
                            tempQty={tempQty}
                            setTempQty={setTempQty}
                            onAddToCart={handleAddToCart}
                            isLoading={isUpdating}
                        />
                    </div>
                    
                    <WishlistButton 
                        product={product} 
                        variant="square" 
                        className="w-full sm:w-14 sm:h-14 mt-auto shadow-xl shadow-red-100/20"
                    />
                </div>

                {/* Progress Tracking / Stock */}
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    In stock & ready to ship
                </div>
            </motion.div>

            <ProductFeatures />
        </motion.div>
    );
};

export default ProductInfo;
