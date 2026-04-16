import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductImageGallery = ({ images, name }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  // Ensure images is always an array
  const imageList = Array.isArray(images) ? images : [images];

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide py-1 px-1">
        {imageList.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
              selectedImage === index ? 'border-violet-600 scale-105 shadow-lg' : 'border-transparent bg-white/50 opacity-60 hover:opacity-100 hover:scale-105'
            }`}
          >
            <img src={img} alt={`${name} ${index}`} className="w-full h-full object-contain p-2" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 bg-white rounded-[2.5rem] overflow-hidden relative group min-h-[400px] md:min-h-[600px] border border-gray-100/50 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            src={imageList[selectedImage]}
            alt={name}
            className="w-full h-full object-contain p-8 md:p-12"
          />
        </AnimatePresence>
        
        {/* Aesthetic glass tag */}
        <div className="absolute top-6 left-6">
            <div className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 text-[10px] font-black uppercase tracking-[0.2em] text-gray-800 shadow-sm">
                Fine Collection
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;