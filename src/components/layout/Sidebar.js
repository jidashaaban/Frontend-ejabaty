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
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import StarIcon from '@mui/icons-material/Star';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotificationImportantIcon from '@mui/icons-material/Notifications';
import ScoreIcon from '@mui/icons-material/Score';
import PaymentIcon from '@mui/icons-material/Payment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SchoolIcon from '@mui/icons-material/School';
import EventNoteIcon from '@mui/icons-material/EventNote';

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
    { text: 'الإشعارات', path: 'notifications', icon: <NotificationImportantIcon /> },
    { text: 'القاعات', path: 'halls', icon: <MeetingRoomIcon /> },
  ];

  const teacherItems = [
    { text: 'لوحة التحكم', path: '', icon: <DashboardIcon /> },
    { text: 'جدولي', path: 'schedule', icon: <CalendarMonthIcon /> },
    { text: 'تقييم الطلاب', path: 'evaluations', icon: <AssessmentIcon /> },
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

  const parentItems = [
    { text: 'لوحة التحكم', path: '', icon: <DashboardIcon /> },
    { text: 'تقديم شكوى', path: 'complaints', icon: <ReportProblemIcon /> },
    { text: 'تقييم الطالب', path: 'points', icon: <StarIcon /> },
    { text: 'برنامج الامتحانات', path: 'exams', icon: <EventNoteIcon /> },
    { text: 'الإشعارات', path: 'notifications', icon: <NotificationImportantIcon /> },
  ];

  let items = [];
  if (role === 'admin') items = adminItems;
  else if (role === 'teacher') items = teacherItems;
  else if (role === 'student') items = studentItems;
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
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <Avatar sx={{ 
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          width: 40, 
          height: 40,
        }}>
          <SchoolIcon sx={{ color: '#fff' }} />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
            منصة إجابتي
          </Typography>
          <Typography variant="caption" sx={{ color: '#93c5fd' }}>
            {role === 'admin' ? 'لوحة التحكم' : role === 'teacher' ? 'الأستاذ' : role === 'student' ? 'الطالب' : 'ولي الأمر'}
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