// src/pages/Teacher/Inquiries.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  QuestionAnswer as QuestionAnswerIcon,
  ExpandMore as ExpandMoreIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Reply as ReplyIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { getInquiries, replyToInquiry } from '../../services/teacherService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const Inquiries = () => {
  const { user } = useSelector((state) => state.auth);
  const [inquiries, setInquiries] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // جلب الاستفسارات
  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const data = await getInquiries(user?.id || 1);
      setInquiries(data);
    } catch (error) {
      console.error('خطأ في جلب الاستفسارات:', error);
      // بيانات تجريبية
      setInquiries([
        {
          id: 1,
          studentId: 1,
          studentName: 'أحمد محمد',
          studentClass: 'الثاني علمي',
          subject: 'الرياضيات',
          question: 'أستاذ، عندي سؤال في درس المشتقات، كيف أجد مشتقة الدالة f(x) = x² sin(x)?',
          date: '2026-04-28',
          time: '10:30',
          replied: false,
          reply: '',
          replyDate: null,
        },
        {
          id: 2,
          studentId: 2,
          studentName: 'سارة خالد',
          studentClass: 'الثالث علمي',
          subject: 'الفيزياء',
          question: 'أستاذ، هل يمكنك شرح قانون نيوتن الثاني مع أمثلة؟',
          date: '2026-04-27',
          time: '14:15',
          replied: true,
          reply: 'قانون نيوتن الثاني: القوة = الكتلة × التسارع (F = ma). مثلاً إذا كانت كتلة الجسم 5kg ويتسارع بمقدار 2m/s²، فإن القوة المؤثرة = 10 نيوتن.',
          replyDate: '2026-04-27',
          replyTime: '16:00',
        },
        {
          id: 3,
          studentId: 3,
          studentName: 'محمد علي',
          studentClass: 'الثاني علمي',
          subject: 'الكيمياء',
          question: 'ما الفرق بين التفاعل الطارد للحرارة والتفاعل الماص للحرارة؟',
          date: '2026-04-26',
          time: '09:45',
          replied: false,
          reply: '',
          replyDate: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [user?.id]);

  // الرد على استفسار
  const handleReply = async (id) => {
    const reply = replyTexts[id] || '';
    if (!reply.trim()) {
      setToast({ open: true, message: 'الرجاء كتابة رد قبل الإرسال', severity: 'warning' });
      return;
    }

    setSending(true);
    try {
      await replyToInquiry(id, reply);
      setToast({ open: true, message: 'تم إرسال الرد بنجاح', severity: 'success' });
      setReplyTexts((prev) => ({ ...prev, [id]: '' }));
      fetchInquiries(); // تحديث القائمة
    } catch (error) {
      setToast({ open: true, message: error.message || 'فشل في إرسال الرد', severity: 'error' });
    } finally {
      setSending(false);
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString, timeString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل الاستفسارات...</Typography>
      </Box>
    );
  }

  // حساب الإحصائيات
  const totalInquiries = inquiries.length;
  const answeredCount = inquiries.filter(i => i.replied).length;
  const pendingCount = totalInquiries - answeredCount;

  return (
    <Box>
      <PageHeader
        title="الاستفسارات"
        subtitle="استفسارات الطلاب والرد عليها"
        icon={<QuestionAnswerIcon sx={{ fontSize: 20 }} />}
      />

      {/* بطاقات الإحصائيات */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Paper
          sx={{
            p: 2,
            flex: 1,
            textAlign: 'center',
            bgcolor: '#e3f2fd',
            borderRadius: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            {totalInquiries}
          </Typography>
          <Typography variant="body2" color="text.secondary">إجمالي الاستفسارات</Typography>
        </Paper>
        <Paper
          sx={{
            p: 2,
            flex: 1,
            textAlign: 'center',
            bgcolor: '#e8f5e9',
            borderRadius: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
            {answeredCount}
          </Typography>
          <Typography variant="body2" color="text.secondary">تم الرد عليها</Typography>
        </Paper>
        <Paper
          sx={{
            p: 2,
            flex: 1,
            textAlign: 'center',
            bgcolor: '#fff3e0',
            borderRadius: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
            {pendingCount}
          </Typography>
          <Typography variant="body2" color="text.secondary">قيد الانتظار</Typography>
        </Paper>
      </Box>

      {/* قائمة الاستفسارات */}
      {inquiries.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 4 }}>
          <QuestionAnswerIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            لا توجد استفسارات حالياً
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            سيظهر هنا أي استفسار يرسله الطلاب
          </Typography>
        </Paper>
      ) : (
        inquiries.map((inquiry) => (
          <Accordion
            key={inquiry.id}
            sx={{
              mb: 2,
              borderRadius: 3,
              '&:before': { display: 'none' },
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: inquiry.replied ? '1px solid #c8e6c9' : '1px solid #ffe0b2',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                borderRadius: 3,
                backgroundColor: inquiry.replied ? '#f5f5f5' : '#fff8e1',
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" flexWrap="wrap" gap={1}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: inquiry.replied ? '#4caf50' : '#ff9800', width: 40, height: 40 }}>
                    {inquiry.replied ? <CheckCircleIcon /> : <PendingIcon />}
                  </Avatar>
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                      <Typography variant="subtitle1" fontWeight="bold">
                        {inquiry.studentName}
                      </Typography>
                      <Chip label={inquiry.studentClass} size="small" variant="outlined" />
                      <Chip label={inquiry.subject} size="small" sx={{ bgcolor: '#e3f2fd', color: '#1565c0' }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {inquiry.date} - {inquiry.time}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={inquiry.replied ? 'تم الرد' : 'قيد الانتظار'}
                  size="small"
                  color={inquiry.replied ? 'success' : 'warning'}
                  icon={inquiry.replied ? <CheckCircleIcon /> : <PendingIcon />}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              {/* سؤال الطالب */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: '#fafafa',
                  borderRight: '4px solid #1976d2',
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <PersonIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                  <Typography variant="subtitle2" color="#1976d2" fontWeight="bold">
                    سؤال الطالب:
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {inquiry.question}
                </Typography>
              </Paper>

              {/* الرد (إذا كان موجوداً) */}
              {inquiry.replied ? (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#e8f5e9',
                    borderRight: '4px solid #4caf50',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <ReplyIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                    <Typography variant="subtitle2" color="#4caf50" fontWeight="bold">
                      رد الأستاذ:
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {inquiry.reply}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    تم الرد بتاريخ: {inquiry.replyDate}
                  </Typography>
                </Paper>
              ) : (
                <Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom color="#1976d2">
                    الرد على الاستفسار:
                  </Typography>
                  <TextField
                    label="اكتب ردك هنا"
                    fullWidth
                    multiline
                    rows={3}
                    value={replyTexts[inquiry.id] || ''}
                    onChange={(e) =>
                      setReplyTexts((prev) => ({ ...prev, [inquiry.id]: e.target.value }))
                    }
                    sx={{ mb: 2 }}
                    variant="outlined"
                    placeholder="أدخل ردك على هذا الاستفسار..."
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleReply(inquiry.id)}
                    startIcon={<SendIcon />}
                    disabled={sending}
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

export default Inquiries;