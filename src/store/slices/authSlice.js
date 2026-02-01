import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: null,
  isAuthenticated: !!localStorage.getItem('adminAccessToken'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
      state.isAuthenticated = true;
    },
    clearAdmin: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminRefreshToken');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setAdmin, clearAdmin, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
