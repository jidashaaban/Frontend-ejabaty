import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import teacherReducer from './slices/teacherSlice';
import studentReducer from './slices/studentSlice';
import parentReducer from './slices/parentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    teacher: teacherReducer,
    student: studentReducer,
    parent: parentReducer,
  },
});

export default store;