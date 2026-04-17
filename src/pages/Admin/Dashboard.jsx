import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  Schedule as ScheduleIcon,
  Today as TodayIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { getReports, getWeeklyProgram, getExamProgram } from '../../services/adminService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

function Dashboard() {
  const [reports, setReports] = useState(null);
  const [weeklyProgram, setWeeklyProgram] = useState([]);
  const [examProgram, setExamProgram] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  const timeSlots = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00'];

  const getScheduleAt = (day, time) => {
    const startTime = time.split('-')[0];
    return weeklyProgram.find(s => s.day === day && s.startTime === startTime);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reportsData, weeklyData, examData] = await Promise.all([
          getReports(),
          getWeeklyProgram(),
          getExamProgram(),
        ]);
        setReports(reportsData);
        setWeeklyProgram(weeklyData);
        setExamProgram(examData);
      } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
        setToast({ open: true, message: 'فشل في جلب البيانات', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const studentsCount = reports?.studentsCount || 0;
  const teachersCount = reports?.teachersCount || 0;
  const activeCoursesCount = reports?.activeCoursesCount || 0;

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
        subtitle="مرحباً بك في لوحة التحكم "
        icon={<DashboardIcon sx={{ fontSize: 20 }} />}
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: '#e3f2fd', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>عدد الطلاب</Typography>
                  <Typography variant="h3" component="div" color="primary" fontWeight="bold">{studentsCount}</Typography>
                  <Typography variant="body2" color="text.secondary">طالب مسجل</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}><PeopleIcon sx={{ fontSize: 32 }} /></Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: '#e8f5e9', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>عدد الأساتذة</Typography>
                  <Typography variant="h3" component="div" color="success.main" fontWeight="bold">{teachersCount}</Typography>
                  <Typography variant="body2" color="text.secondary">أستاذ يعمل</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2e7d32', width: 56, height: 56 }}><SchoolIcon sx={{ fontSize: 32 }} /></Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: '#fff3e0', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>الدورات النشطة</Typography>
                  <Typography variant="h3" component="div" color="warning.main" fontWeight="bold">{activeCoursesCount}</Typography>
                  <Typography variant="body2" color="text.secondary">دورة نشطة</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#ed6c02', width: 56, height: 56 }}><MenuBookIcon sx={{ fontSize: 32 }} /></Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <ScheduleIcon color="primary" />
          <Typography variant="h5">📅 البرنامج الأسبوعي (جميع المواد)</Typography>
        </Box>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }} centered>
          <Tab label="جدول الدوام" />
          <Tab label="جدول الامتحانات" />
        </Tabs>
        {tab === 0 && (
          <Box sx={{ overflowX: 'auto' }}>
            {weeklyProgram.length === 0 ? (
              <Alert severity="info">لا توجد جلسات في برنامج الدوام</Alert>
            ) : (
              <Table sx={{ minWidth: 800 }}>
                <TableHead><TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell align="center">الوقت</TableCell>
                  {days.map((day) => (<TableCell key={day} align="center">{day}</TableCell>))}
                </TableRow></TableHead>
                <TableBody>
                  {timeSlots.map((time) => (
                    <TableRow key={time}>
                      <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}>{time}</TableCell>
                      {days.map((day) => {
                        const session = getScheduleAt(day, time);
                        return (<TableCell key={day} align="center">
                          {session ? (<Box><Typography variant="body2" fontWeight="bold">{session.subject}</Typography>
                          <Typography variant="caption" color="text.secondary">👨‍🏫 {session.teacherId}</Typography>
                          <Typography variant="caption" color="text.secondary" display="block">🏫 {session.roomId}</Typography></Box>) : (<Typography variant="caption" color="text.disabled">—</Typography>)}
                        </TableCell>);
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        )}
        {tab === 1 && (
          <Box sx={{ overflowX: 'auto' }}>
            {examProgram.length === 0 ? (<Alert severity="info">لا توجد امتحانات</Alert>) : (
              <Table><TableHead><TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>المادة</TableCell><TableCell>اليوم</TableCell><TableCell>التاريخ</TableCell><TableCell>الوقت</TableCell><TableCell>القاعة</TableCell>
              </TableRow></TableHead>
              <TableBody>{examProgram.map((exam) => (<TableRow key={exam.id}>
                <TableCell>{exam.subject}</TableCell><TableCell><Chip label={exam.day} color="warning" size="small" /></TableCell>
                <TableCell>{exam.date}</TableCell><TableCell>{exam.startTime} - {exam.endTime}</TableCell><TableCell>{exam.roomId}</TableCell>
              </TableRow>))}</TableBody></Table>
            )}
          </Box>
        )}
      </Paper>
      <Toast open={toast.open} onClose={() => setToast({ ...toast, open: false })} message={toast.message} severity={toast.severity} />
    </Box>
  );
}

export default Dashboard;