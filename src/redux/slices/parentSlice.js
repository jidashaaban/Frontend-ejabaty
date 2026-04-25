// src/redux/slices/parentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  complaints: [],
  loading: false,
  error: null,
};

const parentSlice = createSlice({
  name: 'parent',
  initialState,
  reducers: {
    setComplaints: (state, action) => {
      state.complaints = action.payload;
    },
    addComplaint: (state, action) => {
      state.complaints.unshift(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setComplaints, addComplaint, setLoading, setError } = parentSlice.actions;
export default parentSlice.reducer;