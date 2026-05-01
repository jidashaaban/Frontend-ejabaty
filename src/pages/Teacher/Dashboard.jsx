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
import { getTeacherSchedule, getExamModels, getAnnouncedTests } from '../../services/teacherService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [schedule, setSchedule] = useState([]);
  const [examModels, setExamModels] = useState([]);
  const [announcedTests, setAnnouncedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const scheduleData = await getTeacherSchedule(user.id);
        setSchedule(scheduleData || []);
        const modelsData = await getExamModels();
        setExamModels(modelsData || []);
        const testsData = await getAnnouncedTests();
        setAnnouncedTests(testsData || []);
      } catch (error) {
        setSchedule([
          { id: 1, subject: 'الرياضيات', day: 'الأحد', time: '09:00-11:00', room: 'قاعة 101', class: 'الثاني علمي' },
          { id: 2, subject: 'الفيزياء', day: 'الثلاثاء', time: '11:00-13:00', room: 'قاعة 102', class: 'الثالث علمي' },
          { id: 3, subject: 'الكيمياء', day: 'الخميس', time: '10:00-12:00', room: 'مختبر الكيمياء', class: 'الثاني علمي' },
        ]);
        setExamModels([
          { id: 1, title: 'نموذج امتحان الرياضيات', subject: 'الرياضيات', date: '2026-04-20' },
          { id: 2, title: 'نموذج امتحان الفيزياء', subject: 'الفيزياء', date: '2026-04-18' },
          { id: 3, title: 'نموذج امتحان الكيمياء', subject: 'الكيمياء', date: '2026-04-15' },
        ]);
        setAnnouncedTests([
          { id: 1, title: 'اختبار الرياضيات', subject: 'الرياضيات', date: '2026-04-25', time: '10:00-12:00' },
          { id: 2, title: 'اختبار الفيزياء', subject: 'الفيزياء', date: '2026-04-27', time: '10:00-12:00' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const dayOrder = { 'الأحد': 0, 'الإثنين': 1, 'الثلاثاء': 2, 'الأربعاء': 3, 'الخميس': 4 };
  const sortedSchedule = [...schedule].sort((a, b) => dayOrder[a.day] - dayOrder[b.day]);

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
        subtitle="مرحباً بك في لوحة تحكم الأستاذ"
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
                    الحصص الأسبوعية
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {schedule.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#1976d2', width: 45, height: 45 }}>
                  <CalendarMonthIcon sx={{ fontSize: 24 }} />
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
                    النماذج الامتحانية
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {examModels.length}
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
                    {announcedTests.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#1976d2', width: 45, height: 45 }}>
                  <AnnouncementIcon sx={{ fontSize: 24 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid #1976d2',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            p: 1.5,
            px: 2,
            color: '#fff',
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarMonthIcon sx={{ fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              برنامجي الأسبوعي
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 2 }}>
          {schedule.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 2 }}>لا توجد حصص في جدولك الأسبوعي</Alert>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>اليوم</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>المادة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>الوقت</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>القاعة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>الصف</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedSchedule.map((session, index) => (
                  <TableRow 
                    key={session.id} 
                    hover 
                    sx={{ 
                      backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                    }}
                  >
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                      <Chip 
                        label={session.day} 
                        size="small" 
                        sx={{ bgcolor: '#e3f2fd', color: '#1565c0', height: 22, fontSize: '0.7rem' }} 
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <SchoolIcon sx={{ color: '#1976d2', fontSize: 16 }} />
                        {session.subject}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <AccessTimeIcon sx={{ color: '#1976d2', fontSize: 14 }} />
                        {session.time}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <MeetingRoomIcon sx={{ color: '#1976d2', fontSize: 14 }} />
                        {session.room}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{session.class}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
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