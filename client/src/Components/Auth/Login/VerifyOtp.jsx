import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast"; // ✅ ADD THIS

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const email = state?.email;

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!email) {
      toast.error("No email found");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const onSubmit = async (data) => {
    try {
      await axios.post(`${API_URL}/verify-otp`, {
        email,
        otp: data.otp,
      });

      toast.success("OTP verified successfully");
      navigate("/reset-password", { state: { email } });

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the OTP sent to your email
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("otp", {
                required: "OTP is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "OTP must be 6 digits"
                }
              })}
            />
            {errors.otp && (
              <p className="text-red-500 text-sm mt-1">
                {errors.otp.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}