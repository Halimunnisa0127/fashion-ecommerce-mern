// components/Orders/Orders.jsx - Fixed API endpoints
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api/axios";
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronRight, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchOrders();
    }, [token]);

    const fetchOrders = async () => {
        try {
            // ✅ Fixed endpoint - /api/user/orders (matches server.js)
            const response = await API.get("/user/orders", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error(error.response?.data?.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "pending": return <Clock className="w-5 h-5 text-yellow-500" />;
            case "processing": return <Truck className="w-5 h-5 text-blue-500" />;
            case "shipped": return <Package className="w-5 h-5 text-purple-500" />;
            case "delivered": return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "cancelled": return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
            case "shipped": return "bg-purple-100 text-purple-800 border-purple-200";
            case "delivered": return "bg-green-100 text-green-800 border-green-200";
            case "cancelled": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        My Orders
                    </h1>
                    <p className="text-gray-600 mt-2">Track and manage your orders</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
                        <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                                <div className="bg-gradient-to-r from-gray-50 to-white p-5 border-b">
                                    <div className="flex flex-wrap justify-between items-center gap-3">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-100 rounded-lg px-3 py-2">
                                                <p className="text-xs text-gray-500">ORDER ID</p>
                                                <p className="font-mono font-semibold text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">PLACED ON</p>
                                                <p className="font-medium text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span className="capitalize">{order.status}</span>
                                            </div>
                                            <div className="bg-gray-100 rounded-lg px-3 py-2">
                                                <p className="text-xs text-gray-500">TOTAL</p>
                                                <p className="font-bold text-pink-600">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="space-y-3">
                                        {order.items.slice(0, 2).map((item, idx) => (
                                            <div key={idx} className="flex gap-4 py-2">
                                                <img
                                                    src={item.image || "https://via.placeholder.com/80"}
                                                    alt={item.title}
                                                    className="w-16 h-16 object-cover rounded-lg border"
                                                    onError={(e) => e.target.src = "https://via.placeholder.com/80"}
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                                    <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                                                    <p className="text-pink-600 font-semibold">₹{item.price * item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">Price</p>
                                                    <p className="font-medium">₹{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > 2 && (
                                            <button
                                                onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                                                className="text-pink-600 text-sm font-medium hover:underline flex items-center gap-1"
                                            >
                                                {selectedOrder === order._id ? "Show less" : `+ ${order.items.length - 2} more items`}
                                                <ChevronRight className={`w-4 h-4 transition-transform ${selectedOrder === order._id ? "rotate-90" : ""}`} />
                                            </button>
                                        )}
                                        {selectedOrder === order._id && order.items.slice(2).map((item, idx) => (
                                            <div key={idx} className="flex gap-4 py-2 border-t pt-3">
                                                <img
                                                    src={item.image || "https://via.placeholder.com/80"}
                                                    alt={item.title}
                                                    className="w-16 h-16 object-cover rounded-lg border"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{item.title}</h3>
                                                    <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                                                    <p className="text-pink-600 font-semibold">₹{item.price * item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">Price</p>
                                                    <p className="font-medium">₹{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 border-t">
                                    <div className="flex flex-wrap justify-between items-center gap-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CreditCard className="w-4 h-4" />
                                            <span>Paid via {order.paymentMethod}</span>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/order/${order._id}`)}
                                            className="px-4 py-2 bg-white border border-pink-600 text-pink-600 rounded-lg text-sm font-medium hover:bg-pink-600 hover:text-white transition-all"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;