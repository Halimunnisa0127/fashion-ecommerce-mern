import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast from "react-hot-toast";
import API from '../../../services/api/axios';
export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [LoginDetails, setLoginDetails] = useState({
    Email: "",
    Password: "",
  });

  function LoginAuthentication(e) {
    const { name, value } = e.target;
    setLoginDetails(prev => ({ ...prev, [name]: value }));
  }

  async function submitDetails(e) {
    e.preventDefault();

    console.log("Login Details Submitted:", LoginDetails);

    try {
      const response = await API.post(
        "/login",
        LoginDetails
      );

      const result = response.data;
      console.log("LOGIN RESPONSE:", result);

      // ✅ Safety check
      if (!result?.token) {
        toast.error("Login failed: No token received");
        return;
      }

      // ✅ Store token FIRST
      localStorage.setItem("token", result.token);
      localStorage.setItem("username", result.user?.username || "");
      localStorage.setItem("email", result.user?.email || "");
      localStorage.setItem("phone", result.user?.phone || "");
      localStorage.setItem("role", result.user?.role || "");
      localStorage.setItem("role", result.user?.role || "user"); // ✅ Store role
      console.log("Token stored:", localStorage.getItem("token"));

      // ✅ Success
      toast.success("Login successful!");

      if (result.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      // ✅ Notify app
      window.dispatchEvent(new Event("storage"));

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to login.");
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 text-black" >
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

        <img
          className="w-50 h-30 mb-6"
          src="https://www.pngall.com/wp-content/uploads/15/Login-PNG-HD-Image.png"
          alt="logo"
        />

        <div className="w-full bg-white rounded-lg shadow sm:max-w-md dark:bg-gray-800 text-white">
          <div className="p-6 space-y-4 sm:p-8">

            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Login to your account
            </h1>

            {/* ✅ FIXED FORM */}
            <form className="space-y-4" onSubmit={submitDetails}>

              {/* EMAIL */}
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                  Your email
                </label>
                <input
                  type="email"
                  name="Email"
                  value={LoginDetails.Email}
                  onChange={LoginAuthentication}
                  id="email"
                  placeholder="yourmail@.com"
                  className="w-full p-2.5 border rounded-lg"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label htmlFor="password" className="block mb-3 text-sm font-medium">
                  Password
                </label>

                <div className="relative bottom-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="Password"
                    value={LoginDetails.Password}
                    onChange={LoginAuthentication}
                    id="password"
                    placeholder="••••••••"
                    className="w-full p-2.5 border rounded-lg pr-12"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                  >
                    {showPassword ? (
                      // ✅ Eye Off (Hide)
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a21.81 21.81 0 0 1 5.06-6.94" />
                        <path d="M1 1l22 22" />
                        <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 10 8 10 8a21.77 21.77 0 0 1-3.06 4.94" />
                        <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
                        <path d="M10.59 10.59A3 3 0 0 1 13.41 13.41" />
                      </svg>
                    ) : (
                      // ✅ Eye (Show)
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                {/* SUBMIT */}
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-5 py-2.5"
                >
                  Login
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

