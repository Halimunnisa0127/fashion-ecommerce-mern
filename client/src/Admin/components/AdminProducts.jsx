// components/Admin/AdminProducts.jsx - Fixed version
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Star } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../../services/api/axios";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // ✅ FIXED: rating should be an object, not a string
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
    stock: "",
    rating: { rate: 0, count: 0 }  // ✅ Fixed: object instead of string
  });

  const token = localStorage.getItem("token");


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ FIXED: Properly structure the product data
      const productData = {
        title: formData.title,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        image: formData.image || "https://via.placeholder.com/300",
        stock: parseInt(formData.stock) || 0,
        rating: {
          rate: parseFloat(formData.rating.rate) || 0,
          count: parseInt(formData.rating.count) || 0
        }
      };

      console.log("Sending product data:", productData); // Debug log

      let response;
      if (editingProduct) {
        response = await API.put(
          "/products/${editingProduct._id}",
          productData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Product updated successfully!");
      } else {
        response = await API.post(
          "/products",
          productData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Product created successfully!");
      }

      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      console.error("Error details:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await API.delete("/products/${productId}", {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      description: "",
      category: "",
      image: "",
      stock: "",
      rating: { rate: 0, count: 0 }
    });
    setEditingProduct(null);
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || "",
      price: product.price || "",
      description: product.description || "",
      category: product.category || "",
      image: product.image || "",
      stock: product.stock || "",
      rating: product.rating || { rate: 0, count: 0 }
    });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products Management</h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      {loading && products.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="group bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="relative h-64 overflow-hidden bg-gray-50">
                <img
                  src={product.image || "https://via.placeholder.com/300"}
                  alt={product.title}
                  className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700"
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-800 shadow-sm border border-white/50">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 leading-tight line-clamp-1 flex-1 pr-2">
                    {product.title}
                  </h3>
                  <div className="flex items-center bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                    <Star className="w-3 h-3 text-amber-500 fill-current" />
                    <span className="text-[11px] font-bold text-amber-700 ml-1">
                      {product.rating?.rate || 0}
                    </span>
                  </div>
                </div>

                <p className="text-gray-500 text-xs mb-4 line-clamp-2 min-h-[2rem]">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Price</p>
                    <p className="text-xl font-black text-violet-600">₹{product.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Inventory</p>
                    <span className={`text-[11px] font-bold px-2 py-1 rounded-md ${(product.stock || 0) > 10 ? 'bg-green-50 text-green-600' :
                        (product.stock || 0) > 0 ? 'bg-orange-50 text-orange-600' :
                          'bg-red-50 text-red-600'
                      }`}>
                      {product.stock || 0} in stock
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => editProduct(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-violet-600 transition-colors duration-300 font-bold text-sm shadow-lg shadow-gray-200"
                  >
                    <Edit className="w-4 h-4" />
                    Modify
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex items-center justify-center w-11 h-11 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all duration-300 border border-gray-100"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Select Category</option>
                    <option value="men's clothing">Men's Clothing</option>
                    <option value="women's clothing">Women's Clothing</option>
                    <option value="electronics">Electronics</option>
                    <option value="jewelery">Jewelery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="mt-2 h-20 w-20 object-cover rounded"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* Rating Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating (0-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating.rate}
                      onChange={(e) => setFormData({
                        ...formData,
                        rating: { ...formData.rating, rate: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating Count</label>
                    <input
                      type="number"
                      value={formData.rating.count}
                      onChange={(e) => setFormData({
                        ...formData,
                        rating: { ...formData.rating, count: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? "Saving..." : (editingProduct ? "Update Product" : "Create Product")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;