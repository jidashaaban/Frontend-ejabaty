// src/components/layout/Sidebar.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnnouncementIcon from '@mui/icons-material/Campaign';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PollIcon from '@mui/icons-material/Poll';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SchoolIcon from '@mui/icons-material/School';

const Sidebar = ({ role, drawerWidth = 260 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const adminItems = [
    { text: 'لوحة التحكم', path: '', icon: <DashboardIcon /> },
    { text: 'الإعلانات', path: 'announcements', icon: <AnnouncementIcon /> },
    { text: 'إضافة مستخدم', path: 'add-user', icon: <PersonAddIcon /> },
    { text: 'الاستبيانات', path: 'polls', icon: <PollIcon /> },
    { text: 'التقارير', path: 'reports', icon: <AssessmentIcon /> },
    { text: 'البرنامج الأسبوعي', path: 'weekly-program', icon: <CalendarMonthIcon /> },
    { text: 'الشكاوى', path: 'complaints', icon: <ReportProblemIcon /> },
    { text: 'الإشعارات', path: 'notifications', icon: <NotificationsIcon /> },
    { text: 'القاعات', path: 'halls', icon: <MeetingRoomIcon /> },
  ];

  const parentItems = [
    { text: 'لوحة التحكم', path: '', icon: <DashboardIcon /> },
    { text: 'تقديم شكوى', path: 'complaints', icon: <ReportProblemIcon /> },
    { text: 'نقاط الطالب', path: 'points', icon: <SchoolIcon /> },
    { text: 'برنامج الامتحانات', path: 'exams', icon: <CalendarMonthIcon /> },
    { text: 'الإشعارات', path: 'notifications', icon: <NotificationsIcon /> },
  ];

  let items = [];
  if (role === 'admin') items = adminItems;
  else if (role === 'parent') items = parentItems;

  const currentPath = location.pathname;

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #0f2b3d 0%, #1a4a6f 50%, #0f2b3d 100%)',
          color: '#e0e7ff',
          borderRight: 'none',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
          borderRadius: 0,
        },
      }}
    >
      {/* Logo Area */}
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <Avatar sx={{ 
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          width: 42, 
          height: 42,
        }}>
          <SchoolIcon sx={{ color: '#fff' }} />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
            منصة إجابتي
          </Typography>
          <Typography variant="caption" sx={{ color: '#93c5fd' }}>
            {role === 'admin' ? 'لوحة التحكم' : 'ولي الأمر'}
          </Typography>
        </Box>
      </Box>

      <List sx={{ mt: 2, px: 2 }}>
        {items.map((item) => {
          const to = `/${role}${item.path ? '/' + item.path : ''}`;
          const selected = currentPath === to;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={selected}
                onClick={() => navigate(to)}
                sx={{
                  borderRadius: 0,
                  py: 1.2,
                  px: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(59,130,246,0.2)',
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
                    color: '#fff',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #1d4ed8 0%, #1e3a8a 100%)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#fff',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: selected ? '#fff' : '#93c5fd', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: '0.9rem', 
                    fontWeight: selected ? 600 : 400,
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;