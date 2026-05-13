import React, { useState } from 'react';
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
  InputAdornment,
  Tab,
  Tabs,
  IconButton,
} from '@mui/material';
import {
  MenuBook as MenuBookIcon,
  Save as SaveIcon,
  School as SchoolIcon,
  QuestionAnswer as QuestionAnswerIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import {
  getMarkingSchemesByCourse,
  getExamForMarking,
  submitMarkingScheme,
  createExam,
} from '../../services/teacherService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

// ============= تبويب إنشاء امتحان جديد =============
const CreateExamTab = ({ onExamCreated }) => {
  const [formData, setFormData] = useState({
    course_name: '',
    title: '',
    questions: [''],
  });
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, ''],
    });
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async () => {
    if (!formData.course_name.trim()) {
      setToast({ open: true, message: 'الرجاء إدخال اسم المادة', severity: 'error' });
      return;
    }
    if (!formData.title.trim()) {
      setToast({ open: true, message: 'الرجاء إدخال عنوان الامتحان', severity: 'error' });
      return;
    }
    const validQuestions = formData.questions.filter(q => q.trim() !== '');
    if (validQuestions.length === 0) {
      setToast({ open: true, message: 'الرجاء إضافة سؤال واحد على الأقل', severity: 'error' });
      return;
    }

    setCreating(true);
    try {
      const payload = {
        course_name: formData.course_name.trim(),
        title: formData.title.trim(),
        questions: validQuestions,
      };
      
      console.log('📤 إرسال بيانات الامتحان:', payload);
      const result = await createExam(payload);
      console.log('✅ تم إنشاء الامتحان:', result);
      
      setToast({ open: true, message: '✅ تم إنشاء الامتحان بنجاح!', severity: 'success' });
      
      setFormData({
        course_name: '',
        title: '',
        questions: [''],
      });
      
      if (onExamCreated) onExamCreated();
      
    } catch (error) {
      console.error('❌ خطأ في إنشاء الامتحان:', error);
      setToast({ 
        open: true, 
        message: error.response?.data?.message || 'حدث خطأ في إنشاء الامتحان', 
        severity: 'error' 
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <strong>📝 تعليمات:</strong> أدخل اسم المادة بالضبط كما هو مسجل في النظام (مثال: الرياضيات، الفيزياء، الكيمياء، علوم الحاسوب)
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="اسم المادة"
            fullWidth
            value={formData.course_name}
            onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
            placeholder="مثال: الرياضيات"
            helperText="⚠️ يجب أن يطابق الاسم المسجل في قاعدة البيانات تماماً"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="عنوان الامتحان"
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="مثال: امتحان منتصف الفصل - الوحدة الأولى"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="bold" color="#1565c0" sx={{ mb: 2 }}>
            الأسئلة:
          </Typography>
          
          {formData.questions.map((question, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label={`السؤال ${index + 1}`}
                value={question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                multiline
                rows={2}
                placeholder="اكتب السؤال هنا..."
              />
              <IconButton 
                color="error" 
                onClick={() => handleRemoveQuestion(index)}
                disabled={formData.questions.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddQuestion}
            sx={{ mt: 1 }}
          >
            إضافة سؤال
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={creating}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            }}
          >
            {creating ? <CircularProgress size={24} /> : 'إنشاء الامتحان'}
          </Button>
        </Grid>
      </Grid>

      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </Box>
  );
};

// ============= قائمة الامتحانات =============
const ExamList = ({ exams, loading, onAddAnswers }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (exams.length === 0) {
    return (
      <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
        <MenuBookIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          لا توجد امتحانات لهذه المادة
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          💡 انتقل إلى تبويب "إنشاء امتحان" لإنشاء امتحان جديد
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {exams.map((exam) => (
        <Grid item xs={12} md={6} key={exam.id}>
          <Card sx={{ 
            borderRadius: 3, 
            transition: '0.3s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
          }}>
            <CardContent>
              <Chip 
                label={exam.title} 
                size="small" 
                sx={{ bgcolor: '#1976d2', color: '#fff', mb: 1 }} 
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 1 }}>
                {exam.description}
              </Typography>
              <Button
                fullWidth
                variant="contained"
                startIcon={<QuestionAnswerIcon />}
                onClick={() => onAddAnswers(exam)}
                sx={{ 
                  borderRadius: 2, 
                  bgcolor: '#42a5f5', 
                  '&:hover': { bgcolor: '#1976d2' } 
                }}
              >
                إضافة الإجابات (سلم التصحيح)
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// ============= تبويب سلم التصحيح =============
const MarkingSchemeTab = ({ refreshTrigger }) => {
  const [courseName, setCourseName] = useState('');
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAnswersDialog, setOpenAnswersDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [answersData, setAnswersData] = useState({});
  const [savingAnswers, setSavingAnswers] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchExams = async () => {
    if (!courseName.trim()) return;
    
    setLoading(true);
    try {
      const response = await getMarkingSchemesByCourse(courseName);
      console.log('📦 الامتحانات:', response);
      
      let examsList = [];
      
      if (response && response.marking_schemes && Array.isArray(response.marking_schemes)) {
        examsList = response.marking_schemes;
        console.log('✅ تم استخراج الامتحانات من marking_schemes');
      }
      else if (response && response.data && Array.isArray(response.data)) {
        examsList = response.data;
      }
      else if (response && response.exams && Array.isArray(response.exams)) {
        examsList = response.exams;
      }
      else if (Array.isArray(response)) {
        examsList = response;
      }
      
      console.log('📋 عدد الامتحانات:', examsList.length);
      
      const formattedExams = examsList.map(exam => ({
        id: exam.id,
        title: exam.title || exam.exam_title || 'امتحان',
        description: exam.description || 'يحتاج إضافة الإجابات النموذجية',
      }));
      
      setExams(formattedExams);
      
      if (formattedExams.length === 0) {
        console.log('ℹ️ لا توجد امتحانات للمادة:', courseName);
      }
      
    } catch (error) {
      console.error('❌ خطأ في جلب الامتحانات:', error);
      setToast({ open: true, message: 'فشل في جلب الامتحانات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ التعديل الوحيد - دالة جلب الأسئلة المعدلة
  const fetchExamQuestions = async (examId) => {
    try {
      const response = await getExamForMarking(examId);
      console.log('📝 استجابة الأسئلة:', response);
      
      let questions = [];
      
      // ✅ الأسئلة في response.exam.questions
      if (response && response.exam && response.exam.questions) {
        questions = response.exam.questions;
        console.log('✅ تم استخراج الأسئلة من response.exam.questions');
      }
      // للاحتياط
      else if (response && response.questions) {
        questions = response.questions;
      }
      
      console.log('📝 عدد الأسئلة:', questions.length);
      
      const formattedQuestions = questions.map((q, idx) => ({
        id: q.id || idx,
        text: q.question || q.text,
      }));
      
      setExamQuestions(formattedQuestions);
      const answers = {};
      formattedQuestions.forEach((q) => {
        answers[q.id] = '';
      });
      setAnswersData(answers);
      
      if (formattedQuestions.length === 0) {
        setToast({ open: true, message: '⚠️ لا توجد أسئلة لهذا الامتحان', severity: 'warning' });
      }
      
    } catch (error) {
      console.error('❌ خطأ في جلب أسئلة الامتحان:', error);
      setToast({ open: true, message: 'فشل في جلب أسئلة الامتحان', severity: 'error' });
    }
  };

  const handleOpenAnswersDialog = async (exam) => {
    setSelectedExam(exam);
    setExamQuestions([]);
    setAnswersData({});
    await fetchExamQuestions(exam.id);
    setOpenAnswersDialog(true);
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswersData({ ...answersData, [questionId]: value });
  };

  const handleSaveAnswers = async () => {
    if (!selectedExam) return;
    
    const unanswered = Object.values(answersData).some(answer => answer.trim() === '');
    if (unanswered) {
      setToast({ open: true, message: '⚠️ الرجاء إكمال جميع الإجابات قبل الحفظ', severity: 'warning' });
      return;
    }
    
    setSavingAnswers(true);
    try {
      const markingData = Object.keys(answersData).map(questionId => ({
        question_id: parseInt(questionId),
        answer: answersData[questionId]
      }));
      
      const payload = { marking_data: markingData };
      console.log('📤 إرسال الإجابات:', payload);
      
      await submitMarkingScheme(selectedExam.id, payload);
      
      setToast({ open: true, message: '✅ تم حفظ الإجابات بنجاح!', severity: 'success' });
      setOpenAnswersDialog(false);
      await fetchExams();
      
    } catch (error) {
      console.error('❌ خطأ في حفظ الإجابات:', error);
      setToast({ 
        open: true, 
        message: error.response?.data?.message || 'حدث خطأ في حفظ الإجابات', 
        severity: 'error' 
      });
    } finally {
      setSavingAnswers(false);
    }
  };

  const handleSearch = () => {
    if (courseName.trim()) {
      fetchExams();
    } else {
      setToast({ open: true, message: '⚠️ الرجاء إدخال اسم المادة', severity: 'warning' });
    }
  };

  React.useEffect(() => {
    if (courseName.trim()) {
      fetchExams();
    }
  }, [refreshTrigger]);

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: '#f5f7fa' }}>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={1}>
            <SchoolIcon sx={{ color: '#1976d2' }} />
            <Typography variant="subtitle1" fontWeight="bold" color="#1565c0">
              اسم المادة:
            </Typography>
          </Box>
          <TextField
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
            placeholder="مثال: رياضيات، فيزياء، كيمياء"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="contained" onClick={handleSearch}>بحث</Button>
          <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchExams}>
            تحديث
          </Button>
        </Box>
      </Paper>

      {!courseName ? (
        <Alert severity="info">🔍 الرجاء إدخال اسم المادة ثم الضغط على بحث</Alert>
      ) : loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <ExamList 
          exams={exams} 
          loading={loading} 
          onAddAnswers={handleOpenAnswersDialog}
        />
      )}

      {/* نافذة إضافة الإجابات */}
      <Dialog open={openAnswersDialog} onClose={() => setOpenAnswersDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#42a5f5', color: '#fff' }}>
          📝 إضافة سلم التصحيح: {selectedExam?.title}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
            📖 قم بكتابة الإجابة النموذجية لكل سؤال.
          </Alert>
          
          {examQuestions.length === 0 ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            examQuestions.map((question, idx) => (
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
                />
              </Paper>
            ))
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenAnswersDialog(false)} variant="outlined">إلغاء</Button>
          <Button onClick={handleSaveAnswers} variant="contained" disabled={savingAnswers}>
            {savingAnswers ? <CircularProgress size={24} /> : 'حفظ سلم التصحيح'}
          </Button>
        </DialogActions>
      </Dialog>

      <Toast open={toast.open} onClose={() => setToast({ ...toast, open: false })} message={toast.message} severity={toast.severity} />
    </Box>
  );
};

// ============= المكون الرئيسي =============
const ExamModels = () => {
  const [mainTabValue, setMainTabValue] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMainTabChange = (event, newValue) => {
    setMainTabValue(newValue);
  };

  const handleExamCreated = () => {
    setMainTabValue(1);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Box>
      <PageHeader
        title="النماذج الامتحانية وسلالم التصحيح"
        subtitle="إنشاء امتحانات جديدة وإضافة الإجابات النموذجية"
        icon={<MenuBookIcon sx={{ fontSize: 20 }} />}
      />

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Tabs 
          value={mainTabValue} 
          onChange={handleMainTabChange} 
          sx={{ 
            bgcolor: '#f5f7fa', 
            borderBottom: '1px solid #e0e0e0',
            '& .MuiTab-root': { fontWeight: 'bold' }
          }}
        >
          <Tab label="📝 إنشاء امتحان" />
          <Tab label="📖 سلم التصحيح" />
        </Tabs>

        {mainTabValue === 0 && <CreateExamTab onExamCreated={handleExamCreated} />}
        {mainTabValue === 1 && <MarkingSchemeTab refreshTrigger={refreshTrigger} />}
      </Paper>
    </Box>
  );
};

export default ExamModels;