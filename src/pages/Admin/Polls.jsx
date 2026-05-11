import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';
import {
  getAllPolls,
  createPoll,
  deletePoll,
  getPollResults,
} from '../../services/adminService';

function Polls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [pollResults, setPollResults] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  const getDefaultExpiresAt = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    date.setHours(date.getHours() + 1);
    return date.toISOString().slice(0, 16);
  };

  const [pollForm, setPollForm] = useState({
    title: '',
    description: '',
    expires_at: getDefaultExpiresAt(),
    questions: [
      {
        question_text: '',
        options: ['', '']
      }
    ]
  });

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const data = await getAllPolls();
      console.log('بيانات الاستبيانات المستلمة:', data);
      
      let pollsArray = [];
      if (Array.isArray(data)) {
        pollsArray = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        pollsArray = data.data;
      } else {
        pollsArray = [];
      }
      
      setPolls(pollsArray);
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
        { question_text: '', options: ['', ''] }
      ]
    });
  };

  const handleRemoveQuestion = (questionIndex) => {
    if (pollForm.questions.length === 1) {
      setToast({ open: true, message: 'يجب أن يكون هناك سؤال واحد على الأقل', severity: 'warning' });
      return;
    }
    setPollForm({
      ...pollForm,
      questions: pollForm.questions.filter((_, idx) => idx !== questionIndex)
    });
  };

  const handleQuestionChange = (questionIndex, value) => {
    const updatedQuestions = [...pollForm.questions];
    updatedQuestions[questionIndex].question_text = value;
    setPollForm({ ...pollForm, questions: updatedQuestions });
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...pollForm.questions];
    updatedQuestions[questionIndex].options.push('');
    setPollForm({ ...pollForm, questions: updatedQuestions });
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...pollForm.questions];
    if (updatedQuestions[questionIndex].options.length <= 2) {
      setToast({ open: true, message: 'يجب أن يكون هناك خياران على الأقل لكل سؤال', severity: 'warning' });
      return;
    }
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, idx) => idx !== optionIndex);
    setPollForm({ ...pollForm, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...pollForm.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setPollForm({ ...pollForm, questions: updatedQuestions });
  };

  const formatDateForMySQL = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSavePoll = async () => {
    if (!pollForm.title.trim()) {
      setToast({ open: true, message: 'الرجاء إدخال عنوان الاستبيان', severity: 'error' });
      return;
    }

    if (!pollForm.expires_at) {
      setToast({ open: true, message: 'الرجاء تحديد تاريخ انتهاء الاستبيان', severity: 'error' });
      return;
    }
    const expiresAtDate = new Date(pollForm.expires_at);
    const now = new Date();
    
    if (expiresAtDate <= now) {
      setToast({ open: true, message: 'تاريخ الانتهاء يجب أن يكون بعد الوقت الحالي', severity: 'error' });
      return;
    }

    for (let i = 0; i < pollForm.questions.length; i++) {
      const question = pollForm.questions[i];
      if (!question.question_text.trim()) {
        setToast({ open: true, message: `الرجاء إدخال نص السؤال ${i + 1}`, severity: 'error' });
        return;
      }
      const validOptions = question.options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        setToast({ open: true, message: `السؤال ${i + 1} يحتاج إلى خيارين على الأقل`, severity: 'error' });
        return;
      }
    }

    try {
      const formattedExpiresAt = formatDateForMySQL(pollForm.expires_at);
      
      const pollData = {
        title: pollForm.title,
        description: pollForm.description || '',
        expires_at: formattedExpiresAt,
        questions: pollForm.questions.map(q => ({
          question_text: q.question_text,
          options: q.options.filter(opt => opt.trim() !== '')
        }))
      };
      
      console.log('البيانات المرسلة للـ API:', pollData);
      await createPoll(pollData);
      setToast({ open: true, message: 'تم إضافة الاستبيان بنجاح', severity: 'success' });
      setOpenDialog(false);
      
      setPollForm({
        title: '',
        description: '',
        expires_at: getDefaultExpiresAt(),
        questions: [{ question_text: '', options: ['', ''] }]
      });
      fetchPolls();
    } catch (error) {
      console.error('خطأ في إضافة الاستبيان:', error);
      setToast({ 
        open: true, 
        message: error.response?.data?.message || 'فشل في إضافة الاستبيان', 
        severity: 'error' 
      });
    }
  };

  const handleDeletePoll = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الاستبيان؟')) {
      try {
        await deletePoll(id);
        setToast({ open: true, message: 'تم حذف الاستبيان بنجاح', severity: 'success' });
        fetchPolls();
      } catch (error) {
        console.error('خطأ في حذف الاستبيان:', error);
        setToast({ open: true, message: error.response?.data?.message || 'فشل في حذف الاستبيان', severity: 'error' });
      }
    }
  };

  const handleViewResults = async (poll) => {
    setSelectedPoll(poll);
    try {
      const results = await getPollResults(poll.id);
      console.log('نتائج الاستبيان:', results);
      
      let resultsArray = [];
      if (Array.isArray(results)) {
        resultsArray = results;
      } else if (results && results.data && Array.isArray(results.data)) {
        resultsArray = results.data;
      } else {
        resultsArray = [];
      }
      
      setPollResults(resultsArray);
      setOpenViewDialog(true);
    } catch (error) {
      console.error('خطأ في جلب النتائج:', error);
      setPollResults([]);
      setOpenViewDialog(true);
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
      <PageHeader 
        title="إدارة الاستبيانات"
        subtitle="أنشئ استبيانات لجمع آراء الطلاب وأولياء الأمور"
        icon={<PollIcon sx={{ fontSize: 20 }} />}
      />

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

      {polls.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
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
                bgcolor: '#ffffff',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: '0 8px 25px rgba(25,118,210,0.15)',
                } 
              }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Chip
                      label={`${poll.questions_count || poll.questions?.length || 0} أسئلة`}
                      size="small"
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

                  {poll.description && (
                    <Typography variant="body2" sx={{ mt: 1, mb: 2, color: '#555' }}>
                      {poll.description}
                    </Typography>
                  )}

                  <Divider sx={{ my: 1.5 }} />

                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ color: '#1565c0' }}>
                      ينتهي: {poll.expires_at ? new Date(poll.expires_at).toLocaleDateString('ar') : 'غير محدد'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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
            label="وصف الاستبيان (اختياري)"
            fullWidth
            margin="normal"
            multiline
            rows={2}
            value={pollForm.description}
            onChange={(e) => setPollForm({ ...pollForm, description: e.target.value })}
            variant="outlined"
          />

          <TextField
            label="تاريخ الانتهاء"
            type="datetime-local"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={pollForm.expires_at}
            onChange={(e) => setPollForm({ ...pollForm, expires_at: e.target.value })}
            required
            variant="outlined"
            helperText="بعد هذا التاريخ لن يتمكن الطلاب من الإجابة"
          />

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
            الأسئلة
          </Typography>

          {pollForm.questions.map((question, qIndex) => (
            <Paper key={qIndex} sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5', borderRadius: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight="bold" color="#1565c0">
                  سؤال {qIndex + 1}
                </Typography>
                {pollForm.questions.length > 1 && (
                  <IconButton onClick={() => handleRemoveQuestion(qIndex)} color="error" size="small">
                    <RemoveCircleIcon />
                  </IconButton>
                )}
              </Box>

              <TextField
                label="نص السؤال"
                fullWidth
                margin="normal"
                value={question.question_text}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
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
                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                    variant="outlined"
                  />
                  {question.options.length > 2 && (
                    <IconButton onClick={() => handleRemoveOption(qIndex, optIndex)} color="error" size="small">
                      <RemoveCircleIcon />
                    </IconButton>
                  )}
                </Box>
              ))}

              <Button
                size="small"
                startIcon={<AddCircleIcon />}
                onClick={() => handleAddOption(qIndex)}
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

      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', 
          color: '#fff' 
        }}>
           نتائج الاستبيان: {selectedPoll?.title}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {pollResults && pollResults.length > 0 ? (
            pollResults.map((result, idx) => (
              <Paper key={idx} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#1565c0' }}>
                  {result.question_text || result.question}
                </Typography>
                {result.options?.map((option, optIdx) => (
                  <Box key={optIdx} sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="body2">{option.option_text}</Typography>
                      <Typography variant="body2" fontWeight="bold" color="#1976d2">
                        {option.percentage || 0}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={option.percentage || 0}
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#1976d2' } }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {option.votes_count || option.votes || 0} صوت
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