import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,  // ← أضفنا Typography هنا
  Paper,
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
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Poll as PollIcon,
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
  Visibility as VisibilityIcon,
  QuestionAnswer as QuestionAnswerIcon,
} from '@mui/icons-material';
import { getPolls, createPoll, deletePoll, getPollResults } from '../../services/adminService';
import PageHeader from '../../components/common/PageHeader';
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
      setPolls(data);
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

  const handleAddQuestion = () => {
    setPollForm({
      ...pollForm,
      questions: [
        ...pollForm.questions,
        { id: Date.now(), text: '', options: ['', ''] }
      ]
    });
  };

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

  const handleQuestionChange = (questionId, value) => {
    setPollForm({
      ...pollForm,
      questions: pollForm.questions.map(q =>
        q.id === questionId ? { ...q, text: value } : q
      )
    });
  };

  const handleAddOption = (questionId) => {
    setPollForm({
      ...pollForm,
      questions: pollForm.questions.map(q =>
        q.id === questionId ? { ...q, options: [...q.options, ''] } : q
      )
    });
  };

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

  const handleSavePoll = async () => {
    if (!pollForm.title.trim()) {
      setToast({ open: true, message: 'الرجاء إدخال عنوان الاستبيان', severity: 'error' });
      return;
    }

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
      setToast({ open: true, message: 'فشل في إضافة الاستبيان', severity: 'error' });
    }
  };

  const handleDeletePoll = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الاستبيان؟')) {
      try {
        await deletePoll(id);
        setToast({ open: true, message: 'تم حذف الاستبيان بنجاح', severity: 'success' });
        fetchPolls();
      } catch (error) {
        setToast({ open: true, message: 'فشل في حذف الاستبيان', severity: 'error' });
      }
    }
  };

  const handleViewResults = async (poll) => {
    setSelectedPoll(poll);
    try {
      const results = await getPollResults(poll.id);
      setPollResults(results);
      setOpenViewDialog(true);
    } catch (error) {
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
      {/* Header موحد */}
      <PageHeader 
        title="إدارة الاستبيانات"
        subtitle="أنشئ استبيانات لجمع آراء الطلاب وأولياء الأمور"
        icon={<PollIcon sx={{ fontSize: 20 }} />}
      />

      {/* زر الإضافة */}
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 0.8,
            bgcolor: '#1976d2',
            '&:hover': { bgcolor: '#1565c0' },
          }}
        >
          استبيان جديد
        </Button>
      </Box>

      {/* قائمة الاستبيانات */}
      {polls.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 4 }}>
          <PollIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            لا توجد استبيانات حالياً
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            اضغط على "استبيان جديد" لإضافة أول استبيان
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {polls.map((poll) => (
            <Grid item xs={12} md={6} lg={4} key={poll.id}>
              <Card sx={{ 
                borderRadius: 3, 
                transition: '0.3s', 
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdef5 100%)',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: '0 8px 25px rgba(25,118,210,0.15)',
                } 
              }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Chip
                      label={`${poll.questions?.length || 0} أسئلة`}
                      size="small"
                      color="primary"
                      sx={{ bgcolor: '#1976d2', color: '#fff' }}
                    />
                    <Box>
                      <IconButton onClick={() => handleViewResults(poll)} color="primary" size="small" title="عرض النتائج">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeletePoll(poll.id)} color="error" size="small" title="حذف">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: '#1565c0' }}>
                    <PollIcon color="primary" fontSize="small" />
                    {poll.title}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1, mb: 2, color: '#555' }}>
                    {poll.description || 'لا يوجد وصف'}
                  </Typography>

                  <Divider sx={{ my: 1.5, borderColor: '#90caf9' }} />

                  <Box display="flex" alignItems="center" gap={1}>
                    <QuestionAnswerIcon fontSize="small" sx={{ color: '#1565c0' }} />
                    <Typography variant="caption" sx={{ color: '#1565c0' }}>
                      تم الإنشاء: {poll.date || '2026-04-15'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* نافذة إضافة استبيان جديد */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', 
          color: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}>
          <PollIcon />
          إضافة استبيان جديد
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            label="عنوان الاستبيان"
            fullWidth
            margin="normal"
            value={pollForm.title}
            onChange={(e) => setPollForm({ ...pollForm, title: e.target.value })}
            required
            variant="outlined"
          />
          <TextField
            label="وصف الاستبيان"
            fullWidth
            margin="normal"
            multiline
            rows={2}
            value={pollForm.description}
            onChange={(e) => setPollForm({ ...pollForm, description: e.target.value })}
            variant="outlined"
          />

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
            <QuestionAnswerIcon color="primary" />
            الأسئلة
          </Typography>

          {pollForm.questions.map((question, qIndex) => (
            <Paper key={question.id} sx={{ p: 2, mb: 3, bgcolor: '#e3f2fd', borderRadius: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight="bold" color="#1565c0">
                  سؤال {qIndex + 1}
                </Typography>
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
                variant="outlined"
              />

              <Typography variant="body2" sx={{ mt: 2, mb: 1, color: '#1565c0' }}>
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
                    variant="outlined"
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
                sx={{ mt: 1, color: '#1976d2' }}
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
            sx={{ mt: 1, py: 1.5, borderRadius: 3, borderColor: '#1976d2', color: '#1976d2' }}
          >
            إضافة سؤال
          </Button>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">إلغاء</Button>
          <Button onClick={handleSavePoll} variant="contained" sx={{ bgcolor: '#1976d2' }}>حفظ الاستبيان</Button>
        </DialogActions>
      </Dialog>

      {/* نافذة عرض النتائج */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', 
          color: '#fff' 
        }}>
          📊 نتائج الاستبيان: {selectedPoll?.title}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {pollResults && pollResults.length > 0 ? (
            pollResults.map((result, idx) => (
              <Paper key={idx} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#1565c0' }}>
                  {result.question}
                </Typography>
                {result.options.map((option, optIdx) => (
                  <Box key={optIdx} sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="body2">{option.text}</Typography>
                      <Typography variant="body2" fontWeight="bold" color="#1976d2">
                        {option.percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={option.percentage}
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#1976d2' } }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {option.votes} صوت
                    </Typography>
                  </Box>
                ))}
              </Paper>
            ))
          ) : (
            <Alert severity="info" sx={{ borderRadius: 3 }}>
              لا توجد إجابات على هذا الاستبيان بعد
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenViewDialog(false)} variant="contained" sx={{ bgcolor: '#1976d2' }}>إغلاق</Button>
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