import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  MenuItem,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  MenuBook as MenuBookIcon,
  Save as SaveIcon,
  School as SchoolIcon,
  QuestionAnswer as QuestionAnswerIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import {
  getTeacherSubjects,
  getExamModels,
  saveAnswers,
} from '../../services/teacherService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const ExamModels = () => {
  const { user } = useSelector((state) => state.auth);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [examModels, setExamModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAnswersDialog, setOpenAnswersDialog] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [answersData, setAnswersData] = useState({});
  const [savingAnswers, setSavingAnswers] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subjectsData, modelsData] = await Promise.all([
        getTeacherSubjects(user?.id || 1),
        getExamModels(user?.id || 1),
      ]);
      setSubjects(subjectsData || []);
      setExamModels(modelsData || []);
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
      setSubjects([
        { id: 1, name: 'الرياضيات' },
        { id: 2, name: 'الفيزياء' },
        { id: 3, name: 'الكيمياء' },
      ]);
      setExamModels([
        { 
          id: 1, 
          title: 'نموذج امتحان الرياضيات - الفصل الأول', 
          subject: 'الرياضيات', 
          description: 'أسئلة شاملة للمنهج',
          questions: [
            { id: 1, text: 'حل المعادلة: 2x + 5 = 15', answer: '' },
            { id: 2, text: 'أوجد مشتقة: f(x) = x² + 3x', answer: '' },
            { id: 3, text: 'باستخدام النظرية: احسب قيمة x في المعادلة 3x - 7 = 8', answer: '' },
          ],
          date: '2026-04-20',
        },
        { 
          id: 2, 
          title: 'نموذج امتحان الفيزياء - الوحدة الأولى', 
          subject: 'الفيزياء', 
          description: 'أسئلة في قوانين نيوتن والحركة',
          questions: [
            { id: 1, text: 'ما هو قانون نيوتن الأول؟', answer: '' },
            { id: 2, text: 'احسب القوة المؤثرة على جسم كتلته 5kg ويسارع بمقدار 2m/s²', answer: '' },
            { id: 3, text: 'ما هي وحدة قياس السرعة؟', answer: '' },
          ],
          date: '2026-04-18',
        },
        { 
          id: 3, 
          title: 'نموذج امتحان الكيمياء - التفاعلات', 
          subject: 'الكيمياء', 
          description: 'أسئلة في التفاعلات الكيميائية',
          questions: [
            { id: 1, text: 'ما هو التفاعل الكيميائي؟', answer: '' },
            { id: 2, text: 'اذكر أنواع التفاعلات الكيميائية', answer: '' },
          ],
          date: '2026-04-15',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  useEffect(() => {
    if (selectedSubject) {
      setFilteredModels(examModels.filter(m => m.subject === selectedSubject));
    } else {
      setFilteredModels([]);
    }
  }, [selectedSubject, examModels]);

  const handleOpenAnswersDialog = (model) => {
    setSelectedModel(model);
    const answers = {};
    model.questions.forEach(q => {
      answers[q.id] = q.answer || '';
    });
    setAnswersData(answers);
    setOpenAnswersDialog(true);
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswersData({ ...answersData, [questionId]: value });
  };

  const handleSaveAnswers = async () => {
    setSavingAnswers(true);
    try {
      await saveAnswers(selectedModel.id, answersData);
      setToast({ open: true, message: 'تم حفظ الإجابات بنجاح', severity: 'success' });
      setOpenAnswersDialog(false);
      fetchData(); 
    } catch (error) {
      setToast({ open: true, message: error.message || 'حدث خطأ', severity: 'error' });
    } finally {
      setSavingAnswers(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل البيانات...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="النماذج الامتحانية"
        subtitle="إضافة الإجابات النموذجية للنماذج الامتحانية"
        icon={<MenuBookIcon sx={{ fontSize: 20 }} />}
      />

      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f9ff 100%)',
          border: '1px solid #1976d2',
        }}
      >
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={1}>
            <SchoolIcon sx={{ color: '#1976d2' }} />
            <Typography variant="subtitle1" fontWeight="bold" color="#1565c0">
              اختر المادة:
            </Typography>
          </Box>
          <TextField
            select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
            placeholder="اختر المادة"
          >
            <MenuItem value="">-- جميع المواد --</MenuItem>
            {subjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.name}>
                {subject.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Paper>

      {!selectedSubject ? (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          الرجاء اختيار مادة لعرض النماذج الامتحانية الخاصة بها
        </Alert>
      ) : filteredModels.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
          <MenuBookIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            لا توجد نماذج امتحانية لهذه المادة
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredModels.map((model) => (
            <Grid item xs={12} md={6} key={model.id}>
              <Card
                sx={{
                  borderRadius: 4,
                  transition: '0.3s',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '1px solid #e0e0e0',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Chip
                      label={model.subject}
                      size="small"
                      sx={{ bgcolor: '#1976d2', color: '#fff' }}
                    />
                  </Box>

                  <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold', color: '#1565c0' }}>
                    {model.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {model.description || 'لا يوجد وصف'}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip
                      icon={<QuestionAnswerIcon />}
                      label={`${model.questions?.length || 0} سؤال`}
                      size="small"
                      variant="outlined"
                    />
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={() => handleOpenAnswersDialog(model)}
                      sx={{
                        borderRadius: 2,
                        bgcolor: '#42a5f5',
                        '&:hover': { bgcolor: '#1976d2' },
                      }}
                    >
                      إضافة الإجابات
                    </Button>
                  </Box>

                  {model.questions?.some(q => q.answer) && (
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="caption" color="success.main" display="flex" alignItems="center" gap={0.5}>
                        <CheckCircleIcon fontSize="small" />
                        تم حفظ الإجابات
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openAnswersDialog} onClose={() => setOpenAnswersDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#42a5f5', color: '#fff' }}>
          📝 إضافة إجابات نموذج: {selectedModel?.title}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            قم بكتابة الإجابة النموذجية لكل سؤال من الأسئلة التالية:
          </Typography>
          {selectedModel?.questions.map((question, idx) => (
            <Paper key={question.id} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="#1565c0" gutterBottom>
                السؤال {idx + 1}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                {question.text}
              </Typography>
              <TextField
                label="الإجابة النموذجية"
                fullWidth
                multiline
                rows={3}
                value={answersData[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="اكتب الإجابة النموذجية لهذا السؤال..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CheckCircleIcon sx={{ color: '#4caf50' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Paper>
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenAnswersDialog(false)} variant="outlined">إلغاء</Button>
          <Button onClick={handleSaveAnswers} variant="contained" disabled={savingAnswers} sx={{ bgcolor: '#1976d2' }}>
            {savingAnswers ? 'جاري الحفظ...' : 'حفظ الإجابات'}
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

export default ExamModels;