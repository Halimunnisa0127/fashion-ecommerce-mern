import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Package, ShoppingBag, Users, Plus, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../services/api/axios";

// Shared Library
import Badge from "../../Components/Shared/Badge";
import Modal from "../../Components/Shared/Modal";

// Modular Admin Components
import AdminStats from "./AdminStats";
import UsersTable from "./UsersTable";
import ProductsAdminGrid from "./ProductsAdminGrid";
import OrdersTable from "./OrdersTable";
import ProductFormModal from "./ProductFormModal";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [productForm, setProductForm] = useState({
    title: "", price: "", description: "", category: "", image: "", stock: "", ratingRate: "", ratingCount: ""
  });

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchUsers(), fetchProducts(), fetchOrders()]);
      setLoading(false);
    }
    initData();
  }, [token]);

  const fetchStats = async () => { try { const r = await API.get("/admin/stats"); setStats(r.data.stats); } catch (e) { if (e.response?.status === 403) navigate("/"); } };
  const fetchUsers = async () => { try { const r = await API.get("/admin/users"); setUsers(r.data.users); } catch (e) { } };
  const fetchProducts = async () => { try { const r = await API.get("/admin/products"); setProducts(r.data.products); } catch (e) { } };
  const fetchOrders = async () => { try { const r = await API.get("/admin/orders"); setOrders(r.data.orders); } catch (e) { } };

  const handleCreateOrUpdateProduct = async () => {
    setLoading(true);
    try {
      const data = {
        title: productForm.title, price: parseFloat(productForm.price), description: productForm.description, category: productForm.category, image: productForm.image, stock: parseInt(productForm.stock) || 0,
        rating: { rate: parseFloat(productForm.ratingRate) || 0, count: parseInt(productForm.ratingCount) || 0 }
      };
      if (editingProduct) await API.put(`/admin/products/${editingProduct._id}`, data);
      else await API.post("/admin/products", data);

      toast.success(editingProduct ? "Updated!" : "Created!");
      setShowProductModal(false);
      resetProductForm();
      fetchProducts();
      fetchStats();
    } catch (e) { toast.error("Sync failed"); } finally { setLoading(false); }
  };

  const handleUpdateUserRole = async (userId, role) => {
    try { await API.put(`/admin/users/${userId}/role`, { role }); toast.success("Role Updated"); fetchUsers(); } catch (e) { toast.error("Update failed"); }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try { await API.put(`/admin/orders/${orderId}/status`, { status }); toast.success("Status Updated"); fetchOrders(); } catch (e) { toast.error("Update failed"); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete asset?")) return;
    try { await API.delete(`/admin/products/${id}`); toast.success("Archived"); fetchProducts(); fetchStats(); } catch (e) { }
  };

  const resetProductForm = () => setProductForm({
    title: "", price: "", description: "", category: "", image: "", stock: "", ratingRate: "", ratingCount: ""
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-pink-600/20 opacity-50" />
        <div className="max-w-7xl mx-auto px-8 py-16 relative z-10">
          <Badge variant="primary" className="mb-4">Admin Orchestrator</Badge>
          <h1 className="text-5xl font-black tracking-tighter mb-2">Management Suite</h1>
        </div>
      </div>

      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 flex space-x-12 overflow-x-auto">
          {[
            { id: "dashboard", label: "Overview", icon: TrendingUp },
            { id: "products", label: "Inventory", icon: Package },
            { id: "orders", label: "Transactions", icon: ShoppingBag },
            { id: "users", label: "Customers", icon: Users },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 py-6 border-b-2 font-black uppercase text-[10px] tracking-widest ${activeTab === t.id ? "border-violet-600 text-gray-950" : "border-transparent text-gray-300 hover:text-gray-500"}`}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {activeTab === "dashboard" && <div className="space-y-12">
          <AdminStats stats={stats} />
          <div className="p-12 bg-white rounded-[3rem] border border-gray-100 text-center">
            <CheckCircle size={32} className="mx-auto mb-6 text-violet-600" />
            <h3 className="text-2xl font-black text-gray-950">Systems Operational</h3>
          </div>
        </div>}

        {activeTab === "products" && <div>
          <div className="flex justify-between items-end mb-12">
            <div><h2 className="text-3xl font-black text-gray-950">Inventory</h2></div>
            <button onClick={() => { setEditingProduct(null); resetProductForm(); setShowProductModal(true); }} className="px-6 py-3 bg-gray-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-violet-600 transition-all shadow-xl">
              <Plus size={18} className="inline mr-2" /> Add Asset
            </button>
          </div>
          <ProductsAdminGrid products={products} onEdit={(p) => { setEditingProduct(p); setProductForm({ ...p, ratingRate: p.rating?.rate, ratingCount: p.rating?.count }); setShowProductModal(true); }} onDelete={handleDeleteProduct} />
        </div>}

        {activeTab === "users" && <UsersTable users={users} onUpdateRole={handleUpdateUserRole} onViewDetails={(u) => { setSelectedUser(u); setShowUserModal(true); }} />}

        {activeTab === "orders" && <OrdersTable orders={orders} onUpdateStatus={handleUpdateOrderStatus} onViewDetails={() => { }} />}
      </div>

      <ProductFormModal isOpen={showProductModal} onClose={() => setShowProductModal(false)} product={editingProduct} form={productForm} setForm={setProductForm} onSave={handleCreateOrUpdateProduct} loading={loading} />

      <Modal isOpen={showUserModal} onClose={() => setShowUserModal(false)} title="Client Profile Audit" maxWidth="max-w-md">
        {selectedUser && <div className="text-center">
          <div className="w-24 h-24 bg-violet-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black mx-auto mb-8">{selectedUser.Username?.[0].toUpperCase()}</div>
          <h3 className="text-2xl font-black text-gray-950">{selectedUser.Username}</h3>
          <p className="text-gray-400 mb-8">{selectedUser.Email}</p>
          <div className="grid grid-cols-2 gap-4"><div className="p-4 bg-gray-50 rounded-2xl"><p className="text-[9px] font-black uppercase text-gray-400">Class</p><p className="text-xs font-black uppercase">{selectedUser.role}</p></div></div>
        </div>}
      </Modal>
    </div>
  );
};

export default AdminDashboard;