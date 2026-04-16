// components/Payment/Payment.jsx - Complete Working Version
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../../services/api/axios";
import toast from "react-hot-toast";
import { CreditCard, Smartphone, Building, Truck, CheckCircle, XCircle } from "lucide-react";
import { clearCartAPI, fetchCart } from "../../features/products/cartSlice";

const Payment = () => {
  const dispatch = useDispatch();
  const [method, setMethod] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart?.items || []);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        // already loaded check
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);

        document.body.appendChild(script);
      });
    };

    loadRazorpay().then((res) => {
      if (!res) {
        console.error("Razorpay SDK failed to load");
      }
    });
  }, []);
  // ✅ Function to clear cart and redirect to payment success
  const clearCartAndRedirect = async () => {
    try {
      // Clear cart from backend
      await dispatch(clearCartAPI()).unwrap();

      // Refetch cart to ensure state is updated
      await dispatch(fetchCart()).unwrap();

      // Show success message
      toast.success("Order placed successfully!");

      // Redirect to payment success page after 2 seconds
      setTimeout(() => {
        navigate("/payment-success");
      }, 2000);
    } catch (error) {
      console.error("Error clearing cart:", error);
      // Still redirect even if cart clear fails
      setTimeout(() => {
        navigate("/payment-success");
      }, 2000);
    }
  };

  // Handle Cash on Delivery
  const handleCOD = async () => {
    if (!method) {
      toast.error("Please select a payment method");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/");
      return;
    }

    setProcessing(true);
    setPaymentStatus("processing");

    try {
      // Create order in backend for COD
      const orderResponse = await API.post(
        "/user/order",
        {
          method: "COD",
          items: cartItems.map(item => ({
            productId: item.id,
            title: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          totalAmount: totalPrice
        }
      );

      if (orderResponse.data.success) {
        setPaymentStatus("success");
        // Clear cart and redirect to home
        await clearCartAndRedirect();
      } else {
        throw new Error("Order placement failed");
      }
    } catch (error) {
      console.error("COD Error:", error);
      setPaymentStatus("failed");
      toast.error(error.response?.data?.message || "Failed to place order");
      setProcessing(false);
    }
  };

  // Handle Online Payment with Razorpay
  const handleOnlinePayment = async () => {
    if (!method) {
      toast.error("Please select a payment method");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/");
      return;
    }

    setProcessing(true);
    setPaymentStatus("processing");

    try {
      // Step 1: Create order in backend
      const orderResponse = await API.post("/payment/create-order", {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      });
      const { id, amount, currency } = orderResponse.data;

      // Get Razorpay key from environment variable
      const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

      // Step 2: Configure Razorpay options
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "Fashion Hub",
        description: `Order Payment`,
        order_id: id,
        handler: async (response) => {
          try {
            // Step 3: Verify payment
            const verifyResponse = await API.post(
              "/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,

                // ✅ IMPORTANT
                items: cartItems.map(item => ({
                  productId: item.id,
                  quantity: item.quantity
                }))
              }
            );
            if (verifyResponse.data.success) {
              // Create order after successful payment
              const orderResult = await API.post(
                "/user/order",
                {
                  method: method,
                  paymentId: response.razorpay_payment_id,
                  items: cartItems.map(item => ({
                    productId: item.id,
                    title: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                  })),
                  totalAmount: totalPrice
                }
              );

              if (orderResult.data.success) {
                setPaymentStatus("success");
                // Clear cart and redirect to home
                await clearCartAndRedirect();
              } else {
                throw new Error("Order creation failed");
              }
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            setPaymentStatus("failed");
            toast.error(error.message || "Payment verification failed");
            setProcessing(false);
          }
        },
        prefill: {
          name: localStorage.getItem("username"),
          email: localStorage.getItem("email"),
          contact: localStorage.getItem("phone"),
        },
        theme: {
          color: "#db2777",
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            setPaymentStatus(null);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("failed");
      toast.error(error.response?.data?.error || "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  const handlePayment = () => {
    if (!method) {
      toast.error("Please select a payment method");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/");
      return;
    }

    if (method === "Cash on Delivery") {
      handleCOD();
    } else {
      handleOnlinePayment();
    }
  };

  const paymentMethods = [
    { id: "UPI", name: "UPI", icon: Smartphone, description: "Google Pay, PhonePe, Paytm" },
    { id: "Card", name: "Credit/Debit Card", icon: CreditCard, description: "Visa, Mastercard, RuPay" },
    { id: "NetBanking", name: "Net Banking", icon: Building, description: "All major banks" },
    { id: "Cash on Delivery", name: "Cash on Delivery", icon: Truck, description: "Pay when you receive" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 text-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Payment
          </h1>
          <p className="text-gray-600 mt-2">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 py-3 border-b">
                  <img
                    src={item.image || "https://via.placeholder.com/60"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-pink-600 font-bold">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-pink-600">₹{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>

            <div className="space-y-3 mb-6">
              {paymentMethods.map((pm) => (
                <label
                  key={pm.id}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${method === pm.id
                    ? "border-pink-600 bg-pink-50"
                    : "border-gray-200 hover:border-pink-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={pm.id}
                    checked={method === pm.id}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-4 h-4 text-pink-600"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <pm.icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">{pm.name}</span>
                    </div>
                    <p className="text-sm text-gray-500">{pm.description}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Payment Status */}
            {paymentStatus === "processing" && (
              <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                Processing payment...
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Payment successful! Redirecting to home...
              </div>
            )}

            {paymentStatus === "failed" && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Payment failed. Please try again.
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={processing || !method || cartItems.length === 0}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </span>
              ) : (
                `Pay ₹${totalPrice}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;