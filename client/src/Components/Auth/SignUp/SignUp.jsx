import { useState } from 'react'
import API from '../../../services/api/axios'
import '../../../App.css'
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

function SignUp() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [UserRigisterDetails, setUserRigisterDetails] = useState(
    {
      Username: "",
      Email: "",
      Phone: "",
      Userpassword: "",
      ConfirmUserpassword: "",
      CaptchaValue: ""
    }
  )

  function UserDetails(event) {
    const { name, value } = event.target;
    setUserRigisterDetails(prev => ({ ...prev, [name]: value }));
    console.log(name, value);
  }

  async function submitdetails(event) {
    event.preventDefault();
    console.log("UserRigisterDetails", UserRigisterDetails);

    try {
      const response = await API.post('/signup', UserRigisterDetails);
      toast.success("Account created! Please login.");
      navigate('/login');
    }
    catch (error) {
      console.log("error", error);
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }
  return (
    <>

      <div className="bg-white min-h-screen">
        <div className="grid md:grid-cols-2 items-center gap-8 h-full">
          <div className="max-md:order-1 p-4">
            <img src="https://readymadeui.com/signin-image.webp" className="lg:max-w-[85%] w-full h-full aspect-square object-contain block mx-auto" alt="login-image" />
          </div>

          <div className="flex items-center lg:p-12 p-8 bg-[#0C172C] h-full lg:w-11/12 lg:ml-auto">
            <form className="max-w-lg w-full mx-auto">
              <div className="mb-12">
                <h1 className="text-3xl font-semibold text-purple-400">Create an account</h1>
              </div>

              <div>
                <label className="text-white text-xs block mb-2">Full Name</label>
                <div className="relative flex items-center">
                  <input onChange={UserDetails} name='Username' value={UserRigisterDetails.Username} type="text" required className="w-full bg-transparent text-sm text-white border-b border-slate-500 focus:border-white pl-2 pr-8 py-3 outline-none" placeholder="Enter name" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="fullname absolute right-2" viewBox="0 0 24 24">
                    <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                    <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                  </svg>
                </div>
              </div>
              <div className="mt-8">
                <label className="text-white text-xs block mb-2">Email</label>
                <div className="relative flex items-center">
                  <input type="email" onChange={UserDetails} name='Email' value={UserRigisterDetails.Email} required className="w-full bg-transparent text-sm text-white border-b border-slate-500 focus:border-white pl-2 pr-8 py-3 outline-none" placeholder="Enter email" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="fullname absolute right-2" viewBox="0 0 24 24">
                    <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                    <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                  </svg>
                </div>
              </div>
              <div className="mt-8">
                <label className="text-white text-xs block mb-2">Phone</label>
                <div className="relative flex items-center">
                  <input type="text" onChange={UserDetails} name='Phone' value={UserRigisterDetails.Phone} required className="w-full bg-transparent text-sm text-white border-b border-slate-500 focus:border-white pl-2 pr-8 py-3 outline-none" placeholder="Enter phone" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="fullname absolute right-2" viewBox="0 0 24 24">
                    <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                    <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                  </svg>
                </div>
              </div>
              <div className="mt-8">
                <label className="text-white text-xs block mb-2">Password</label>
                <div className="relative flex items-center">
                  <input type={showPassword ? "text" : "password"} onChange={UserDetails} name='Userpassword' value={UserRigisterDetails.Userpassword} required className="w-full bg-transparent text-sm text-white border-b border-slate-500 focus:border-white pl-2 pr-8 py-3 outline-none" placeholder="Enter password" />
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
              </div>
              <div className="mt-8">
                <label className="text-white text-xs block mb-2">Confirm Password</label>
                <div className="relative flex items-center">
                  <input type={showConfirmPassword ? "text" : "password"} onChange={UserDetails} name='ConfirmUserpassword' value={UserRigisterDetails.ConfirmUserpassword} required className="w-full bg-transparent text-sm text-white border-b border-slate-500 focus:border-white pl-2 pr-8 py-3 outline-none" placeholder="Enter password" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                  >
                    {showConfirmPassword ? (
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
              </div>

              <div className="mt-8">
                <button type="submit" onClick={submitdetails} className="w-max shadow-xl py-3 px-6 min-w-32 text-sm text-white font-medium rounded-sm bg-purple-600 hover:bg-purple-500 focus:outline-none cursor-pointer">
                  Register
                </button>
                <p className="text-sm text-slate-300 mt-8">Already have an account? <Link to="/login" className="text-purple-400 font-medium hover:underline ml-1">Login here</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>

  )
}


export default SignUp;
