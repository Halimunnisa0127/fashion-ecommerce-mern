// components/ProtectedRoute/AdminRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../../services/api/axios';
import toast from 'react-hot-toast';

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAdmin = async () => {
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const response = await API.get("/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          toast.error("Admin access required");
        }
      } catch (error) {
        setIsAdmin(false);
        toast.error("Access denied");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;