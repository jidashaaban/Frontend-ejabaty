// src/components/layout/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Button, IconButton } from '@mui/material';
import { Logout as LogoutIcon, Menu as MenuIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * تخطيط لوحة الإدارة
 * يتكون من شريط جانبي وشريط علوي ومحتوى.
 */
const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // دالة تبديل حالة الـ Sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // دالة تسجيل الخروج والعودة إلى صفحة تسجيل الدخول
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', direction: 'rtl', minHeight: '100vh' }}>
      {/* Sidebar - يظهر ويختفي حسب الحالة */}
      {sidebarOpen && (
        <Box sx={{ transition: '0.3s' }}>
          <Sidebar role="admin" />
        </Box>
      )}
      
      <Box sx={{ flexGrow: 1, ml: 0 }}>
        {/* شريط علوي يحتوي على زر القائمة وزر تسجيل الخروج */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          bgcolor: '#fff',
        }}>
          <Box display="flex" alignItems="center" gap={1}>
            {/* زر إظهار/إخفاء القائمة الجانبية */}
            <IconButton 
              onClick={toggleSidebar} 
              color="primary"
              sx={{ 
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              {sidebarOpen ? <ChevronRightIcon /> : <MenuIcon />}
            </IconButton>
            <Navbar />
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ borderRadius: 2 }}
          >
            تسجيل الخروج
          </Button>
        </Box>
        
        <Box component="main" sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;