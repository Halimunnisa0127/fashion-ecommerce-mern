import React from 'react';
import { Eye } from 'lucide-react';
import PriceDisplay from '../../Components/Shared/PriceDisplay';

const OrdersTable = ({ orders, onUpdateStatus, onViewDetails }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-50 text-yellow-600 border-yellow-100",
      processing: "bg-blue-50 text-blue-600 border-blue-100",
      shipped: "bg-purple-50 text-purple-600 border-purple-100",
      delivered: "bg-green-50 text-green-600 border-green-100",
      cancelled: "bg-red-50 text-red-600 border-red-100"
    };
    return colors[status] || "bg-gray-50 text-gray-600 border-gray-100";
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Acquirer</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Valuation</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Flow State</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6">
                  <span className="font-mono text-xs font-bold text-gray-400">#{order._id.slice(-8).toUpperCase()}</span>
                </td>
                <td className="px-8 py-6">
                  <div>
                    <p className="font-black text-gray-950">{order.userId?.Username || 'External'}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </td>
                <td className="px-8 py-6 font-black text-gray-950">
                  <PriceDisplay price={order.totalAmount} />
                </td>
                <td className="px-8 py-6">
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors cursor-pointer outline-none ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-8 py-6 text-right">
                  <button
                    onClick={() => onViewDetails(order)}
                    className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-violet-50 hover:text-violet-600 transition-all ml-auto"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
