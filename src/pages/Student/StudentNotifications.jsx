import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  Badge,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  Poll as PollIcon,
  School as SchoolIcon,
  EmojiEvents as EmojiEventsIcon,
  Announcement as AnnouncementIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';
import { getNotifications } from '../../services/studentService';

function StudentNotifications() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      console.log('🔔 الإشعارات (الخام):', data);
      
      let notificationsArray = [];
      let count = 0;
      
      if (Array.isArray(data)) {
        notificationsArray = data;
      } else if (data?.notifications && Array.isArray(data.notifications)) {
        notificationsArray = data.notifications;
      } else if (data?.data && Array.isArray(data.data)) {
        notificationsArray = data.data;
      } else {
        notificationsArray = [];
      }
      
      if (data?.unread_count !== undefined) {
        count = data.unread_count;
      } else {
        count = notificationsArray.filter(n => !n.read_at && !n.is_read).length;
      }
      
      setNotifications(notificationsArray);
      setUnreadCount(count);
      console.log('✅ الإشعارات بعد المعالجة:', notificationsArray.length);
    } catch (error) {
      console.error('❌ خطأ في جلب الإشعارات:', error);
      setToast({ open: true, message: 'فشل في جلب الإشعارات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type, sender) => {
    // إشعارات من الأدمن
    if (sender === 'admin') {
      if (type === 'exam' || type === 'schedule') {
        return <EventIcon sx={{ color: '#ff9800' }} />;
      }
      if (type === 'poll') {
        return <PollIcon sx={{ color: '#9c27b0' }} />;
      }
      return <AnnouncementIcon sx={{ color: '#1976d2' }} />;
    }
    
    // إشعارات من الأستاذ
    if (sender === 'teacher') {
      if (type === 'correction') {
        return <CheckCircleIcon sx={{ color: '#4caf50' }} />;
      }
      if (type === 'points') {
        return <EmojiEventsIcon sx={{ color: '#ffc107' }} />;
      }
      if (type === 'quiz') {
        return <AssignmentIcon sx={{ color: '#f44336' }} />;
      }
      return <SchoolIcon sx={{ color: '#795548' }} />;
    }
    
    return <InfoIcon sx={{ color: '#1976d2' }} />;
  };

  const getNotificationColor = (type, sender) => {
    if (sender === 'admin') {
      if (type === 'exam' || type === 'schedule') return '#ff9800';
      if (type === 'poll') return '#9c27b0';
      return '#1976d2';
    }
    if (sender === 'teacher') {
      if (type === 'correction') return '#4caf50';
      if (type === 'points') return '#ffc107';
      if (type === 'quiz') return '#f44336';
      return '#795548';
    }
    return '#1976d2';
  };

  const getNotificationBadge = (type, sender) => {
    if (sender === 'admin') {
      if (type === 'exam' || type === 'schedule') return 'جدول جديد';
      if (type === 'poll') return 'استبيان جديد';
      return 'إعلان';
    }
    if (sender === 'teacher') {
      if (type === 'correction') return 'تصحيح';
      if (type === 'points') return 'نقاط جديدة';
      if (type === 'quiz') return 'اختبار';
      return 'إعلان أستاذ';
    }
    return 'إشعار';
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

  const getFilteredNotifications = () => {
    if (tabValue === 0) return notifications;
    if (tabValue === 1) return notifications.filter(n => n.sender === 'admin');
    if (tabValue === 2) return notifications.filter(n => n.sender === 'teacher');
    return notifications;
  };

  const filteredNotifications = getFilteredNotifications();

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
        subtitle="آخر التحديثات والإشعارات من الإدارة والأساتذة"
        icon={<NotificationsIcon sx={{ fontSize: 20 }} />}
      />

      {/* إحصائية سريعة */}
      <Paper sx={{ 
        p: 2.5, 
        mb: 3, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 12 } }}>
            <NotificationsIcon sx={{ fontSize: 32 }} />
          </Badge>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{unreadCount}</Typography>
            <Typography variant="caption">إشعار غير مقروء</Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <EventIcon sx={{ fontSize: 18 }} />
            <Typography variant="caption">إدارة</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <SchoolIcon sx={{ fontSize: 18 }} />
            <Typography variant="caption">أساتذة</Typography>
          </Box>
        </Box>
      </Paper>

      {/* تبويبات التصنيف */}
      <Tabs 
        value={tabValue} 
        onChange={(e, v) => setTabValue(v)} 
        sx={{ mb: 3, bgcolor: '#fff', borderRadius: 2 }}
        centered
      >
        <Tab label="الكل" />
        <Tab label="📋 الإدارة" />
        <Tab label="👨‍🏫 الأساتذة" />
      </Tabs>

      {/* قائمة الإشعارات */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {filteredNotifications.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">لا توجد إشعارات</Typography>
            <Typography variant="body2" color="text.secondary">
              {tabValue === 0 ? 'سيتم عرض الإشعارات الجديدة هنا' : 
               tabValue === 1 ? 'لا توجد إشعارات من الإدارة حالياً' : 
               'لا توجد إشعارات من الأساتذة حالياً'}
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredNotifications.map((notification, index) => {
              const isUnread = !notification.read_at && !notification.is_read;
              const iconColor = getNotificationColor(notification.type, notification.sender);
              
              return (
                <React.Fragment key={notification.id || index}>
                  <ListItem 
                    sx={{ 
                      py: 2.5,
                      px: 3,
                      bgcolor: isUnread ? '#f0f7ff' : 'transparent',
                      transition: '0.3s',
                      '&:hover': { bgcolor: '#f5f5f5' },
                      cursor: 'pointer'
                    }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: `${iconColor}20`, color: iconColor }}>
                        {getNotificationIcon(notification.type, notification.sender)}
                      </Avatar>
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle1" sx={{ fontWeight: isUnread ? 'bold' : 'normal' }}>
                              {notification.title}
                            </Typography>
                            <Chip 
                              label={getNotificationBadge(notification.type, notification.sender)} 
                              size="small" 
                              sx={{ 
                                bgcolor: `${iconColor}20`, 
                                color: iconColor,
                                fontWeight: 'bold',
                                fontSize: '0.7rem'
                              }} 
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(notification.created_at)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message || notification.content}
                          </Typography>
                          {notification.sender && (
                            <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                              📨 من: {notification.sender === 'admin' ? 'إدارة المدرسة' : `الأستاذ ${notification.teacher_name || ''}`}
                            </Typography>
                          )}
                          {notification.quiz_date && (
                            <Typography variant="caption" color="primary" sx={{ mt: 0.5, display: 'block' }}>
                              📅 موعد الاختبار: {formatDate(notification.quiz_date)}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < filteredNotifications.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Paper>

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