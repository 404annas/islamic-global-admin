import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = '/api/v1';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('adminAccessToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Progress', 'Analytics', 'Admin'],
  endpoints: (builder) => ({
    // Authentication
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Get admin profile
    getAdminProfile: builder.query({
      query: () => '/admin/profile',
      providesTags: ['Admin'],
    }),

    // Update admin profile
    updateAdminProfile: builder.mutation({
      query: (profileData) => ({
        url: '/admin/profile',
        method: 'PATCH',
        body: profileData,
      }),
      invalidatesTags: ['Admin'],
    }),

    // Change admin password
    changeAdminPassword: builder.mutation({
      query: (passwordData) => ({
        url: '/admin/change-password',
        method: 'PATCH',
        body: passwordData,
      }),
    }),

    // Delete admin account
    deleteAdminAccount: builder.mutation({
      query: (passwordData) => ({
        url: '/admin/delete-account',
        method: 'DELETE',
        body: passwordData,
      }),
    }),

    // Get all users
    listAllUsers: builder.query({
      query: ({ page = 1, limit = 10, search = '', status = '', paymentStatus = '', registrationType = '' }) => ({
        url: '/admin/users',
        params: { page, limit, search, status, paymentStatus, registrationType },
      }),
      providesTags: ['User'],
    }),

    // Get user details
    getUserDetails: builder.query({
      query: (userId) => `/admin/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),

    // Update user status
    updateUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/admin/users/${userId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['User', 'Analytics'],
    }),

    // Block/Unblock user
    updateBlockStatus: builder.mutation({
      query: ({ userId, isBlocked }) => ({
        url: `/admin/users/${userId}/block`,
        method: 'PATCH',
        body: { isBlocked },
      }),
      invalidatesTags: ['User', 'Analytics'],
    }),

    // Update payment status
    updatePaymentStatus: builder.mutation({
      query: ({ userId, paymentStatus }) => ({
        url: `/admin/users/${userId}/payment`,
        method: 'PATCH',
        body: { paymentStatus },
      }),
      invalidatesTags: ['User'],
    }),

    // Get user progress
    getUserProgress: builder.query({
      query: (userId) => `/admin/users/${userId}/progress`,
      providesTags: (result, error, userId) => [{ type: 'Progress', id: userId }],
    }),

    // Create/Update progress report
    createProgressReport: builder.mutation({
      query: ({ userId, progressData }) => ({
        url: `/admin/users/${userId}/progress`,
        method: 'POST',
        body: progressData,
      }),
      invalidatesTags: ['Progress', 'Analytics'],
    }),

    // Get admin analytics
    getAnalytics: builder.query({
      query: () => '/admin/analytics',
      providesTags: ['Analytics'],
    }),

    // Get dashboard stats
    getDashboardStats: builder.query({
      query: () => '/admin/dashboard/stats',
      providesTags: ['Analytics'],
    }),

    // Get admin analytics (duplicate - removing to avoid confusion)
    // getAdminAnalytics: builder.query({
    //   query: () => '/admin/analytics',
    //   providesTags: ['Analytics'],
    // }),

    // Logout
    adminLogout: builder.mutation({
      query: () => ({
        url: '/admin/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useChangeAdminPasswordMutation,
  useDeleteAdminAccountMutation,
  useListAllUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserStatusMutation,
  useUpdateBlockStatusMutation,
  useUpdatePaymentStatusMutation,
  useGetUserProgressQuery,
  useCreateProgressReportMutation,
  useGetAnalyticsQuery,
  useGetDashboardStatsQuery,
  useAdminLogoutMutation,
} = adminApi;
