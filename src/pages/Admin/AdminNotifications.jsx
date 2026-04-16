// src/pages/Admin/AdminNotifications.jsx
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
  getUnrepliedComplaintsCount,
  getComplaints,
  getReports,
} from '../../services/adminService';
import Toast from '../../components/common/Toast';

function AdminNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // جلب الإشعارات
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const notificationsList = [];
      
      // 1. الشكاوى الجديدة (غير مجاب عليها)
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

      // 2. نقاط جديدة (أفضل الطلاب)
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

      // 3. نتائج الاستبيان (إذا وجدت)
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

      // إذا لم توجد إشعارات
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

  // معالجة الضغط على إشعار
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
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Badge badgeContent={notifications.filter(n => n.type !== 'empty').length} color="error">
          <NotificationsIcon sx={{ fontSize: 32 }} />
        </Badge>
        <Typography variant="h4">
          الإشعارات
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <List>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem
                disablePadding
                sx={{
                  backgroundColor: notification.type !== 'empty' ? '#fff8e1' : 'transparent',
                  transition: '0.3s',
                  '&:hover': notification.action ? {
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                  } : {},
                }}
              >
                <ListItemButton
                  onClick={() => handleNotificationClick(notification)}
                  disabled={!notification.action}
                >
                  <ListItemIcon>
                    {notification.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {notification.title}
                        </Typography>
                        {notification.count && (
                          <Chip
                            label={notification.count}
                            size="small"
                            color="error"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        {notification.action && (
                          <Typography
                            variant="caption"
                            color="primary"
                            sx={{ mt: 0.5, display: 'inline-block' }}
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
        <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
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