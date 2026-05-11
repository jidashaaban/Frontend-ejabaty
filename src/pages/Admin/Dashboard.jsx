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
  Button,
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
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getReports, getWeeklyProgram, getExamProgram, getDashboardMetrics } from '../../services/adminService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const dayOrder = ['الأحد' ,'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

const daysMap = {
  'Sunday': 'الأحد',
  'Monday': 'الإثنين',
  'Tuesday': 'الثلاثاء',
  'Wednesday': 'الأربعاء',
  'Thursday': 'الخميس'
};

function Dashboard() {
  const navigate = useNavigate();
  const [weeklyProgram, setWeeklyProgram] = useState(null);
  const [examProgram, setExamProgram] = useState(null);
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
  const [scheduleList, setScheduleList] = useState([]);
  const [examList, setExamList] = useState([]);

  const formatScheduleData = (scheduleRes) => {
    let formatted = [];
    
    if (!scheduleRes) return [];
    
    if (scheduleRes.master_grid) {
      const masterGrid = scheduleRes.master_grid;
      Object.keys(masterGrid).forEach(day => {
        const timeSlots = masterGrid[day];
        Object.keys(timeSlots).forEach(time => {
          const slot = timeSlots[time];
          if (slot.status === 'Occupied') {
            formatted.push({
              id: slot.session_id,
              day: daysMap[day] || day,
              start_time: slot.start_time,
              end_time: slot.end_time,
              course_name: slot.course_name,
              hall_name: slot.halls && slot.halls.length > 0 ? slot.halls[0] : 'غير محدد',
            });
          }
        });
      });
    } 
    else if (scheduleRes.sessions && Array.isArray(scheduleRes.sessions)) {
      formatted = scheduleRes.sessions.map(session => ({
        id: session.id,
        day: daysMap[session.day] || session.day,
        start_time: session.start_time,
        end_time: session.end_time,
        course_name: session.course?.name,
        hall_name: session.hall?.name,
      }));
    }
    else if (Array.isArray(scheduleRes)) {
      formatted = scheduleRes.map(item => ({
        id: item.id,
        day: daysMap[item.day] || item.day,
        start_time: item.start_time,
        end_time: item.end_time,
        course_name: item.course?.name || item.course_name,
        hall_name: item.hall?.name || item.hall_name,
      }));
    }
    
    return formatted;
  };

  const formatExamData = (examRes) => {
    let formatted = [];
    
    if (!examRes) return [];
    
    if (examRes.master_grid) {
      const masterGrid = examRes.master_grid;
      Object.keys(masterGrid).forEach(day => {
        const timeSlots = masterGrid[day];
        Object.keys(timeSlots).forEach(time => {
          const slot = timeSlots[time];
          if (slot.status === 'Occupied') {
            formatted.push({
              id: slot.session_id,
              day: daysMap[day] || day,
              start_time: slot.start_time,
              end_time: slot.end_time,
              course_name: slot.course_name,
              hall_name: slot.halls && slot.halls.length > 0 ? slot.halls[0] : 'غير محدد',
            });
          }
        });
      });
    } 
    else if (examRes.sessions && Array.isArray(examRes.sessions)) {
      formatted = examRes.sessions.map(session => ({
        id: session.id,
        day: daysMap[session.day] || session.day,
        start_time: session.start_time,
        end_time: session.end_time,
        course_name: session.course?.name,
        hall_name: session.hall?.name,
      }));
    }
    else if (Array.isArray(examRes)) {
      formatted = examRes.map(item => ({
        id: item.id,
        day: daysMap[item.day] || item.day,
        start_time: item.start_time,
        end_time: item.end_time,
        course_name: item.course?.name || item.course_name,
        hall_name: item.hall?.name || item.hall_name,
      }));
    }
    
    return formatted;
  };

  const isEmptySchedule = (program) => {
    if (!program) return true;
    if (program.master_grid) {
      const daysWithSessions = Object.keys(program.master_grid).filter(day => {
        const sessions = program.master_grid[day];
        return Object.values(sessions).some(session => session.status === 'Occupied');
      });
      return daysWithSessions.length === 0;
    }
    if (program.sessions && Array.isArray(program.sessions)) {
      return program.sessions.length === 0;
    }
    if (Array.isArray(program)) {
      return program.length === 0;
    }
    return true;
  };

  const groupByDay = (list) => {
    const grouped = {};
    dayOrder.forEach(day => { grouped[day] = []; });
    list.forEach(item => {
      if (grouped[item.day]) {
        grouped[item.day].push(item);
      } else {
        grouped[item.day] = [item];
      }
    });
    Object.keys(grouped).forEach(day => {
      grouped[day].sort((a, b) => {
        return (a.start_time || '').localeCompare(b.start_time || '');
      });
    });
    return grouped;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
      try {
          const metricsData = await getDashboardMetrics();
          setMetrics({
            studentsCount: metricsData.studentsCount || 0,
            teachersCount: metricsData.teachersCount || 0,
            parentsCount: metricsData.parentsCount || 0,
            pendingComplaintsCount: metricsData.pendingComplaintsCount || 0,
            totalCoursesCount: metricsData.totalCoursesCount || 0,
            totalPollsCount: metricsData.totalPollsCount || 0,
          });
        } catch (apiError) {
          console.log('API غير متاح:', apiError);
          const reportsData = await getReports();
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
          console.log(' جدول الدوام:', weeklyData);
          setWeeklyProgram(weeklyData);
          const formatted = formatScheduleData(weeklyData);
          setScheduleList(formatted);
        } catch (error) {
          console.log('فشل جلب جدول الدوام:', error);
          setWeeklyProgram(null);
          setScheduleList([]);
        }

        let examData = null;
        try {
          examData = await getExamProgram();
          console.log('جدول الامتحانات:', examData);
          setExamProgram(examData);
          const formatted = formatExamData(examData);
          setExamList(formatted);
        } catch (error) {
          console.log('فشل جلب جدول الامتحانات:', error);
          setExamProgram(null);
          setExamList([]);
        }
        
      } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
        setToast({ open: true, message: 'فشل في جلب البيانات', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const groupedSchedule = groupByDay(scheduleList);
  const groupedExams = groupByDay(examList);
  const hasSchedule = !isEmptySchedule(weeklyProgram) && scheduleList.length > 0;
  const hasExams = !isEmptySchedule(examProgram) && examList.length > 0;

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
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <ScheduleIcon color="primary" />
            <Typography variant="h5">البرنامج الأسبوعي</Typography>
          </Box>
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => navigate('/admin/weekly-program')}
            sx={{ textTransform: 'none' }}
          >
            إدارة البرنامج
          </Button>
        </Box>

        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }} centered>
          <Tab label="جدول الدوام" />
          <Tab label="جدول الامتحانات" />
        </Tabs>

        {tab === 0 && (
          <Box>
            {!hasSchedule ? (
              <Alert severity="info" sx={{ borderRadius: 2, py: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <ScheduleIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2, opacity: 0.7 }} />
                  <Typography variant="h6" gutterBottom>لا يوجد برنامج دوام</Typography>
                  <Typography variant="body2" color="text.secondary">
                    لم يتم إنشاء جدول الدوام بعد. قم بتوليد البرنامج من صفحة "البرنامج الأسبوعي".
                  </Typography>
                </Box>
              </Alert>
            ) : (
              <Box>
                {dayOrder.map(day => {
                  const sessions = groupedSchedule[day] || [];
                  if (sessions.length === 0) return null;
                  
                  return (
                    <Box key={day} sx={{ mb: 4 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          bgcolor: '#e3f2fd', 
                          p: 1.5, 
                          borderRadius: 2, 
                          mb: 2,
                          fontWeight: 'bold',
                          color: '#1565c0'
                        }}
                      >
                         {day} ({sessions.length} مواد)
                      </Typography>
                      
                      <Table sx={{ minWidth: 600 }}>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>الوقت</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>المادة</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>القاعة</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sessions.map((item, idx) => (
                            <TableRow key={item.id || idx} hover>
                              <TableCell>
                                {item.start_time?.substring(0, 5) || item.start_time} - {item.end_time?.substring(0, 5) || item.end_time}
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={item.course_name || 'غير محدد'} 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>{item.hall_name || 'غير محدد'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        )}

        {tab === 1 && (
          <Box>
            {!hasExams ? (
              <Alert severity="info" sx={{ borderRadius: 2, py: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <ScheduleIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2, opacity: 0.7 }} />
                  <Typography variant="h6" gutterBottom>لا توجد امتحانات مجدولة حالياً</Typography>
                  <Typography variant="body2" color="text.secondary">
                    قم بتوليد جدول الامتحانات من صفحة "البرنامج الأسبوعي".
                  </Typography>
                </Box>
              </Alert>
            ) : (
              <Box>
                {dayOrder.map(day => {
                  const exams = groupedExams[day] || [];
                  if (exams.length === 0) return null;
                  
                  return (
                    <Box key={day} sx={{ mb: 4 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          bgcolor: '#fff3e0', 
                          p: 1.5, 
                          borderRadius: 2, 
                          mb: 2,
                          fontWeight: 'bold',
                          color: '#ed6c02'
                        }}
                      >
                         {day} ({exams.length} امتحانات)
                      </Typography>
                      
                      <Table sx={{ minWidth: 600 }}>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>الوقت</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>المادة</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>القاعة</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {exams.map((item, idx) => (
                            <TableRow key={item.id || idx} hover>
                              <TableCell>
                                {item.start_time?.substring(0, 5) || item.start_time} - {item.end_time?.substring(0, 5) || item.end_time}
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={item.course_name || 'غير محدد'} 
                                  size="small" 
                                  color="warning" 
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>{item.hall_name || 'غير محدد'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
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

export default Dashboard;