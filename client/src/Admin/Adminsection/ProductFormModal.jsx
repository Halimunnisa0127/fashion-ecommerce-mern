import React from 'react';
import Modal from '../../Components/Shared/Modal';

const ProductFormModal = ({ isOpen, onClose, product, form, setForm, onSave, loading }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? "Refine Product Art" : "Initialize New Product"}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Subject Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full bg-gray-50 border-gray-100 rounded-2xl px-6 py-4 font-bold focus:ring-violet-600 focus:border-violet-600 transition-all outline-none"
              placeholder="e.g. Midnight Silk Gown"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Valuation (₹)</label>
            <input
              type="number"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              className="w-full bg-gray-50 border-gray-100 rounded-2xl px-6 py-4 font-bold focus:ring-violet-600 transition-all outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Inventory Stock</label>
            <input
              type="number"
              value={form.stock}
              onChange={e => setForm({ ...form, stock: e.target.value })}
              className="w-full bg-gray-50 border-gray-100 rounded-2xl px-6 py-4 font-bold focus:ring-violet-600 transition-all outline-none"
            />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Asset URL</label>
            <input
              type="text"
              value={form.image}
              onChange={e => setForm({ ...form, image: e.target.value })}
              className="w-full bg-gray-50 border-gray-100 rounded-2xl px-6 py-4 text-xs font-mono focus:ring-violet-600 transition-all outline-none"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Category</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full bg-gray-50 border-gray-100 rounded-2xl px-6 py-4 font-bold focus:ring-violet-600 appearance-none outline-none"
            >
              <option value="">Select Category</option>
              <option value="men's clothing">Men's Apparel</option>
              <option value="women's clothing">Women's Couture</option>
              <option value="electronics">Technique</option>
              <option value="jewelery">Adornment</option>
            </select>
          </div>
           {/* Rating Section */}
           <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Rating (0-5)</label>
              <input
                type="number"
                step="0.1"
                value={form.ratingRate}
                onChange={e => setForm({ ...form, ratingRate: e.target.value })}
                className="w-full bg-gray-50 border-gray-100 rounded-2xl px-6 py-4 font-bold focus:ring-violet-600 transition-all outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Reviews Count</label>
              <input
                type="number"
                value={form.ratingCount}
                onChange={e => setForm({ ...form, ratingCount: e.target.value })}
                className="w-full bg-gray-50 border-gray-100 rounded-2xl px-6 py-4 font-bold focus:ring-violet-600 transition-all outline-none"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <button
            onClick={onSave}
            disabled={loading}
            className="w-full py-5 bg-gray-950 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-violet-600 disabled:bg-gray-200 transition-all shadow-xl shadow-gray-200"
          >
            {loading ? "Synchronizing Asset..." : "Finalize Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductFormModal;
