import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Send as SendIcon,
  QuestionAnswer as QuestionIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';
import { submitInquiry, getMyInquiries } from '../../services/studentService';

function InquiriesStudent() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    teacher_id: '',
  });

  useEffect(() => {
    fetchInquiries();
    fetchTeachers();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const data = await getMyInquiries();
      console.log('📋 الاستفسارات:', data);
      
      let inquiriesArray = [];
      if (Array.isArray(data)) {
        inquiriesArray = data;
      } else if (data?.data && Array.isArray(data.data)) {
        inquiriesArray = data.data;
      } else if (data?.questions && Array.isArray(data.questions)) {
        inquiriesArray = data.questions;
      }
      
      setInquiries(inquiriesArray);
    } catch (error) {
      console.error('❌ خطأ في جلب الاستفسارات:', error);
      setToast({ open: true, message: 'فشل في جلب الاستفسارات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/admin/users?role=teacher', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      
      let teachersArray = [];
      if (Array.isArray(data)) {
        teachersArray = data;
      } else if (data?.data && Array.isArray(data.data)) {
        teachersArray = data.data;
      }
      
      setTeachers(teachersArray);
    } catch (error) {
      console.error('❌ خطأ في جلب الأساتذة:', error);
    }
  };

  const handleOpenDialog = (inquiry = null) => {
    if (inquiry) {
      setEditingInquiry(inquiry);
      setFormData({
        title: inquiry.title,
        content: inquiry.content,
        teacher_id: inquiry.teacher_id || '',
      });
    } else {
      setEditingInquiry(null);
      setFormData({ title: '', content: '', teacher_id: '' });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingInquiry(null);
    setFormData({ title: '', content: '', teacher_id: '' });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setToast({ open: true, message: 'الرجاء إدخال عنوان الاستفسار', severity: 'error' });
      return;
    }
    if (!formData.content.trim()) {
      setToast({ open: true, message: 'الرجاء إدخال محتوى الاستفسار', severity: 'error' });
      return;
    }
    
    setSubmitting(true);
    try {
      await submitInquiry({
        title: formData.title,
        content: formData.content,
        teacher_id: formData.teacher_id || null,
      });
      
      setToast({ open: true, message: 'تم إرسال الاستفسار بنجاح', severity: 'success' });
      handleCloseDialog();
      fetchInquiries();
    } catch (error) {
      console.error('❌ خطأ:', error);
      setToast({ open: true, message: error.response?.data?.message || 'فشل في إرسال الاستفسار', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusChip = (inquiry) => {
    if (inquiry.answer || inquiry.status === 'answered') {
      return <Chip label="تم الرد" size="small" color="success" icon={<CheckCircleIcon />} />;
    }
    return <Chip label="قيد الانتظار" size="small" color="warning" icon={<PendingIcon />} />;
  };

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'جميع الأساتذة';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل استفساراتك...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader 
        title="الاستفسارات"
        subtitle="تواصل مع أساتذتك واستفسر عن أي شيء"
        icon={<QuestionIcon sx={{ fontSize: 20 }} />}
      />

      {/* إحصائية سريعة */}
      <Paper sx={{ 
        p: 2.5, 
        mb: 3, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }}>
        <Box display="flex" alignItems="center" gap={2}>
          <QuestionIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{inquiries.length}</Typography>
            <Typography variant="caption">استفسار مسجل</Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <CheckCircleIcon sx={{ fontSize: 18 }} />
            <Typography variant="caption">
              {inquiries.filter(i => i.answer || i.status === 'answered').length} تم الرد
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <PendingIcon sx={{ fontSize: 18 }} />
            <Typography variant="caption">
              {inquiries.filter(i => !i.answer && i.status !== 'answered').length} قيد الانتظار
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* نموذج إرسال استفسار جديد */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
              <SendIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                استفسار جديد
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <TextField
              label="عنوان الاستفسار"
              fullWidth
              margin="normal"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="مثال: استفسار عن منهج الرياضيات"
              required
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            
            <TextField
              label="محتوى الاستفسار"
              fullWidth
              margin="normal"
              multiline
              rows={5}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="اكتب استفسارك هنا..."
              required
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>الأستاذ (اختياري)</InputLabel>
              <Select
                value={formData.teacher_id}
                onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                label="الأستاذ (اختياري)"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">جميع الأساتذة</MenuItem>
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button
              variant="contained"
              fullWidth
              startIcon={<SendIcon />}
              onClick={handleSubmit}
              disabled={submitting}
              sx={{ 
                mt: 3, 
                borderRadius: 2, 
                py: 1.2,
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
                }
              }}
            >
              {submitting ? 'جاري الإرسال...' : 'إرسال الاستفسار'}
            </Button>
          </Paper>
        </Grid>

        {/* قائمة الاستفسارات السابقة */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
              <QuestionIcon sx={{ color: '#ff9800' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                استفساراتي السابقة
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {inquiries.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                📭 لا توجد استفسارات حالياً. أضف استفسارك الأول!
              </Alert>
            ) : (
              <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
                {inquiries.map((inquiry, idx) => {
                  const isAnswered = inquiry.answer || inquiry.status === 'answered';
                  
                  return (
                    <Card 
                      key={inquiry.id || idx} 
                      sx={{ 
                        mb: 2, 
                        borderRadius: 2,
                        borderRight: isAnswered ? '4px solid #4caf50' : '4px solid #ff9800',
                        transition: '0.3s',
                        '&:hover': { transform: 'translateX(4px)', boxShadow: 3 }
                      }}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" mb={1}>
                          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                            <Avatar sx={{ bgcolor: isAnswered ? '#4caf50' : '#ff9800', width: 32, height: 32 }}>
                              {isAnswered ? <CheckCircleIcon /> : <PendingIcon />}
                            </Avatar>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {inquiry.title}
                            </Typography>
                            {getStatusChip(inquiry)}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            📅 {new Date(inquiry.created_at).toLocaleDateString('ar')}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, mr: 4 }}>
                          {inquiry.content}
                        </Typography>
                        
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <SchoolIcon sx={{ fontSize: 16, color: '#795548' }} />
                          <Typography variant="caption" color="text.secondary">
                            إلى: {getTeacherName(inquiry.teacher_id)}
                          </Typography>
                        </Box>
                        
                        {isAnswered && (
                          <Box sx={{ 
                            mt: 1.5, 
                            p: 1.5, 
                            bgcolor: '#e8f5e9', 
                            borderRadius: 2,
                            borderRight: '3px solid #4caf50'
                          }}>
                            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                              <CheckCircleIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                                رد الأستاذ
                              </Typography>
                            </Box>
                            <Typography variant="body2">
                              {inquiry.answer || inquiry.response}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}
          </Paper>
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
}

export default InquiriesStudent;