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
  Divider,
} from '@mui/material';
import {
  Star as StarIcon,
  EmojiEvents as EmojiEventsIcon,
  Assignment as AssignmentIcon,
  EventNote as EventNoteIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  School as SchoolIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { getStudentInfo, getStudentPoints, getStudentExams, getStudentNotes } from '../../services/parentService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const Dashboard = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [points, setPoints] = useState(0);
  const [exams, setExams] = useState([]);
  const [notes, setNotes] = useState([]);
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
        
        const notesData = await getStudentNotes(studentData.id);
        setNotes(notesData || []);
      } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
        setToast({ open: true, message: 'فشل في جلب البيانات', severity: 'error' });
        
        setStudentInfo({ id: 1, name: 'أحمد محمد', class: 'الصف التاسع' });
        setPoints(250);
        setExams([
          { id: 1, subject: 'الرياضيات', date: '2026-04-25', time: '10:00-12:00', room: 'قاعة 101' },
          { id: 2, subject: 'الفيزياء', date: '2026-04-27', time: '10:00-12:00', room: 'قاعة 102' },
          { id: 3, subject: 'الكيمياء', date: '2026-04-29', time: '10:00-12:00', room: 'مختبر الكيمياء' },
        ]);
        setNotes([
          { id: 1, subject: 'الرياضيات', note: 'الطالب ممتاز ويحتاج إلى تشجيع', date: '2026-04-20', teacher: 'أ. أحمد' },
          { id: 2, subject: 'الفيزياء', note: 'يحتاج إلى مراجعة قوانين نيوتن', date: '2026-04-18', teacher: 'أ. سارة' },
          { id: 3, subject: 'اللغة العربية', note: 'تميز في الإملاء', date: '2026-04-15', teacher: 'أ. خالد' },
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
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل البيانات...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="لوحة تحكم ولي الأمر"
        subtitle="تابع تقدم ابنك الدراسي ونقاطه وبرنامج امتحاناته"
        icon={<SchoolIcon sx={{ fontSize: 20 }} />}
      />

      <Paper sx={{ p: 3, mb: 4, borderRadius: 4, bgcolor: 'linear-gradient(135deg, #e3f2fd 0%, #bbdef5 100%)' }}>
        <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
          <Avatar sx={{ width: 80, height: 80, bgcolor: '#1976d2' }}>
            <PersonIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
              {studentInfo?.name || 'الطالب'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              الصف: {studentInfo?.class || 'غير محدد'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* بطاقة النقاط */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 4,
              background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
                <EmojiEventsIcon sx={{ color: '#ff9800', fontSize: 40 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>
                  نقاط الطالب
                </Typography>
              </Box>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#ed6c02', mb: 1 }}>
                {points}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                نقطة
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                <Chip
                  icon={<StarIcon />}
                  label={`${points} نقطة`}
                  sx={{ bgcolor: '#ff9800', color: '#fff' }}
                />
                <Chip
                  icon={<CheckCircleIcon />}
                  label="نشط"
                  sx={{ bgcolor: '#4caf50', color: '#fff' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 4, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <AssignmentIcon sx={{ color: '#1976d2' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  ملاحظات الأساتذة
                </Typography>
              </Box>
              {notes.length === 0 ? (
                <Alert severity="info">لا توجد ملاحظات حتى الآن</Alert>
              ) : (
                notes.map((note) => (
                  <Box key={note.id} sx={{ mb: 2 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Chip label={note.subject} size="small" color="primary" />
                        <Typography variant="caption" color="text.secondary">
                          {note.teacher} | {note.date}
                        </Typography>
                      </Box>
                      <Typography variant="body2">{note.note}</Typography>
                    </Paper>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 4, borderRadius: 4 }}>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <EventNoteIcon sx={{ color: '#1976d2' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            برنامج الامتحانات
          </Typography>
        </Box>

        {exams.length === 0 ? (
          <Alert severity="info">لا توجد امتحانات مسجلة حالياً</Alert>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>المادة</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>الوقت</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>القاعة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id} hover>
                  <TableCell>{exam.subject}</TableCell>
                  <TableCell>{exam.date}</TableCell>
                  <TableCell>{exam.time}</TableCell>
                  <TableCell>{exam.room}</TableCell>
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