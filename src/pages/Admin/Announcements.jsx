import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  TextField,
  IconButton,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Switch,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MenuBook as MenuBookIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';
import {
  getAllCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  toggleCourseStatus,
} from '../../services/adminService';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    setFetching(true);
    try {
      const data = await getAllCourses();
      console.log(' المواد المستلمة:', data);
      
      let coursesArray = [];
      if (Array.isArray(data)) {
        coursesArray = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        coursesArray = data.data;
      } else {
        coursesArray = [];
      }
      
      setAnnouncements(coursesArray);
    } catch (error) {
      console.error('خطأ في جلب المواد:', error);
      setToast({ open: true, message: 'فشل في جلب المواد', severity: 'error' });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setCurrent({ 
      id: null,
      name: '',
      code: '',
      capacity: '',
      teacher_name: '',
      is_active: 0, 
    });
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setCurrent({ 
      id: row.id,
      name: row.name,
      code: row.code || '',
      capacity: row.capacity || '',
      teacher_name: row.teacher?.name || row.teacher_name || '',
      is_active: row.is_active !== undefined ? row.is_active : 0,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المادة؟')) {
      setLoading(true);
      try {
        await deleteCourse(id);
        setToast({ open: true, message: 'تم حذف المادة بنجاح', severity: 'success' });
        fetchData();
      } catch (error) {
        setToast({ open: true, message: error.response?.data?.message || 'فشل في حذف المادة', severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setTogglingId(id);
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await toggleCourseStatus(id, newStatus);
      setToast({ 
        open: true, 
        message: newStatus === 1 ? '✅ تم تفعيل المادة بنجاح' : '⏸️ تم تعطيل المادة بنجاح', 
        severity: 'success' 
      });
      fetchData(); 
    } catch (error) {
      console.error('خطأ في تغيير حالة المادة:', error);
      setToast({ 
        open: true, 
        message: error.response?.data?.message || 'فشل في تغيير حالة المادة', 
        severity: 'error' 
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleSave = async () => {
    if (!current.name || !current.name.trim()) {
      setToast({ open: true, message: 'الرجاء إدخال اسم المادة', severity: 'error' });
      return;
    }
    if (!current.code || !current.code.trim()) {
      setToast({ open: true, message: 'الرجاء إدخال كود المادة', severity: 'error' });
      return;
    }
    if (!current.capacity || parseInt(current.capacity) <= 0) {
      setToast({ open: true, message: 'الرجاء إدخال سعة صحيحة للمادة', severity: 'error' });
      return;
    }
    if (!current.teacher_name || !current.teacher_name.trim()) {
      setToast({ open: true, message: 'الرجاء إدخال اسم المعلم', severity: 'error' });
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        name: current.name,
        code: current.code,
        capacity: parseInt(current.capacity),
        teacher_name: current.teacher_name,
        is_active: current.is_active !== undefined ? current.is_active : 0,
      };
      
      if (current.id) {
        await updateCourse(current.id, payload);
        setToast({ open: true, message: 'تم تعديل المادة بنجاح', severity: 'success' });
      } else {
        await addCourse(payload);
        setToast({ open: true, message: 'تم إضافة المادة بنجاح', severity: 'success' });
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('خطأ:', err);
      const errors = err.response?.data?.errors;
      const errorMsg = errors ? Object.values(errors).flat().join(' | ') : (err.response?.data?.message || 'فشل في حفظ المادة');
      setToast({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل المواد...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader 
        title="المواد الدراسية"
        subtitle="أضف أو عدل أو احذف المواد الدراسية - المواد غير المفعلة لا تظهر في الجداول"
        icon={<MenuBookIcon sx={{ fontSize: 20 }} />}
      />

      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 0.8,
            bgcolor: '#1976d2',
            '&:hover': {
              bgcolor: '#1565c0',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          مادة جديدة
        </Button>
      </Box>

      {announcements.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
          <MenuBookIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">لا توجد مواد حالياً</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            اضغط على "مادة جديدة" لإضافة أول مادة
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {announcements.map((course) => {
            const isActive = course.is_active === 1;
            
            return (
              <Grid item xs={12} md={6} lg={4} key={course.id}>
                <Card sx={{
                  borderRadius: 3,
                  transition: '0.3s',
                  bgcolor: isActive ? '#ffffff' : '#fafafa',
                  border: isActive ? '1px solid #e0e0e0' : '1px solid #ffccbc',
                  opacity: isActive ? 1 : 0.85,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  '&:hover': { 
                    transform: 'translateY(-4px)', 
                    boxShadow: '0 8px 25px rgba(25,118,210,0.15)',
                  }
                }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Chip 
                        label={isActive ? 'مفعلة' : 'غير مفعلة'} 
                        size="small" 
                        icon={isActive ? <CheckCircleIcon /> : <CancelIcon />}
                        sx={{ 
                          bgcolor: isActive ? '#4caf50' : '#ff9800', 
                          color: '#fff',
                          '& .MuiChip-icon': { color: '#fff' }
                        }}
                      />
                      <Box>
                        <Tooltip title={isActive ? 'تعطيل المادة' : 'تفعيل المادة'}>
                          <IconButton 
                            onClick={() => handleToggleStatus(course.id, course.is_active)} 
                            color={isActive ? 'success' : 'warning'}
                            size="small"
                            disabled={togglingId === course.id}
                          >
                            {togglingId === course.id ? (
                              <CircularProgress size={20} />
                            ) : isActive ? (
                              <ToggleOnIcon fontSize="small" />
                            ) : (
                              <ToggleOffIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                        <IconButton onClick={() => handleEdit(course)} color="primary" size="small" title="تعديل">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(course.id)} color="error" size="small" title="حذف">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      mb: 1, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      color: '#1565c0' 
                    }}>
                      <MenuBookIcon color="primary" fontSize="small" />
                      {course.name}
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 1, color: '#37474f' }}>
                      <strong>الكود:</strong> {course.code}
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 1, color: '#37474f' }}>
                      <strong>السعة:</strong> {course.capacity} طالب
                    </Typography>

                    {course.teacher && (
                      <Typography variant="body2" sx={{ mb: 2, color: '#37474f' }}>
                        <strong>المعلم:</strong> {course.teacher.name}
                      </Typography>
                    )}

                    {!isActive && (
                      <Chip 
                        label=" غير مفعلة - لن تظهر في الجداول" 
                        size="small" 
                        variant="outlined"
                        sx={{ mt: 1, borderColor: '#ff9800', color: '#ff9800', width: '100%' }}
                      />
                    )}

                    <Box display="flex" alignItems="center" justifyContent="flex-end" mt={2}>
                      <Chip 
                        label={`تمت الإضافة: ${new Date(course.created_at).toLocaleDateString('ar')}`} 
                        size="small" 
                        variant="outlined"
                        sx={{ borderColor: '#1976d2', color: '#1976d2' }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', 
          color: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}>
          <MenuBookIcon />
          {current?.id ? 'تعديل مادة' : 'إضافة مادة جديدة'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            label="اسم المادة"
            fullWidth
            margin="normal"
            value={current?.name || ''}
            onChange={(e) => setCurrent({ ...current, name: e.target.value })}
            required
            variant="outlined"
            placeholder="مثال: الرياضيات"
          />
          <TextField
            label="كود المادة"
            fullWidth
            margin="normal"
            value={current?.code || ''}
            onChange={(e) => setCurrent({ ...current, code: e.target.value })}
            required
            variant="outlined"
            placeholder="مثال: MATH101"
          />
          <TextField
            label="السعة (عدد الطلاب)"
            type="number"
            fullWidth
            margin="normal"
            value={current?.capacity || ''}
            onChange={(e) => setCurrent({ ...current, capacity: e.target.value })}
            required
            variant="outlined"
            placeholder="مثال: 30"
            inputProps={{ min: 1 }}
          />
          <TextField
            label="اسم المعلم"
            fullWidth
            margin="normal"
            value={current?.teacher_name || ''}
            onChange={(e) => setCurrent({ ...current, teacher_name: e.target.value })}
            required
            variant="outlined"
            placeholder="مثال: أحمد محمد"
          />
          
          <Box sx={{ mt: 2, pt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={current?.is_active === 1}
                  onChange={(e) => setCurrent({ ...current, is_active: e.target.checked ? 1 : 0 })}
                  color="primary"
                />
              }
              label={current?.is_active === 1 ? 'المادة مفعلة (ستظهر في الجداول)' : 'المادة غير مفعلة (لن تظهر في الجداول)'}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setModalOpen(false)} variant="outlined" disabled={loading}>
            إلغاء
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={loading} sx={{ bgcolor: '#1976d2' }}>
            {loading ? <CircularProgress size={24} /> : 'حفظ'}
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

export default Announcements;