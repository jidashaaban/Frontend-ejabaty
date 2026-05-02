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
  EventNote as EventNoteIcon,
  QuestionAnswer as QuestionAnswerIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getTeacherNotifications, markNotificationAsRead } from '../../services/teacherService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const TeacherNotifications = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await getTeacherNotifications(user?.id || 1);
        setNotifications(data);
      } catch (error) {
        console.error('خطأ في جلب الإشعارات:', error);
        setNotifications([
          {
            id: 1,
            type: 'exam',
            title: 'برنامج امتحان جديد',
            message: 'تم إضافة امتحان جديد في مادة الرياضيات بتاريخ 2026-05-10',
            date: '2026-04-28',
            time: '10:30',
            icon: <EventNoteIcon />,
            color: '#1976d2',
            bgColor: '#e3f2fd',
            action: '/teacher/exams',
            actionText: 'الذهاب إلى جدول الامتحانات',
            read: false,
          },
          {
            id: 2,
            type: 'inquiry',
            title: 'استفسار جديد من طالب',
            message: 'لديك استفسار جديد من الطالب أحمد محمد بخصوص مادة الرياضيات',
            date: '2026-04-27',
            time: '14:15',
            icon: <QuestionAnswerIcon />,
            color: '#ff9800',
            bgColor: '#fff3e0',
            action: '/teacher/inquiries',
            actionText: 'الذهاب إلى الاستفسارات',
            read: false,
          },
          {
            id: 3,
            type: 'exam',
            title: 'تحديث في جدول الامتحانات',
            message: 'تم تعديل موعد امتحان مادة الفيزياء إلى 2026-05-15',
            date: '2026-04-26',
            time: '09:45',
            icon: <ScheduleIcon />,
            color: '#4caf50',
            bgColor: '#e8f5e9',
            action: '/teacher/exams',
            actionText: 'الذهاب إلى جدول الامتحانات',
            read: true,
          },
          {
            id: 4,
            type: 'inquiry',
            title: 'استفسار جديد من طالب',
            message: 'لديك استفسار جديد من الطالبة سارة خالد بخصوص مادة الفيزياء',
            date: '2026-04-25',
            time: '11:00',
            icon: <QuestionAnswerIcon />,
            color: '#ff9800',
            bgColor: '#fff3e0',
            action: '/teacher/inquiries',
            actionText: 'الذهاب إلى الاستفسارات',
            read: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user?.id]);

  const handleNotificationClick = async (notification) => {
    if (notification.action) {
      if (!notification.read) {
        try {
          await markNotificationAsRead(notification.id);
          setNotifications(prev =>
            prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
          );
        } catch (error) {
          console.error('خطأ في تحديث حالة الإشعار:', error);
        }
      }
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
        subtitle="آخر التحديثات والإشعارات الخاصة بك"
        icon={<NotificationsIcon sx={{ fontSize: 20 }} />}
      />

      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 12, height: 20, minWidth: 20 } }}>
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
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            سيتم إشعارك عند وجود تحديثات جديدة
          </Typography>
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
                  '&:hover': {
                    transform: 'translateX(-5px)',
                    boxShadow: 3,
                  },
                }}
              >
                <ListItemButton onClick={() => handleNotificationClick(notification)} sx={{ p: 2 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: notification.color }}>
                      {notification.icon}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        <Typography variant="subtitle1" sx={{ fontWeight: notification.read ? 'normal' : 'bold', color: notification.color }}>
                          {notification.title}
                        </Typography>
                        {!notification.read && (
                          <Chip label="جديد" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem' }} />
                        )}
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
                          <Chip
                            label={notification.actionText}
                            size="small"
                            sx={{
                              bgcolor: notification.color,
                              color: '#fff',
                              '&:hover': { opacity: 0.9 },
                            }}
                          />
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

      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </Box>
  );
};

export default TeacherNotifications;