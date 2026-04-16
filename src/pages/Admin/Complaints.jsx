// src/pages/Admin/Complaints.jsx
import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Reply as ReplyIcon,
  ExpandMore as ExpandMoreIcon,
  ReportProblem as ReportProblemIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { getComplaints, replyToComplaint } from '../../services/adminService';
import Toast from '../../components/common/Toast';

/**
 * صفحة إدارة شكاوى أولياء الأمور
 * تعرض جميع الشكاوى مع إمكانية الرد عليها
 */
const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // جلب الشكاوى
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await getComplaints();
      setComplaints(data);
    } catch (error) {
      console.error('خطأ في جلب الشكاوى:', error);
      setToast({ open: true, message: 'فشل في جلب الشكاوى', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // الرد على شكوى
  const handleReply = async (id) => {
    const reply = replyTexts[id] || '';
    if (!reply.trim()) {
      setToast({ open: true, message: 'الرجاء كتابة رد قبل الإرسال', severity: 'warning' });
      return;
    }

    try {
      await replyToComplaint(id, reply);
      setToast({ open: true, message: 'تم إرسال الرد بنجاح', severity: 'success' });
      setReplyTexts((prev) => ({ ...prev, [id]: '' }));
      fetchComplaints(); // تحديث القائمة
    } catch (error) {
      setToast({ open: true, message: error.message || 'فشل في إرسال الرد', severity: 'error' });
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل الشكاوى...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <ReportProblemIcon color="error" sx={{ fontSize: 32 }} />
        <Typography variant="h4">
          إدارة شكاوى أولياء الأمور
        </Typography>
      </Box>

      {complaints.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          لا توجد شكاوى حالياً. سيظهر هنا أي شكوى يرسلها أولياء الأمور.
        </Alert>
      ) : (
        complaints.map((complaint) => (
          <Accordion key={complaint.id} sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: complaint.replied ? '#f5f5f5' : '#fff3e0',
                borderRadius: 2,
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <Box display="flex" alignItems="center" gap={2}>
                  <Chip
                    label={complaint.replied ? 'تم الرد' : 'قيد الانتظار'}
                    color={complaint.replied ? 'success' : 'warning'}
                    size="small"
                    icon={complaint.replied ? <CheckCircleIcon /> : <PendingIcon />}
                  />
                  <Typography variant="subtitle1" fontWeight="bold">
                    {complaint.parentName || 'ولي أمر'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(complaint.date)}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {complaint.studentName ? `عن الطالب: ${complaint.studentName}` : ''}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#fafafa' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  نص الشكوى:
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {complaint.message}
                </Typography>
              </Paper>

              {complaint.replied ? (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#e8f5e9' }}>
                  <Typography variant="subtitle2" color="success.main" gutterBottom>
                    الرد:
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {complaint.reply}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    تاريخ الرد: {formatDate(complaint.replyDate)}
                  </Typography>
                </Paper>
              ) : (
                <Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    الرد على الشكوى:
                  </Typography>
                  <TextField
                    label="اكتب ردك هنا"
                    fullWidth
                    multiline
                    rows={3}
                    value={replyTexts[complaint.id] || ''}
                    onChange={(e) =>
                      setReplyTexts((prev) => ({ ...prev, [complaint.id]: e.target.value }))
                    }
                    sx={{ mb: 2 }}
                    variant="outlined"
                    placeholder="أدخل ردك على هذه الشكوى..."
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleReply(complaint.id)}
                    startIcon={<ReplyIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    إرسال الرد
                  </Button>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))
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

export default Complaints;