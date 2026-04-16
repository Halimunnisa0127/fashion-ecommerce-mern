import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectAllProducts, fetchProductById } from '../../features/products/productsSlice';
import { containerVariants, itemVariants } from './animations';
import ProductBreadcrumb from './ProductBreadcrumb';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ZoomedImageModal from './ZoomedImageModal';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector((state) => state.products.status);
  
  const product = products.find(p => String(p.id) === String(id) || String(p._id) === String(id));



  useEffect(() => {
    window.scrollTo(0, 0);
    // If product is not found in already loaded products, fetch it individually
    if (!product) {
      dispatch(fetchProductById(id));
    }
  }, [id, product, dispatch]);

  if (!product) {
    if (status === "loading") {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      );
    }
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-64 text-red-500 text-xl"
      >
        <p>Product not found</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-sm bg-gray-100 px-4 py-2 rounded text-gray-700 hover:bg-gray-200"
        >
          Try Refreshing
        </button>
      </motion.div>
    );
  }

  // Sample product images for gallery (in a real app, this would come from product data)
  const productImages = [
    product.image,
    product.image, // In reality, you'd have multiple images
    product.image,
    product.image
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto p-6 text-black"
    >
      <ProductBreadcrumb productName={product.name} />

      <motion.h1
        variants={itemVariants}
        className="text-3xl md:text-4xl font-bold mb-4"
      >
        {product.name}
      </motion.h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="product-card bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          <ProductImageGallery
            images={productImages}
            name={product.name}
          />

          <ProductInfo product={product} />
        </div>
      </motion.div>


    </motion.div>
  );
};

export default ProductDetails;