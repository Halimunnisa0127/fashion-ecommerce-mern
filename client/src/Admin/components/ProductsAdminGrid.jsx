import React from 'react';
import { Trash2 } from 'lucide-react';
import Badge from '../../Components/Shared/Badge';
import StarRating from '../../Components/Shared/StarRating';
import PriceDisplay from '../../Components/Shared/PriceDisplay';

const ProductsAdminGrid = ({ products, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div key={product._id} className="bg-white rounded-[2.5rem] border border-gray-100 p-4 group hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
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
          <div className="px-4 pb-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-black text-gray-950 text-lg leading-tight line-clamp-1">
                {product.title || product.name}
              </h4>
              <StarRating rating={product.rating?.rate} showCount={false} size={14} />
            </div>
            <div className="flex justify-between items-end mb-8">
              <PriceDisplay price={product.price} />
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Stock</p>
                <p className={`font-black ${product.stock > 10 ? 'text-green-500' : 'text-orange-500'}`}>
                  {product.stock || 0}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 py-3 bg-gray-50 text-gray-950 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-violet-50 hover:text-violet-600 transition-all"
              >
                Modify
              </button>
              <button
                onClick={() => onDelete(product._id)}
                className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsAdminGrid;
