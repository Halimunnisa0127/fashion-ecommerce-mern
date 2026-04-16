import React from 'react';
import { Plus } from 'lucide-react';
import ProductsAdminGrid from './ProductsAdminGrid';

const AdminProductsSection = ({ 
  products, 
  onAddClick, 
  onEditClick, 
  onDeleteClick, 
  loading 
}) => {
  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-gray-950 tracking-tight">Gallery Inventory</h2>
          <p className="text-gray-500 text-sm mt-1">Manage and curate your storefront's visual catalog.</p>
        </div>
        
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-8 py-4 bg-gray-950 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-violet-600 transition-all shadow-xl shadow-gray-200"
        >
          <Plus size={16} /> Initialize New Asset
        </button>
      </div>

      {loading && products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-violet-600/20 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Synchronizing Inventory...</p>
        </div>
      ) : (
        <ProductsAdminGrid 
          products={products} 
          onEdit={onEditClick} 
          onDelete={onDeleteClick} 
        />
      )}

      {!loading && products.length === 0 && (
        <div className="py-24 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">No assets found in the inventory vault.</p>
        </div>
      )}
    </div>
  );
};

export default AdminProductsSection;
