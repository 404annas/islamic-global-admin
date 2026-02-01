import { configureStore } from '@reduxjs/toolkit';
import { adminApi } from './api/adminApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    [adminApi.reducerPath]: adminApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware),
});
