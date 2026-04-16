// components/UserProfile/UserProfile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Package, Heart, Settings, LogOut, ChevronDown } from "lucide-react";

const UserProfile = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.profile-menu')) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const menuItems = [
    { icon: User, label: "My Profile", onClick: () => navigate("/profile") },
    { icon: Package, label: "My Orders", onClick: () => navigate("/orders") },
    { icon: Heart, label: "Wishlist", onClick: () => navigate("/wishlist") },
    { icon: Settings, label: "Settings", onClick: () => navigate("/settings") },
  ];

  return (
    <div className="relative profile-menu">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-full transition-all"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {user?.username?.[0]?.toUpperCase() || "U"}
        </div>
        <span className="text-gray-700 font-medium hidden sm:inline">
          {user?.username}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-slideDown">
          {/* User Info Header */}
          <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
            
            <div className="border-t border-gray-100 my-2"></div>
            
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;