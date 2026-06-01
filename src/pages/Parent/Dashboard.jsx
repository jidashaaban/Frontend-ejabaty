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
  Star as StarIcon,
  EventNote as EventNoteIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  MeetingRoom as MeetingRoomIcon,
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

  return (
    <Box>
      <PageHeader
        title="لوحة التحكم"
        subtitle="مرحباً بك في لوحة تحكم ولي الأمر"
        icon={<SchoolIcon sx={{ fontSize: 20 }} />}
      />

      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdef5 100%)',
        }}
      >
        <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
          <Avatar sx={{ width: 60, height: 60, bgcolor: '#1976d2' }}>
            <PersonIcon sx={{ fontSize: 35, color: '#fff' }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
              {studentName || 'الطالب'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#1976d2' }}>
              الصف: {studentGrade || 'غير محدد'}
            </Typography>
          </Box>
          <Box flexGrow={1} />
          <Box textAlign="center">
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
              {totalPoints}
            </Typography>
            <Typography variant="body2" sx={{ color: '#1976d2' }}>نقطة</Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdef5 100%)',
              height: '100%',
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <StarIcon sx={{ color: '#1565c0' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                  نقاط الاختبارات
                </Typography>
              </Box>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#1565c0', mb: 1 }}>
                {totalPoints}
              </Typography>
              <Typography variant="body2" sx={{ color: '#1976d2' }}>
                إجمالي النقاط المحصلة من الاختبارات
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
              height: '100%',
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <SchoolIcon sx={{ color: '#2e7d32' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                  متوسط الدرجات
                </Typography>
              </Box>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}>
                {avgGrade}
              </Typography>
              <Typography variant="body2" sx={{ color: '#2e7d32' }}>
                متوسط درجات الامتحانات
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            p: 2.5,
            color: '#fff',
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  borderRadius: 2,
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <EventNoteIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  برنامج الامتحانات
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  جدول امتحانات الطالب القادمة
                </Typography>
              </Box>
            </Box>
            <Chip
              icon={<EventNoteIcon />}
              label={`${examSchedule.length} امتحان${examSchedule.length !== 1 ? 'ات' : ''}`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}
            />
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {examSchedule.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              لا توجد امتحانات مسجلة حالياً
            </Alert>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>المادة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الوقت</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>القاعة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الأستاذ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {examSchedule.map((exam, index) => (
                  <TableRow key={exam.id || index} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Chip
                        label={exam.subject}
                        size="small"
                        sx={{
                          bgcolor: '#e3f2fd',
                          color: '#1565c0',
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <CalendarTodayIcon fontSize="small" color="action" />
                        {exam.date}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        {exam.time}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <MeetingRoomIcon fontSize="small" color="action" />
                        {exam.room}
                      </Box>
                    </TableCell>
                    <TableCell>{exam.teacher}</TableCell>
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