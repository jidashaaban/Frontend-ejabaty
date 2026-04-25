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
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  ReportProblem as ReportProblemIcon,
  Star as StarIcon,
  Poll as PollIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  getComplaints,
  getReports,
} from '../../services/adminService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

function AdminNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const notificationsList = [];

      const complaints = await getComplaints();
      const unreadComplaints = complaints.filter(c => !c.replied);
      if (unreadComplaints.length > 0) {
        notificationsList.push({
          id: 'complaints',
          type: 'complaint',
          title: 'شكاوى جديدة',
          message: `لديك ${unreadComplaints.length} شكوى جديدة لم يتم الرد عليها`,
          count: unreadComplaints.length,
          icon: <ReportProblemIcon sx={{ color: '#f44336' }} />,
          action: '/admin/complaints',
          actionText: 'الذهاب إلى الشكاوى',
        });
      }

      const reports = await getReports();
      const topStudents = reports.topStudents;
      const allTopStudents = [
        ...(topStudents.grade9 || []),
        ...(topStudents.scientific || []),
        ...(topStudents.literary || []),
      ];
      
      if (allTopStudents.length > 0) {
        notificationsList.push({
          id: 'points',
          type: 'points',
          title: 'تحديث النقاط',
          message: `تم تحديث نقاط الطلاب. يمكنك الاطلاع على أفضل ${allTopStudents.length} طالب`,
          count: allTopStudents.length,
          icon: <StarIcon sx={{ color: '#ff9800' }} />,
          action: '/admin/reports',
          actionText: 'الذهاب إلى التقارير',
        });
      }

      const surveyResults = reports.surveyResults;
      if (surveyResults && surveyResults.length > 0) {
        notificationsList.push({
          id: 'survey',
          type: 'survey',
          title: 'نتائج استبيان جديدة',
          message: `تم نشر نتائج استبيان "${surveyResults[0]?.title || 'تقييم'}" يمكنك الاطلاع عليها`,
          count: surveyResults.length,
          icon: <PollIcon sx={{ color: '#4caf50' }} />,
          action: '/admin/reports',
          actionText: 'الذهاب إلى التقارير',
        });
      }

      if (notificationsList.length === 0) {
        notificationsList.push({
          id: 'empty',
          type: 'empty',
          title: 'لا توجد إشعارات',
          message: 'ليس لديك أي إشعارات جديدة حالياً',
          icon: <CheckCircleIcon sx={{ color: '#9e9e9e' }} />,
          action: null,
        });
      }

      setNotifications(notificationsList);
    } catch (error) {
      console.error('خطأ في جلب الإشعارات:', error);
      setToast({ open: true, message: 'فشل في جلب الإشعارات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = (notification) => {
    if (notification.action) {
      navigate(notification.action);
    }
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
        subtitle="عرض آخر الإشعارات والتحديثات"
        icon={<NotificationsIcon sx={{ fontSize: 20 }} />}
      />

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Badge 
          badgeContent={notifications.filter(n => n.type !== 'empty').length} 
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
            label={`${notifications.filter(n => n.type !== 'empty').length} إشعار جديد`}
            size="small"
            sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
          />
        </Badge>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <List>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem
                disablePadding
                sx={{
                  backgroundColor: notification.type !== 'empty' ? '#e3f2fd' : 'transparent',
                  transition: '0.3s',
                  '&:hover': notification.action ? {
                    backgroundColor: '#bbdef5',
                    cursor: 'pointer',
                  } : {},
                }}
              >
                <ListItemButton
                  onClick={() => handleNotificationClick(notification)}
                  disabled={!notification.action}
                  sx={{ py: 2 }}
                >
                  <ListItemIcon>
                    {notification.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1565c0' }}>
                          {notification.title}
                        </Typography>
                        {notification.count && (
                          <Chip
                            label={notification.count}
                            size="small"
                            color="error"
                            sx={{ height: 22, fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        {notification.action && (
                          <Typography
                            variant="caption"
                            sx={{ 
                              mt: 1, 
                              display: 'inline-block',
                              color: '#1976d2',
                              fontWeight: 500,
                            }}
                          >
                            {notification.actionText} →
                          </Typography>
                        )}
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

      {notifications.length === 1 && notifications[0].type === 'empty' && (
        <Alert 
          severity="info" 
          sx={{ mt: 3, borderRadius: 2, bgcolor: '#e3f2fd', color: '#1565c0' }}
        >
          🎉 لا توجد إشعارات جديدة حالياً. سنخبرك عند ظهور أي تحديثات.
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