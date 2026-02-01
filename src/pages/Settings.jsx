'use client';

import { useState } from 'react';
import { User, Save, AlertCircle, CheckCircle, Lock, Trash2 } from 'lucide-react';
import {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useChangeAdminPasswordMutation,
  useDeleteAdminAccountMutation,
  useAdminLogoutMutation
} from '../store/api/adminApi';

export default function SettingsPage() {
  const { data: adminData, isLoading, isError, refetch } = useGetAdminProfileQuery();
  const [updateProfile] = useUpdateAdminProfileMutation();
  const [changePassword] = useChangeAdminPasswordMutation();
  const [deleteAccount] = useDeleteAdminAccountMutation();
  const [logout] = useAdminLogoutMutation();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Administrator',
    lastLogin: '2023-01-01 12:00 PM',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    password: '',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize profile when admin data loads
  if (adminData && (profile.name === '' || profile.email === '')) {
    setProfile({
      name: adminData.data.name || '',
      email: adminData.data.email || '',
      phone: adminData.data.phone || '',
      role: adminData.data.role || 'Administrator',
      lastLogin: adminData.data.lastLogin || '2023-01-01 12:00 PM',
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const result = await updateProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      }).unwrap();

      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMsg('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      }).unwrap();

      setSuccessMsg('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = () => {
    setDeleteConfirmation({ isOpen: true, password: '' });
  };

  const handleCloseDeleteModal = () => {
    setDeleteConfirmation({ isOpen: false, password: '' });
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await deleteAccount({ password: deleteConfirmation.password }).unwrap();

      // Log out the user after account deletion
      await logout().unwrap();

      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      setErrorMsg(error?.data?.message || 'Failed to delete account');
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 md:p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-600">Failed to load profile data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary rounded-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-primary">Profile Settings</h1>
          <p className="text-gray-600 text-sm mt-1">Manage your account information</p>
        </div>
      </div>

      {(successMsg || errorMsg) && (
        <div className={`flex items-center gap-3 p-4 rounded ${successMsg ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
          {successMsg ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <p className={successMsg ? 'text-green-600' : 'text-red-600'}>{successMsg || errorMsg}</p>
        </div>
      )}

      {/* Profile Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-primary border-b pb-3 mb-6">Personal Information</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
            <input
              type="text"
              name="role"
              value={profile.role}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Last Login</label>
            <input
              type="text"
              name="lastLogin"
              value={profile.lastLogin}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Save Button */}
          <div className="flex gap-3 pt-6 border-t">
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="flex-1 bg-primary text-white font-semibold py-3 rounded-lg hover:bg-secondary transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
            <button
              onClick={() => refetch()}
              className="px-6 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Account Security Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-primary border-b pb-3 mb-6">Account Security</h2>

        <div className="space-y-4">
          {/* Change Password Card */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-900">Change Password</h3>
            </div>
            <p className="text-xs text-gray-600 mb-4">Update your account password</p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-secondary transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
            </div>
          </div>

          {/* Two-Factor Authentication Card */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
            </div>
            <p className="text-xs text-gray-600 mt-1">Add an extra layer of security to your account</p>
            <div className="mt-3">
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                Coming Soon
              </button>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="pt-4 border-t">
            <button
              onClick={handleOpenDeleteModal}
              className="w-full flex items-center justify-center gap-2 text-red-600 font-semibold py-2 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-5 h-5" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-bold text-red-600">Delete Account</h3>
            </div>

            <p className="text-gray-600 mb-4">
              Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your password to confirm
              </label>
              <input
                type="password"
                value={deleteConfirmation.password}
                onChange={(e) => setDeleteConfirmation({...deleteConfirmation, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseDeleteModal}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading || !deleteConfirmation.password}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
