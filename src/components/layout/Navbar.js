// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Avatar, 
  IconButton, 
  Badge,
  Button,
  Chip,
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  ChevronRight as ChevronRightIcon,
  Logout as LogoutIcon, 
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const Navbar = ({ toggleSidebar, sidebarOpen, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const getPageTitle = () => {
    const path = location.pathname.split('/')[2] || 'dashboard';
    const titles = {
      '': 'لوحة التحكم',
      'dashboard': 'لوحة التحكم',
      'announcements': 'الإعلانات',
      'add-user': 'إضافة مستخدم',
      'polls': 'الاستبيانات',
      'reports': 'التقارير',
      'weekly-program': 'البرنامج الأسبوعي',
      'complaints': 'الشكاوى',
      'halls': 'القاعات',
      'notifications': 'الإشعارات',
      'points': 'نقاط الطالب',
      'exams': 'برنامج الامتحانات',
    };
    return titles[path] || 'لوحة التحكم';
  };

  const role = user?.role || 'admin';
  const roleName = {
    admin: 'مدير',
    teacher: 'أستاذ',
    student: 'طالب',
    parent: 'ولي أمر',
  }[role] || 'مستخدم';

  const notifications = [
    { title: 'شكوى جديدة', message: 'لديك شكوى جديدة', color: '#f44336' },
    { title: 'تحديث النقاط', message: 'تم تحديث نقاط الطلاب', color: '#ff9800' },
  ];

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, #1a4a6f 0%, #0f2b3d 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: 0,
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        py: 1,
        px: { xs: 2, md: 4 },
      }}>
        {/* الجهة اليمنى */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton 
            onClick={toggleSidebar} 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.1)',
              borderRadius: 1,
              transition: 'all 0.3s ease',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            {sidebarOpen ? <ChevronRightIcon sx={{ color: '#fff' }} /> : <MenuIcon sx={{ color: '#fff' }} />}
          </IconButton>
          
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
            {getPageTitle()}
          </Typography>

          <Chip
            label={roleName}
            size="small"
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.15)',
              color: '#fff',
              fontWeight: 500,
              borderRadius: 1,
            }}
          />
        </Box>

        {/* الجهة اليسرى */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.1)',
              borderRadius: 1,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon sx={{ color: '#fff' }} />
            </Badge>
          </IconButton>

          <Box display="flex" alignItems="center" gap={1.5}>
            <Typography variant="body2" sx={{ color: '#e0e7ff' }}>
              مرحباً {user?.name || 'مستخدم'}
            </Typography>
            <Avatar sx={{ 
              width: 36, 
              height: 36, 
              bgcolor: '#2563eb',
            }}>
              {user?.name?.charAt(0) || 'م'}
            </Avatar>
          </Box>

          <Button
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ 
              borderRadius: 1,
              textTransform: 'none',
              px: 2.5,
              py: 0.8,
              bgcolor: '#dc2626',
              '&:hover': { 
                bgcolor: '#b91c1c',
              },
            }}
          >
            تسجيل الخروج
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;