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
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  ReportProblem as ReportProblemIcon,
  Poll as PollIcon,
  School as SchoolIcon,
  DoneAll as DoneAllIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  getRealNotifications,
  markNotificationAsRead,
} from '../../services/adminService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

function AdminNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getRealNotifications();
      console.log('🔔 الإشعارات المستلمة من API:', data);
      
      setUnreadCount(data.unread_count || 0);
      
      const formattedNotifications = (data.notifications || []).map(notification => ({
        id: notification.id,
        title: notification.data?.title || 'إشعار جديد',
        message: notification.data?.message || '',
        type: notification.data?.type || 'general',
        related_id: notification.data?.related_id,
        read_at: notification.read_at,
        created_at: notification.created_at,
        is_read: notification.read_at !== null,
      }));
      
      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('خطأ في جلب الإشعارات:', error);
      setToast({ open: true, message: 'فشل في جلب الإشعارات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getIconByType = (type) => {
    if (type === 'complaint' || type === 'new_complaint' || type.includes('complaint')) {
      return <ReportProblemIcon sx={{ color: '#f44336' }} />;
    }
    if (type === 'poll_result' || type === 'poll_completed' || type.includes('poll')) {
      return <PollIcon sx={{ color: '#4caf50' }} />;
    }
    if (type === 'course_join' || type === 'new_course_request' || type.includes('course')) {
      return <SchoolIcon sx={{ color: '#00bcd4' }} />;
    }
    return <NotificationsIcon sx={{ color: '#1976d2' }} />;
  };

  const handleNotificationClick = async (notification) => {
    console.log('📌 تم الضغط على إشعار:', notification);
    console.log('📌 نوع الإشعار:', notification.type);
    
    if (!notification.is_read) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('خطأ في تحديث الإشعار:', error);
      }
    }
    
    const type = notification.type;
    
    // شكاوى جديدة
    if (type === 'complaint' || type === 'new_complaint' || type.includes('complaint')) {
      navigate('/admin/complaints');
    }
    // نتائج استبيانات
    else if (type === 'poll_result' || type === 'poll_completed' || type.includes('poll')) {
      navigate('/admin/polls');
    }
    // طلب تسجيل في مادة
    else if (type === 'course_join' || type === 'new_course_request' || type.includes('course')) {
      navigate('/admin/courses');
    }
    // أي إشعار آخر
    else {
      navigate('/admin/dashboard');
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
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
      setToast({ open: true, message: 'تم تحديث جميع الإشعارات كمقروءة', severity: 'success' });
    } catch (error) {
      console.error('خطأ في تحديث الإشعارات:', error);
      setToast({ open: true, message: 'فشل في تحديث بعض الإشعارات', severity: 'error' });
    }
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
    return date.toLocaleDateString('ar-EG');
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

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
        subtitle="إشعارات الشكاوى وطلبات التسجيل ونتائج الاستبيانات"
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
          <Typography variant="h6" color="text.secondary">
            لا توجد إشعارات حالياً
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            ستظهر هنا الإشعارات عند وجود شكاوى جديدة أو طلبات تسجيل أو نتائج استبيانات
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <List>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  disablePadding
                  sx={{
                    backgroundColor: !notification.is_read ? '#e3f2fd' : 'transparent',
                    transition: '0.3s',
                    '&:hover': {
                      backgroundColor: !notification.is_read ? '#bbdef5' : '#f5f5f5',
                      cursor: 'pointer',
                    },
                  }}
                >
                  <ListItemButton onClick={() => handleNotificationClick(notification)}>
                    <ListItemIcon>
                      {getIconByType(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                          <Typography 
                            variant="subtitle1" 
                            fontWeight={!notification.is_read ? 'bold' : 'normal'} 
                            sx={{ color: '#1565c0' }}
                          >
                            {notification.title}
                          </Typography>
                          {!notification.is_read && (
                            <Chip
                              label="جديد"
                              size="small"
                              color="error"
                              sx={{ height: 20, fontSize: '0.65rem' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                            {notification.message}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ mt: 1, display: 'block', color: '#999' }}
                          >
                            {formatDate(notification.created_at)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {notifications.length > 0 && unreadCount === 0 && (
        <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
          🎉 جميع الإشعارات مقروءة
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

export default AdminNotifications;
