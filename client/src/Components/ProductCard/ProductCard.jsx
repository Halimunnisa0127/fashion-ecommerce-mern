import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Shared Reusable Components
import PriceDisplay from '../Shared/PriceDisplay';
import StarRating from '../Shared/StarRating';
import WishlistButton from '../Shared/WishlistButton';
import Badge from '../Shared/Badge';

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Safeguard for missing data
  if (!product) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col h-full bg-white rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(124,58,237,0.15)] group"
    >
      {/* Top Visual Unit */}
      <div className="relative aspect-[1/1] rounded-[2rem] overflow-hidden bg-[#FDFDFF] group-hover:bg-white transition-colors duration-500">
        {/* Aurora Glow Effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-violet-100/50 via-fuchsia-50/30 to-transparent blur-3xl"
            />
          )}
        </AnimatePresence>
 
        {/* Action Badges & Wishlist */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          {product.discountPercent > 0 ? (
            <Badge variant="primary">-{product.discountPercent}%</Badge>
          ) : <div />}
          
          <WishlistButton 
            product={product} 
            variant="circle" 
          />
        </div>

        {/* Product Image */}
        <Link to={`/product/${product.id}`} className="block w-full h-full p-8 flex items-center justify-center">
          <motion.img
            src={product?.image}
            alt={product?.name}
            animate={{ 
              scale: isHovered ? 1.15 : 1,
              rotate: isHovered ? 2 : 0 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`max-w-full max-h-full object-contain mix-blend-multiply transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
        </Link>

        {/* Quick View Trigger */}
        <div className={`absolute inset-x-4 bottom-4 transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Link
            to={`/product/${product.id}`}
            className="w-full h-12 bg-white/80 backdrop-blur-xl rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 border border-white hover:bg-gray-900 hover:text-white transition-all shadow-lg shadow-black/5"
          >
            Discover More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Info Core */}
      <div className="px-3 pt-6 pb-2 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-violet-500 uppercase tracking-[0.25em] opacity-60">
            {product.brand || "Curated"}
          </span>
          <StarRating 
            rating={product.rating} 
            showCount={false} 
          />
        </div>

        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-4 group-hover:text-violet-600 transition-colors line-clamp-1">
          {product.name}
        </h3>

        <div className="mt-auto flex items-end justify-between">
          <PriceDisplay 
            price={product.price}
            originalPrice={product.originalPrice}
            isHovered={isHovered}
          />
          
          <motion.div
            animate={{ x: isHovered ? 0 : 5, opacity: isHovered ? 1 : 0 }}
            className="flex items-center gap-1 text-[10px] font-black text-violet-600 uppercase tracking-widest"
          >
            Shop <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;