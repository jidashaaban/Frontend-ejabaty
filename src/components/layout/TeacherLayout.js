import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * تخطيط لوحة الأستاذ
 */
const TeacherLayout = () => {
  return (
    <Box sx={{ display: 'flex', direction: 'rtl' }}>
      <Sidebar role="teacher" />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar />
        <Box component="main" sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default TeacherLayout;