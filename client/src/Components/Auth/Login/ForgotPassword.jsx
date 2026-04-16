// ForgotPassword.jsx - Professional version
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const API_URL = import.meta.env.VITE_API_URL;
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/forgot-password`,
        { email: data.email }
      );

      toast.success(response.data.message);

      // Navigate to OTP verification
      navigate("/verify-otp", {
        state: { email: data.email },
        replace: true
      });

    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 text-black">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7.5a2.25 2.25 0 012.25 2.25m0 0a2.25 2.25 0 012.25 2.25M6 7.5a2.25 2.25 0 012.25 2.25m0 0a2.25 2.25 0 012.25 2.25m-4.5 0v6m12 0v-6M3 12h18"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Forgot Password?</h2>
          <p className="text-gray-500 mt-2">No worries! Enter your email and we'll send you an OTP.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
                ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold
                     hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending OTP...
              </div>
            ) : (
              "Send OTP"
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              ← Back to Login
            </button>
          </div>
        </form>

        {/* Demo mode indicator */}
        {import.meta.env.DEV && (
          <div className="mt-6 p-3 bg-yellow-50 rounded-lg text-center">
            <p className="text-xs text-yellow-800">
              🔧 Development Mode: Check console for OTP
            </p>
          </div>
        )}
      </div>
    </div>
  );
}