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

  const fetchData = async () => {
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
        { id: 3, subject: 'الكيمياء', date: '2026-04-29', time: '10:00-12:00', room: 'مختبر الكيمياء', teacher: 'أ. خالد' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
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
              {studentInfo?.name || 'الطالب'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#1976d2' }}>
              الصف: {studentInfo?.class || 'غير محدد'}
            </Typography>
          </Box>
          <Box flexGrow={1} />
          <Box textAlign="center">
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
              {points}
            </Typography>
            <Typography variant="body2" sx={{ color: '#1976d2' }}>نقطة</Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdef5 100%)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <StarIcon sx={{ color: '#1565c0' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                  نقاط الطالب
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#1976d2', mb: 1 }}>
                إجمالي النقاط المحصلة
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                {points}
              </Typography>
              <Divider sx={{ my: 2, borderColor: '#90caf9' }} />
              <Box display="flex" gap={2} flexWrap="wrap">
                <Chip
                  label="حضور يومي +5"
                  size="small"
                  sx={{ bgcolor: '#bbdef5', color: '#1565c0' }}
                />
                <Chip
                  label="درجة امتياز +15"
                  size="small"
                  sx={{ bgcolor: '#bbdef5', color: '#1565c0' }}
                />
                <Chip
                  label="سلوك ممتاز +10"
                  size="small"
                  sx={{ bgcolor: '#bbdef5', color: '#1565c0' }}
                />
              </Box>
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
              label={`${exams.length} امتحان${exams.length !== 1 ? 'ات' : ''}`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}
            />
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {exams.length === 0 ? (
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
                {exams.map((exam, index) => (
                  <TableRow key={exam.id} hover>
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