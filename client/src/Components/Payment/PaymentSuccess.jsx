// components/Payment/PaymentSuccess.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Auto redirect to home after 5 seconds
        const timer = setTimeout(() => {
            navigate("/");
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 text-black">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
                <p className="text-gray-600 mb-6">
                    Your order has been placed successfully. You will receive a confirmation email shortly.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;