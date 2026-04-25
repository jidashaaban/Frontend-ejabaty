// src/pages/Parent/ParentNotifications.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
  Grid,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Star as StarIcon,
  EventNote as EventNoteIcon,
  Reply as ReplyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const ParentNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // بيانات تجريبية للإشعارات
    const notificationsList = [
      {
        id: 1,
        type: 'points',
        title: 'نقاط جديدة',
        message: 'تم إضافة 15 نقطة للطالب أحمد محمد',
        date: '2026-04-25',
        time: '10:30',
        icon: <StarIcon />,
        color: '#ff9800',
        bgColor: '#fff3e0',
        action: '/parent/points',
        actionText: 'الذهاب إلى نقاط الطالب',
        read: false,
      },
      {
        id: 2,
        type: 'exam',
        title: 'برنامج امتحان جديد',
        message: 'تم إضافة امتحان جديد في مادة الرياضيات بتاريخ 2026-04-27',
        date: '2026-04-24',
        time: '14:15',
        icon: <EventNoteIcon />,
        color: '#1976d2',
        bgColor: '#e3f2fd',
        action: '/parent/exams',
        actionText: 'الذهاب إلى برنامج الامتحانات',
        read: false,
      },
      {
        id: 3,
        type: 'complaint',
        title: 'تم الرد على شكواك',
        message: 'تم الرد على شكواك بخصوص تأخر المواصلات المدرسية',
        date: '2026-04-23',
        time: '09:45',
        icon: <ReplyIcon />,
        color: '#4caf50',
        bgColor: '#e8f5e9',
        action: '/parent/complaints',
        actionText: 'الذهاب إلى الشكاوى',
        read: true,
      },
    ];
    setNotifications(notificationsList);
    setLoading(false);
  }, []);

  const handleNotificationClick = (notification) => {
    if (notification.action) {
      navigate(notification.action);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={50} />
        <Typography sx={{ mr: 2 }}>جاري تحميل الإشعارات...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="الإشعارات"
        subtitle="آخر التحديثات والإشعارات الخاصة بابنك"
        icon={<NotificationsIcon sx={{ fontSize: 20 }} />}
      />

      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Badge badgeContent={unreadCount} color="error">
          <Chip
            label={`${unreadCount} إشعار غير مقروء`}
            size="small"
            sx={{ bgcolor: unreadCount > 0 ? '#ff9800' : '#e0e0e0', color: unreadCount > 0 ? '#fff' : '#666' }}
          />
        </Badge>
      </Box>

      {notifications.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 4 }}>
          <NotificationsIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">لا توجد إشعارات حالياً</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {notifications.map((notification) => (
            <Grid item xs={12} key={notification.id}>
              <Paper
                sx={{
                  borderRadius: 3,
                  transition: '0.3s',
                  backgroundColor: notification.read ? '#fff' : notification.bgColor,
                  borderRight: `4px solid ${notification.color}`,
                  '&:hover': { transform: 'translateX(-5px)', boxShadow: 3 },
                }}
              >
                <ListItemButton onClick={() => handleNotificationClick(notification)} sx={{ p: 2 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: notification.color }}>{notification.icon}</Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1" sx={{ fontWeight: notification.read ? 'normal' : 'bold', color: notification.color }}>
                          {notification.title}
                        </Typography>
                        {!notification.read && <Chip label="جديد" size="small" color="error" sx={{ height: 20 }} />}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {notification.message}
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                          <Typography variant="caption" color="text.secondary">
                            {notification.date} - {notification.time}
                          </Typography>
                          <Chip label={notification.actionText} size="small" sx={{ bgcolor: notification.color, color: '#fff' }} />
                        </Box>
                      </Box>
                    }
                  />
                </ListItemButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Toast open={toast.open} onClose={() => setToast({ ...toast, open: false })} message={toast.message} severity={toast.severity} />
    </Box>
  );
};

export default ParentNotifications;