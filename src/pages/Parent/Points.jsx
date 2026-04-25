// src/pages/Parent/Points.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Star as StarIcon,
  EmojiEvents as EmojiEventsIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { getStudentPoints, getStudentNotes } from '../../services/parentService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const Points = () => {
  const [points, setPoints] = useState(0);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const pointsData = await getStudentPoints(1);
        setPoints(pointsData.points || 250);
        const notesData = await getStudentNotes(1);
        setNotes(notesData || []);
      } catch (error) {
        setPoints(250);
        setNotes([
          { id: 1, subject: 'الرياضيات', note: '👍 الطالب متميز جداً ويحتاج إلى تشجيع مستمر', date: '2026-04-20', teacher: 'أ. أحمد' },
          { id: 2, subject: 'الفيزياء', note: '📚 يحتاج إلى مراجعة قوانين نيوتن قبل الاختبار', date: '2026-04-18', teacher: 'أ. سارة' },
          { id: 3, subject: 'اللغة العربية', note: '🌟 تميز في الإملاء والقواعد', date: '2026-04-15', teacher: 'أ. خالد' },
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
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mr: 2 }}>جاري تحميل البيانات...</Typography>
      </Box>
    );
  }

  const level = points >= 400 ? 'ممتاز' : points >= 250 ? 'جيد جداً' : points >= 100 ? 'جيد' : 'يحتاج للتحسين';
  const nextLevel = points >= 400 ? '500 نقطة (مستوى ممتاز)' : points >= 250 ? '400 نقطة' : points >= 100 ? '250 نقطة' : '100 نقطة';
  const progress = points >= 500 ? 100 : (points / 500) * 100;
  const steps = ['بداية المشوار', 'مستوى جيد', 'مستوى جيد جداً', 'مستوى ممتاز'];
  const activeStep = points >= 400 ? 3 : points >= 250 ? 2 : points >= 100 ? 1 : 0;

  return (
    <Box>
      <PageHeader
        title="نقاط الطالب وملاحظات الأساتذة"
        subtitle="تابع مستوى ابنك التحفيزي واطلع على ملاحظات الأساتذة"
        icon={<StarIcon sx={{ fontSize: 20 }} />}
      />

      <Grid container spacing={4}>
        {/* القسم الأيمن: النقاط والمستوى */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Box textAlign="center" mb={3}>
                <Avatar sx={{ width: 70, height: 70, bgcolor: '#ff9800', margin: '0 auto', mb: 2 }}>
                  <EmojiEventsIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>{points}</Typography>
                <Typography variant="h6" sx={{ color: '#ed6c02', mb: 1 }}>نقطة</Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 12, borderRadius: 6, mb: 2 }} />
                <Typography variant="body2" color="text.secondary">المستوى الحالي: <strong style={{ color: '#ed6c02' }}>{level}</strong></Typography>
                <Typography variant="caption" color="text.secondary">المستوى التالي: {nextLevel}</Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon color="primary" /> رحلة التميز
              </Typography>
              <Stepper activeStep={activeStep} orientation="vertical" sx={{ mt: 2 }}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel StepIconProps={{ sx: { color: index <= activeStep ? '#ff9800' : '#ccc' } }}>
                      <Typography variant="body2" sx={{ color: index <= activeStep ? '#ed6c02' : '#999', fontWeight: index === activeStep ? 'bold' : 'normal' }}>
                        {label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" gutterBottom>🏆 كيف تحصل على النقاط؟</Typography>
              <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
                <Chip icon={<StarIcon />} label="حضور يومي +5" size="small" sx={{ bgcolor: '#ff9800', color: '#fff' }} />
                <Chip icon={<StarIcon />} label="درجة امتياز +15" size="small" sx={{ bgcolor: '#ff9800', color: '#fff' }} />
                <Chip icon={<StarIcon />} label="سلوك ممتاز +10" size="small" sx={{ bgcolor: '#ff9800', color: '#fff' }} />
                <Chip icon={<StarIcon />} label="مشاركة صفية +5" size="small" sx={{ bgcolor: '#ff9800', color: '#fff' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* القسم الأيسر: ملاحظات الأساتذة */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <AssignmentIcon sx={{ color: '#1976d2', fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>📝 ملاحظات الأساتذة</Typography>
              </Box>

              {notes.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 3 }}>لا توجد ملاحظات حتى الآن</Alert>
              ) : (
                notes.map((note, index) => (
                  <Paper
                    key={note.id}
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      mb: 2,
                      borderRadius: 3,
                      transition: '0.3s',
                      '&:hover': { backgroundColor: '#f8f9fa', transform: 'translateX(-5px)' },
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Chip label={note.subject} size="small" color="primary" />
                      <Typography variant="caption" color="text.secondary">
                        {note.teacher} | {note.date}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.6 }}>
                      {note.note}
                    </Typography>
                  </Paper>
                ))
              )}

              {notes.length > 0 && (
                <Box mt={2} pt={2} borderTop="1px solid #e0e0e0">
                  <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={1}>
                    <StarIcon sx={{ fontSize: 14, color: '#ff9800' }} />
                    الملاحظات الإيجابية تساعد في تحسين مستوى الطالب
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Toast open={toast.open} onClose={() => setToast({ ...toast, open: false })} message={toast.message} severity={toast.severity} />
    </Box>
  );
};

export default Points;