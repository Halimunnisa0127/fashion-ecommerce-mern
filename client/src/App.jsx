import React, { useEffect } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toaster } from "react-hot-toast";

import SignUp from './Components/Auth/SignUp/SignUp';
import Login from './Components/Auth/Login/Login';
import VerifyOtp from './Components/Auth/Login/VerifyOtp';
import Header from './Components/Header/Header';
import ProfilePage from './Components/UserProfile/ProfilePage';
import ProductsList from './Components/ProductList/ProductsList';
import AboutPage from './Components/AboutPage/AboutPage';
import ProductDetails from './Components/ProductDetails/ProductDetails';
import Wishlist from './Components/Wishlist/Wishlist';
import Cart from './Components/Cart/Cart';
import Payment from './Components/Payment/Payment';
import Footer from './Components/Footer/Footer';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import ForgotPassword from './Components/Auth/Login/ForgotPassword';
import ResetPassword from './Components/Auth/Login/ResetPassword';
import { fetchProducts } from './features/products/productsSlice';
import { verifyToken } from './features/products/authSlice';
import AdminRoute from './Components/ProtectedRoute/AdminRoute';
import AdminDashboard from './Admin/components/AdminDashboard';
import PaymentSuccess from './Components/Payment/PaymentSuccess';
import Orders from './Components/Orders/Orders';
import OrderDetails from './Components/Orders/OrderDetails';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 10 }));

    const token = localStorage.getItem("token");
    if (token) {
      dispatch(verifyToken());
      dispatch(fetchCart());
    }
  }, [dispatch]);

  return (
    <div className="App min-h-screen flex flex-col">
      <Header />

      {/* ✅ MOVE HERE */}
      <Toaster position="top-center" />

      <main className="flex-grow pt-[60px]">
        <Routes>

          <Route path="/" element={<ProductsList />} />
          <Route path="/home" element={<Navigate to="/" />} />

          <Route path="/aboutpage" element={<AboutPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          <Route path="/payment-success" element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />

          <Route path="/order/:id" element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          } />

          {/* Catch-all must be LAST */}
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;