// src/components/layout/ParentLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const ParentLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', direction: 'rtl', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {sidebarOpen && (
        <Box sx={{ transition: '0.3s ease' }}>
          <Sidebar role="parent" />   {/* ← parent وليس student */}
        </Box>
      )}
      
      <Box sx={{ flexGrow: 1, ml: 0 }}>
        <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} handleLogout={handleLogout} />
        <Box component="main" sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default ParentLayout;