// components/Orders/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api/axios";
import { Package, Clock, CheckCircle, Truck, XCircle, MapPin, CreditCard, Calendar, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchOrderDetails();
    }, [id]);

    // components/Orders/OrderDetails.jsx - Fixed API endpoint

    const fetchOrderDetails = async () => {
        try {
            // ✅ Fixed endpoint - /api/user/order/:id (matches server.js)
            const response = await API.get(`/user/order/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(response.data);
        } catch (error) {
            console.error("Error fetching order:", error);
            toast.error("Failed to load order details");
            navigate("/orders");
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "pending": return <Clock className="w-6 h-6 text-yellow-500" />;
            case "processing": return <Truck className="w-6 h-6 text-blue-500" />;
            case "shipped": return <Package className="w-6 h-6 text-purple-500" />;
            case "delivered": return <CheckCircle className="w-6 h-6 text-green-500" />;
            case "cancelled": return <XCircle className="w-6 h-6 text-red-500" />;
            default: return <Clock className="w-6 h-6" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-800";
            case "processing": return "bg-blue-100 text-blue-800";
            case "shipped": return "bg-purple-100 text-purple-800";
            case "delivered": return "bg-green-100 text-green-800";
            case "cancelled": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Order not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/orders")}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Orders
                </button>

                {/* Order Header */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 border-b">
                        <div className="flex flex-wrap justify-between items-center gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Order ID</p>
                                <h1 className="text-2xl font-bold font-mono">#{order._id.slice(-8).toUpperCase()}</h1>
                            </div>
                            <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="capitalize">{order.status}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Info Grid */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-b">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Order Date</p>
                                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Payment Method</p>
                                <p className="font-medium">{order.paymentMethod}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Package className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Items</p>
                                <p className="font-medium">{order.items.length} products</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-bold mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 py-3 border-b last:border-0">
                                    <img
                                        src={item.image || "https://via.placeholder.com/100"}
                                        alt={item.title}
                                        className="w-20 h-20 object-cover rounded-lg border"
                                        onError={(e) => e.target.src = "https://via.placeholder.com/100"}
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                        <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                                        <p className="text-pink-600 font-semibold">₹{item.price * item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Unit Price</p>
                                        <p className="font-medium">₹{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="p-6 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-500">Subtotal</p>
                                <p className="text-gray-500">Shipping</p>
                                <p className="text-lg font-bold mt-2">Total Amount</p>
                            </div>
                            <div className="text-right">
                                <p>₹{order.totalAmount}</p>
                                <p className="text-green-600">Free</p>
                                <p className="text-2xl font-bold text-pink-600 mt-2">₹{order.totalAmount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address (if exists) */}
                    {order.shippingAddress && (
                        <div className="p-6 border-t">
                            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Shipping Address
                            </h2>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                <p>{order.shippingAddress.zipCode}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Timeline */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-lg font-bold mb-6">Order Timeline</h2>
                    <div className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        <div className="space-y-6">
                            <div className="relative flex gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center z-10">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-semibold">Order Placed</p>
                                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            {order.status !== "pending" && (
                                <div className="relative flex gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center z-10">
                                        <Truck className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Order Processed</p>
                                        <p className="text-sm text-gray-500">Your order is being processed</p>
                                    </div>
                                </div>
                            )}
                            {order.status === "delivered" && (
                                <div className="relative flex gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center z-10">
                                        <Package className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Delivered</p>
                                        <p className="text-sm text-gray-500">Your order has been delivered</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;