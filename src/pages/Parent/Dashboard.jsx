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
} from '@mui/material';
import {
  Star as StarIcon,
  EmojiEvents as EmojiEventsIcon,
  EventNote as EventNoteIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  MeetingRoom as MeetingRoomIcon,
} from '@mui/icons-material';
import { getStudentInfo, getStudentPoints, getStudentExams } from '../../services/parentService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const Dashboard = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [points, setPoints] = useState(0);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const studentData = await getStudentInfo();
        setStudentInfo(studentData);
        const pointsData = await getStudentPoints(studentData.id);
        setPoints(pointsData.points || 0);
        const examsData = await getStudentExams(studentData.id);
        setExams(examsData || []);
      } catch (error) {
        setStudentInfo({ id: 1, name: 'أحمد محمد', class: 'الصف التاسع' });
        setPoints(250);
        setExams([
          { id: 1, subject: 'الرياضيات', date: '2026-04-25', time: '10:00-12:00', room: 'قاعة 101', teacher: 'أ. أحمد' },
          { id: 2, subject: 'الفيزياء', date: '2026-04-27', time: '10:00-12:00', room: 'قاعة 102', teacher: 'أ. سارة' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={50} />
        <Typography sx={{ mr: 2 }}>جاري تحميل البيانات...</Typography>
      </Box>
    );
  }

  const progress = points >= 500 ? 100 : (points / 500) * 100;
  const levelText = points >= 400 ? 'ممتاز' : points >= 250 ? 'جيد جداً' : points >= 100 ? 'جيد' : 'يحتاج للتحسين';

  return (
    <Box>
      <PageHeader
        title="لوحة التحكم"
        subtitle="تابع تقدم ابنك الدراسي ونقاطه وبرنامج امتحاناته"
        icon={<SchoolIcon sx={{ fontSize: 20 }} />}
      />

      {/* بطاقة معلومات الطالب */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
        }}
      >
        <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
          <Avatar sx={{ width: 70, height: 70, bgcolor: 'rgba(255,255,255,0.2)', border: '2px solid #fff' }}>
            <PersonIcon sx={{ fontSize: 45 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{studentInfo?.name || 'الطالب'}</Typography>
            <Box display="flex" gap={2} mt={1}>
              <Chip label={`الصف: ${studentInfo?.class || 'غير محدد'}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
              <Chip label={`المستوى: ${levelText}`} size="small" sx={{ bgcolor: '#ff9800', color: '#fff' }} />
            </Box>
          </Box>
          <Box flexGrow={1} />
          <Box textAlign="center">
            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>{points}</Typography>
            <Typography variant="body2">نقطة</Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ width: 150, height: 8, borderRadius: 4, mt: 1, bgcolor: 'rgba(255,255,255,0.3)', '& .MuiLinearProgress-bar': { bgcolor: '#ffd700' } }} />
          </Box>
        </Box>
      </Paper>

      {/* نقاط الطالب */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: '#ff9800', width: 56, height: 56 }}>
                    <EmojiEventsIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="text.secondary">نقاط الطالب</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>{points} نقطة</Typography>
                  </Box>
                </Box>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip icon={<StarIcon />} label="حضور يومي +5" sx={{ bgcolor: '#ff9800', color: '#fff' }} />
                  <Chip icon={<StarIcon />} label="درجة امتياز +15" sx={{ bgcolor: '#ff9800', color: '#fff' }} />
                  <Chip icon={<StarIcon />} label="سلوك ممتاز +10" sx={{ bgcolor: '#ff9800', color: '#fff' }} />
                </Box>
              </Box>
              <LinearProgress variant="determinate" value={progress} sx={{ mt: 3, height: 10, borderRadius: 5 }} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {points} / 500 نقطة - المستوى: {levelText}
              </Typography>
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