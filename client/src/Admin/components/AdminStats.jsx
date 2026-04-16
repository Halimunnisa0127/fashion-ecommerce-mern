import React from 'react';
import { Users, Package, ShoppingBag } from 'lucide-react';
import StatCard from '../../Components/Shared/StatCard';

const AdminStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <StatCard 
        title="Total Users" 
        value={stats.totalUsers} 
        icon={Users} 
        colorClass="bg-blue-600"
        delay={0.1}
      />
      <StatCard 
        title="Inventory Items" 
        value={stats.totalProducts} 
        icon={Package} 
        colorClass="bg-emerald-600"
        delay={0.2}
      />
      <StatCard 
        title="Active Orders" 
        value={stats.totalOrders} 
        icon={ShoppingBag} 
        colorClass="bg-violet-600"
        delay={0.3}
      />
    </div>
  );
};

export default AdminStats;
