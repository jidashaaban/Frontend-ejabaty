import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Chip, CircularProgress,
  Alert, Avatar, Divider, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Select, FormControl, InputLabel,
  IconButton, Collapse, Tooltip, Badge,
} from '@mui/material';
import {
  QuestionAnswer as QuestionAnswerIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Reply as ReplyIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as PendingIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  School as SchoolIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';
import {
  getMyInquiries,
  sendInquiry,
  updateInquiry,
  deleteInquiry,
  getActiveCourses,
} from '../../services/studentService';

function InquiryCard({ inquiry, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const answered = inquiry.status === 'Answered';

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        borderRadius: 3,
        border: '1.5px solid',
        borderColor: answered ? '#c8e6c9' : '#ffe0b2',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        px={2.5}
        py={1.8}
        sx={{
          bgcolor: answered ? '#f1f8e9' : '#fff8e1',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setExpanded(p => !p)}
      >
        <Avatar
          sx={{
            width: 38, height: 38,
            bgcolor: answered ? '#43a047' : '#fb8c00',
            flexShrink: 0,
          }}
        >
          {answered ? <CheckCircleIcon fontSize="small" /> : <PendingIcon fontSize="small" />}
        </Avatar>

        <Box flex={1} minWidth={0}>
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={0.3}>
            <Chip
              icon={<SchoolIcon sx={{ fontSize: '13px !important' }} />}
              label={inquiry.course_name || '-'}
              size="small"
              sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 700, fontSize: 11 }}
            />
            <Chip
              icon={<PersonIcon sx={{ fontSize: '13px !important' }} />}
              label={`أ. ${inquiry.teacher_name || '-'}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: 11 }}
            />
            <Chip
              label={answered ? 'تم الرد' : 'قيد الانتظار'}
              size="small"
              color={answered ? 'success' : 'warning'}
            />
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {inquiry.question_text}
          </Typography>
          <Typography variant="caption" color="text.disabled">{inquiry.asked_on}</Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={0.5} flexShrink={0}>
          {!answered && (
            <>
              <Tooltip title="تعديل">
                <IconButton
                  size="small"
                  sx={{ color: '#1976d2' }}
                  onClick={e => { e.stopPropagation(); onEdit(inquiry); }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="حذف">
                <IconButton
                  size="small"
                  sx={{ color: '#e53935' }}
                  onClick={e => { e.stopPropagation(); onDelete(inquiry.id); }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
          <IconButton size="small" sx={{ color: '#78909c' }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box px={2.5} py={2}>
          <Paper
            variant="outlined"
            sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#fafafa', borderRight: '4px solid #1976d2' }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={0.8}>
              <PersonIcon sx={{ color: '#1976d2', fontSize: 18 }} />
              <Typography variant="subtitle2" color="#1976d2" fontWeight={700}>سؤالي:</Typography>
            </Box>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', direction: 'rtl', textAlign: 'right' }}>
              {inquiry.question_text}
            </Typography>
          </Paper>
          {answered ? (
            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 2, bgcolor: '#e8f5e9', borderRight: '4px solid #43a047' }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={0.8}>
                <ReplyIcon sx={{ color: '#43a047', fontSize: 18 }} />
                <Typography variant="subtitle2" color="#43a047" fontWeight={700}>
                  رد الأستاذ {inquiry.teacher_name}:
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', direction: 'rtl', textAlign: 'right' }}>
                {inquiry.answer_text}
              </Typography>
            </Paper>
          ) : (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              في انتظار رد الأستاذ…
            </Alert>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}
export default function StudentInquiries() {
  const [inquiries, setInquiries]   = useState([]);
  const [courses, setCourses]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem]     = useState(null);  
  const [form, setForm]             = useState({ course_id: '', question: '' });
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter]         = useState('all'); 
  const [toast, setToast]           = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') =>
    setToast({ open: true, message, severity });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [inqData, courseData] = await Promise.all([
        getMyInquiries(),
        getActiveCourses(),
      ]);
      setInquiries(Array.isArray(inqData) ? inqData : []);
      setCourses(Array.isArray(courseData) ? courseData.filter(c => c.teacher_id) : []);
    } catch (e) {
      console.error(e);
      showToast('فشل في تحميل البيانات', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openNew  = () => { setEditItem(null); setForm({ course_id: '', question: '' }); setDialogOpen(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({ course_id: item.course_id || '', question: item.question_text });
    setDialogOpen(true);
  };
  const closeDialog = () => { setDialogOpen(false); setEditItem(null); };

  const handleSubmit = async () => {
    if (!form.course_id) return showToast('اختر المادة أولاً', 'warning');
    if (!form.question.trim()) return showToast('اكتب سؤالك أولاً', 'warning');

    setSubmitting(true);
    try {
      const selectedCourse = courses.find(c => c.id === form.course_id);
      if (editItem) {
        await updateInquiry(editItem.id, form.question);
        showToast('تم تعديل السؤال بنجاح');
      } else {
        await sendInquiry({
          teacher_id:  selectedCourse.teacher_id,
          course_name: selectedCourse.name,
          question:    form.question,
        });
        showToast('تم إرسال سؤالك للأستاذ');
      }
      closeDialog();
      fetchAll();
    } catch (e) {
      showToast(e.response?.data?.message || 'حدث خطأ', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل تريد حذف هذا السؤال؟')) return;
    try {
      await deleteInquiry(id);
      showToast('تم حذف السؤال');
      fetchAll();
    } catch (e) {
      showToast(e.response?.data?.message || 'لا يمكن حذف سؤال تمت الإجابة عليه', 'error');
    }
  };

  const filtered = inquiries.filter(i => {
    if (filter === 'pending')  return i.status !== 'Answered';
    if (filter === 'answered') return i.status === 'Answered';
    return true;
  });

  const answeredCount = inquiries.filter(i => i.status === 'Answered').length;
  const pendingCount  = inquiries.length - answeredCount;

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh" flexDirection="column" gap={2}>
      <CircularProgress sx={{ color: '#1565c0' }} />
      <Typography color="text.secondary">جاري التحميل…</Typography>
    </Box>
  );

  return (
    <Box>
      <PageHeader
        title="استفساراتي"
        subtitle="أرسل أسئلتك للأساتذة واستقبل الردود"
        icon={<QuestionAnswerIcon />}
      />

      <Box display="flex" gap={2} mb={3} flexWrap="wrap" alignItems="center">
        <Paper sx={{ p: 2, flex: 1, minWidth: 110, textAlign: 'center', bgcolor: '#e3f2fd', borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={800} color="#1565c0">{inquiries.length}</Typography>
          <Typography variant="caption" color="text.secondary">إجمالي الأسئلة</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, minWidth: 110, textAlign: 'center', bgcolor: '#e8f5e9', borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={800} color="#2e7d32">{answeredCount}</Typography>
          <Typography variant="caption" color="text.secondary">تم الرد</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, minWidth: 110, textAlign: 'center', bgcolor: '#fff3e0', borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={800} color="#e65100">{pendingCount}</Typography>
          <Typography variant="caption" color="text.secondary">قيد الانتظار</Typography>
        </Paper>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openNew}
          sx={{
            borderRadius: 3, px: 3, py: 1.5, fontWeight: 700,
            background: 'linear-gradient(135deg,#1565c0,#42a5f5)',
            boxShadow: '0 4px 14px rgba(21,101,192,0.35)',
            '&:hover': { background: 'linear-gradient(135deg,#0d47a1,#1976d2)' },
          }}
        >
          سؤال جديد
        </Button>
      </Box>

      <Box display="flex" gap={1} mb={2.5}>
        {[
          { key: 'all',      label: 'الكل' },
          { key: 'pending',  label: 'قيد الانتظار' },
          { key: 'answered', label: 'تم الرد' },
        ].map(f => (
          <Chip
            key={f.key}
            label={f.label}
            onClick={() => setFilter(f.key)}
            sx={{
              fontWeight: 700, borderRadius: 2, cursor: 'pointer',
              bgcolor: filter === f.key ? '#1565c0' : '#f0f4f8',
              color:   filter === f.key ? '#fff'    : '#546e7a',
              '&:hover': { bgcolor: filter === f.key ? '#0d47a1' : '#e0e7ef' },
            }}
          />
        ))}
      </Box>

      {filtered.length === 0 ? (
        <Paper
          sx={{
            p: 6, textAlign: 'center', borderRadius: 4,
            background: 'linear-gradient(135deg,#e3f2fd,#f8fafd)',
            border: '2px dashed #bbdefb',
          }}
        >
          <QuestionAnswerIcon sx={{ fontSize: 64, color: '#90caf9', mb: 2 }} />
          <Typography variant="h6" fontWeight={700} color="#1565c0" mb={1}>
            {filter === 'all' ? 'لا توجد أسئلة بعد' : filter === 'pending' ? 'لا توجد أسئلة معلقة' : 'لا توجد أسئلة مجابة'}
          </Typography>
          {filter === 'all' && (
            <Typography variant="body2" color="text.secondary">
              اضغط "سؤال جديد" لإرسال استفسارك للأستاذ المختص
            </Typography>
          )}
        </Paper>
      ) : (
        filtered.map(inq => (
          <InquiryCard
            key={inq.id}
            inquiry={inq}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ))
      )}

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg,#1565c0,#0d47a1)',
            px: 3, py: 2.5,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
              {editItem ? 'تعديل السؤال' : 'سؤال جديد'}
            </Typography>
            <Typography variant="h6" fontWeight={800} color="#fff">
              {editItem ? 'تعديل استفساري' : 'أرسل سؤالاً للأستاذ'}
            </Typography>
          </Box>
          <IconButton onClick={closeDialog} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 3, background: '#f8fafd' }}>
          <FormControl fullWidth sx={{ mb: 2.5 }}>
            <InputLabel>اختر المادة</InputLabel>
            <Select
              value={form.course_id}
              label="اختر المادة"
              onChange={e => setForm(p => ({ ...p, course_id: e.target.value }))}
              disabled={!!editItem}
              sx={{ borderRadius: 2 }}
            >
              {courses.length === 0 ? (
                <MenuItem disabled>لا توجد مواد مفعّلة</MenuItem>
              ) : (
                courses.map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>{c.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {c.code} — أ. {c.teacher_name}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {form.course_id && !editItem && (() => {
            const c = courses.find(x => x.id === form.course_id);
            return c ? (
              <Alert
                severity="info"
                icon={<PersonIcon />}
                sx={{ mb: 2.5, borderRadius: 2 }}
              >
                سيُرسَل سؤالك إلى الأستاذ <strong>{c.teacher_name}</strong>
              </Alert>
            ) : null;
          })()}

          <TextField
            label="اكتب سؤالك هنا"
            fullWidth
            multiline
            rows={4}
            value={form.question}
            onChange={e => setForm(p => ({ ...p, question: e.target.value }))}
            placeholder="اشرح استفسارك بوضوح…"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, background: '#f8fafd', borderTop: '1px solid #e8edf2', gap: 1 }}>
          <Button onClick={closeDialog} sx={{ borderRadius: 2, color: '#546e7a' }}>إلغاء</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
            sx={{
              borderRadius: 2, px: 3, fontWeight: 700,
              background: 'linear-gradient(135deg,#1565c0,#42a5f5)',
              '&:hover': { background: 'linear-gradient(135deg,#0d47a1,#1976d2)' },
            }}
          >
            {editItem ? 'حفظ التعديل' : 'إرسال السؤال'}
          </Button>
        </DialogActions>
      </Dialog>

      <Toast open={toast.open} onClose={() => setToast(p => ({ ...p, open: false }))} message={toast.message} severity={toast.severity} />
    </Box>
  );
}