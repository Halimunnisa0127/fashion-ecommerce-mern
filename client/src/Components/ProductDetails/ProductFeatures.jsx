import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from './animations';

const ProductFeatures = () => {
    const features = [
        "High-quality materials",
        "Eco-friendly packaging",
        "1-year warranty included",
        "Free shipping on orders above ₹999"
    ];

    return (
        <motion.div
            variants={itemVariants}
            className="mt-6 pt-6 border-t border-gray-100"
        >
            <h3 className="text-lg font-semibold mb-3">Product Features:</h3>
            <ul className="space-y-2">
                {features.map((feature, index) => (
                    <motion.li
                        key={index}
                        whileHover={{ x: 5 }}
                        className="flex items-center"
                    >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        <span>{feature}</span>
                    </motion.li>
                ))}
            </ul>
        </motion.div>
    );
};

export default ProductFeatures;