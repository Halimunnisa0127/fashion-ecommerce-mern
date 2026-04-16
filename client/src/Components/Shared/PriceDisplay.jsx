import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PriceDisplay = ({ price, originalPrice, discountPercent, size = 'md', className = '', isHovered = true }) => {
  const isLarge = size === 'lg';
  
  return (
    <div className={`flex flex-col ${className}`}>
      <AnimatePresence mode="wait">
        {originalPrice && originalPrice > price && isHovered && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className={`${isLarge ? 'text-lg' : 'text-[11px]'} font-bold text-gray-300 line-through mb-0.5`}
          >
            ₹{originalPrice}
          </motion.span>
        )}
      </AnimatePresence>
      <div className="flex items-center gap-3">
        <span className={`${isLarge ? 'text-4xl' : 'text-2xl'} font-black text-gray-950 tracking-tighter leading-none`}>
          ₹{price}
        </span>
        {discountPercent > 0 && isLarge && (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
            {discountPercent}% OFF
          </span>
        )}
      </div>
    </div>
  );
};

export default PriceDisplay;
