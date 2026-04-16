// src/components/layout/Sidebar.jsx
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
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnnouncementIcon from '@mui/icons-material/Campaign';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PollIcon from '@mui/icons-material/Poll';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import StarIcon from '@mui/icons-material/Star';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotificationImportantIcon from '@mui/icons-material/Notifications';
import ScoreIcon from '@mui/icons-material/Score';
import PaymentIcon from '@mui/icons-material/Payment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

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
    { text: 'القاعات الامتحانية', path: 'exam-halls', icon: <MeetingRoomIcon /> },
    { text: 'الإشعارات', path: 'notifications', icon: <NotificationImportantIcon /> },
  ];

  const teacherItems = [
    { text: 'لوحة التحكم', path: '', icon: <DashboardIcon /> },
    { text: 'جدولي', path: 'my-schedule', icon: <CalendarMonthIcon /> },
    { text: 'ملاحظات الطلاب', path: 'notes', icon: <NoteAddIcon /> },
    { text: 'نماذج امتحانية', path: 'exam-models', icon: <MenuBookIcon /> },
    { text: 'إعلان اختبار', path: 'announce-test', icon: <CalendarMonthIcon /> },
    { text: 'الاستفسارات', path: 'inquiries', icon: <QuestionAnswerIcon /> },
  ];

  const studentItems = [
    { text: 'لوحة التحكم', path: '', icon: <DashboardIcon /> },
    { text: 'برنامجي', path: 'my-schedule', icon: <CalendarMonthIcon /> },
    { text: 'الدرجات', path: 'grades', icon: <ScoreIcon /> },
    { text: 'الأقساط', path: 'installments', icon: <PaymentIcon /> },
    { text: 'الشكاوى', path: 'complaints', icon: <ReportProblemIcon /> },
    { text: 'الاستبيانات', path: 'surveys', icon: <PollIcon /> },
    { text: 'النقاط', path: 'points', icon: <StarIcon /> },
    { text: 'الإشعارات', path: 'notifications', icon: <NotificationImportantIcon /> },
  ];

  let items = [];
  if (role === 'admin') items = adminItems;
  else if (role === 'teacher') items = teacherItems;
  else items = studentItems;

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
          backgroundColor: '#1976d2', // أزرق فاتح (الأساسي)
          backgroundImage: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', // تدرج أزرق
          color: '#fff',
          borderRight: 'none',
        },
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
          منصة إجابتي
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)' }}>
          نظام إدارة المعاهد
        </Typography>
      </Box>

      <List sx={{ mt: 2 }}>
        {items.map((item) => {
          const to = `/${role}${item.path ? '/' + item.path : ''}`;
          const selected = currentPath === to;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={selected}
                onClick={() => navigate(to)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: selected ? 'bold' : 'normal' }} 
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