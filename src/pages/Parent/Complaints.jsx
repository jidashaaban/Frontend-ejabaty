// src/pages/Parent/Complaints.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  Grid,
} from '@mui/material';
import {
  Send as SendIcon,
  ReportProblem as ReportProblemIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { submitComplaint } from '../../services/parentService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const Complaints = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    title: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.studentName.trim()) {
      setToast({ open: true, message: 'الرجاء إدخال اسم الطالب', severity: 'error' });
      return;
    }
    if (!formData.title.trim()) {
      setToast({ open: true, message: 'الرجاء إدخال عنوان الشكوى', severity: 'error' });
      return;
    }
    if (!formData.message.trim()) {
      setToast({ open: true, message: 'الرجاء إدخال نص الشكوى', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      await submitComplaint({
        studentName: formData.studentName,
        title: formData.title,
        message: formData.message,
        date: new Date().toISOString(),
      });
      setSubmitted(true);
      setFormData({ studentName: '', title: '', message: '' });
      setToast({ open: true, message: 'تم إرسال الشكوى بنجاح. سيتم الرد عليها قريباً.', severity: 'success' });
      
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      setToast({ open: true, message: error.message || 'فشل في إرسال الشكوى', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="تقديم شكوى"
        subtitle="نحن هنا لمساعدتك. اكتب شكواك وسنقوم بالرد عليها في أقرب وقت"
        icon={<ReportProblemIcon sx={{ fontSize: 20 }} />}
      />

      <Grid container spacing={4} justifyContent="center">
        {/* نموذج تقديم الشكوى - توسيط */}
        <Grid item xs={12} md={8} lg={6}>
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 5,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5} mb={4}>
              <Avatar sx={{ bgcolor: '#f44336', width: 48, height: 48 }}>
                <ReportProblemIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  نموذج تقديم شكوى
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  الرجاء تعبئة جميع الحقول بدقة
                </Typography>
              </Box>
            </Box>

            {submitted && (
              <Alert
                severity="success"
                sx={{ mb: 3, borderRadius: 3, bgcolor: '#e8f5e9' }}
                icon={<CheckCircleIcon />}
              >
                <Typography variant="body2" fontWeight="bold">
                  تم إرسال شكواك بنجاح!
                </Typography>
                <Typography variant="caption">
                  سنقوم بالرد عليها في أقرب وقت ممكن
                </Typography>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                name="studentName"
                label="اسم الطالب"
                fullWidth
                margin="normal"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="أدخل اسم الطالب"
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': { borderColor: '#1976d2' },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <AssignmentIcon sx={{ color: '#1976d2', mr: 1 }} />
                  ),
                }}
              />
              <TextField
                name="title"
                label="عنوان الشكوى"
                fullWidth
                margin="normal"
                value={formData.title}
                onChange={handleChange}
                placeholder="مثال: تأخر في المواصلات المدرسية"
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': { borderColor: '#1976d2' },
                  },
                }}
              />
              <TextField
                name="message"
                label="نص الشكوى"
                fullWidth
                margin="normal"
                multiline
                rows={6}
                value={formData.message}
                onChange={handleChange}
                placeholder="اكتب تفاصيل شكواك هنا... يرجى كتابة أكبر قدر من التفاصيل لتساعدنا في معالجة شكواك بشكل أسرع"
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': { borderColor: '#1976d2' },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                sx={{
                  mt: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  boxShadow: '0 4px 15px rgba(25,118,210,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? 'جاري الإرسال...' : 'إرسال الشكوى'}
              </Button>
            </form>
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
};

export default Complaints;