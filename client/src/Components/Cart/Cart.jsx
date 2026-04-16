import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCartAPI,
} from "../../features/products/cartSlice";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) dispatch(fetchCart());
  }, [dispatch]);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 pt-24">
      <div className="max-w-[1200px] mx-auto px-4">

        <div className="flex items-center gap-4 mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Your Selection</h1>
          <span className="bg-violet-100 text-violet-600 px-3 py-1 rounded-full text-sm font-bold">
            {cartItems.length} Items
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 animate-fade-in">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">Your next favorite outfit is just a few clicks away.</p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl active:scale-95"
            >
              Start Curating
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* ITEMS LIST */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 transition-all hover:shadow-md"
                >
                  <div className="w-32 h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest mb-1">{item.brand}</p>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-violet-600 font-black text-xl">₹{Number(item.price).toLocaleString("en-IN")}</p>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => dispatch(updateCartItem({ productId: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateCartItem({ productId: item.id, quantity: item.quantity + 1 }))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
              <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-8">Summary</h3>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-gray-400 font-medium">
                      <span>Subtotal</span>
                      <span className="text-white">₹{totalPrice.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 font-medium">
                      <span>Shipping</span>
                      <span className="text-green-400">FREE</span>
                    </div>
                  </div>

                  <div className="h-px bg-white/10 mb-8" />

                  <div className="flex justify-between items-end mb-8">
                    <span className="text-gray-400 font-bold">Total</span>
                    <span className="text-4xl font-black">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>

                  <button
                    onClick={() => navigate("/payment")}
                    className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group shadow-xl active:scale-95"
                  >
                    Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => dispatch(clearCartAPI())}
                    className="w-full mt-4 py-2 text-white/40 hover:text-white/80 transition-colors text-sm font-bold"
                  >
                    Clear All Selection
                  </button>
                </div>

                {/* Decorative background element */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-violet-600 rounded-full blur-[80px]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}