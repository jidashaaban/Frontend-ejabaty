// src/components/layout/ParentLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography, Avatar, Menu, MenuItem } from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronRight as ChevronRightIcon,
  Logout as LogoutIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';

const ParentLayout = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', direction: 'rtl', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {sidebarOpen && (
        <Box sx={{ transition: '0.3s' }}>
          <Sidebar role="parent" />
        </Box>
      )}

      <Box sx={{ flexGrow: 1, ml: 0 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            bgcolor: '#fff',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            borderRadius: '0 0 15px 15px',
            mx: 2,
            mt: 1,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              onClick={toggleSidebar}
              sx={{
                bgcolor: '#f0f2f5',
                borderRadius: 2,
                '&:hover': { bgcolor: '#e0e0e0' },
              }}
            >
              {sidebarOpen ? <ChevronRightIcon /> : <MenuIcon />}
            </IconButton>
            <SchoolIcon sx={{ color: '#1976d2' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              منصة إجابتي - ولي الأمر
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" sx={{ color: '#555' }}>
              مرحباً {user?.name || 'ولي أمر'}
            </Typography>
            <Avatar
              onClick={handleMenu}
              sx={{ width: 35, height: 35, bgcolor: '#1976d2', cursor: 'pointer' }}
            >
              {user?.name?.charAt(0) || 'و'}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ ml: 1 }} />
                تسجيل الخروج
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <Box component="main" sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default ParentLayout;