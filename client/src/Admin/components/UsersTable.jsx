import React from 'react';
import { Eye } from 'lucide-react';
import Badge from '../../Components/Shared/Badge';

const UsersTable = ({ users, onUpdateRole, onViewDetails }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identity</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Classification</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Verification</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-violet-200">
                      {user.Username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-gray-950">{user.Username}</p>
                      <p className="text-xs text-gray-400 font-medium">{user.Email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <select
                    value={user.role}
                    onChange={(e) => onUpdateRole(user._id, e.target.value)}
                    className="bg-transparent font-black text-[10px] uppercase tracking-widest text-violet-600 border-none focus:ring-0 cursor-pointer"
                  >
                    <option value="user">Private Client</option>
                    <option value="admin">Curator</option>
                  </select>
                </td>
                <td className="px-8 py-6">
                  <Badge variant="success">Verified</Badge>
                </td>
                <td className="px-8 py-6 text-right">
                  <button
                    onClick={() => onViewDetails(user)}
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

export default UsersTable;
