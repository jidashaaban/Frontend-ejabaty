// src/pages/Parent/Dashboard.jsx
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
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Star as StarIcon,
  EventNote as EventNoteIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  MeetingRoom as MeetingRoomIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { getStudentInfo, getStudentPoints, getStudentExams } from '../../services/parentService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const Dashboard = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [points, setPoints] = useState(0);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    try {
      const studentData = await getStudentInfo();
      setStudentInfo(studentData);
      const pointsData = await getStudentPoints(studentData.id);
      setPoints(pointsData.points || 0);
      const examsData = await getStudentExams(studentData.id);
      setExams(examsData || []);
    } catch (error) {
      // بيانات تجريبية
      setStudentInfo({ id: 1, name: 'أحمد محمد', class: 'الصف التاسع', studentId: '2024001', attendance: 92 });
      setPoints(250);
      setExams([
        { id: 1, subject: 'الرياضيات', date: '2026-04-25', time: '10:00-12:00', room: 'قاعة 101', teacher: 'أ. أحمد' },
        { id: 2, subject: 'الفيزياء', date: '2026-04-27', time: '10:00-12:00', room: 'قاعة 102', teacher: 'أ. سارة' },
        { id: 3, subject: 'الكيمياء', date: '2026-04-29', time: '10:00-12:00', room: 'مختبر الكيمياء', teacher: 'أ. خالد' },
      ]);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    setToast({ open: true, message: 'تم تحديث البيانات بنجاح', severity: 'success' });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mr: 2 }}>جاري تحميل البيانات...</Typography>
      </Box>
    );
  }

  const progress = points >= 500 ? 100 : (points / 500) * 100;
  const levelText = points >= 400 ? 'ممتاز' : points >= 250 ? 'جيد جداً' : points >= 100 ? 'جيد' : 'يحتاج للتحسين';
  const levelColor = points >= 400 ? '#4caf50' : points >= 250 ? '#ff9800' : '#f44336';

  return (
    <Box>
      {/* Header مع زر تحديث */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <PageHeader
          title="لوحة التحكم"
          subtitle="مرحباً بك في لوحة تحكم ولي الأمر - تابع تقدم ابنك الدراسي"
          icon={<SchoolIcon sx={{ fontSize: 20 }} />}
        />
        <Tooltip title="تحديث البيانات">
          <IconButton onClick={handleRefresh} disabled={refreshing} sx={{ bgcolor: '#f0f2f5' }}>
            <RefreshIcon sx={{ color: '#1976d2' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* بطاقة معلومات الطالب المتقدمة */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
          <SchoolIcon sx={{ fontSize: 150 }} />
        </Box>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.2)', border: '3px solid #fff' }}>
                <PersonIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{studentInfo?.name || 'الطالب'}</Typography>
                <Box display="flex" gap={2} mt={1} flexWrap="wrap">
                  <Chip label={`الصف: ${studentInfo?.class || 'غير محدد'}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
                  <Chip label={`المستوى: ${levelText}`} size="small" sx={{ bgcolor: levelColor, color: '#fff' }} />
                  <Chip label={`الرقم التعريفي: ${studentInfo?.studentId || '----'}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box textAlign="center" sx={{ bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 3, p: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>نقاط الطالب</Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold' }}>{points}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>من 500 نقطة</Typography>
              <LinearProgress variant="determinate" value={progress} sx={{ mt: 1, height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.3)', '& .MuiLinearProgress-bar': { bgcolor: '#ffd700' } }} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* تقدم النقاط فقط */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <TrendingUpIcon sx={{ color: '#ff9800' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>📈 تقدم النقاط</Typography>
              </Box>
              <Box textAlign="center" py={2}>
                <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>{points}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>من 500 نقطة</Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 12, borderRadius: 6, mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  {points >= 400 ? '🥇 متميز! أنت قريب من المستوى الممتاز' : 
                   points >= 250 ? '👍 جيد جداً! استمر في التحصيل' : 
                   points >= 100 ? '💪 جيد! يمكنك تحسين المزيد' : 
                   '🌟 بداية جيدة! اجمع المزيد من النقاط'}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                <Chip icon={<StarIcon />} label="حضور يومي +5" size="small" sx={{ bgcolor: '#ff9800', color: '#fff' }} />
                <Chip icon={<StarIcon />} label="درجة امتياز +15" size="small" sx={{ bgcolor: '#ff9800', color: '#fff' }} />
                <Chip icon={<StarIcon />} label="سلوك ممتاز +10" size="small" sx={{ bgcolor: '#ff9800', color: '#fff' }} />
                <Chip icon={<StarIcon />} label="مشاركة صفية +5" size="small" sx={{ bgcolor: '#ff9800', color: '#fff' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* برنامج الامتحانات */}
      <Paper sx={{ p: 3, borderRadius: 4 }}>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <EventNoteIcon sx={{ color: '#1976d2', fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>📅 برنامج الامتحانات</Typography>
        </Box>

        {exams.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 3 }}>لا توجد امتحانات مسجلة حالياً</Alert>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>المادة</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>الوقت</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>القاعة</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>الأستاذ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id} hover>
                  <TableCell><Chip label={exam.subject} size="small" color="primary" /></TableCell>
                  <TableCell><Box display="flex" alignItems="center" gap={0.5}><CalendarTodayIcon fontSize="small" color="action" />{exam.date}</Box></TableCell>
                  <TableCell><Box display="flex" alignItems="center" gap={0.5}><AccessTimeIcon fontSize="small" color="action" />{exam.time}</Box></TableCell>
                  <TableCell><Box display="flex" alignItems="center" gap={0.5}><MeetingRoomIcon fontSize="small" color="action" />{exam.room}</Box></TableCell>
                  <TableCell>{exam.teacher}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Toast open={toast.open} onClose={() => setToast({ ...toast, open: false })} message={toast.message} severity={toast.severity} />
    </Box>
  );
};

export default Dashboard;