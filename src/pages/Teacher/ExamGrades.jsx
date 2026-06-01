import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Grid, TextField, Button, Alert,
  CircularProgress, MenuItem, Typography, Avatar,
  Table, TableHead, TableRow, TableCell, TableBody,
  Chip, Divider, InputAdornment,
} from '@mui/material';
import {
  Grade as GradeIcon,
  School as SchoolIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import {
  getTeacherSubjects,
  getExamsByCourse,
  getExamStudents,
  saveExamGrades,
} from '../../services/teacherService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const ExamGrades = () => {
  const [step, setStep]           = useState(1); 
  const [courses, setCourses]     = useState([])
  const [exams, setExams]         = useState([])
  const [students, setStudents]   = useState([])
  const [marks, setMarks]         = useState({});
  const [examInfo, setExamInfo]   = useState(null);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedExam, setSelectedExam]     = useState('');

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingExams, setLoadingExams]     = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving]                   = useState(false);

  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const data = await getTeacherSubjects();
        setCourses(Array.isArray(data) ? data : data?.data || []);
      } catch {
        setToast({ open: true, message: 'خطأ في جلب المواد', severity: 'error' });
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseChange = async (courseName) => {
    setSelectedCourse(courseName);
    setSelectedExam('');
    setExams([]);
    setStudents([]);
    setMarks({});
    setStep(1);

    if (!courseName) return;
    setLoadingExams(true);
    try {
      const data = await getExamsByCourse(courseName);
      const list = data?.exams || (Array.isArray(data) ? data : []);
      setExams(list);
    } catch {
      setToast({ open: true, message: 'خطأ في جلب الامتحانات', severity: 'error' });
    } finally {
      setLoadingExams(false);
    }
  };

  const handleExamChange = async (examId) => {
    setSelectedExam(examId);
    setStudents([]);
    setMarks({});
    setStep(1);

    if (!examId) return;
    setLoadingStudents(true);
    try {
      const data = await getExamStudents(examId);
      const sList = data?.students || [];
      setExamInfo(data?.exam || null);
      setStudents(sList);

      const existing = {};
      sList.forEach(s => {
        if (s.mark !== null && s.mark !== undefined) existing[s.id] = String(s.mark);
      });
      setMarks(existing);
      setStep(2);
    } catch {
      setToast({ open: true, message: 'خطأ في جلب طلاب الامتحان', severity: 'error' });
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleMarkChange = (studentId, value) => {
    const num = value === '' ? '' : Math.min(100, Math.max(0, Number(value)));
    setMarks(prev => ({ ...prev, [studentId]: num === '' ? '' : String(num) }));
  };

  const handleSave = async () => {
    const grades = students
      .filter(s => marks[s.id] !== '' && marks[s.id] !== undefined)
      .map(s => ({ student_id: s.id, mark: parseFloat(marks[s.id]) }));

    if (grades.length === 0) {
      setToast({ open: true, message: 'أدخل علامة واحدة على الأقل', severity: 'warning' });
      return;
    }

    setSaving(true);
    try {
      await saveExamGrades(selectedExam, grades);
      setToast({ open: true, message: `تم حفظ ${grades.length} علامة بنجاح ✅`, severity: 'success' });
    } catch (err) {
      setToast({ open: true, message: err.response?.data?.message || 'فشل في حفظ العلامات', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const markColor = (mark) => {
    if (mark === '' || mark === undefined) return { bg: '#f5f5f5', color: '#999' };
    const n = parseFloat(mark);
    if (n >= 85) return { bg: '#e8f5e9', color: '#2e7d32' };
    if (n >= 60) return { bg: '#fff3e0', color: '#e65100' };
    return { bg: '#ffebee', color: '#c62828' };
  };

  const filledCount = students.filter(s => marks[s.id] !== '' && marks[s.id] !== undefined).length;

  return (
    <Box>
      <PageHeader
        title="إضافة علامات الامتحان"
        subtitle="أدخل علامات الطلاب لكل امتحان وسيظهر عندهم في صفحة الدرجات"
        icon={<GradeIcon sx={{ fontSize: 20 }} />}
      />

      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#1565c0' }}>
          الخطوة 1 — اختر المادة والامتحان
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="المادة"
              fullWidth
              value={selectedCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
              disabled={loadingCourses}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SchoolIcon sx={{ color: '#1976d2' }} />
                  </InputAdornment>
                ),
              }}
            >
              {loadingCourses
                ? <MenuItem disabled>جاري التحميل...</MenuItem>
                : courses.map(c => <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>)
              }
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              label="الامتحان"
              fullWidth
              value={selectedExam}
              onChange={(e) => handleExamChange(e.target.value)}
              disabled={!selectedCourse || loadingExams}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GradeIcon sx={{ color: '#1976d2' }} />
                  </InputAdornment>
                ),
              }}
            >
              {loadingExams
                ? <MenuItem disabled>جاري التحميل...</MenuItem>
                : exams.length === 0
                  ? <MenuItem disabled>لا توجد امتحانات لهذه المادة</MenuItem>
                  : exams.map(e => <MenuItem key={e.id} value={e.id}>{e.title}</MenuItem>)
              }
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {loadingStudents && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
          <Typography sx={{ mr: 2, mt: 0.5 }}>جاري تحميل الطلاب...</Typography>
        </Box>
      )}

      {step === 2 && students.length > 0 && (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', p: 2, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
                الخطوة 2 — أدخل العلامات
              </Typography>
              <Typography variant="caption" sx={{ color: '#bbdefb' }}>
                {examInfo?.title} · {selectedCourse}
              </Typography>
            </Box>
            <Chip
              label={`${filledCount} / ${students.length} طالب`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 'bold' }}
            />
          </Box>

          <Box sx={{ p: 3 }}>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              العلامة من 0 إلى 100 
            </Alert>

            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>اسم الطالب</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: 180 }}>العلامة / 100</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, idx) => {
                  const val = marks[student.id];
                  const { bg, color } = markColor(val);
                  return (
                    <TableRow key={student.id} hover>
                      <TableCell sx={{ color: '#888' }}>{idx + 1}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2', fontSize: 14 }}>
                            {student.name?.charAt(0)}
                          </Avatar>
                          <Typography fontWeight="500">{student.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={val ?? ''}
                          onChange={(e) => handleMarkChange(student.id, e.target.value)}
                          inputProps={{ min: 0, max: 100, step: 0.5 }}
                          placeholder="—"
                          sx={{
                            width: 130,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: val !== '' && val !== undefined ? bg : '#fafafa',
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {val !== '' && val !== undefined ? (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label={`${val} / 100`}
                            size="small"
                            sx={{ bgcolor: bg, color, fontWeight: 'bold' }}
                          />
                        ) : (
                          <Chip label="لم تُدخَل" size="small" variant="outlined" sx={{ color: '#bbb', borderColor: '#ddd' }} />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <Divider sx={{ my: 3 }} />

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                {filledCount} من {students.length} طالب تم إدخال علامتهم
              </Typography>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                onClick={handleSave}
                disabled={saving || filledCount === 0}
                sx={{ borderRadius: 2, px: 4, bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
              >
                {saving ? 'جاري الحفظ...' : 'حفظ العلامات'}
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {step === 2 && students.length === 0 && !loadingStudents && (
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          لا يوجد طلاب مسجلين في هذه المادة بعد
        </Alert>
      )}

      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </Box>
  );
};

export default ExamGrades;
