// src/pages/Admin/Polls.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Poll as PollIcon,
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { getPolls, createPoll, deletePoll, getPollResults } from '../../services/adminService';
import Toast from '../../components/common/Toast';

function Polls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [pollResults, setPollResults] = useState(null);
  const [pollForm, setPollForm] = useState({
    title: '',
    description: '',
    questions: [
      { id: 1, text: '', options: ['', ''] }
    ]
  });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const data = await getPolls();
      console.log('الاستبيانات المستلمة:', data);
      setPolls(data || []);
    } catch (error) {
      console.error('خطأ في جلب الاستبيانات:', error);
      setToast({ open: true, message: 'فشل في جلب الاستبيانات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  // إضافة سؤال جديد
  const handleAddQuestion = () => {
    setPollForm({
      ...pollForm,
      questions: [
        ...pollForm.questions,
        { id: Date.now(), text: '', options: ['', ''] }
      ]
    });
  };

  // حذف سؤال
  const handleRemoveQuestion = (questionId) => {
    if (pollForm.questions.length === 1) {
      setToast({ open: true, message: 'يجب أن يكون هناك سؤال واحد على الأقل', severity: 'warning' });
      return;
    }
    setPollForm({
      ...pollForm,
      questions: pollForm.questions.filter(q => q.id !== questionId)
    });
  };

  // تحديث نص السؤال
  const handleQuestionChange = (questionId, value) => {
    setPollForm({
      ...pollForm,
      questions: pollForm.questions.map(q =>
        q.id === questionId ? { ...q, text: value } : q
      )
    });
  };

  // إضافة خيار للسؤال
  const handleAddOption = (questionId) => {
    setPollForm({
      ...pollForm,
      questions: pollForm.questions.map(q =>
        q.id === questionId ? { ...q, options: [...q.options, ''] } : q
      )
    });
  };

  // حذف خيار من السؤال
  const handleRemoveOption = (questionId, optionIndex) => {
    setPollForm({
      ...pollForm,
      questions: pollForm.questions.map(q =>
        q.id === questionId
          ? { ...q, options: q.options.filter((_, idx) => idx !== optionIndex) }
          : q
      )
    });
  };

  // تحديث نص الخيار
  const handleOptionChange = (questionId, optionIndex, value) => {
    setPollForm({
      ...pollForm,
      questions: pollForm.questions.map(q =>
        q.id === questionId
          ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
          : q
      )
    });
  };

  // حفظ الاستبيان
  const handleSavePoll = async () => {
    // التحقق من صحة البيانات
    if (!pollForm.title.trim()) {
      setToast({ open: true, message: 'الرجاء إدخال عنوان الاستبيان', severity: 'error' });
      return;
    }

    // التحقق من الأسئلة
    for (const question of pollForm.questions) {
      if (!question.text.trim()) {
        setToast({ open: true, message: 'الرجاء إكمال جميع الأسئلة', severity: 'error' });
        return;
      }
      for (const option of question.options) {
        if (!option.trim()) {
          setToast({ open: true, message: 'الرجاء إكمال جميع الخيارات', severity: 'error' });
          return;
        }
      }
    }

    try {
      console.log('جاري إضافة استبيان:', pollForm);
      await createPoll(pollForm);
      setToast({ open: true, message: 'تم إضافة الاستبيان بنجاح', severity: 'success' });
      setOpenDialog(false);
      setPollForm({
        title: '',
        description: '',
        questions: [{ id: Date.now(), text: '', options: ['', ''] }]
      });
      fetchPolls();
    } catch (error) {
      console.error('خطأ في إضافة الاستبيان:', error);
      setToast({ open: true, message: 'فشل في إضافة الاستبيان: ' + error.message, severity: 'error' });
    }
  };

  // حذف استبيان
  const handleDeletePoll = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الاستبيان؟')) {
      try {
        await deletePoll(id);
        setToast({ open: true, message: 'تم حذف الاستبيان بنجاح', severity: 'success' });
        fetchPolls();
      } catch (error) {
        console.error('خطأ في حذف الاستبيان:', error);
        setToast({ open: true, message: 'فشل في حذف الاستبيان', severity: 'error' });
      }
    }
  };

  // عرض نتائج الاستبيان
  const handleViewResults = async (poll) => {
    setSelectedPoll(poll);
    try {
      const results = await getPollResults(poll.id);
      setPollResults(results);
      setOpenViewDialog(true);
    } catch (error) {
      console.error('خطأ في جلب النتائج:', error);
      setToast({ open: true, message: 'فشل في جلب النتائج', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل الاستبيانات...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          📊 إدارة الاستبيانات
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setPollForm({
              title: '',
              description: '',
              questions: [{ id: Date.now(), text: '', options: ['', ''] }]
            });
            setOpenDialog(true);
          }}
        >
          استبيان جديد
        </Button>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        {polls.length === 0 ? (
          <Alert severity="info">
            لا توجد استبيانات حالياً. اضغط على "استبيان جديد" لإضافة أول استبيان.
          </Alert>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>العنوان</TableCell>
                <TableCell>الوصف</TableCell>
                <TableCell>عدد الأسئلة</TableCell>
                <TableCell>التاريخ</TableCell>
                <TableCell align="center">إجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {polls.map((poll) => (
                <TableRow key={poll.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PollIcon color="primary" fontSize="small" />
                      <Typography fontWeight="medium">{poll.title}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{poll.description}</TableCell>
                  <TableCell>
                    <Chip label={`${poll.questions?.length || 0} سؤال`} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={poll.date || '2026-04-15'} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleViewResults(poll)} color="info" size="small" title="عرض النتائج">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeletePoll(poll.id)} color="error" size="small" title="حذف">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* نافذة إضافة استبيان جديد */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>➕ إضافة استبيان جديد</DialogTitle>
        <DialogContent>
          <TextField
            label="عنوان الاستبيان"
            fullWidth
            margin="normal"
            value={pollForm.title}
            onChange={(e) => setPollForm({ ...pollForm, title: e.target.value })}
            required
          />
          <TextField
            label="وصف الاستبيان"
            fullWidth
            margin="normal"
            multiline
            rows={2}
            value={pollForm.description}
            onChange={(e) => setPollForm({ ...pollForm, description: e.target.value })}
          />

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            الأسئلة
          </Typography>

          {pollForm.questions.map((question, qIndex) => (
            <Paper key={question.id} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">سؤال {qIndex + 1}</Typography>
                <IconButton onClick={() => handleRemoveQuestion(question.id)} color="error" size="small">
                  <RemoveCircleIcon />
                </IconButton>
              </Box>

              <TextField
                label="نص السؤال"
                fullWidth
                margin="normal"
                value={question.text}
                onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                required
              />

              <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                الخيارات:
              </Typography>

              {question.options.map((option, optIndex) => (
                <Box key={optIndex} display="flex" alignItems="center" gap={1} mb={1}>
                  <TextField
                    label={`خيار ${optIndex + 1}`}
                    size="small"
                    fullWidth
                    value={option}
                    onChange={(e) => handleOptionChange(question.id, optIndex, e.target.value)}
                  />
                  {question.options.length > 2 && (
                    <IconButton onClick={() => handleRemoveOption(question.id, optIndex)} color="error" size="small">
                      <RemoveCircleIcon />
                    </IconButton>
                  )}
                </Box>
              ))}

              <Button
                size="small"
                startIcon={<AddCircleIcon />}
                onClick={() => handleAddOption(question.id)}
                sx={{ mt: 1 }}
              >
                إضافة خيار
              </Button>
            </Paper>
          ))}

          <Button
            variant="outlined"
            startIcon={<AddCircleIcon />}
            onClick={handleAddQuestion}
            fullWidth
            sx={{ mt: 1 }}
          >
            إضافة سؤال
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>إلغاء</Button>
          <Button onClick={handleSavePoll} variant="contained">حفظ الاستبيان</Button>
        </DialogActions>
      </Dialog>

      {/* نافذة عرض النتائج */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>📊 نتائج الاستبيان: {selectedPoll?.title}</DialogTitle>
        <DialogContent>
          {pollResults && pollResults.length > 0 ? (
            pollResults.map((result, idx) => (
              <Paper key={idx} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">{result.question}</Typography>
                <Box sx={{ mt: 1 }}>
                  {result.options.map((option, optIdx) => (
                    <Box key={optIdx} sx={{ mb: 1 }}>
                      <Typography variant="body2">{option.text}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ flexGrow: 1, bgcolor: '#e0e0e0', borderRadius: 1, height: 10 }}>
                          <Box
                            sx={{
                              width: `${option.percentage}%`,
                              bgcolor: '#1976d2',
                              height: 10,
                              borderRadius: 1,
                            }}
                          />
                        </Box>
                        <Typography variant="caption">{option.percentage}%</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({option.votes} صوت)
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            ))
          ) : (
            <Alert severity="info">لا توجد إجابات على هذا الاستبيان بعد</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>إغلاق</Button>
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

export default Polls;