import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { addToWishlist } from '../../features/products/wishlistSlice';
import toast from 'react-hot-toast';

const WishlistButton = ({ product, variant = 'circle', className = '' }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist || []);
  const isInWishlist = wishlist.some(item => item.id === product?.id);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;
    
    dispatch(addToWishlist(product));
    toast.success(isInWishlist ? "Removed from collection" : "Added to collection", {
      icon: isInWishlist ? '📝' : '✨',
      style: {
        borderRadius: '1rem',
        background: '#111',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }
    });
  };

  const isSquare = variant === 'square';

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className={`relative flex items-center justify-center transition-all duration-300 shadow-sm border ${
        isSquare 
          ? 'w-14 h-14 rounded-2xl bg-white border-gray-100 hover:border-red-100' 
          : 'w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border-white/50'
      } ${isInWishlist ? 'text-red-500 bg-red-50/50 border-red-100' : 'text-gray-400'} ${className}`}
    >
      <Heart 
        className={`w-5 h-5 transition-all duration-500 ${
          isInWishlist ? 'fill-red-500 text-red-500' : 'group-hover:text-red-500'
        }`} 
        strokeWidth={1.5} 
      />
      {isInWishlist && (
        <motion.div
          layoutId="heart-glow"
          className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-20"
        />
      )}
    </motion.button>
  );
};

export default WishlistButton;
