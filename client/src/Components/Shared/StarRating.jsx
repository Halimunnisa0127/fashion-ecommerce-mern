import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, count, showCount = true, className = '' }) => {
  const normalizedRating = parseFloat(rating) || 0;
  
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg border border-amber-100/50">
        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
        <span className="text-[11px] font-black text-amber-700 ml-1">
          {normalizedRating.toFixed(1)}
        </span>
      </div>
      {showCount && count !== undefined && (
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          ({count} Reviews)
        </span>
      )}
    </div>
  );
};

export default StarRating;
