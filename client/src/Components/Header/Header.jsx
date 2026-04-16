import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag, Search, X, User, Package, Heart,
  LogOut, ChevronDown, Shield, Menu
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { searchProducts } from "../../features/products/productsSlice";
import toast from "react-hot-toast";
import API from "../../services/api/axios";

const Header = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const cartItems = useSelector((state) => state.cart?.items || []);
  const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setUserRole(null);
      return;
    }
    const fetchUser = async () => {
      try {
        const response = await API.get("/profile");
        setUser(response.data);
        setUserRole(response.data.role);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      }
    };
    fetchUser();
  }, [token, navigate]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    dispatch(searchProducts(e.target.value));
    if (location.pathname !== "/") navigate("/");
  };

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    setUser(null);
    setUserRole(null);
    navigate("/");
    toast.success("Logged out successfully");
  };

  const isAdmin = userRole === "admin";

  const navLinks = [
    { name: "Home", path: "/" },
    // { name: "Collection", path: "/" },
    { name: "About", path: "/aboutpage" },
    { name: "Wishlist", path: "/wishlist" },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "glass-nav py-2 shadow-sm" : "bg-white py-4"} mb-12`}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">

        {/* Left: Mobile Menu Toggle & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Fashion<span className="text-violet-600">Hub</span>
            </span>
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[15px] font-medium transition-colors hover:text-violet-600 ${location.pathname === link.path ? "text-violet-600" : "text-gray-600"}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: Search & Icons */}
        <div className="flex items-center gap-2 md:gap-5">
          {/* Desktop Search */}
          <div className="hidden lg:relative lg:flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search aesthetics..."
              className="bg-gray-50 border-none w-64 pl-10 pr-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-violet-500/20 transition-all"
            />
          </div>

          <Link to="/cart" className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-violet-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>

          {!token ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-violet-600 transition-colors">Login</Link>
              <Link to="/signup" className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-md active:scale-95">Register</Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pr-3 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-100 transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-tr from-violet-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs ring-2 ring-white">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-semibold text-gray-700 hidden lg:inline">{user?.username}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-50 p-2 overflow-hidden animate-fade-in">
                  <div className="px-4 py-3 bg-gray-50 rounded-xl mb-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.username}</p>
                    {isAdmin && <span className="inline-flex mt-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-[10px] font-bold rounded-md">ADMIN</span>}
                  </div>
                  <MenuItem icon={<User className="w-4 h-4" />} label="Profile" onClick={() => navigate("/profile")} />
                  <MenuItem icon={<Package className="w-4 h-4" />} label="My Orders" onClick={() => navigate("/orders")} />
                  <MenuItem icon={<Heart className="w-4 h-4" />} label="Wishlist" onClick={() => navigate("/wishlist")} />
                  {isAdmin && <MenuItem icon={<Shield className="w-4 h-4" />} label="Admin Dashboard" onClick={() => navigate("/admin")} color="text-violet-600" />}
                  <div className="h-px bg-gray-100 my-1 mx-2" />
                  <MenuItem icon={<LogOut className="w-4 h-4" />} label="Logout" onClick={handleLogout} color="text-red-500 hover:bg-red-50" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[73px] bg-white z-40 animate-fade-in">
          <div className="p-6 flex flex-col gap-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search products..."
                className="w-full bg-gray-50 pl-10 py-3 rounded-xl text-sm"
              />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-semibold text-gray-800 py-2 border-b border-gray-50"
              >
                {link.name}
              </Link>
            ))}
            {!token && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Link to="/login" className="py-3 text-center rounded-xl bg-gray-50 font-bold text-gray-800">Login</Link>
                <Link to="/signup" className="py-3 text-center rounded-xl bg-violet-600 font-bold text-white">Join Now</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const MenuItem = ({ icon, label, onClick, color }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors hover:bg-gray-50 ${color || "text-gray-700"}`}>
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export default Header;