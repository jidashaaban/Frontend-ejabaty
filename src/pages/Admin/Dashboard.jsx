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
  Dashboard as DashboardIcon,
  PeopleAlt as ParentsIcon,
  ReportProblem as ReportProblemIcon,
  Poll as PollIcon,
} from '@mui/icons-material';
import { getReports, getWeeklyProgram, getExamProgram, getDashboardMetrics } from '../../services/adminService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

function Dashboard() {
  const [reports, setReports] = useState(null);
  const [weeklyProgram, setWeeklyProgram] = useState([]);
  const [examProgram, setExamProgram] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [metrics, setMetrics] = useState({
    studentsCount: 0,
    teachersCount: 0,
    parentsCount: 0,
    pendingComplaintsCount: 0,
    totalCoursesCount: 0,
    totalPollsCount: 0,
  });

  const daysMap = {
    'Sunday': 'الأحد',
    'Monday': 'الإثنين',
    'Tuesday': 'الثلاثاء',
    'Wednesday': 'الأربعاء',
    'Thursday': 'الخميس'
  };

  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  
  const timeSlots = ['08:00:00', '09:30:00', '11:00:00', '12:30:00', '14:00:00', '15:30:00'];
  const timeSlotsDisplay = ['08:00-09:30', '09:30-11:00', '11:00-12:30', '12:30-14:00', '14:00-15:30', '15:30-17:00'];

  const getScheduleGrid = (scheduleData) => {
    const grid = {};
    
    days.forEach(day => {
      grid[day] = {};
      timeSlots.forEach((slot, index) => {
        grid[day][timeSlotsDisplay[index]] = null;
      });
    });

    if (!scheduleData) return grid;

    if (scheduleData.master_grid) {
      const masterGrid = scheduleData.master_grid;
      
      Object.keys(masterGrid).forEach(dayEn => {
        const dayAr = daysMap[dayEn] || dayEn;
        const timeSlotsData = masterGrid[dayEn];
        
        Object.keys(timeSlotsData).forEach(time => {
          const slot = timeSlotsData[time];
          if (slot.status === 'Occupied') {
            const timeIndex = timeSlots.findIndex(t => t === time);
            const displayTime = timeSlotsDisplay[timeIndex];
            if (displayTime && grid[dayAr]) {
              grid[dayAr][displayTime] = {
                id: slot.session_id,
                course_name: slot.course_name,
                halls: slot.halls,
                start_time: slot.start_time,
                end_time: slot.end_time,
              };
            }
          }
        });
      });
    }
    else if (scheduleData.sessions && Array.isArray(scheduleData.sessions)) {
      scheduleData.sessions.forEach(session => {
        const dayAr = daysMap[session.day] || session.day;
        const startTime = session.start_time;
        const timeIndex = timeSlots.findIndex(t => t === startTime);
        if (timeIndex !== -1 && grid[dayAr]) {
          const displayTime = timeSlotsDisplay[timeIndex];
          grid[dayAr][displayTime] = {
            id: session.id,
            course_name: session.course?.name || session.course_name,
            halls: session.hall ? [session.hall.name] : ['غير محدد'],
            start_time: session.start_time,
            end_time: session.end_time,
          };
        }
      });
    }
    else if (Array.isArray(scheduleData)) {
      scheduleData.forEach(session => {
        const dayAr = daysMap[session.day] || session.day;
        const startTime = session.start_time;
        const timeIndex = timeSlots.findIndex(t => t === startTime);
        if (timeIndex !== -1 && grid[dayAr]) {
          const displayTime = timeSlotsDisplay[timeIndex];
          grid[dayAr][displayTime] = {
            id: session.id,
            course_name: session.course?.name || session.course_name,
            halls: session.hall_name ? [session.hall_name] : ['غير محدد'],
            start_time: session.start_time,
            end_time: session.end_time,
          };
        }
      });
    }

    return grid;
  };

  const getExamGrid = (examData) => {
    const exams = [];
    
    if (!examData) return exams;

    if (examData.master_grid) {
      const masterGrid = examData.master_grid;
      
      Object.keys(masterGrid).forEach(dayEn => {
        const dayAr = daysMap[dayEn] || dayEn;
        const timeSlotsData = masterGrid[dayEn];
        
        Object.keys(timeSlotsData).forEach(time => {
          const slot = timeSlotsData[time];
          if (slot.status === 'Occupied') {
            exams.push({
              id: slot.session_id,
              subject: slot.course_name,
              day: dayAr,
              date: new Date().toLocaleDateString('ar'),
              startTime: slot.start_time?.substring(0, 5) || slot.start_time,
              endTime: slot.end_time?.substring(0, 5) || slot.end_time,
              roomId: slot.halls && slot.halls.length > 0 ? slot.halls[0] : 'غير محدد',
            });
          }
        });
      });
    }
    else if (examData.sessions && Array.isArray(examData.sessions)) {
      examData.sessions.forEach(session => {
        exams.push({
          id: session.id,
          subject: session.course?.name || session.course_name,
          day: daysMap[session.day] || session.day,
          date: session.date || new Date().toLocaleDateString('ar'),
          startTime: session.start_time?.substring(0, 5) || session.start_time,
          endTime: session.end_time?.substring(0, 5) || session.end_time,
          roomId: session.hall?.name || session.hall_name || 'غير محدد',
        });
      });
    }
    else if (Array.isArray(examData)) {
      examData.forEach(session => {
        exams.push({
          id: session.id,
          subject: session.course?.name || session.course_name,
          day: daysMap[session.day] || session.day,
          date: session.date || new Date().toLocaleDateString('ar'),
          startTime: session.start_time?.substring(0, 5) || session.start_time,
          endTime: session.end_time?.substring(0, 5) || session.end_time,
          roomId: session.hall_name || session.room_id || 'غير محدد',
        });
      });
    }

    return exams;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        try {
          const metricsData = await getDashboardMetrics();
          setMetrics({
            studentsCount: metricsData.studentsCount,
            teachersCount: metricsData.teachersCount,
            parentsCount: metricsData.parentsCount,
            pendingComplaintsCount: metricsData.pendingComplaintsCount,
            totalCoursesCount: metricsData.totalCoursesCount,
            totalPollsCount: metricsData.totalPollsCount,
          });
        } catch (apiError) {
          console.log('API غير متاح، استخدام البيانات الوهمية:', apiError);
          const reportsData = await getReports();
          setReports(reportsData);
          setMetrics({
            studentsCount: reportsData?.studentsCount || 0,
            teachersCount: reportsData?.teachersCount || 0,
            parentsCount: reportsData?.parentsCount || 0,
            pendingComplaintsCount: reportsData?.pendingComplaintsCount || 0,
            totalCoursesCount: reportsData?.activeCoursesCount || 0,
            totalPollsCount: (reportsData?.surveyResults?.length || 0),
          });
        }

        let weeklyData = null;
        try {
          weeklyData = await getWeeklyProgram();
          console.log('📅 Dashboard - جدول الدوام من API:', weeklyData);
        } catch (error) {
          console.log('فشل جلب جدول الدوام:', error);
          weeklyData = null;
        }

        let examData = null;
        try {
          examData = await getExamProgram();
          console.log('📝 Dashboard - جدول الامتحانات من API:', examData);
        } catch (error) {
          console.log('فشل جلب جدول الامتحانات:', error);
          examData = null;
        }

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

  const scheduleGrid = getScheduleGrid(weeklyProgram);
  const examList = getExamGrid(examProgram);

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
        subtitle="مرحباً بك في لوحة تحكم المدير"
        icon={<DashboardIcon sx={{ fontSize: 20 }} />}
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ backgroundColor: '#e3f2fd', borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>عدد الطلاب</Typography>
                  <Typography variant="h4" component="div" color="primary" fontWeight="bold">{metrics.studentsCount}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#1976d2', width: 50, height: 50 }}><PeopleIcon sx={{ fontSize: 28 }} /></Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ backgroundColor: '#e8f5e9', borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>عدد الأساتذة</Typography>
                  <Typography variant="h4" component="div" color="success.main" fontWeight="bold">{metrics.teachersCount}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2e7d32', width: 50, height: 50 }}><SchoolIcon sx={{ fontSize: 28 }} /></Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ backgroundColor: '#f3e5f5', borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>أولياء الأمور</Typography>
                  <Typography variant="h4" component="div" color="#9c27b0" fontWeight="bold">{metrics.parentsCount}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#9c27b0', width: 50, height: 50 }}><ParentsIcon sx={{ fontSize: 28 }} /></Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ backgroundColor: '#ffebee', borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>شكاوى معلقة</Typography>
                  <Typography variant="h4" component="div" color="#f44336" fontWeight="bold">{metrics.pendingComplaintsCount}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#f44336', width: 50, height: 50 }}><ReportProblemIcon sx={{ fontSize: 28 }} /></Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ backgroundColor: '#fff3e0', borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>دورات نشطة</Typography>
                  <Typography variant="h4" component="div" color="warning.main" fontWeight="bold">{metrics.totalCoursesCount}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#ed6c02', width: 50, height: 50 }}><MenuBookIcon sx={{ fontSize: 28 }} /></Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ backgroundColor: '#e0f7fa', borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>استبيانات</Typography>
                  <Typography variant="h4" component="div" color="#00838f" fontWeight="bold">{metrics.totalPollsCount}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#00838f', width: 50, height: 50 }}><PollIcon sx={{ fontSize: 28 }} /></Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <ScheduleIcon color="primary" />
          <Typography variant="h5"> البرنامج الأسبوعي</Typography>
        </Box>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }} centered>
          <Tab label="جدول الدوام" />
          <Tab label="جدول الامتحانات" />
        </Tabs>
        
        {tab === 0 && (
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell align="center">الوقت / اليوم</TableCell>
                  {days.map((day) => (
                    <TableCell key={day} align="center">{day}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {timeSlotsDisplay.map((time) => (
                  <TableRow key={time}>
                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                      {time}
                    </TableCell>
                    {days.map((day) => {
                      const session = scheduleGrid[day]?.[time];
                      return (
                        <TableCell key={`${day}-${time}`} align="center" sx={{ py: 1.5 }}>
                          {session ? (
                            <Box>
                              <Typography variant="body2" fontWeight="bold" sx={{ color: '#1976d2' }}>
                                {session.course_name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                🏫 {session.halls && session.halls.length > 0 ? session.halls[0] : 'غير محدد'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                ⏰ {session.start_time?.substring(0, 5)} - {session.end_time?.substring(0, 5)}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.disabled">—</Typography>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {!weeklyProgram && (
              <Alert severity="info" sx={{ mt: 2 }}>
                لا يوجد جدول دوام. قم بتوليد جدول من صفحة "البرنامج الأسبوعي"
              </Alert>
            )}
          </Box>
        )}
        
        {tab === 1 && (
          <Box sx={{ overflowX: 'auto' }}>
            {examList.length === 0 ? (
              <Alert severity="info">لا توجد امتحانات مجدولة حالياً. قم بتوليد جدول الامتحانات من صفحة "البرنامج الأسبوعي"</Alert>
            ) : (
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>المادة</strong></TableCell>
                    <TableCell><strong>اليوم</strong></TableCell>
                    <TableCell><strong>التاريخ</strong></TableCell>
                    <TableCell><strong>الوقت</strong></TableCell>
                    <TableCell><strong>القاعة</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {examList.map((exam, idx) => (
                    <TableRow key={exam.id || idx} hover>
                      <TableCell>{exam.subject}</TableCell>
                      <TableCell><Chip label={exam.day} color="warning" size="small" /></TableCell>
                      <TableCell>{exam.date}</TableCell>
                      <TableCell>{exam.startTime} - {exam.endTime}</TableCell>
                      <TableCell>{exam.roomId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        )}
      </Paper>

      <Toast open={toast.open} onClose={() => setToast({ ...toast, open: false })} message={toast.message} severity={toast.severity} />
    </Box>
  );
}

export default Dashboard;