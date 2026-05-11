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
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await getComplaints();
      console.log('📋 الشكاوى المستلمة:', data);
      
      let complaintsArray = [];
      if (Array.isArray(data)) {
        complaintsArray = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        complaintsArray = data.data;
      } else if (data && data.complaints && Array.isArray(data.complaints)) {
        complaintsArray = data.complaints;
      } else {
        complaintsArray = [];
      }
      
      const formattedComplaints = complaintsArray.map(complaint => ({
        id: complaint.id,
        parentName: complaint.parent?.name || 'ولي أمر',
        studentName: complaint.student_name || '',
        message: complaint.complaint_text || complaint.message,
        subject: complaint.subject,
        reply: complaint.answer_text || complaint.reply,
        replied: !!complaint.answer_text || !!complaint.reply,
        replyDate: complaint.updated_at,
        date: complaint.created_at,
      }));
      
      setComplaints(formattedComplaints);
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
      fetchComplaints(); 
    } catch (error) {
      console.error('خطأ:', error);
      setToast({ 
        open: true, 
        message: error.response?.data?.message || error.message || 'فشل في إرسال الرد', 
        severity: 'error' 
      });
    }
  };

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
      <PageHeader 
        title="إدارة الشكاوى"
        subtitle="عرض والرد على شكاوى أولياء الأمور"
        icon={<ReportProblemIcon sx={{ fontSize: 20 }} />}
      />

      {complaints.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          لا توجد شكاوى حالياً. سيظهر هنا أي شكوى يرسلها أولياء الأمور.
        </Alert>
      ) : (
        complaints.map((complaint) => (
          <Accordion 
            key={complaint.id} 
            sx={{ 
              mb: 2, 
              borderRadius: 2, 
              '&:before': { display: 'none' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: complaint.replied ? '#f5f5f5' : '#e3f2fd',
                borderRadius: 2,
                '&:hover': { backgroundColor: complaint.replied ? '#eeeeee' : '#bbdef5' },
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" flexWrap="wrap" gap={1}>
                <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                  <Chip
                    label={complaint.replied ? 'تم الرد' : 'قيد الانتظار'}
                    color={complaint.replied ? 'success' : 'warning'}
                    size="small"
                    icon={complaint.replied ? <CheckCircleIcon /> : <PendingIcon />}
                  />
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1565c0' }}>
                    {complaint.parentName || 'ولي أمر'}
                  </Typography>
                  {complaint.subject && (
                    <Chip label={complaint.subject} size="small" variant="outlined" />
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(complaint.date)}
                  </Typography>
                </Box>
                {complaint.studentName && (
                  <Typography variant="caption" color="text.secondary">
                    عن الطالب: {complaint.studentName}
                  </Typography>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#fafafa', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="#1565c0" gutterBottom>
                  نص الشكوى:
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {complaint.message}
                </Typography>
              </Paper>

              {complaint.replied ? (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
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
                  <Typography variant="subtitle2" gutterBottom sx={{ color: '#1976d2' }}>
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
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: '#1976d2',
                      '&:hover': { bgcolor: '#1565c0' },
                    }}
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