import React from 'react';
import { IoIosArrowForward } from "react-icons/io";
import { motion } from 'framer-motion';
import { itemVariants } from './animations';

const ProductBreadcrumb = ({ productName }) => {
    return (
        <motion.div
            variants={itemVariants}
            className="flex items-center text-sm text-gray-500 mb-6"
        >
            <span>Home</span>
            <IoIosArrowForward className="mx-2" />
            <span>Products</span>
            <IoIosArrowForward className="mx-2" />
            <span className="text-gray-800 font-medium truncate">{productName}</span>
        </motion.div>
    );
};

export default ProductBreadcrumb;