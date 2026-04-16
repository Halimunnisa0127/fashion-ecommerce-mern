import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Edit, Trash2 } from 'lucide-react';

// Reusable Shared Components
import PriceDisplay from './PriceDisplay';
import StarRating from './StarRating';
import WishlistButton from './WishlistButton';
import Badge from './Badge';

const UnifiedProductCard = ({ 
  product, 
  mode = 'shop', // 'shop' or 'admin'
  onEdit, 
  onDelete 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const isAdmin = mode === 'admin';
  const productId = product._id || product.id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: isAdmin ? -5 : -10 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col h-full bg-white rounded-[2.5rem] p-4 transition-all duration-500 group ${
        isAdmin 
          ? 'border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50' 
          : 'hover:shadow-[0_40px_80px_-20px_rgba(124,58,237,0.15)]'
      }`}
    >
      {/* Visual Section */}
      <div className={`relative aspect-square rounded-[2rem] overflow-hidden transition-colors duration-500 ${
        isAdmin ? 'bg-gray-50 mb-6' : 'bg-[#FDFDFF] group-hover:bg-white'
      }`}>
        {/* Glow effect for shop mode */}
        {!isAdmin && (
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
        )}

        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          {isAdmin ? (
            <Badge variant="secondary">{product.category}</Badge>
          ) : (
            <>
              {product.discountPercent > 0 ? (
                <Badge variant="primary">-{product.discountPercent}%</Badge>
              ) : <div />}
              <WishlistButton product={product} variant="circle" />
            </>
          )}
        </div>

        {/* Image Container */}
        <div className={`w-full h-full flex items-center justify-center p-8`}>
          {isAdmin ? (
             <motion.img
                src={product.image}
                alt={product.title}
                animate={{ scale: isHovered ? 1.1 : 1 }}
                className="max-w-full max-h-full object-contain"
             />
          ) : (
            <Link to={`/product/${productId}`} className="w-full h-full flex items-center justify-center">
              <motion.img
                src={product.image}
                alt={product.name || product.title}
                animate={{ 
                  scale: isHovered ? 1.15 : 1,
                  rotate: isHovered ? 2 : 0 
                }}
                className={`max-w-full max-h-full object-contain mix-blend-multiply transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
            </Link>
          )}
        </div>

        {/* Quick View (Shop Only) */}
        {!isAdmin && (
          <div className={`absolute inset-x-4 bottom-4 transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Link
              to={`/product/${productId}`}
              className="w-full h-12 bg-white/80 backdrop-blur-xl rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 border border-white hover:bg-gray-900 hover:text-white transition-all shadow-lg shadow-black/5"
            >
              Discover More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="px-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-violet-500 uppercase tracking-[0.25em] opacity-60">
            {isAdmin ? `ID: ${productId?.slice(-6).toUpperCase()}` : (product.brand || "Curated")}
          </span>
          <StarRating rating={isAdmin ? product.rating?.rate : product.rating} showCount={false} size={isAdmin ? 12 : 14} />
        </div>

        <h3 className={`font-bold text-gray-950 leading-tight line-clamp-1 mb-4 ${
          isAdmin ? 'text-lg' : 'text-lg group-hover:text-violet-600 transition-colors'
        }`}>
          {product.title || product.name}
        </h3>

        <div className="mt-auto flex items-end justify-between mb-2">
          <PriceDisplay 
            price={product.price}
            originalPrice={!isAdmin ? product.originalPrice : null}
            isHovered={isHovered}
          />
          
          {isAdmin ? (
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock</p>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-orange-500'}`} />
                <p className={`font-black text-xs ${product.stock > 10 ? 'text-green-500' : 'text-orange-500'}`}>{product.stock || 0}</p>
              </div>
            </div>
          ) : (
            <motion.div
              animate={{ x: isHovered ? 0 : 5, opacity: isHovered ? 1 : 0 }}
              className="flex items-center gap-1 text-[10px] font-black text-violet-600 uppercase tracking-widest"
            >
              Shop <ArrowRight className="w-4 h-4" />
            </motion.div>
          )}
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex gap-2 pt-4">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-950 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-violet-50 hover:text-violet-600 transition-all border border-transparent hover:border-violet-100"
            >
              <Edit size={14} /> Modify
            </button>
            <button
              onClick={() => onDelete(productId)}
              className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UnifiedProductCard;
