import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, useTheme } from '@mui/material';
import { Logout as LogoutIcon, Menu as MenuIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';

const AdminLayout = () => {
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
          <Sidebar role="admin" />
        </Box>
      )}
      
      <Box sx={{ flexGrow: 1, ml: 0 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 2,
          bgcolor: '#fff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          borderRadius: '0 0 15px 15px',
          mx: 2,
          mt: 1,
        }}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton 
              onClick={toggleSidebar} 
              sx={{ 
                bgcolor: '#f0f2f5',
                borderRadius: 2,
                '&:hover': { bgcolor: '#e0e0e0' }
              }}
            >
              {sidebarOpen ? <ChevronRightIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
          
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ 
              borderRadius: 3,
              textTransform: 'none',
              px: 3,
              boxShadow: 'none',
              '&:hover': { boxShadow: '0 2px 8px rgba(244,67,54,0.3)' }
            }}
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