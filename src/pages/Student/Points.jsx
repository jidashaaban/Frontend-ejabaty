import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Rating,
  Tooltip,
} from '@mui/material';
import {
  EmojiEvents as EmojiEventsIcon,
  Star as StarIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';
import { getPoints, getExamHistory, getPastQuizzes } from '../../services/studentService';

function Points() {
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [pointsDetails, setPointsDetails] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchPointsData();
  }, []);

  const fetchPointsData = async () => {
    setLoading(true);
    try {
      const [pointsData, examHistory, pastQuizzes] = await Promise.all([
        getPoints(),
        getExamHistory(),
        getPastQuizzes(),
      ]);

      console.log('⭐ النقاط (الخام):', pointsData);
      console.log('📊 سجل الامتحانات:', examHistory);
      console.log('📚 الاختبارات السابقة:', pastQuizzes);

      // معالجة النقاط الكلية
      let total = 0;
      if (typeof pointsData === 'number') {
        total = pointsData;
      } else if (pointsData?.total_points) {
        total = pointsData.total_points;
      } else if (pointsData?.points) {
        total = pointsData.points;
      }
      setTotalPoints(total);

      // معالجة تفاصيل النقاط من سجل الامتحانات والاختبارات
      let detailsArray = [];

      // من سجل الامتحانات
      if (Array.isArray(examHistory)) {
        examHistory.forEach(item => {
          detailsArray.push({
            id: item.id,
            course_name: item.course?.name || item.course_name,
            exam_name: item.exam_name || 'امتحان',
            points: item.marks_obtained || item.points || 0,
            max_points: item.max_marks || item.total_marks || 100,
            note: item.teacher_note || item.note || item.feedback || '',
            date: item.created_at || item.date,
            type: 'exam',
          });
        });
      } else if (examHistory?.data && Array.isArray(examHistory.data)) {
        examHistory.data.forEach(item => {
          detailsArray.push({
            id: item.id,
            course_name: item.course?.name || item.course_name,
            exam_name: item.exam_name || 'امتحان',
            points: item.marks_obtained || item.points || 0,
            max_points: item.max_marks || item.total_marks || 100,
            note: item.teacher_note || item.note || item.feedback || '',
            date: item.created_at || item.date,
            type: 'exam',
          });
        });
      }

      // من الاختبارات السابقة (Quizzes)
      if (Array.isArray(pastQuizzes)) {
        pastQuizzes.forEach(item => {
          detailsArray.push({
            id: item.id,
            course_name: item.course?.name || item.course_name,
            exam_name: item.quiz_name || item.title || 'اختبار قصير',
            points: item.score || item.points || item.marks_obtained || 0,
            max_points: item.max_score || item.total_marks || 100,
            note: item.feedback || item.teacher_note || item.note || '',
            date: item.created_at || item.date,
            type: 'quiz',
          });
        });
      } else if (pastQuizzes?.data && Array.isArray(pastQuizzes.data)) {
        pastQuizzes.data.forEach(item => {
          detailsArray.push({
            id: item.id,
            course_name: item.course?.name || item.course_name,
            exam_name: item.quiz_name || item.title || 'اختبار قصير',
            points: item.score || item.points || item.marks_obtained || 0,
            max_points: item.max_score || item.total_marks || 100,
            note: item.feedback || item.teacher_note || item.note || '',
            date: item.created_at || item.date,
            type: 'quiz',
          });
        });
      }

      // ترتيب حسب التاريخ (الأحدث أولاً)
      detailsArray.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setPointsDetails(detailsArray);
      console.log('✅ تفاصيل النقاط:', detailsArray);
      console.log('📊 عدد العناصر:', detailsArray.length);

    } catch (error) {
      console.error('❌ خطأ في جلب بيانات النقاط:', error);
      setToast({ open: true, message: 'فشل في جلب بيانات النقاط', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (points, maxPoints) => {
    if (!maxPoints || maxPoints === 0) return 0;
    return Math.round((points / maxPoints) * 100);
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return '#4caf50';
    if (percentage >= 80) return '#8bc34a';
    if (percentage >= 70) return '#ffc107';
    if (percentage >= 60) return '#ff9800';
    return '#f44336';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل النقاط...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader 
        title="نقاطي"
        subtitle="سجل النقاط والملاحظات من الأساتذة"
        icon={<EmojiEventsIcon sx={{ fontSize: 20 }} />}
      />

      {/* بطاقة إجمالي النقاط */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            borderRadius: 3, 
            background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(46,125,50,0.3)',
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>مجموع النقاط</Typography>
                  <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                    {totalPoints}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    من الاختبارات والامتحانات
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 70, height: 70 }}>
                  <EmojiEventsIcon sx={{ fontSize: 45 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            borderRadius: 3, 
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(25,118,210,0.3)',
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>عدد الاختبارات</Typography>
                  <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                    {pointsDetails.length}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    امتحانات واختبارات قصيرة
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 70, height: 70 }}>
                  <AssignmentIcon sx={{ fontSize: 45 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* قائمة النقاط والملاحظات */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
          <StarIcon sx={{ color: '#ffc107' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            سجل النقاط والملاحظات
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {pointsDetails.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            📭 لا توجد نقاط مسجلة حالياً. سيتم عرض النقاط بعد تصحيح الاختبارات من قبل الأساتذة.
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {pointsDetails.map((item, index) => {
              const percentage = getPercentage(item.points, item.max_points);
              const gradeColor = getGradeColor(percentage);
              
              return (
                <Grid item xs={12} key={item.id || index}>
                  <Card sx={{ 
                    borderRadius: 2,
                    borderRight: `4px solid ${gradeColor}`,
                    transition: '0.3s',
                    '&:hover': { transform: 'translateX(4px)', boxShadow: 3 }
                  }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        {/* معلومات المادة والاختبار */}
                        <Grid item xs={12} md={5}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <SchoolIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {item.course_name || 'مادة غير محددة'}
                            </Typography>
                          </Box>
                          <Chip 
                            label={item.exam_name} 
                            size="small" 
                            sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 'bold', mb: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary" display="block">
                            📅 {item.date ? new Date(item.date).toLocaleDateString('ar') : 'تاريخ غير محدد'}
                          </Typography>
                        </Grid>

                        {/* النقاط */}
                        <Grid item xs={12} md={3}>
                          <Box textAlign="center">
                            <Typography variant="body2" color="text.secondary">الدرجة</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: gradeColor }}>
                              {item.points}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              من {item.max_points}
                            </Typography>
                            <Box display="flex" alignItems="center" justifyContent="center" mt={0.5}>
                              <Chip 
                                label={`${percentage}%`} 
                                size="small" 
                                sx={{ bgcolor: `${gradeColor}20`, color: gradeColor, fontWeight: 'bold' }}
                              />
                            </Box>
                          </Box>
                        </Grid>

                        {/* ملاحظات الأستاذ */}
                        <Grid item xs={12} md={4}>
                          {item.note ? (
                            <Box sx={{ bgcolor: '#f5f5f5', p: 1.5, borderRadius: 2 }}>
                              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                <Avatar sx={{ width: 24, height: 24, bgcolor: '#1976d2' }}>
                                  <StarIcon sx={{ fontSize: 14 }} />
                                </Avatar>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                  ملاحظة الأستاذ
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {item.note}
                              </Typography>
                            </Box>
                          ) : (
                            <Box sx={{ bgcolor: '#fafafa', p: 1.5, borderRadius: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="text.disabled">
                                📝 لا توجد ملاحظات
                              </Typography>
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Paper>

      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </Box>
  );
}

export default Points;