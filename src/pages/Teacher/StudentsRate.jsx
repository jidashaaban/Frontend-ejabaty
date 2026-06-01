import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Grid, TextField, Button, Alert,
  CircularProgress, InputAdornment, MenuItem,
} from '@mui/material';
import {
  School as SchoolIcon, Star as StarIcon, Comment as CommentIcon,
} from '@mui/icons-material';
import { submitQuizPoints, getTeacherSubjects, getAllStudents } from '../../services/teacherService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const StudentsRate = () => {
  const [submitting, setSubmitting] = useState(false);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ course_name: '', student_name: '', points: '', comment: '' });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, coursesData] = await Promise.all([
          getAllStudents(),
          getTeacherSubjects(),
        ]);
        const sList = Array.isArray(studentsData) ? studentsData : studentsData?.data || [];
        const cList = Array.isArray(coursesData) ? coursesData : coursesData?.data || coursesData?.courses || [];
        setStudents(sList);
        setCourses(cList);
      } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!formData.course_name || !formData.student_name || !formData.points) {
      setToast({ open: true, message: 'الرجاء إدخال جميع الحقول المطلوبة', severity: 'error' });
      return;
    }
    const pointsNum = parseInt(formData.points);
    if (isNaN(pointsNum) || pointsNum < 0 || pointsNum > 100) {
      setToast({ open: true, message: 'عدد النقاط يجب أن يكون بين 0 و 100', severity: 'error' });
      return;
    }
    setSubmitting(true);
    try {
      await submitQuizPoints({ ...formData, points: pointsNum });
      setToast({ open: true, message: 'تم إضافة نقاط الطالب بنجاح', severity: 'success' });
      setFormData({ course_name: '', student_name: '', points: '', comment: '' });
    } catch (error) {
      setToast({ open: true, message: error.response?.data?.message || 'فشل في إضافة النقاط', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="تقييم الطلاب"
        subtitle="إضافة نقاط للطلاب في الاختبارات"
        icon={<StarIcon sx={{ fontSize: 20 }} />}
      />

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          اختر المادة والطالب من القائمة ثم أدخل عدد النقاط.
        </Alert>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="المادة"
              fullWidth
              value={formData.course_name}
              onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
              InputProps={{ startAdornment: <InputAdornment position="start"><SchoolIcon sx={{ color: '#1976d2' }} /></InputAdornment> }}
            >
              {courses.map((c) => (
                <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select={students.length > 0}
              label="الطالب"
              fullWidth
              value={formData.student_name}
              onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
              placeholder="اسم الطالب كما هو مسجل في النظام"
            >
              {students.map((s) => (
                <MenuItem key={s.id} value={s.name}>{s.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="عدد النقاط"
              type="number"
              fullWidth
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: e.target.value })}
              helperText="أدخل عدد النقاط (0-100)"
              InputProps={{
                startAdornment: <InputAdornment position="start"><StarIcon sx={{ color: '#1976d2' }} /></InputAdornment>,
                inputProps: { min: 0, max: 100 },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="ملاحظات (اختياري)"
              fullWidth
              multiline
              rows={2}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              InputProps={{ startAdornment: <InputAdornment position="start"><CommentIcon sx={{ color: '#1976d2' }} /></InputAdornment> }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting || !formData.course_name || !formData.student_name || !formData.points}
              sx={{ borderRadius: 2, px: 4, py: 1, bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
            >
              {submitting ? <CircularProgress size={24} /> : 'إضافة نقاط'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Toast open={toast.open} onClose={() => setToast({ ...toast, open: false })} message={toast.message} severity={toast.severity} />
    </Box>
  );
};

export default StudentsRate;
