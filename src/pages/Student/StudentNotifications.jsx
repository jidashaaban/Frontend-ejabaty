import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Button,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  Poll as PollIcon,
  School as SchoolIcon,
  EmojiEvents as EmojiEventsIcon,
  Announcement as AnnouncementIcon,
  DoneAll as DoneAllIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';
import { getNotifications, markNotificationAsRead } from '../../services/studentService';

function StudentNotifications() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      console.log(' الإشعارات (الخام):', data);
      
      let notificationsArray = [];
      let count = 0;

      const parseNotification = (n) => ({
        id:           n.id,
        title:        n.data?.title        || n.data?.subject || n.title        || 'إشعار جديد',
        message:      n.data?.message      || n.data?.body    || n.message      || '',
        type:         n.data?.type         || n.type          || 'info',
        created_at:   n.created_at,
        read_at:      n.read_at,
        is_read:      n.read_at !== null,
      });

      if (data?.notifications && Array.isArray(data.notifications)) {
        notificationsArray = data.notifications.map(parseNotification);
      } else if (Array.isArray(data)) {
        notificationsArray = data.map(parseNotification);
      } else if (data?.data && Array.isArray(data.data)) {
        notificationsArray = data.data.map(parseNotification);
      }
      
      if (data?.unread_count !== undefined) {
        count = data.unread_count;
      } else {
        count = notificationsArray.filter(n => !n.read_at && !n.is_read).length;
      }
      
      setNotifications(notificationsArray);
      setUnreadCount(count);
      console.log(' الإشعارات بعد المعالجة:', notificationsArray.length);
    } catch (error) {
      console.error('❌ خطأ في جلب الإشعارات:', error);
      setToast({ open: true, message: 'فشل في جلب الإشعارات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('خطأ في تحديث الإشعار:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.is_read);
    if (unreadNotifications.length === 0) {
      setToast({ open: true, message: 'لا توجد إشعارات غير مقروءة', severity: 'info' });
      return;
    }
    
    try {
      for (const notification of unreadNotifications) {
        await markNotificationAsRead(notification.id);
      }
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
      setToast({ open: true, message: 'تم تحديث جميع الإشعارات كمقروءة', severity: 'success' });
    } catch (error) {
      console.error('خطأ في تحديث الإشعارات:', error);
      setToast({ open: true, message: 'فشل في تحديث بعض الإشعارات', severity: 'error' });
    }
  };

  const getNotificationIcon = (type) => {
    if (type === 'exam' || type === 'schedule') {
      return <EventIcon sx={{ color: '#ff9800' }} />;
    }
    if (type === 'poll') {
      return <PollIcon sx={{ color: '#9c27b0' }} />;
    }
    if (type === 'correction') {
      return <CheckCircleIcon sx={{ color: '#4caf50' }} />;
    }
    if (type === 'points') {
      return <EmojiEventsIcon sx={{ color: '#ffc107' }} />;
    }
    if (type === 'quiz') {
      return <AssignmentIcon sx={{ color: '#f44336' }} />;
    }
    return <NotificationsIcon sx={{ color: '#1976d2' }} />;
  };

  const getIconColor = (type) => {
    if (type === 'exam' || type === 'schedule') return '#ff9800';
    if (type === 'poll') return '#9c27b0';
    if (type === 'correction') return '#4caf50';
    if (type === 'points') return '#ffc107';
    if (type === 'quiz') return '#f44336';
    return '#1976d2';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    
    return date.toLocaleDateString('ar', { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل الإشعارات...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader 
        title="الإشعارات"
        subtitle="آخر التحديثات والإشعارات"
        icon={<NotificationsIcon sx={{ fontSize: 20 }} />}
      />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: 12,
              height: 20,
              minWidth: 20,
            }
          }}
        >
          <Chip 
            label={`${unreadCount} إشعار غير مقروء`}
            size="small"
            sx={{ bgcolor: unreadCount > 0 ? '#e3f2fd' : '#f5f5f5', color: '#1976d2' }}
          />
        </Badge>
        
        {notifications.length > 0 && (
          <Tooltip title="تحديد الكل كمقروء">
            <Button
              size="small"
              startIcon={<DoneAllIcon />}
              onClick={handleMarkAllAsRead}
              sx={{ textTransform: 'none', color: '#1976d2' }}
            >
              تحديد الكل كمقروء
            </Button>
          </Tooltip>
        )}
      </Box>

      {notifications.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3, bgcolor: '#f8f9fa' }}>
          <NotificationsIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">لا توجد إشعارات</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            ستظهر الإشعارات الجديدة هنا
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => {
              const isUnread = !notification.read_at && !notification.is_read;
              const iconColor = getIconColor(notification.type);
              
              return (
                <React.Fragment key={notification.id || index}>
                  <ListItem
                    disablePadding
                    sx={{
                      backgroundColor: isUnread ? '#e3f2fd' : 'transparent',
                      transition: '0.3s',
                      '&:hover': {
                        backgroundColor: isUnread ? '#bbdef5' : '#f5f5f5',
                      },
                    }}
                  >
                    <ListItemButton onClick={() => markAsRead(notification.id)}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: `${iconColor}20`, color: iconColor, width: 40, height: 40 }}>
                          {getNotificationIcon(notification.type)}
                        </Avatar>
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ fontWeight: isUnread ? 'bold' : 'normal', color: '#1565c0' }}
                              >
                                {notification.title}
                              </Typography>
                              {isUnread && (
                                <Chip
                                  label="جديد"
                                  size="small"
                                  color="error"
                                  sx={{ height: 20, fontSize: '0.65rem' }}
                                />
                              )}
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(notification.created_at)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                              {notification.message}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        </Paper>
      )}

      {notifications.length > 0 && unreadCount === 0 && (
        <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
          جميع الإشعارات مقروءة
        </Alert>
      )}

      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </Box>
  );
}

export default StudentNotifications;