import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, colorClass = "bg-violet-500", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-500"
    >
      <div className={`w-14 h-14 rounded-2xl ${colorClass} flex items-center justify-center text-white shadow-lg shadow-current/20 transition-transform group-hover:scale-110 duration-500`}>
        <Icon size={24} strokeWidth={2} />
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-gray-950 tracking-tighter">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
