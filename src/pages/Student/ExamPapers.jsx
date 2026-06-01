import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Chip, CircularProgress,
  Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Divider, Avatar, IconButton, Collapse, Tooltip, Badge,
} from '@mui/material';
import {
  MenuBook as MenuBookIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  EmojiEvents as TrophyIcon,
  QuestionAnswer as QAIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import { apiClient } from '../../services/studentService';

const getMyExamPapers = async () => {
  const res = await apiClient.get('/student/exam-papers');
  return res.data;
};
const markColor = (mark) => {
  if (mark === null || mark === undefined) return '#78909c';
  if (mark >= 80) return '#2e7d32';
  if (mark >= 60) return '#e65100';
  return '#c62828';
};

const markLabel = (mark) => {
  if (mark === null || mark === undefined) return 'لم تُسجَّل';
  if (mark >= 80) return 'ممتاز';
  if (mark >= 60) return 'جيد';
  return 'بحاجة لمراجعة';
};

function QuestionRow({ question, index }) {
  const [open, setOpen] = useState(false);
  return (
    <Box
      sx={{
        mb: 1.5,
        borderRadius: 3,
        border: '1.5px solid',
        borderColor: open ? '#1976d2' : '#e8edf2',
        overflow: 'hidden',
        transition: 'border-color .2s',
        background: open ? 'rgba(25,118,210,0.03)' : '#fff',
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={1.5}
        px={2}
        py={1.5}
        sx={{ cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setOpen(p => !p)}
      >
        <Avatar
          sx={{
            width: 30, height: 30, fontSize: 13, fontWeight: 800,
            bgcolor: open ? '#1976d2' : '#e3edf7',
            color: open ? '#fff' : '#1976d2',
            flexShrink: 0,
            transition: 'all .2s',
          }}
        >
          {index + 1}
        </Avatar>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ flex: 1, color: '#1a2332', direction: 'rtl', textAlign: 'right' }}
        >
          {question.question}
        </Typography>
        <Tooltip title={open ? 'إخفاء الإجابة' : 'عرض الإجابة الصحيحة'}>
          <IconButton size="small" sx={{ color: open ? '#1976d2' : '#90a4ae' }}>
            {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={open}>
        <Divider />
        <Box
          display="flex"
          alignItems="flex-start"
          gap={1.5}
          px={2}
          py={1.5}
          sx={{ background: 'linear-gradient(90deg,#e8f5e9 0%,#f1f8e9 100%)' }}
        >
          <LightbulbIcon sx={{ color: '#388e3c', fontSize: 20, mt: 0.2, flexShrink: 0 }} />
          <Box>
            <Typography variant="caption" color="#388e3c" fontWeight={700} sx={{ display: 'block', mb: 0.3 }}>
              الإجابة الصحيحة
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#1b5e20', fontWeight: 500, direction: 'rtl', textAlign: 'right', whiteSpace: 'pre-wrap' }}
            >
              {question.correct_answer || '—'}
            </Typography>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
function ExamDialog({ exam, open, onClose }) {
  if (!exam) return null;
  const { title, course_name, course_code, published_at, my_mark, questions } = exam;
  const color = markColor(my_mark);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
    >
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #1a237e 100%)',
          px: 3, py: 2.5,
          display: 'flex', alignItems: 'flex-start', gap: 2,
        }}
      >
        <Box flex={1}>
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: 2, fontSize: 11 }}>
            نموذج الامتحان وسلم التصحيح
          </Typography>
          <Typography variant="h6" fontWeight={800} color="#fff" sx={{ lineHeight: 1.3, mb: 0.5 }}>
            {title}
          </Typography>
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Chip
              label={course_name}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, fontSize: 12 }}
            />
            <Chip
              label={course_code}
              size="small"
              variant="outlined"
              sx={{ borderColor: 'rgba(255,255,255,0.4)', color: 'rgba(255,255,255,0.8)', fontSize: 11 }}
            />
            <Box display="flex" alignItems="center" gap={0.5}>
              <CalendarIcon sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>{published_at}</Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            minWidth: 72, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.12)',
            borderRadius: 3, px: 2, py: 1,
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 0.2 }}>
            علامتي
          </Typography>
          <Typography variant="h5" fontWeight={900} sx={{ color: my_mark !== null ? '#ffeb3b' : 'rgba(255,255,255,0.4)' }}>
            {my_mark !== null ? my_mark : '—'}
          </Typography>
          {my_mark !== null && (
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>/100</Typography>
          )}
        </Box>

        <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(255,255,255,0.7)', alignSelf: 'flex-start' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 3, background: '#f8fafd' }}>
        <Box
          display="flex"
          gap={2}
          mb={3}
          sx={{ flexWrap: 'wrap' }}
        >
          <Box sx={{ flex: 1, minWidth: 140, bgcolor: '#fff', borderRadius: 3, p: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <QAIcon sx={{ color: '#1976d2', fontSize: 28, mb: 0.5 }} />
            <Typography variant="h5" fontWeight={800} color="#1565c0">{questions?.length || 0}</Typography>
            <Typography variant="caption" color="text.secondary">إجمالي الأسئلة</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 140, bgcolor: '#fff', borderRadius: 3, p: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <TrophyIcon sx={{ color, fontSize: 28, mb: 0.5 }} />
            <Typography variant="h5" fontWeight={800} sx={{ color }}>
              {my_mark !== null ? `${my_mark}/100` : '—'}
            </Typography>
            <Typography variant="caption" color="text.secondary">{markLabel(my_mark)}</Typography>
          </Box>
        </Box>

        <Typography variant="subtitle2" fontWeight={700} color="#1a2332" mb={1.5} display="flex" alignItems="center" gap={1}>
          <QAIcon fontSize="small" sx={{ color: '#1976d2' }} />
          الأسئلة وسلم التصحيح
          <Typography component="span" variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
            (اضغط على السؤال لعرض الإجابة)
          </Typography>
        </Typography>

        {questions && questions.length > 0 ? (
          questions.map((q, i) => <QuestionRow key={q.id} question={q} index={i} />)
        ) : (
          <Alert severity="info">لا توجد أسئلة مسجلة لهذا الامتحان</Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, background: '#f8fafd', borderTop: '1px solid #e8edf2' }}>
        <Button onClick={onClose} variant="contained" sx={{ borderRadius: 2, px: 3, bgcolor: '#1565c0', '&:hover': { bgcolor: '#0d47a1' } }}>
          إغلاق
        </Button>
      </DialogActions>
    </Dialog>
  );
}
function ExamCard({ exam, onClick }) {
  const { title, course_name, course_code, published_at, my_mark, questions } = exam;
  const color = markColor(my_mark);

  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: 4,
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        cursor: 'pointer',
        transition: 'all .22s',
        border: '1.5px solid transparent',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 28px rgba(21,101,192,0.15)',
          borderColor: '#1976d2',
        },
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box sx={{ height: 5, background: 'linear-gradient(90deg, #1565c0, #42a5f5)' }} />

        <Box p={2.5}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
            <Chip
              icon={<SchoolIcon sx={{ fontSize: '14px !important' }} />}
              label={course_name}
              size="small"
              sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 700, fontSize: 12 }}
            />
            <Chip
              label={course_code}
              size="small"
              variant="outlined"
              sx={{ borderColor: '#cfd8dc', color: '#546e7a', fontSize: 11 }}
            />
          </Box>

          <Typography
            variant="subtitle1"
            fontWeight={700}
            color="#1a2332"
            sx={{ mb: 1, direction: 'rtl', textAlign: 'right', lineHeight: 1.4 }}
          >
            {title}
          </Typography>

          <Divider sx={{ my: 1.5 }} />
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={0.7}>
              <CalendarIcon sx={{ fontSize: 14, color: '#90a4ae' }} />
              <Typography variant="caption" color="text.secondary">{published_at}</Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={`${questions?.length || 0} سؤال`}
                size="small"
                sx={{ bgcolor: '#f5f5f5', fontSize: 11 }}
              />
              {my_mark !== null ? (
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: `${color} !important` }} />}
                  label={`${my_mark}/100`}
                  size="small"
                  sx={{ bgcolor: `${color}18`, color, fontWeight: 700, fontSize: 12 }}
                />
              ) : (
                <Chip label="لم تُسجَّل علامة" size="small" sx={{ bgcolor: '#eceff1', color: '#78909c', fontSize: 11 }} />
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
export default function ExamPapers ()
{
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyExamPapers();
        setExams(res?.data || []);
      } catch (e) {
        setError('تعذّر تحميل النماذج الامتحانية. تحقق من الاتصال.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const byCourse = exams.reduce((acc, exam) => {
    const key = exam.course_name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(exam);
    return acc;
  }, {});

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" flexDirection="column" gap={2}>
        <CircularProgress size={48} sx={{ color: '#1565c0' }} />
        <Typography color="text.secondary">جاري تحميل النماذج الامتحانية…</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="النماذج الامتحانية"
        subtitle="اطّلع على نموذج الامتحان وسلم التصحيح لكل مادة"
        icon={<MenuBookIcon />}
      />

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

      {exams.length === 0 && !error ? (
        <Box
          textAlign="center"
          py={10}
          sx={{
            background: 'linear-gradient(135deg,#e3f2fd 0%,#f8fafd 100%)',
            borderRadius: 5,
            border: '2px dashed #bbdefb',
          }}
        >
          <MenuBookIcon sx={{ fontSize: 64, color: '#90caf9', mb: 2 }} />
          <Typography variant="h6" fontWeight={700} color="#1565c0" mb={1}>
            لا توجد نماذج منشورة بعد
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ستظهر هنا نماذج الامتحانات وسلالم التصحيح بعد نشرها من قِبَل الأستاذ
          </Typography>
        </Box>
      ) : (
        Object.entries(byCourse).map(([courseName, courseExams]) => (
          <Box key={courseName} mb={4}>
            <Box
              display="flex"
              alignItems="center"
              gap={1.5}
              mb={2}
              pb={1.5}
              sx={{ borderBottom: '2px solid #e3f2fd' }}
            >
              <Avatar sx={{ bgcolor: '#1565c0', width: 36, height: 36, fontSize: 16, fontWeight: 800 }}>
                {courseName?.[0] || 'M'}
              </Avatar>
              <Typography variant="h6" fontWeight={700} color="#1a2332">
                {courseName}
              </Typography>
              <Chip
                label={`${courseExams.length} نموذج`}
                size="small"
                sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 700 }}
              />
            </Box>

            <Grid container spacing={2.5}>
              {courseExams.map(exam => (
                <Grid item xs={12} sm={6} md={4} key={exam.exam_id}>
                  <ExamCard exam={exam} onClick={() => setSelected(exam)} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))
      )}
      <ExamDialog
        exam={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
      />
    </Box>
  );
}