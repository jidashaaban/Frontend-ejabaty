// src/pages/Parent/Complaints.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Send as SendIcon,
  ReportProblem as ReportProblemIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { submitComplaint } from '../../services/parentService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const Complaints = () => {
  const [formData, setFormData] = useState({
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
        title: formData.title,
        message: formData.message,
        date: new Date().toISOString(),
      });
      setSubmitted(true);
      setFormData({ title: '', message: '' });
      setToast({ open: true, message: 'تم إرسال الشكوى بنجاح', severity: 'success' });
      
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
        subtitle="اكتب شكواك وسنقوم بالرد عليها"
        icon={<ReportProblemIcon sx={{ fontSize: 20 }} />}
      />

      {/* بطاقة تقديم الشكوى المتطورة */}
      <Paper
        elevation={0}
        sx={{
          maxWidth: 750,
          mx: 'auto',
          mt: 3,
          borderRadius: 5,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 50%, #1976d2 100%)',
          },
        }}
      >
        {/* رأس البطاقة بتدرج أزرق أنيق */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            p: 4,
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* تأثير خلفية زخرفية */}
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
            }}
          />
          
          <Avatar
            sx={{
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)',
              color: '#1976d2',
              mx: 'auto',
              mb: 2,
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            }}
          >
            <ReportProblemIcon sx={{ fontSize: 45 }} />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#fff' }}>
            نموذج تقديم شكوى
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.5 }}>
            الرجاء تعبئة جميع الحقول بدقة
          </Typography>
        </Box>

        {/* محتوى البطاقة */}
        <Box sx={{ p: 4 }}>
          {submitted && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: 3,
                bgcolor: '#e8f5e9',
                border: '1px solid #c8e6c9',
              }}
              icon={<CheckCircleIcon />}
            >
              <Typography variant="body1" fontWeight="bold">
                ✅ تم إرسال شكواك بنجاح!
              </Typography>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* حقل عنوان الشكوى */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#1976d2', fontWeight: 600 }}>
                عنوان الشكوى
              </Typography>
              <TextField
                name="title"
                fullWidth
                placeholder="مثال: تأخر في المواصلات المدرسية"
                value={formData.title}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <AssignmentIcon sx={{ color: '#1976d2', mr: 1 }} />
                  ),
                  sx: {
                    borderRadius: 3,
                    '&:hover': { borderColor: '#1976d2' },
                  },
                }}
              />
            </Box>

            {/* حقل نص الشكوى */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#1976d2', fontWeight: 600 }}>
                نص الشكوى
              </Typography>
              <TextField
                name="message"
                fullWidth
                multiline
                rows={6}
                placeholder="اكتب تفاصيل شكواك هنا..."
                value={formData.message}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <DescriptionIcon sx={{ color: '#1976d2', mr: 1, alignSelf: 'flex-start', mt: 1 }} />
                  ),
                  sx: {
                    borderRadius: 3,
                    '&:hover': { borderColor: '#1976d2' },
                  },
                }}
              />
            </Box>

            {/* زر الإرسال */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={22} /> : <SendIcon />}
              sx={{
                py: 1.8,
                borderRadius: 4,
                fontSize: '1rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                boxShadow: '0 8px 20px rgba(25,118,210,0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 25px rgba(25,118,210,0.45)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'جاري الإرسال...' : 'إرسال الشكوى'}
            </Button>
          </form>
        </Box>
      </Paper>

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