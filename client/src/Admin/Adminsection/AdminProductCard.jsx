import React from 'react';
import { Trash2, Edit } from 'lucide-react';
import Badge from '../../Components/Shared/Badge';
import StarRating from '../../Components/Shared/StarRating';
import PriceDisplay from '../../Components/Shared/PriceDisplay';

const AdminProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-4 group hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
      {/* Product Image Section */}
      <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-50 mb-6">
        <img
          src={product.image || "https://via.placeholder.com/300"}
          className="w-full h-full object-contain p-8 group-hover:scale-110 transition-all duration-700"
          alt={product.title}
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary">{product.category}</Badge>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-black text-gray-950 text-lg leading-tight line-clamp-1">
              {product.title || product.name}
            </h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {product._id.slice(-6).toUpperCase()}</p>
          </div>
          <StarRating rating={product.rating?.rate} showCount={false} size={14} />
        </div>

        <div className="flex justify-between items-end mb-8">
          <PriceDisplay price={product.price} />
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock Level</p>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-orange-500'}`} />
              <p className={`font-black ${product.stock > 10 ? 'text-green-500' : 'text-orange-500'}`}>
                {product.stock || 0} units
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-950 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-violet-50 hover:text-violet-600 transition-all"
          >
            <Edit size={14} /> Modify Asset
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="w-14 h-14 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;
