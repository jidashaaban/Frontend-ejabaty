import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Star as StarIcon,
  Comment as CommentIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import {
  getStudents,
  addStudentEvaluation,
  getStudentEvaluations,
  updateStudentEvaluation,
  deleteStudentEvaluation,
} from '../../services/teacherService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const StudentsRate = () => {
  const { user } = useSelector((state) => state.auth);
  const [students, setStudents] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    subject: '',
    points: '',
    notes: '',
  });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const subjects = [
    'الرياضيات',
    'الفيزياء',
    'الكيمياء',
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsData, evaluationsData] = await Promise.all([
        getStudents(),
        getStudentEvaluations(user?.id || 1),
      ]);
      setStudents(studentsData || []);
      setEvaluations(evaluationsData || []);
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
      setStudents([
        { id: 1, name: 'أحمد محمد', class: 'الثاني علمي' },
        { id: 2, name: 'سارة خالد', class: 'الثاني علمي' },
        { id: 3, name: 'محمد علي', class: 'الثالث علمي' },
        { id: 4, name: 'نور حسين', class: 'الثالث علمي' },
      ]);
      setEvaluations([
        { id: 1, studentId: 1, studentName: 'أحمد محمد', subject: 'الرياضيات', points: 15, notes: 'متميز في حل المسائل', date: '2026-04-25' },
        { id: 2, studentId: 2, studentName: 'سارة خالد', subject: 'الفيزياء', points: 10, notes: 'مشاركة ممتازة', date: '2026-04-24' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleOpenAddDialog = () => {
    setEditingEvaluation(null);
    setFormData({
      studentId: '',
      studentName: '',
      subject: '',
      points: '',
      notes: '',
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (evaluation) => {
    setEditingEvaluation(evaluation);
    setFormData({
      studentId: evaluation.studentId,
      studentName: evaluation.studentName,
      subject: evaluation.subject,
      points: evaluation.points,
      notes: evaluation.notes || '',
    });
    setOpenDialog(true);
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    const student = students.find(s => s.id === parseInt(studentId));
    setFormData({
      ...formData,
      studentId: studentId,
      studentName: student?.name || '',
    });
  };

  const handleSave = async () => {
    if (!formData.studentId || !formData.subject || !formData.points) {
      setToast({ open: true, message: 'الرجاء تعبئة جميع الحقول المطلوبة', severity: 'error' });
      return;
    }

    try {
      if (editingEvaluation) {
        await updateStudentEvaluation(editingEvaluation.id, {
          ...formData,
          points: parseInt(formData.points),
          teacherId: user?.id || 1,
          date: new Date().toISOString().split('T')[0],
        });
        setToast({ open: true, message: 'تم تعديل التقييم بنجاح', severity: 'success' });
      } else {
        await addStudentEvaluation({
          ...formData,
          points: parseInt(formData.points),
          teacherId: user?.id || 1,
          date: new Date().toISOString().split('T')[0],
        });
        setToast({ open: true, message: 'تم إضافة التقييم بنجاح', severity: 'success' });
      }
      setOpenDialog(false);
      fetchData();
    } catch (error) {
      setToast({ open: true, message: error.message || 'حدث خطأ', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
      try {
        await deleteStudentEvaluation(id);
        setToast({ open: true, message: 'تم حذف التقييم بنجاح', severity: 'success' });
        fetchData();
      } catch (error) {
        setToast({ open: true, message: error.message || 'حدث خطأ', severity: 'error' });
      }
    }
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
        title="تقييم الطلاب"
        subtitle="إضافة نقاط وملاحظات للطلاب"
        icon={<StarIcon sx={{ fontSize: 20 }} />}
      />

      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 0.8,
            bgcolor: '#1976d2',
            '&:hover': { bgcolor: '#1565c0' },
          }}
        >
          إضافة تقييم جديد
        </Button>
      </Box>

      <Paper
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid #1976d2',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            p: 1.5,
            px: 2,
            color: '#fff',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
             قائمة تقييمات الطلاب
          </Typography>
        </Box>

        <Box sx={{ p: 2 }}>
          {evaluations.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 2 }}>لا توجد تقييمات حتى الآن</Alert>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>اسم الطالب</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>المادة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>النقاط</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>الملاحظات</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>التاريخ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>إجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {evaluations.map((evaluation, index) => (
                  <TableRow key={evaluation.id} hover sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{index + 1}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <PersonIcon sx={{ color: '#1976d2', fontSize: 16 }} />
                        {evaluation.studentName}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                      <Chip label={evaluation.subject} size="small" sx={{ bgcolor: '#e3f2fd', color: '#1565c0', height: 22 }} />
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                      <Chip label={`${evaluation.points} نقطة`} size="small" sx={{ bgcolor: '#fff3e0', color: '#ed6c02' }} />
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                      {evaluation.notes || '-'}
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{evaluation.date}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                      <IconButton onClick={() => handleOpenEditDialog(evaluation)} color="primary" size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(evaluation.id)} color="error" size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1976d2', color: '#fff' }}>
          {editingEvaluation ? '✏️ تعديل تقييم' : '➕ إضافة تقييم جديد'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            select
            label="اسم الطالب"
            fullWidth
            margin="normal"
            value={formData.studentId}
            onChange={handleStudentChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: '#1976d2' }} />
                </InputAdornment>
              ),
            }}
          >
            {students.map((student) => (
              <MenuItem key={student.id} value={student.id}>
                {student.name} - {student.class}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="المادة"
            fullWidth
            margin="normal"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SchoolIcon sx={{ color: '#1976d2' }} />
                </InputAdornment>
              ),
            }}
          >
            {subjects.map((subject) => (
              <MenuItem key={subject} value={subject}>
                {subject}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="عدد النقاط"
            type="number"
            fullWidth
            margin="normal"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: e.target.value })}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StarIcon sx={{ color: '#1976d2' }} />
                </InputAdornment>
              ),
              inputProps: { min: 0, max: 100 },
            }}
            helperText="أدخل عدد النقاط (1-100)"
          />

          <TextField
            label="ملاحظات (اختياري)"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CommentIcon sx={{ color: '#1976d2' }} />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">
            إلغاء
          </Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#1976d2' }}>
            {editingEvaluation ? 'تعديل' : 'حفظ'}
          </Button>
        </DialogActions>
      </Dialog>

      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </Box>
  );
};

export default StudentsRate;