'use client';

import { useState, useMemo } from 'react';
import { useListAllUsersQuery } from '../store/api/adminApi';
import UserTable from '../components/UserTable';
import UserModal from '../components/UserModal';
import { Search, Plus, Filter } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Users() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [expirationFilter, setExpirationFilter] = useState('');
  const [registrationTypeFilter, setRegistrationTypeFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data: response, isLoading, error, refetch } = useListAllUsersQuery({
    page,
    limit: 10,
    search,
    expiration: expirationFilter,
    registrationType: registrationTypeFilter,
  });

  const users = response?.data?.users || [];
  const total = response?.data?.total || 0;
  const totalPages = response?.data?.totalPages || 1;

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading && users.length === 0) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Users Management</h1>
          <p className="text-gray-600 text-sm mt-1">Manage and monitor all users on the platform</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Bar */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          {/* Expiration Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={expirationFilter}
              onChange={(e) => {
                setExpirationFilter(e.target.value);
                setPage(1);
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary bg-white"
            >
              <option value="">All Trials</option>
              <option value="active">Active Trials</option>
              <option value="expired">Expired Trials</option>
              <option value="expiring_soon">Expiring Soon</option>
            </select>
          </div>

          <div className="">
            {/* Registration Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={registrationTypeFilter}
                onChange={(e) => {
                  setRegistrationTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary bg-white"
              >
                <option value="">Registration Type</option>
                <option value="plan">Plan</option>
                <option value="register">Register</option>
                <option value="form">Form</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Filters Row */}

        {/* Result Count */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing {users.length} of {total} users</span>
          <button
            onClick={handleRefresh}
            className="text-primary hover:text-secondary font-semibold"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-600">Failed to load users. Please try again.</p>
        </div>
      )}

      {/* Users Table */}
      {users.length > 0 ? (
        <>
          <UserTable users={users} onSelectUser={handleSelectUser} />

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg">No users found</p>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* User Detail Modal */}
      {showModal && (
        <UserModal user={selectedUser} onClose={handleCloseModal} onUpdate={handleRefresh} />
      )}
    </div>
  );
}
