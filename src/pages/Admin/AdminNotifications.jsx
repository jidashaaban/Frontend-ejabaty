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
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  ReportProblem as ReportProblemIcon,
  Star as StarIcon,
  Poll as PollIcon,
  CheckCircle as CheckCircleIcon,
  Quiz as QuizIcon,
  Announcement as AnnouncementIcon,
  School as SchoolIcon,
  DoneAll as DoneAllIcon,
  MarkEmailRead as MarkEmailReadIcon,
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
      console.log('🔔 الإشعارات المستلمة:', data);
      
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
        icon: getIconByType(notification.data?.type),
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
    switch (type) {
      case 'complaint':
      case 'new_complaint':
        return <ReportProblemIcon sx={{ color: '#f44336' }} />;
      case 'points':
      case 'mark':
      case 'new_mark':
        return <StarIcon sx={{ color: '#ff9800' }} />;
      case 'poll':
      case 'new_poll':
        return <PollIcon sx={{ color: '#4caf50' }} />;
      case 'quiz':
      case 'new_quiz':
        return <QuizIcon sx={{ color: '#9c27b0' }} />;
      case 'announcement':
      case 'new_announcement':
        return <AnnouncementIcon sx={{ color: '#2196f3' }} />;
      case 'course':
      case 'course_assignment':
      case 'new_course':
        return <SchoolIcon sx={{ color: '#00bcd4' }} />;
      default:
        return <NotificationsIcon sx={{ color: '#1976d2' }} />;
    }
  };

  const handleNotificationClick = async (notification) => {
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
    
    // التنقل بناءً على نوع الإشعار
    if (notification.type === 'complaint' || notification.type === 'new_complaint') {
      navigate('/admin/complaints');
    } else if (notification.type === 'poll' || notification.type === 'new_poll') {
      navigate('/admin/polls');
    } else if (notification.type === 'quiz' || notification.type === 'new_quiz') {
      navigate('/admin/quizzes');
    } else if (notification.type === 'announcement' || notification.type === 'new_announcement') {
      navigate('/admin/announcements');
    } else if (notification.type === 'course' || notification.type === 'course_assignment' || notification.type === 'new_course') {
      navigate('/admin/courses');
    } else if (notification.type === 'mark' || notification.type === 'new_mark') {
      navigate('/admin/reports');
    } else if (notification.related_id) {
      navigate(`/admin/${notification.type}s/${notification.related_id}`);
    } else {
      // ✅ إذا لم يتطابق أي نوع، ننقل إلى صفحة الإشعارات نفسها
      navigate('/admin/notifications');
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

  const unreadNotifications = notifications.filter(n => !n.is_read);

  return (
    <Box>
      <PageHeader 
        title="الإشعارات"
        subtitle="عرض آخر الإشعارات والتحديثات"
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
            ستظهر هنا الإشعارات عند حدوث أي حدث جديد (شكاوى، استبيانات، اختبارات...)
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
                      {notification.icon}
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
                            sx={{ 
                              mt: 1, 
                              display: 'block',
                              color: '#999',
                            }}
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
        <Alert 
          severity="success" 
          sx={{ mt: 3, borderRadius: 2, bgcolor: '#e8f5e9', color: '#2e7d32' }}
        >
          🎉 جميع الإشعارات مقروءة. ليس لديك إشعارات جديدة حالياً.
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