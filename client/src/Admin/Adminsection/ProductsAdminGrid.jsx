import React from 'react';
import UnifiedProductCard from '../../Components/Shared/UnifiedProductCard';

const ProductsAdminGrid = ({ products, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <UnifiedProductCard
          key={product._id}
          product={product}
          mode="admin"
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProductsAdminGrid;

