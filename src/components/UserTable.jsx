'use client';

import { Eye, Lock, Unlock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useUpdateBlockStatusMutation } from '../store/api/adminApi';

export default function UserTable({ users, onSelectUser }) {
  const [updateBlock] = useUpdateBlockStatusMutation();

  const handleBlockToggle = async (user) => {
    try {
      await updateBlock({ userId: user._id, isBlocked: !user.isBlocked }).unwrap();
      // The parent component should handle the refresh of data
    } catch (error) {
      console.error('Failed to update block status:', error);
    }
  };

  const getStatusBadge = (registrationType) => {
    const statusConfig = {
      plan: { bg: 'bg-green-100', text: 'text-green-800', label: 'Plan', border: 'border-green-200' },
      register: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Register', border: 'border-blue-200' },
      form: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Form', border: 'border-purple-200' },
    };

    const config = statusConfig[registrationType?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-800', label: registrationType || 'N/A', border: 'border-gray-200' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (isPaid) => {
    const config =
      isPaid === true
        ? { bg: 'bg-green-50', text: 'text-green-700', label: 'Paid' }
        : { bg: 'bg-red-50', text: 'text-red-700', label: 'Unpaid' };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase min-w-[300px]">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase min-w-[250px]">
                Course
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase min-w-[200px]">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase min-w-[150px]">
                Reg. Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase min-w-[120px]">
                Payment
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase min-w-[150px]">
                Joined
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase min-w-[220px]">
                Trial Expiration
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{user.name || 'N/A'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.course}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.phone || 'N/A'}</td>
                <td className="px-6 py-4 capitalize">{getStatusBadge(user.registrationType)}</td>
                <td className="px-6 py-4">{getPaymentBadge(user.isPaid)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.createdAt
                    ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.trialExpiresAt
                    ? new Date(user.trialExpiresAt).toLocaleString("en-PK", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : "N/A"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectUser(user)}
                      title="View Details"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleBlockToggle(user)}
                      title={user.isBlocked ? 'Unblock User' : 'Block User'}
                      className={`p-2 rounded-lg transition ${user.isBlocked
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-red-600 hover:bg-red-50'
                        }`}
                    >
                      {user.isBlocked ? (
                        <Unlock className="w-5 h-5" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
