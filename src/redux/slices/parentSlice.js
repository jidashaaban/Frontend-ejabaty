import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  children: [],
  notifications: [],
  complaints: [],
};

const parentSlice = createSlice({
  name: 'parent',
  initialState,
  reducers: {
    setChildren: (state, action) => {
      state.children = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setComplaints: (state, action) => {
      state.complaints = action.payload;
    },
  },
});

export const { setChildren, setNotifications, setComplaints } = parentSlice.actions;
export default parentSlice.reducer;