import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  LinearProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Rating,
} from '@mui/material';
import {
  Star as StarIcon,
  EmojiEvents as EmojiEventsIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Science as ScienceIcon,
  MenuBook as MenuBookIcon,
  Calculate as CalculateIcon,
  HistoryEdu as HistoryEduIcon,
} from '@mui/icons-material';
import { getStudentPoints, getStudentNotes, getStudentGrades } from '../../services/parentService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const Points = () => {
  const [points, setPoints] = useState(0);
  const [grades, setGrades] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const pointsData = await getStudentPoints(1);
        setPoints(pointsData.points || 250);
        const gradesData = await getStudentGrades(1);
        setGrades(gradesData || []);
        const notesData = await getStudentNotes(1);
        setNotes(notesData || []);
      } catch (error) {
        setPoints(250);
        setGrades([
          { id: 1, subject: 'الرياضيات', grade: 92, maxGrade: 100, date: '2026-04-20', type: 'اختبار نهائي' },
          { id: 2, subject: 'الفيزياء', grade: 88, maxGrade: 100, date: '2026-04-18', type: 'اختبار شهري' },
          { id: 3, subject: 'الكيمياء', grade: 95, maxGrade: 100, date: '2026-04-15', type: 'اختبار نهائي' },
          { id: 4, subject: 'اللغة العربية', grade: 85, maxGrade: 100, date: '2026-04-10', type: 'اختبار شهري' },
          { id: 5, subject: 'اللغة الإنجليزية', grade: 90, maxGrade: 100, date: '2026-04-05', type: 'اختبار نهائي' },
        ]);
        setNotes([
          { id: 1, subject: 'الرياضيات', note: 'متميز في حل المسائل، استمر', date: '2026-04-20', teacher: 'أ. أحمد' },
          { id: 2, subject: 'الفيزياء', note: 'يحتاج إلى مراجعة قوانين نيوتن', date: '2026-04-18', teacher: 'أ. سارة' },
          { id: 3, subject: 'الكيمياء', note: 'تميز في التفاعلات الكيميائية', date: '2026-04-15', teacher: 'أ. خالد' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const averageGrade = grades.length > 0 
    ? Math.round(grades.reduce((sum, g) => sum + g.grade, 0) / grades.length) 
    : 0;

  const getSubjectIcon = (subject) => {
    const icons = {
      'الرياضيات': <CalculateIcon />,
      'الفيزياء': <ScienceIcon />,
      'الكيمياء': <ScienceIcon />,
      'اللغة العربية': <MenuBookIcon />,
      'اللغة الإنجليزية': <MenuBookIcon />,
    };
    return icons[subject] || <SchoolIcon />;
  };

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
        title="تقييم الطالب"
        subtitle="تابع علامات ابنك ونقاطه وملاحظات الأساتذة"
        icon={<StarIcon sx={{ fontSize: 20 }} />}
      />

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdef5 100%)',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4} textAlign="center">
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#1976d2',
                mx: 'auto',
                mb: 1,
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 45, color: '#fff' }} />
            </Avatar>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
              {points}
            </Typography>
            <Typography variant="body2" sx={{ color: '#1976d2' }}>نقطة</Typography>
            <Chip
              icon={<StarIcon />}
              label={points >= 400 ? 'ممتاز' : points >= 250 ? 'جيد جداً' : 'جيد'}
              size="small"
              sx={{ mt: 1, bgcolor: '#1976d2', color: '#fff' }}
            />
          </Grid>
          <Grid item xs={12} md={4} textAlign="center">
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#42a5f5',
                mx: 'auto',
                mb: 1,
              }}
            >
              <SchoolIcon sx={{ fontSize: 45, color: '#fff' }} />
            </Avatar>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
              {averageGrade}
            </Typography>
            <Typography variant="body2" sx={{ color: '#1976d2' }}>المتوسط العام</Typography>
            <Chip
              label={`${grades.length} اختبار`}
              size="small"
              sx={{ mt: 1, bgcolor: '#e3f2fd', color: '#1565c0' }}
            />
          </Grid>
          <Grid item xs={12} md={4} textAlign="center">
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#64b5f6',
                mx: 'auto',
                mb: 1,
              }}
            >
              <AssignmentIcon sx={{ fontSize: 45, color: '#fff' }} />
            </Avatar>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
              {notes.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#1976d2' }}>ملاحظة</Typography>
            <Chip
              label="من الأساتذة"
              size="small"
              sx={{ mt: 1, bgcolor: '#e3f2fd', color: '#1565c0' }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ mb: 4, borderRadius: 4, overflow: 'hidden' }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            p: 2,
            px: 3,
          }}
        >
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
             علامات الطالب
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          {grades.length === 0 ? (
            <Alert severity="info">لا توجد علامات مسجلة حالياً</Alert>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>المادة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>العلامة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>نوع الاختبار</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grades.map((grade) => (
                  <TableRow key={grade.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getSubjectIcon(grade.subject)}
                        <Typography fontWeight="500">{grade.subject}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${grade.grade} / ${grade.maxGrade}`}
                        size="small"
                        sx={{
                          bgcolor: grade.grade >= 90 ? '#e8f5e9' : grade.grade >= 70 ? '#fff3e0' : '#ffebee',
                          color: grade.grade >= 90 ? '#2e7d32' : grade.grade >= 70 ? '#ed6c02' : '#d32f2f',
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                    <TableCell>{grade.date}</TableCell>
                    <TableCell>
                      <Chip label={grade.type} size="small" variant="outlined" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 4,
              height: '100%',
              background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f9ff 100%)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40 }}>
                  <EmojiEventsIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                  نقاط الأنشطة الصفية
                </Typography>
              </Box>
              <Divider sx={{ mb: 2, borderColor: '#90caf9' }} />
              
              <Box textAlign="center" py={2}>
                <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  {points}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  إجمالي النقاط
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(points / 500) * 100}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: '#bbdef5',
                    '& .MuiLinearProgress-bar': { bgcolor: '#1976d2' },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {points} / 500 نقطة
                </Typography>
              </Box>

              <Divider sx={{ my: 2, borderColor: '#90caf9' }} />

              <Box display="flex" justifyContent="center" gap={1.5} flexWrap="wrap">
                <Chip icon={<StarIcon />} label="حضور يومي +5" sx={{ bgcolor: '#1976d2', color: '#fff' }} />
                <Chip icon={<StarIcon />} label="مشاركة صفية +5" sx={{ bgcolor: '#42a5f5', color: '#fff' }} />
                <Chip icon={<StarIcon />} label="درجة امتياز +15" sx={{ bgcolor: '#64b5f6', color: '#fff' }} />
                <Chip icon={<StarIcon />} label="سلوك ممتاز +10" sx={{ bgcolor: '#90caf9', color: '#fff' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 4,
              height: '100%',
              background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f9ff 100%)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <Avatar sx={{ bgcolor: '#42a5f5', width: 40, height: 40 }}>
                  <AssignmentIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                   ملاحظات الأساتذة
                </Typography>
              </Box>
              <Divider sx={{ mb: 2, borderColor: '#90caf9' }} />

              {notes.length === 0 ? (
                <Alert severity="info">لا توجد ملاحظات حتى الآن</Alert>
              ) : (
                notes.map((note) => (
                  <Paper
                    key={note.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 3,
                      bgcolor: '#f8f9fa',
                      borderRight: `4px solid #1976d2`,
                      transition: '0.3s',
                      '&:hover': { bgcolor: '#e3f2fd' },
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Chip
                        icon={getSubjectIcon(note.subject)}
                        label={note.subject}
                        size="small"
                        sx={{ bgcolor: '#1976d2', color: '#fff' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {note.teacher} | {note.date}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6 }}>
                      {note.note}
                    </Typography>
                  </Paper>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </Box>
  );
};

export default Points;