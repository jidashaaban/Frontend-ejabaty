import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Avatar,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Quiz as QuizIcon,
  Announcement as AnnouncementIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { announceTest, getAnnouncedTests } from '../../services/teacherService';
import Toast from '../../components/common/Toast';
import PageHeader from '../../components/common/PageHeader';

function AnnounceTest() {
  const { user } = useSelector((state) => state.auth);
  const [quizzes, setQuizzes] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    course_name: '',
    quiz_date: new Date().toISOString().split('T')[0],
    start_time: '08:00',
    included_content: '',
    teacher_name: '',
  });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      try {
        const data = await getAnnouncedTests();
        const quizzes = data?.quizzes || data?.data || (Array.isArray(data) ? data : []);
        setQuizzes(quizzes);
      } catch (error) {
        console.error('خطأ في جلب الاختبارات:', error);
        setQuizzes([]);
      }
    } catch (error) {
      console.error('خطأ في جلب الاختبارات:', error);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchQuizzes();
  }, [user?.id]);

  const handleOpenAddDialog = () => {
    setFormData({
      course_name: '',
      quiz_date: new Date().toISOString().split('T')[0],
      start_time: '08:00',
      included_content: '',
      teacher_name: user?.name || '',
    });
    setTeachers([]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.course_name) {
      setToast({ open: true, message: 'الرجاء إدخال اسم المادة', severity: 'error' });
      return;
    }
    if (!formData.teacher_name) {
      setToast({ open: true, message: 'الرجاء اختيار اسم الأستاذ', severity: 'error' });
      return;
    }
    if (!formData.included_content) {
      setToast({ open: true, message: 'الرجاء إدخال محتوى الاختبار', severity: 'error' });
      return;
    }

    try {
      const quizData = {
        course_name: formData.course_name,
        quiz_date: formData.quiz_date,
        start_time: formData.start_time,
        included_content: formData.included_content,
        teacher_name: formData.teacher_name,
      };
      
      console.log(' إرسال بيانات الاختبار:', quizData);
      const response = await announceTest(quizData);
      
      if (response && response.success) {
        const newQuiz = {
          id: Date.now(),
          course_name: formData.course_name,
          course: { name: formData.course_name },
          included_content: formData.included_content,
          quiz_date: formData.quiz_date,
          start_time: formData.start_time,
          teacher_name: formData.teacher_name,
          created_at: new Date().toISOString(),
        };
        
        fetchQuizzes();
        setToast({ open: true, message: 'تم إعلان الاختبار بنجاح! سيتم إشعار الطلاب', severity: 'success' });
        handleCloseDialog();
      } else {
        throw new Error(response?.message || 'حدث خطأ');
      }
    } catch (error) {
      console.error('خطأ:', error);
      setToast({ 
        open: true, 
        message: error.response?.data?.message || error.message || 'حدث خطأ في إضافة الاختبار', 
        severity: 'error' 
      });
    }
  };

  const handleDelete = (id) => {
    fetchQuizzes();
    setToast({ 
      open: true, 
      message: 'تم حذف الاختبار من القائمة', 
      severity: 'success' 
    });
  };

  const stats = {
    total: quizzes.length,
    upcoming: quizzes.filter(q => new Date(q.quiz_date) >= new Date()).length,
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل الاختبارات...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="إعلان الاختبارات"
        subtitle="إدارة اختبارات المواد وإشعار الطلاب بها"
        icon={<QuizIcon sx={{ fontSize: 20 }} />}
      />

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdef5 100%)',
              transition: '0.3s',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: 4 },
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="#1565c0" gutterBottom>
                    إجمالي الاختبارات
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {stats.total}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#1976d2', width: 45, height: 45 }}>
                  <QuizIcon sx={{ fontSize: 24 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
              transition: '0.3s',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: 4 },
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="#2e7d32" gutterBottom>
                    اختبارات قادمة
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                    {stats.upcoming}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#388e3c', width: 45, height: 45 }}>
                  <AccessTimeIcon sx={{ fontSize: 24 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)' },
          }}
        >
          إعلان اختبار جديد
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
          <Box display="flex" alignItems="center" gap={1}>
            <AnnouncementIcon sx={{ fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              قائمة الاختبارات المعلنة
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 2 }}>
          {quizzes.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              لا توجد اختبارات معلنة حالياً. اضغط على "إعلان اختبار جديد" لإضافة أول اختبار.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {quizzes.map((quiz, index) => (
                <Grid item xs={12} key={quiz.id || index}>
                  <Card 
                    sx={{ 
                      borderRadius: 2, 
                      border: '1px solid #e0e0e0', 
                      transition: '0.2s',
                      '&:hover': { 
                        boxShadow: 3,
                        borderColor: '#1976d2'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={2}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <SchoolIcon color="primary" fontSize="small" />
                            <Typography fontWeight="bold" variant="body2">
                              {quiz.course?.name || quiz.course_name}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={2}>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <PersonIcon sx={{ color: '#1976d2', fontSize: 14 }} />
                            <Typography variant="body2" color="text.primary">
                              {quiz.teacher_name || quiz.teacher?.name || 'غير محدد'}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={ 12 } sm={ 4 }>
                          <Typography variant="body2" color="text.secondary">
                            {quiz.included_content?.length > 60 
                              ? quiz.included_content.substring(0, 60) + '...' 
                              : quiz.included_content}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={6} sm={2}>
                          <Chip 
                            label={quiz.quiz_date} 
                            size="small" 
                            variant="outlined"
                            sx={{ 
                              borderColor: '#1976d2',
                              color: '#1976d2',
                              fontWeight: 500,
                              height: 28
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={4} sm={1}>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <AccessTimeIcon sx={{ color: '#1976d2', fontSize: 14 }} />
                            <Typography variant="body2" fontWeight={500}>
                              {quiz.start_time}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={2} sm={1} sx={{ textAlign: 'center' }}>
                          <IconButton
                            onClick={() => handleDelete(quiz.id)}
                            color="error"
                            size="small"
                            title="حذف الاختبار"
                            sx={{
                              '&:hover': { backgroundColor: '#ffebee' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: '#fff' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <QuizIcon />
            <Typography variant="h6">إعلان اختبار جديد</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            name="course_name"
            label="اسم المادة"
            fullWidth
            margin="normal"
            value={formData.course_name}
            onChange={handleChange}
            required
            variant="outlined"
            placeholder="مثال: رياضيات، علوم، لغة عربية"
          />
          
          <TextField
            name="teacher_name"
            label="اسم الأستاذ"
            select={teachers.length > 0}
            fullWidth
            margin="normal"
            value={formData.teacher_name}
            onChange={handleChange}
            required
            variant="outlined"
            helperText="اختر اسم الأستاذ الذي سيعلن الاختبار"
            InputProps={{
              startAdornment: <PersonIcon sx={{ color: '#1976d2', mr: 1 }} />,
            }}
          >
            {teachers.length > 0 ? (
              teachers.map((teacher, index) => (
                <MenuItem key={teacher.id || index} value={teacher.name}>
                  {teacher.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value={formData.teacher_name}>{formData.teacher_name || 'أدخل اسم الأستاذ'}</MenuItem>
            )}
          </TextField>
          
          <TextField
            name="included_content"
            label="محتوى الاختبار"
            fullWidth
            margin="normal"
            value={formData.included_content}
            onChange={handleChange}
            required
            multiline
            rows={3}
            variant="outlined"
            placeholder="مثال: الوحدة الأولى - الدرس الثاني، اختبار منتصف الفصل..."
          />
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="quiz_date"
                label="تاريخ الاختبار"
                type="date"
                fullWidth
                margin="normal"
                value={formData.quiz_date}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="start_time"
                label="وقت البدء"
                type="time"
                fullWidth
                margin="normal"
                value={formData.start_time}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                helperText="يجب أن يتوافق مع وقت الحصة في الجدول (مثال: 08:00)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            إلغاء
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}
          >
            إعلان الاختبار
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
}

export default AnnounceTest;  