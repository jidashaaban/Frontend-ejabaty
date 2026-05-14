import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  Paper,
  Card,
  CardContent,
  Chip,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Send as SendIcon,
  ReportProblem as ReportProblemIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { submitComplaint, getComplaints, deleteComplaint } from '../../services/parentService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const ComplaintsParent = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
  });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // جلب الشكاوى السابقة
  const fetchComplaints = async () => {
    setLoadingComplaints(true);
    try {
      const data = await getComplaints();
      console.log('📋 الشكاوى:', data);
      
      let complaintsList = [];
      if (data && data.complaints && Array.isArray(data.complaints)) {
        complaintsList = data.complaints;
      } else if (data && data.data && Array.isArray(data.data)) {
        complaintsList = data.data;
      } else if (Array.isArray(data)) {
        complaintsList = data;
      }
      
      setComplaints(complaintsList);
    } catch (error) {
      console.error('خطأ في جلب الشكاوى:', error);
    } finally {
      setLoadingComplaints(false);
    }
  };

  useEffect(() => {
    if (showHistory) {
      fetchComplaints();
    }
  }, [showHistory]);

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
      await submitComplaint(formData.title, formData.message);
      setSubmitted(true);
      setFormData({ title: '', message: '' });
      setToast({ open: true, message: 'تم إرسال الشكوى بنجاح', severity: 'success' });
      
      if (showHistory) {
        fetchComplaints();
      }
      
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      setToast({ open: true, message: error.response?.data?.message || 'فشل في إرسال الشكوى', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (complaint) => {
    setSelectedComplaint(complaint);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedComplaint) return;
    
    try {
      await deleteComplaint(selectedComplaint.id);
      setToast({ open: true, message: 'تم حذف الشكوى بنجاح', severity: 'success' });
      fetchComplaints();
    } catch (error) {
      setToast({ open: true, message: 'فشل في حذف الشكوى', severity: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedComplaint(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  return (
    <Box>
      <PageHeader
        title="تقديم شكوى"
        subtitle="اكتب شكواك وسنقوم بالرد عليها"
        icon={<ReportProblemIcon sx={{ fontSize: 20 }} />}
      />

      {/* زر عرض تاريخ الشكاوى */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant={showHistory ? "contained" : "outlined"}
          startIcon={<HistoryIcon />}
          onClick={() => setShowHistory(!showHistory)}
          sx={{ borderRadius: 2 }}
        >
          {showHistory ? "إخفاء تاريخ الشكاوى" : "عرض تاريخ الشكاوى"}
        </Button>
      </Box>

      {/* قائمة الشكاوى السابقة */}
      {showHistory && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
            📋 تاريخ الشكاوى
          </Typography>
          
          {loadingComplaints ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : complaints.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              لا توجد شكاوى سابقة
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {complaints.map((complaint) => (
                <Grid item xs={12} key={complaint.id}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={1}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {complaint.subject}
                            </Typography>
                            <Chip
                              label={complaint.answer_text ? 'تم الرد' : 'قيد الانتظار'}
                              size="small"
                              color={complaint.answer_text ? 'success' : 'warning'}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {complaint.complaint_text}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            التاريخ: {formatDate(complaint.created_at)}
                          </Typography>
                          
                          {/* عرض الرد إن وجد */}
                          {complaint.answer_text && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                              <Typography variant="caption" color="success.main" fontWeight="bold">
                                رد الإدارة:
                              </Typography>
                              <Typography variant="body2">
                                {complaint.answer_text}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(complaint)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}

      {/* بطاقة تقديم الشكوى */}
      <Paper
        elevation={0}
        sx={{
          maxWidth: 750,
          mx: 'auto',
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
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            p: 4,
            textAlign: 'center',
            position: 'relative',
          }}
        >
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

      {/* نافذة تأكيد الحذف */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <Typography>
            هل أنت متأكد من حذف الشكوى "{selectedComplaint?.subject}"؟
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            حذف
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

export default ComplaintsParent;