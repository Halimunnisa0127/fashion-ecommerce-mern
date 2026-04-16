// src/components/ProductsList/ProductsList.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectAllProducts,
  getProductsStatus,
  getProductsError,
  filterProducts,
  setSortBy,
  resetProducts,
} from "../../features/products/productsSlice";
import UnifiedProductCard from "../Shared/UnifiedProductCard";
import Loader from "../Loader/Loader";
import { Filter, X } from "lucide-react";

const ProductsList = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const { page, hasMore, selectedCategory } = useSelector(
    (state) => state.products
  );
  const status = useSelector(getProductsStatus);
  const error = useSelector(getProductsError);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 15, category: selectedCategory }));
  }, [dispatch, selectedCategory]);

  const loadMore = () => {
    if (hasMore) {
      dispatch(fetchProducts({ page: page + 1, limit: 10, category: selectedCategory }));
    }
  };

  const handleCategoryChange = (category) => {
    dispatch(resetProducts()); // 🔹 clear old products & reset page
    dispatch(filterProducts(category));
    dispatch(fetchProducts({ page: 1, limit: 15, category }));
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  let content;

  if (status === "loading" && products.length === 0) {
    content = <Loader />;
  } else if (status === "succeeded" || (status === "loading" && products.length > 0)) {
    content = (
      <>
        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-auto md:right-auto md:top-28 md:left-8 bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all z-40 md:z-30"
        >
          <Filter className="w-6 h-6" />
        </button>

        {/* Backdrop for sidebar */}
        {isOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:z-40" onClick={() => setIsOpen(false)} />}

        {/* Sidebar Drawer */}
        <div
          className={`fixed top-0 left-0 h-screen w-full max-w-[320px] bg-white ring-1 ring-gray-900/5 shadow-2xl p-6 
          transform transition-transform duration-500 ease-in-out 
          overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300
          z-[60] md:z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Curate Search</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-50 rounded-lg"><X className="w-6 h-6" /></button>
          </div>

          <div className="space-y-10">
            {/* Categories */}
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Categories</h3>
              <div className="flex flex-col gap-3">
                {[
                  { value: "all", label: "All Masterpieces" },
                  { value: "men's clothing", label: "Men's Sartorial" },
                  { value: "jewelery", label: "Jewelery & Fine Art" },
                  { value: "electronics", label: "Precision Tech" },
                  { value: "women's clothing", label: "Women's Couture" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { handleCategoryChange(opt.value); setIsOpen(false); }}
                    className={`text-left text-sm py-2 px-4 rounded-xl transition-all ${selectedCategory === opt.value ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Sort */}
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Arrange By</h3>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { value: "lowprice-highprice", label: "Price: Low to High" },
                  { value: "highprice-lowprice", label: "Price: High to Low" },
                  { value: "rating", label: "Highest Voted" },
                  { value: "discountPercent", label: "Season Sale" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { dispatch(setSortBy(opt.value)); setIsOpen(false); }}
                    className="text-left text-sm py-3 px-4 rounded-xl border border-gray-100 hover:border-violet-600 transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Products Grid - 2 columns on mobile, 4-5 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-8 mt-12 pb-12">
          {products.map((product, index) => (
            <div key={product.id ?? index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <UnifiedProductCard product={product} mode="shop" />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center my-12">
            <button
              onClick={loadMore}
              className="px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 hover:shadow-xl transition-all active:scale-95"
            >
              Discover More
            </button>
          </div>
        )}
      </>
    );
  }
  else if (status === "failed") {
    content = (
      <div className="text-red-600 text-center mt-4">Error: {error}</div>
    );
  }

  return (
    <div className="products-container px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-amber-600 drop-shadow mt-12">
        Fashion Hub Best Sellers
      </h2>
      {content}
    </div>
  );
};

export default ProductsList;