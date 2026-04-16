// components/UserProfile/ProfilePage.jsx - Updated (No direct password change)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Edit2,
  CheckCircle,
  ShoppingBag,
  Heart,
  LogOut,
  Key,
  AlertCircle,
  Phone,
  ArrowRight,
  Star,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux"; // For wishlist
import { removeFromWishlist } from "../../features/products/wishlistSlice";
import API from "../../services/api/axios";
import toast from "react-hot-toast";

const WishlistItem = ({ item, navigate, dispatch, removeFromWishlist, toast }) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="group relative flex flex-col p-4 bg-white rounded-[2rem] border border-gray-100 hover:shadow-2xl hover:shadow-violet-100/50 transition-all duration-500 hover:-translate-y-1">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 p-3 group-hover:scale-110 transition-transform duration-500">
          <img src={item.image} className="w-full h-full object-contain mix-blend-multiply" alt={item.name} />
        </div>
        <div className="flex-1 min-w-0 pr-8">
          <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest mb-1 opacity-70">{item.brand || 'Luxury'}</p>
          <h4 className="text-base font-bold text-gray-900 truncate mb-1">{item.name}</h4>
          <div className="flex items-center gap-2">
            <p className="text-xl font-black text-gray-900">₹{item.price}</p>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-[10px] font-bold text-violet-600 hover:underline px-2 py-1 bg-violet-50 rounded-md"
            >
              {showDetails ? "Hide Details" : "Quick Details"}
            </button>
          </div>
        </div>

        <div className="absolute right-4 top-4 flex flex-col gap-2 scale-90 sm:scale-100">
          <button
            onClick={() => navigate(`/product/${item.id}`)}
            className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-violet-600 transition-colors shadow-lg shadow-black/5"
            title="Expand Product Page"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(removeFromWishlist(item.id));
              toast.success("Item removed");
            }}
            className="w-10 h-10 bg-white text-gray-400 rounded-xl border border-gray-100 flex items-center justify-center hover:text-red-500 hover:bg-red-50 transition-all"
            title="Remove item"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4 pt-4 border-t border-gray-50"
          >
            <div className="flex items-center gap-1 mb-2 bg-amber-50 w-fit px-2 py-0.5 rounded-lg border border-amber-100">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-bold text-amber-700">{item.rating || 4.5}</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
              {item.description}
            </p>
            <button
              onClick={() => navigate(`/product/${item.id}`)}
              className="mt-3 text-[10px] font-black text-violet-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
            >
              Full Specifications <ArrowRight className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [orders, setOrders] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const wishlistItems = useSelector(state => state.wishlist || []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserProfile();
    fetchUserOrders();
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await API.get("/profile");
      setUser(response.data);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        phone: response.data.phone || ""
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    }
  };

  const fetchUserOrders = async () => {
    try {
      const response = await API.get("/user/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateProfileForm()) return;
    setLoading(true);
    try {
      const response = await API.put("/profile", {
        username: formData.username,
        email: formData.email,
        phone: formData.phone
      });
      toast.success(response.data.message);
      setUser(response.data.user);
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await API.put("/profile/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success(response.data.message);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setActiveTab("profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await API.delete("/profile");
      toast.success("Account deleted successfully");
      localStorage.clear();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    toast.success("Logged out successfully");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            My Account
          </h1>
          <p className="text-gray-600 mt-2">Manage your profile and account settings</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-80 bg-gradient-to-b from-pink-50 to-purple-50 p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                {user.username?.[0]?.toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{user.username}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
                <CheckCircle className="w-3 h-3" /> Verified Account
              </p>
            </div>

            <nav className="space-y-2">
              {[
                { id: "profile", label: "Profile Information", icon: User },
                { id: "orders", label: "My Orders", icon: ShoppingBag },
                { id: "wishlist", label: "Wishlist", icon: Heart },
                { id: "security", label: "Security", icon: Key },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-white/50"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 md:p-8">
            {activeTab === "profile" && (
              <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Profile Information</h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-600 hover:text-white transition-all"
                    >
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none ${
                            errors.username ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button onClick={handleUpdateProfile} disabled={loading} className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 rounded-lg font-medium shadow-lg hover:shadow-pink-200 transition-all">
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                      <button onClick={() => setIsEditing(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                      <div className="flex items-center gap-4 mb-4">
                        <User className="text-gray-400 w-5 h-5" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Full Name</p>
                          <p className="text-lg font-bold text-gray-800">{user.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <Phone className="text-gray-400 w-5 h-5" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Phone Number</p>
                          <p className="text-lg font-bold text-gray-800">{user.phone || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <ShoppingBag className="text-gray-400 w-5 h-5" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Member Since</p>
                          <p className="text-lg font-bold text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setShowDeleteModal(true)} className="w-full py-4 text-red-600 border border-red-100 rounded-2xl hover:bg-red-50 transition-all font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Delete Account
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div className="animate-in fade-in duration-500">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Order History</h3>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-xl transition-all bg-white group">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Order #{order._id.slice(-8)}</span>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            order.status === "delivered" ? "bg-green-100 text-green-700" : "bg-violet-100 text-violet-700"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="flex -space-x-4">
                              {order.items.slice(0, 3).map((item, i) => (
                                <img key={i} src={item.image} className="w-14 h-14 rounded-2xl ring-4 ring-white object-cover shadow-lg" />
                              ))}
                           </div>
                           <div className="flex-1">
                              <p className="text-lg font-black text-gray-900 leading-none mb-1">{order.items.length} Essence Items</p>
                              <p className="text-sm font-bold text-violet-600">Totaling ₹{order.totalAmount.toLocaleString()}</p>
                           </div>
                           <button onClick={() => navigate(`/product/${order.items[0].productId}`)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all">
                              <ArrowRight className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-[3rem]">
                    <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6 font-bold">You haven't placed any orders yet.</p>
                    <button onClick={() => navigate("/")} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-violet-600 transition-all">
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">Curated Selection</h3>
                  <span className="text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full uppercase tracking-widest">
                    {wishlistItems.length} Saved Items
                  </span>
                </div>
                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlistItems.map((item) => (
                      <WishlistItem key={item.id} item={item} navigate={navigate} dispatch={dispatch} removeFromWishlist={removeFromWishlist} toast={toast} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                    <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6 font-bold">Your gallery is currently empty.</p>
                    <button onClick={() => navigate("/")} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-violet-600 transition-all">
                      Explore Gallery
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "security" && (
              <div className="animate-in fade-in duration-500">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Security Settings</h3>
                <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
                   <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Password</label>
                    <input type="password" required value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="w-full px-5 py-4 border border-gray-100 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">New Security Code</label>
                    <input type="password" required value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full px-5 py-4 border border-gray-100 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Confirm New Code</label>
                    <input type="password" required value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full px-5 py-4 border border-gray-100 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 transition-all" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-violet-600 shadow-xl shadow-gray-200 transition-all">
                    {loading ? "Authorizing..." : "Update Security"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2.5rem] max-w-md w-full p-10 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2">Irreversible Action</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">Are you absolutely sure? Deleting your account will permanently erase your curated collection and order history.</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleDeleteAccount} disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all">
                  {loading ? "Erasing..." : "Yes, Terminate Account"}
                </button>
                <button onClick={() => setShowDeleteModal(false)} className="w-full bg-gray-50 text-gray-700 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                  Maintain Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;