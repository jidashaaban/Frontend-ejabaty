import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  IconButton,
  Divider,
  useTheme,
  Avatar,
} from '@mui/material';
import {
  Poll as PollIcon,
  CheckCircle as CheckCircleIcon,
  Timer as TimerIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Assignment as AssignmentIcon,
  EmojiEvents as EmojiEventsIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';
import {
  getStudentPolls,
  getPollById,
  submitPollAnswers,
} from '../../services/studentService';

function PollStudent() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [polls, setPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [answers, setAnswers] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const data = await getStudentPolls();
      console.log('📊 الاستبيانات:', data);
      
      let pollsArray = [];
      if (Array.isArray(data)) {
        pollsArray = data;
      } else if (data?.data && Array.isArray(data.data)) {
        pollsArray = data.data;
      } else if (data?.polls && Array.isArray(data.polls)) {
        pollsArray = data.polls;
      }
      
      setPolls(pollsArray);
    } catch (error) {
      console.error('❌ خطأ في جلب الاستبيانات:', error);
      setToast({ open: true, message: 'فشل في جلب الاستبيانات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPoll = async (pollId) => {
    setLoading(true);
    try {
      const data = await getPollById(pollId);
      console.log('📊 تفاصيل الاستبيان:', data);
      
      let pollDetails = data;
      if (data?.data) pollDetails = data.data;
      if (data?.poll) pollDetails = data.poll;
      
      setSelectedPoll(pollDetails);
      setAnswers({});
      setDialogOpen(true);
    } catch (error) {
      console.error('❌ خطأ في جلب تفاصيل الاستبيان:', error);
      setToast({ open: true, message: 'فشل في جلب تفاصيل الاستبيان', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitPoll = async () => {
    if (!selectedPoll) return;
    
    const totalQuestions = selectedPoll.questions?.length || 0;
    const answeredQuestions = Object.keys(answers).length;
    
    if (answeredQuestions < totalQuestions) {
      setToast({ 
        open: true, 
        message: `⚠️ الرجاء الإجابة على جميع الأسئلة (${answeredQuestions}/${totalQuestions})`, 
        severity: 'warning' 
      });
      return;
    }
    
    setSubmitting(true);
    try {
      await submitPollAnswers(selectedPoll.id, answers);
      setToast({ open: true, message: '✅ تم إرسال الإجابات بنجاح! شكراً لمشاركتك', severity: 'success' });
      setDialogOpen(false);
      setSelectedPoll(null);
      setAnswers({});
      fetchPolls();
    } catch (error) {
      console.error('❌ خطأ في إرسال الإجابات:', error);
      setToast({ open: true, message: error.response?.data?.message || '❌ فشل في إرسال الإجابات', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const isPollExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getRemainingDays = (expiresAt) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCardStyle = (expired, alreadyAnswered) => {
    if (expired) {
      return {
        background: 'linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%)',
        borderLeft: '6px solid #f44336',
        icon: <TimerIcon sx={{ color: '#f44336' }} />,
        chipColor: '#f44336',
        chipText: 'منتهي',
        textColor: '#c62828',
        avatarBg: '#f44336'
      };
    }
    if (alreadyAnswered) {
      return {
        background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
        borderLeft: '6px solid #4caf50',
        icon: <CheckCircleIcon sx={{ color: '#4caf50' }} />,
        chipColor: '#4caf50',
        chipText: 'تمت المشاركة',
        textColor: '#2e7d32',
        avatarBg: '#4caf50'
      };
    }
    return {
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      borderLeft: '6px solid #1976d2',
      icon: <PollIcon sx={{ color: '#1976d2' }} />,
      chipColor: '#1976d2',
      chipText: 'متاح',
      textColor: '#1565c0',
      avatarBg: '#1976d2'
    };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="500px" flexDirection="column">
        <CircularProgress size={60} sx={{ color: '#1976d2' }} />
        <Typography sx={{ mt: 2, color: '#1976d2' }}>جاري تحميل الاستبيانات...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader 
        title="الاستبيانات"
        subtitle="شارك برأيك وساهم في تطوير العملية التعليمية"
        icon={<PollIcon sx={{ fontSize: 20 }} />}
      />

      <Paper sx={{ 
        p: 2.5, 
        mb: 4, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }}>
        <Box display="flex" alignItems="center" gap={2}>
          <AssignmentIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{polls.length}</Typography>
            <Typography variant="body2">استبيان متاح</Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <StarIcon />
          <Typography variant="body2">
            شارك برأيك بكل ثقة، إجاباتك سرية تماماً
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {polls.length === 0 ? (
            <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, bgcolor: '#fafafa' }}>
              <PollIcon sx={{ fontSize: 100, color: '#ccc', mb: 2 }} />
              <Typography variant="h5" color="text.secondary">لا توجد استبيانات متاحة حالياً</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                ترقب الاستبيانات الجديدة من إدارة المدرسة
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {polls.map((poll) => {
                const expired = isPollExpired(poll.expires_at);
                const alreadyAnswered = poll.user_answered === true || poll.submitted === true;
                const remainingDays = getRemainingDays(poll.expires_at);
                const cardStyle = getCardStyle(expired, alreadyAnswered);
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={poll.id}>
                    <Card sx={{ 
                      borderRadius: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: cardStyle.background,
                      borderLeft: cardStyle.borderLeft,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      cursor: expired || alreadyAnswered ? 'default' : 'pointer',
                      '&:hover': expired || alreadyAnswered ? {} : { 
                        transform: 'translateY(-8px)', 
                        boxShadow: theme.shadows[12] 
                      },
                      position: 'relative',
                      overflow: 'visible'
                    }}
                    onClick={() => !expired && !alreadyAnswered && handleOpenPoll(poll.id)}
                    >
                      {!expired && !alreadyAnswered && (
                        <Box sx={{
                          position: 'absolute',
                          top: -12,
                          right: 20,
                          bgcolor: '#ff9800',
                          color: '#fff',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 3,
                          fontSize: '12px',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          boxShadow: 2
                        }}>
                          <StarIcon sx={{ fontSize: 14 }} />
                          جديد
                        </Box>
                      )}
                      
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                          <Avatar sx={{ bgcolor: cardStyle.avatarBg, width: 48, height: 48 }}>
                            {cardStyle.icon}
                          </Avatar>
                          <Chip 
                            label={cardStyle.chipText} 
                            size="medium" 
                            sx={{
                              bgcolor: cardStyle.chipColor,
                              color: '#fff',
                              fontWeight: 'bold',
                              px: 1
                            }}
                          />
                        </Box>

                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1.2rem', color: cardStyle.textColor }}>
                          {poll.title}
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 2, color: '#555', lineHeight: 1.5 }}>
                          {poll.description || 'لا يوجد وصف'}
                        </Typography>

                        <Divider sx={{ my: 1.5 }} />

                        <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <AssignmentIcon sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="caption" color="text.secondary">
                              {poll.questions?.length || 0} أسئلة
                            </Typography>
                          </Box>
                          
                          {!expired && !alreadyAnswered && remainingDays !== null && (
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <TimerIcon sx={{ fontSize: 14, color: '#ff9800' }} />
                              <Typography variant="caption" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                                {remainingDays} يوم متبقي
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {!expired && !alreadyAnswered && (
                          <Button
                            variant="contained"
                            fullWidth
                            sx={{
                              mt: 2,
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 'bold',
                              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
                              }
                            }}
                          >
                            ابدأ الاستبيان الآن
                          </Button>
                        )}
                        
                        {(expired || alreadyAnswered) && (
                          <Button
                            variant="outlined"
                            fullWidth
                            disabled
                            sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
                          >
                            {expired ? 'انتهى الاستبيان' : 'لقد شاركت بالفعل'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Grid>
      </Grid>

      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, overflow: 'hidden' }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', 
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <PollIcon />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {selectedPoll?.title}
            </Typography>
          </Box>
          <IconButton onClick={() => setDialogOpen(false)} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, backgroundColor: '#fafafa' }}>
          {selectedPoll?.description && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              📌 {selectedPoll.description}
            </Alert>
          )}
          
          {selectedPoll?.questions?.map((question, qIndex) => (
            <Paper key={question.id || qIndex} sx={{ p: 2.5, mb: 3, borderRadius: 2, boxShadow: 1 }}>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 2, fontSize: '1rem', color: '#1976d2' }}>
                  {qIndex + 1}. {question.text || question.question}
                </FormLabel>
                
                <RadioGroup
                  value={answers[question.id || qIndex] || ''}
                  onChange={(e) => handleAnswerChange(question.id || qIndex, e.target.value)}
                >
                  <Grid container spacing={1}>
                    {question.options?.map((option, oIndex) => (
                      <Grid item xs={12} key={oIndex}>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 1,
                            borderRadius: 2,
                            transition: 'all 0.2s ease',
                            bgcolor: answers[question.id || qIndex] === option ? '#e3f2fd' : 'transparent',
                            borderColor: answers[question.id || qIndex] === option ? '#1976d2' : '#e0e0e0',
                            borderWidth: answers[question.id || qIndex] === option ? 2 : 1,
                            '&:hover': { bgcolor: '#f5f5f5', cursor: 'pointer' }
                          }}
                        >
                          <FormControlLabel
                            value={option}
                            control={<Radio />}
                            label={option}
                            sx={{ width: '100%', m: 0 }}
                          />
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              </FormControl>
            </Paper>
          ))}
          
          {selectedPoll?.questions?.length > 0 && (
            <Box sx={{ mt: 3, p: 2, bgcolor: '#fff', borderRadius: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">التقدم في الاستبيان</Typography>
                <Typography variant="body2" fontWeight="bold" color="#1976d2">
                  {Object.keys(answers).length} / {selectedPoll.questions.length}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(Object.keys(answers).length / selectedPoll.questions.length) * 100} 
                sx={{ height: 10, borderRadius: 5, bgcolor: '#e0e0e0' }}
              />
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, backgroundColor: '#fff', borderTop: '1px solid #eee' }}>
          <Button 
            onClick={() => setDialogOpen(false)} 
            variant="outlined" 
            disabled={submitting}
            sx={{ borderRadius: 2, px: 3 }}
          >
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmitPoll} 
            variant="contained" 
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{ 
              bgcolor: '#4caf50',
              borderRadius: 2,
              px: 3,
              '&:hover': { bgcolor: '#388e3c' }
            }}
          >
            {submitting ? 'جاري الإرسال...' : 'إرسال الإجابات'}
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
}

export default PollStudent;