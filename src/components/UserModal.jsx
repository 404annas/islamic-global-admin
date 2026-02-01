'use client';

import { useState } from 'react';
import { X, Save, Lock, Unlock, CheckCircle, AlertCircle } from 'lucide-react';
import {
  useUpdateUserStatusMutation,
  useUpdateBlockStatusMutation,
  useUpdatePaymentStatusMutation,
  useGetUserProgressQuery,
  useCreateProgressReportMutation,
} from '../store/api/adminApi';

export default function UserModal({ user, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState('details');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { data: progressData } = useGetUserProgressQuery(user._id);
  const [updateStatus] = useUpdateUserStatusMutation();
  const [updateBlock] = useUpdateBlockStatusMutation();
  const [updatePayment] = useUpdatePaymentStatusMutation();
  const [createProgress] = useCreateProgressReportMutation();

  const [progressForm, setProgressForm] = useState({
    status: '',
    timing: '',
    lesson: '',
    performance: '',
    remarks: '',
    teacherName: '',
  });

  const getRegistrationTypeBadge = (registrationType) => {
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

  const getPaymentStatusBadge = (isPaid) => {
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

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateStatus({ userId: user._id, status: newStatus }).unwrap();
      setSuccessMsg(`User status updated to ${newStatus}`);
      onUpdate();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error?.data?.message || 'Failed to update status');
    }
  };

  const handleBlockToggle = async () => {
    try {
      await updateBlock({ userId: user._id, isBlocked: !user.isBlocked }).unwrap();
      setSuccessMsg(user.isBlocked ? 'User unblocked' : 'User blocked');
      onUpdate();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error?.data?.message || 'Failed to update block status');
    }
  };

  const handlePaymentUpdate = async (newStatus) => {
    try {
      await updatePayment({ userId: user._id, paymentStatus: newStatus }).unwrap();
      setSuccessMsg(`Payment status updated to ${newStatus}`);
      onUpdate();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error?.data?.message || 'Failed to update payment status');
    }
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProgress({
        userId: user._id,
        progressData: progressForm,
      }).unwrap();
      setSuccessMsg('Progress updated successfully');
      setProgressForm({
        status: '',
        timing: '',
        lesson: '',
        performance: '',
        remarks: '',
      });
      onUpdate();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error?.data?.message || 'Failed to update progress');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">User Details</h2>
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-green-50 border-l-4 border-green-500 rounded flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-600 text-sm">{successMsg}</p>
          </div>
        )}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-600 text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-6">
            {['details', 'progress'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-4 font-medium border-b-2 transition ${activeTab === tab
                  ? 'text-primary border-primary'
                  : 'text-gray-600 border-transparent hover:text-primary'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'details' && (
            <>
              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <p className="text-gray-900">{user.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <p className="text-gray-900">{user.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Type</label>
                  <div className="flex items-center gap-2">
                    {getRegistrationTypeBadge(user.registrationType)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Status</label>
                  <div className="flex items-center gap-2">
                    {getPaymentStatusBadge(user.isPaid)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 border-t pt-6">
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>

                <div className='grid grid-cols-1 md:grid-cols-2 items-center'>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Registration Status</p>
                    <div className="flex gap-2 flex-wrap">
                      {['register', 'form', 'plan'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(status)}
                          className={`px-4 py-2 rounded-lg font-medium transition text-sm ${user.status === status
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <div className="flex gap-2">
                      {['paid', 'unpaid'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handlePaymentUpdate(status)}
                          className={`px-4 py-2 rounded-lg font-medium transition text-sm ${user.paymentStatus === status
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    onClick={handleBlockToggle}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${user.isBlocked
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                  >
                    {user.isBlocked ? (
                      <>
                        <Unlock className="w-4 h-4" />
                        Unblock User
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Block User
                      </>
                    )}
                  </button>
                </div>

              </div>
            </>
          )}

          {activeTab === 'progress' && (
            <>
              {/* Current Progress */}
              {progressData?.data && progressData.data.length > 0 ? (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">User Progress History</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {progressData.data.map((progress, index) => (
                      <div key={progress._id || index} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-semibold text-gray-800">{progress.lesson || 'Lesson'}</h5>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(progress.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            progress.status?.toLowerCase() === 'active' || progress.status?.toLowerCase() === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {progress.status || 'N/A'}
                          </span>
                        </div>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-600"><span className="font-semibold">Timing:</span> {progress.timing || 'N/A'}</p>
                            <p className="text-gray-600"><span className="font-semibold">Performance:</span> {progress.performance || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600"><span className="font-semibold">Teacher:</span> {progress.teacherName || user.name || 'N/A'}</p>
                          </div>
                        </div>
                        {progress.remarks && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-sm text-gray-700"><span className="font-semibold">Remarks:</span> {progress.remarks}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
                  <p className="text-gray-600">No progress records found for this user</p>
                  <p className="text-gray-500 text-sm mt-1">Add the first progress record using the form below</p>
                </div>
              )}

              {/* Update Progress Form */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Add New Progress Record</h4>
                <form onSubmit={handleProgressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={progressForm.status}
                        onChange={(e) =>
                          setProgressForm({ ...progressForm, status: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      >
                        <option value="">Select Status</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">late</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="completed">Completed</option>
                        <option value="hold">On Hold</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Timing
                      </label>
                      <input
                        type="text"
                        value={progressForm.timing}
                        onChange={(e) =>
                          setProgressForm({ ...progressForm, timing: e.target.value })
                        }
                        placeholder="e.g., Morning, Evening"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Lesson
                    </label>
                    <input
                      type="text"
                      value={progressForm.lesson}
                      onChange={(e) =>
                        setProgressForm({ ...progressForm, lesson: e.target.value })
                      }
                      placeholder="e.g., Surah Al-Fatiha, Arabic Alphabet"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Performance
                      </label>
                      <select
                        value={progressForm.performance}
                        onChange={(e) =>
                          setProgressForm({ ...progressForm, performance: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      >
                        <option value="">Select Performance</option>
                        <option value="excellent">Excellent</option>
                        <option value="improving">Improving</option>
                        <option value="good">Good</option>
                        <option value="average">Average</option>
                        <option value="needs_work">Needs Work</option>
                        <option value="below_average">Below Average</option>
                        <option value="poor">Poor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Teacher Name
                      </label>
                      <input
                        type="text"
                        value={progressForm.teacherName || ''}
                        onChange={(e) =>
                          setProgressForm({ ...progressForm, teacherName: e.target.value })
                        }
                        placeholder="Enter teacher name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
                    <textarea
                      value={progressForm.remarks}
                      onChange={(e) => setProgressForm({ ...progressForm, remarks: e.target.value })}
                      placeholder="Add detailed remarks about the user's progress..."
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-secondary transition flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Update Progress
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
