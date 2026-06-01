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
  LinearProgress,
} from '@mui/material';
import {
  Star as StarIcon,
  EventNote as EventNoteIcon,
  School as SchoolIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  MeetingRoom as MeetingRoomIcon,
  EmojiEvents as EmojiEventsIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { getChildren, getChildProgress, getChildExamSchedule } from '../../services/parentService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [childId, setChildId] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [avgGrade, setAvgGrade] = useState(0);
  const [examSchedule, setExamSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchChildProgress = async (id) => {
    try {
      const data = await getChildProgress(id);
      console.log('📊 تقدم الطالب:', data);
      
      if (data && data.success === true) {
        setStudentName(data.student_name || 'الطالب');
        
        let points = 0;
        if (data.quiz_progress && Array.isArray(data.quiz_progress)) {
          points = data.quiz_progress.reduce((sum, quiz) => sum + (parseInt(quiz.points) || 0), 0);
          console.log('📝 تفاصيل النقاط:', data.quiz_progress);
        }
        
        let examMarks = [];
        if (data.exam_progress && Array.isArray(data.exam_progress)) {
          examMarks = data.exam_progress.map(e => e.mark || 0);
        } else if (data.exam_progress === "No exam history") {
          examMarks = [];
        }
        
        const avg = examMarks.length > 0 ? Math.round(examMarks.reduce((a, b) => a + b, 0) / examMarks.length) : 0;
        setAvgGrade(avg);
        setTotalPoints(points);
      }
    } catch (error) {
      console.error('خطأ في جلب تقدم الطالب:', error);
      setToast({ open: true, message: 'فشل في جلب بيانات الطالب', severity: 'error' });
    }
  };

  const fetchChildExamSchedule = async (id) => {
    try {
      const data = await getChildExamSchedule(id);
      console.log('📚 جدول امتحانات الطالب:', data);
      
      let examsList = [];
      
      if (data && data.success === true && data.exam_schedule) {
        examsList = data.exam_schedule.map(session => ({
          id: session.id,
          subject: session.course?.name || 'غير محدد',
          date: session.date || session.exam_date || '',
          time: session.start_time && session.end_time 
            ? `${session.start_time.substring(0, 5)} - ${session.end_time.substring(0, 5)}` 
            : (session.time || ''),
          room: session.hall?.name || session.room || 'غير محدد',
          teacher: session.course?.teacher?.name || 'غير محدد',
        }));
      }
      
      setExamSchedule(examsList);
    } catch (error) {
      console.error('خطأ في جلب جدول امتحانات الطالب:', error);
      setExamSchedule([]);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const childrenData = await getChildren();
      console.log('👨‍👧 بيانات الأبناء الكاملة:', JSON.stringify(childrenData, null, 2));
      let id = null;
      const list =
        childrenData?.children ||
        childrenData?.data ||
        childrenData?.students ||
        (Array.isArray(childrenData) ? childrenData : null);

      if (Array.isArray(list) && list.length > 0) {
        id = list[0].id;
        setStudentName(list[0].name || '');
        setStudentGrade(list[0].grade || '');
      } else if (childrenData?.student) {
        id = childrenData.student.id;
        setStudentName(childrenData.student.name || '');
        setStudentGrade(childrenData.student.grade || '');
      } else if (childrenData?.child) {
        id = childrenData.child.id;
        setStudentName(childrenData.child.name || '');
        setStudentGrade(childrenData.child.grade || '');
      }

      if (!id) {
        console.warn(' لم يتم العثور على ID الطالب من البيانات:', childrenData);
        setToast({ open: true, message: 'لا يوجد طالب مرتبط بهذا الحساب', severity: 'warning' });
        setLoading(false);
        return;
      }

      setChildId(id);
      await Promise.all([
        fetchChildProgress(id),
        fetchChildExamSchedule(id),
      ]);
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
      setToast({ open: true, message: 'فشل في تحميل بيانات الطالب', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل البيانات...</Typography>
      </Box>
    );
  }

  const maxPoints = 500;
  const pointsPercentage = (totalPoints / maxPoints) * 100;

  return (
    <Box>
      <PageHeader
        title="لوحة التحكم"
        subtitle="مرحباً بك في لوحة تحكم ولي الأمر"
        icon={<SchoolIcon sx={{ fontSize: 20 }} />}
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, bgcolor: '#e3f2fd', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="#1565c0" sx={{ mb: 0.5, fontWeight: 600 }}>الطالب</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1565c0' }}>{studentName || 'الطالب'}</Typography>
                  <Typography variant="caption" color="#1976d2">الصف: {studentGrade || 'غير محدد'}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#1976d2', width: 50, height: 50 }}>
                  <PeopleIcon sx={{ fontSize: 26, color: '#fff' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, bgcolor: '#e8f5e9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="#2e7d32" sx={{ mb: 0.5, fontWeight: 600 }}>نقاط الاختبارات</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>{totalPoints}</Typography>
                  <Typography variant="caption" color="#4caf50">من {maxPoints} نقطة</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2e7d32', width: 50, height: 50 }}>
                  <EmojiEventsIcon sx={{ fontSize: 26, color: '#fff' }} />
                </Avatar>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={pointsPercentage} 
                sx={{ mt: 1.5, height: 5, borderRadius: 3, bgcolor: '#c8e6c9', '& .MuiLinearProgress-bar': { bgcolor: '#2e7d32', borderRadius: 3 } }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, bgcolor: '#fff3e0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="#ed6c02" sx={{ mb: 0.5, fontWeight: 600 }}>متوسط الدرجات</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>{avgGrade}</Typography>
                  <Typography variant="caption" color="#ff9800">من 100 درجة</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#ed6c02', width: 50, height: 50 }}>
                  <TrendingUpIcon sx={{ fontSize: 26, color: '#fff' }} />
                </Avatar>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={avgGrade} 
                sx={{ mt: 1.5, height: 5, borderRadius: 3, bgcolor: '#ffe0b2', '& .MuiLinearProgress-bar': { bgcolor: '#ed6c02', borderRadius: 3 } }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, bgcolor: '#fce4ec', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="#c62828" sx={{ mb: 0.5, fontWeight: 600 }}>الامتحانات القادمة</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#c62828' }}>{examSchedule.length}</Typography>
                  <Typography variant="caption" color="#ef5350">امتحان قادم</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#c62828', width: 50, height: 50 }}>
                  <EventNoteIcon sx={{ fontSize: 26, color: '#fff' }} />
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
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}
      >
        <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventNoteIcon sx={{ color: '#ed6c02', fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>
            جدول الامتحانات
          </Typography>
          <Chip
            label={`${examSchedule.length} امتحان${examSchedule.length !== 1 ? 'ات' : ''}`}
            size="small"
            sx={{ bgcolor: '#fff3e0', color: '#ed6c02', fontWeight: 'bold' }}
          />
        </Box>

        {examSchedule.length === 0 ? (
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 2,
              bgcolor: '#e3f2fd',
              color: '#1565c0',
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <EventNoteIcon fontSize="small" />
              لا توجد امتحانات مسجلة حالياً
            </Box>
          </Alert>
        ) : (
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: '#ed6c02',
                '& .MuiTableCell-root': { 
                  color: '#fff', 
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  border: 'none',
                  py: 1.2,
                }
              }}>
                <TableCell align="center">المادة</TableCell>
                <TableCell align="center">التاريخ</TableCell>
                <TableCell align="center">الوقت</TableCell>
                <TableCell align="center">القاعة</TableCell>
                <TableCell align="center">الأستاذ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {examSchedule.map((exam, idx) => (
                <TableRow 
                  key={exam.id || idx} 
                  hover
                  sx={{
                    '&:hover': { backgroundColor: '#fff8e1' },
                  }}
                >
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: '#fff3e0' }}>
                        <SchoolIcon sx={{ fontSize: 16, color: '#ed6c02' }} />
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {exam.subject}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                      <CalendarTodayIcon sx={{ fontSize: 14, color: '#ed6c02' }} />
                      <Typography variant="body2">{exam.date}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: '#ed6c02' }} />
                      <Typography variant="body2">{exam.time}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                      <MeetingRoomIcon sx={{ fontSize: 14, color: '#9e9e9e' }} />
                      <Typography variant="body2">{exam.room}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={exam.teacher} 
                      size="small" 
                      sx={{ 
                        bgcolor: '#fff3e0', 
                        color: '#ed6c02', 
                        fontWeight: 'bold',
                        borderRadius: 1,
                      }} 
                    />
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