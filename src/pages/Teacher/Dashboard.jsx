import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarMonthIcon,
  MenuBook as MenuBookIcon,
  Announcement as AnnouncementIcon,
  AccessTime as AccessTimeIcon,
  MeetingRoom as MeetingRoomIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { getTeacherDashboardStats } from '../../services/teacherService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState({
    teacher_name: '',
    metrics: {
      courses_count: 0,
      quizzes_count: 0,
      marking_schemes_count: 0,
    },
    schedule: [],
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const daysMap = {
    'Sunday': 'الأحد',
    'Monday': 'الإثنين',
    'Tuesday': 'الثلاثاء',
    'Wednesday': 'الأربعاء',
    'Thursday': 'الخميس',
  };

  const dayOrder = { 'الأحد': 0, 'الإثنين': 1, 'الثلاثاء': 2, 'الأربعاء': 3, 'الخميس': 4 };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getTeacherDashboardStats();
        console.log(' بيانات لوحة التحكم:', response);
        
        if (response && response.success && response.data) {
          let formattedSchedule = [];
          if (response.data.schedule && Array.isArray(response.data.schedule)) {
            formattedSchedule = response.data.schedule.map(session => ({
              id: session.id,
              day: daysMap[session.day] || session.day,
              subject: session.course?.name || 'غير محدد',
              start_time: session.start_time,
              end_time: session.end_time,
              time: `${session.start_time?.substring(0, 5) || ''} - ${session.end_time?.substring(0, 5) || ''}`,
              room: session.hall?.name || 'غير محدد',
            }));
          }
          
          setDashboardData({
            teacher_name: response.data.teacher_name || user?.name || 'الأستاذ',
            metrics: {
              courses_count: response.data.metrics?.courses_count || 0,
              quizzes_count: response.data.metrics?.quizzes_count || 0,
              marking_schemes_count: response.data.metrics?.marking_schemes_count || 0,
            },
            schedule: formattedSchedule,
          });
        } else {
          throw new Error('بيانات غير صالحة من الخادم');
        }
      } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
        setToast({ open: true, message: 'فشل في جلب البيانات من الخادم', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.id) {
      fetchData();
    }
  }, [user?.id, user?.name]);

  const sortedSchedule = [...dashboardData.schedule].sort((a, b) => 
    (dayOrder[a.day] || 99) - (dayOrder[b.day] || 99)
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل البيانات...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="لوحة التحكم"
        subtitle={`مرحباً بك في لوحة تحكم الأستاذ, ${dashboardData.teacher_name}`}
        icon={<DashboardIcon sx={{ fontSize: 20 }} />}
      />

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdef5 100%)',
              transition: '0.3s',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: 4 },
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="#1565c0" gutterBottom>
                    المواد التي أدرسها
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {dashboardData.metrics.courses_count}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#1976d2', width: 45, height: 45 }}>
                  <MenuBookIcon sx={{ fontSize: 24 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdef5 100%)',
              transition: '0.3s',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: 4 },
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="#1565c0" gutterBottom>
                    الاختبارات المعلنة
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {dashboardData.metrics.quizzes_count}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#1976d2', width: 45, height: 45 }}>
                  <AnnouncementIcon sx={{ fontSize: 24 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdef5 100%)',
              transition: '0.3s',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: 4 },
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="#1565c0" gutterBottom>
                    نماذج التصحيح
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {dashboardData.metrics.marking_schemes_count}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#1976d2', width: 45, height: 45 }}>
                  <SchoolIcon sx={{ fontSize: 24 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            bgcolor: '#e3f2fd',
            color: '#1565c0',
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <SchoolIcon fontSize="small" />
            هذا جدول دوامك الأسبوعي - يعرض الحصص التي تدرسها هذا الأسبوع
          </Box>
        </Alert>

        {sortedSchedule.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <CalendarMonthIcon sx={{ fontSize: 48, color: '#ccc', mb: 1, opacity: 0.5 }} />
            <Typography color="text.secondary">لا توجد حصص في جدولك الأسبوعي حالياً</Typography>
          </Box>
        ) : (
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: '#1565c0',
                '& .MuiTableCell-root': { 
                  color: '#fff', 
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  border: 'none',
                }
              }}>
                <TableCell align="center">اليوم</TableCell>
                <TableCell align="center">المادة</TableCell>
                <TableCell align="center">الوقت</TableCell>
                <TableCell align="center">القاعة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedSchedule.map((session, idx) => (
                <TableRow 
                  key={session.id} 
                  hover
                  sx={{
                    '&:hover': { backgroundColor: '#e8f0fe' },
                  }}
                >
                  <TableCell align="center">
                    <Chip 
                      label={session.day} 
                      size="small" 
                      sx={{ 
                        bgcolor: '#e3f2fd', 
                        color: '#1565c0', 
                        fontWeight: 'bold',
                        borderRadius: 1,
                      }} 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: '#e3f2fd' }}>
                        <SchoolIcon sx={{ fontSize: 16, color: '#1565c0' }} />
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {session.subject}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: '#1565c0' }} />
                      <Typography variant="body2">{session.time}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                      <MeetingRoomIcon sx={{ fontSize: 14, color: '#1565c0' }} />
                      <Typography variant="body2">{session.room}</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
};

export default Dashboard;