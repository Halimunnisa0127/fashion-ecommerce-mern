import React from 'react';
import { motion } from 'framer-motion';

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-violet-600 text-white shadow-violet-200',
    secondary: 'bg-white/80 backdrop-blur-md text-gray-800 border border-white/50',
    outline: 'border border-gray-200 text-gray-600',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-50 text-amber-700 border border-amber-100',
  };

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg ${variants[variant]} ${className}`}
    >
      {children}
    </motion.span>
  );
};

export default Badge;
