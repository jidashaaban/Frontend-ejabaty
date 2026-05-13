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
  CircularProgress,
  Avatar,
  Grid,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getTeacherNotifications, markTeacherNotificationAsRead } from '../../services/teacherService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const TeacherNotifications = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getTeacherNotifications();
      console.log(' الإشعارات المستلمة:', data);
      
      let notificationsArray = [];
      if (Array.isArray(data)) {
        notificationsArray = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        notificationsArray = data.data;
      } else if (data && data.notifications && Array.isArray(data.notifications)) {
        notificationsArray = data.notifications;
      }
      
      const formattedNotifications = notificationsArray.map(notif => ({
        id: notif.id,
        title: notif.title || notif.data?.title || 'إشعار جديد',
        message: notif.message || notif.data?.message || '',
        date: notif.created_at ? new Date(notif.created_at).toLocaleDateString('ar-EG') : '',
        time: notif.created_at ? new Date(notif.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '',
        read: notif.read_at !== null,
      }));
      
      setNotifications(formattedNotifications);
      
    } catch (error) {
      console.error(' خطأ في جلب الإشعارات:', error);
      setToast({ open: true, message: 'فشل في جلب الإشعارات', severity: 'error' });
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await markTeacherNotificationAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
      } catch (error) {
        console.error('خطأ في تحديث حالة الإشعار:', error);
      }
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
                  backgroundColor: notification.read ? '#fff' : '#f5f5f5',
                  borderRight: `4px solid ${notification.read ? '#9e9e9e' : '#1976d2'}`,
                  '&:hover': {
                    transform: 'translateX(-5px)',
                    boxShadow: 3,
                  },
                }}
              >
                <ListItemButton onClick={() => handleNotificationClick(notification)} sx={{ p: 2 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: notification.read ? '#9e9e9e' : '#1976d2' }}>
                      <NotificationsIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        <Typography variant="subtitle1" sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
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
                        {notification.date && (
                          <Typography variant="caption" color="text.secondary">
                            {notification.date} {notification.time && `- ${notification.time}`}
                          </Typography>
                        )}
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