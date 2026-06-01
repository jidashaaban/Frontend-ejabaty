import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
  LinearProgress,
  Paper,
  Divider,
} from '@mui/material';
import {
  School as SchoolIcon,
  Star as StarIcon,
  EventNote as EventNoteIcon,
  Assignment as AssignmentIcon,
  MenuBook as MenuBookIcon,
  HourglassEmpty as PendingIcon,
  CheckCircle as ActiveIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';
import { getPoints, getStudentExams, getGrades } from '../../services/studentService';
import { getActiveCourses, getPendingCourses } from '../../services/courseRegistrationService';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [data, setData] = useState({
    points: 0,
    activeCourses: [],
    pendingCourses: [],
    exams: [],
    grades: []
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pointsRes, activeRes, pendingRes, examsRes, gradesRes] = await Promise.allSettled([
          getPoints(),
          getActiveCourses(),
          getPendingCourses(),
          getStudentExams(),
          getGrades(),
        ]);

        setData({
          points: pointsRes.status === 'fulfilled' ? (pointsRes.value?.points || 0) : 0,
          activeCourses: activeRes.status === 'fulfilled' ? (activeRes.value?.active_courses || []) : [],
          pendingCourses: pendingRes.status === 'fulfilled' ? (pendingRes.value?.pending_courses || []) : [],
          exams: examsRes.status === 'fulfilled' ? (examsRes.value?.exams || (Array.isArray(examsRes.value) ? examsRes.value : [])) : [],
          grades: gradesRes.status === 'fulfilled' ? (gradesRes.value?.data || []).sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0)) : [],
        });
      } catch (e) {
        console.error('خطأ في تحميل الداشبورد:', e);
        setToast({ open: true, message: 'حدث خطأ في تحميل البيانات', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);


  const gradedItems = data.grades.filter(g => {
    const val = g.my_mark ?? g.mark ?? g.score;
    return val !== null && val !== undefined && !isNaN(Number(val)) && Number(val) > 0;
  });
  const avgGrade = gradedItems.length > 0
    ? Math.round(gradedItems.reduce((sum, g) => sum + Number(g.my_mark ?? g.mark ?? g.score ?? 0), 0) / gradedItems.length)
    : null;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل لوحة التحكم...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={`مرحباً ${user?.name || 'طالب'}`}
        subtitle={'هذه نظرة عامة على تقدمك الدراسي ونشاطك في المنصة'}
        icon={<SchoolIcon sx={{ fontSize: 20 }} />}
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, bgcolor: '#fff3e0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">نقاطي</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>
                    {data.points}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">مجموع النقاط المكتسبة</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#ed6c02', width: 55, height: 55 }}>
                  <StarIcon sx={{ fontSize: 30, color: '#fff' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, bgcolor: '#e8f5e9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">موادي المفعّلة</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    {data.activeCourses.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">مادة مسجّلة وموافق عليها</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2e7d32', width: 55, height: 55 }}>
                  <ActiveIcon sx={{ fontSize: 30, color: '#fff' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, bgcolor: '#e1f5fe', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">طلبات معلّقة</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0288d1' }}>
                    {data.pendingCourses.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">بانتظار موافقة الإدارة</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#0288d1', width: 55, height: 55 }}>
                  <PendingIcon sx={{ fontSize: 30, color: '#fff' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, bgcolor: '#f3e5f5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">المعدل العام</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#7b1fa2' }}>
                    {avgGrade !== null ? `${avgGrade}%` : '—'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {data.grades.length > 0 ? `من ${data.grades.length} امتحان` : 'لا توجد بيانات'}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#7b1fa2', width: 55, height: 55 }}>
                  <TrendingUpIcon sx={{ fontSize: 30, color: '#fff' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
              <MenuBookIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                موادي المفعّلة
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {data.activeCourses.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <MenuBookIcon sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} />
                <Typography variant="body2">لا توجد مواد مفعّلة حتى الآن</Typography>
              </Box>
            ) : (
              data.activeCourses.map((course, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: 1.5,
                    borderBottom: i < data.activeCourses.length - 1 ? '1px solid #f0f0f0' : 'none',
                  }}
                >
                  <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', width: 45, height: 45 }}>
                    {(course.name || '?')[0]}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {course.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {course.code} · {course.teacher_name || 'غير محدد'}
                    </Typography>
                  </Box>
                  <Chip
                    label="مفعّلة"
                    size="small"
                    sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 'bold' }}
                  />
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
              <EventNoteIcon sx={{ color: '#ed6c02' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>
                امتحاناتي القادمة
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {data.exams.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <EventNoteIcon sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} />
                <Typography variant="body2">لا توجد امتحانات قادمة</Typography>
              </Box>
            ) : (
              data.exams.slice(0, 5).map((exam, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: 1.5,
                    borderBottom: i < Math.min(data.exams.length, 5) - 1 ? '1px solid #f0f0f0' : 'none',
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 55,
                      textAlign: 'center',
                      bgcolor: '#fff3e0',
                      borderRadius: 2,
                      py: 0.8,
                      px: 1,
                    }}
                  >
                    <Typography variant="caption" fontWeight="bold" color="#ed6c02" display="block">
                      {exam.date ? new Date(exam.date).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }) : '—'}
                    </Typography>
                  </Box>
                  <Box flex={1}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {exam.course || exam.exam_name || exam.course_name || '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {exam.date || ''}
                    </Typography>
                  </Box>
                  <Chip
                    label="قادم"
                    size="small"
                    sx={{ bgcolor: '#fff3e0', color: '#ed6c02', fontWeight: 'bold' }}
                  />
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        {data.grades.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                <AssignmentIcon sx={{ color: '#1976d2' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  آخر النتائج
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                {data.grades.slice(0, 4).map((grade, i) => {
                  const mark = Number(grade.my_mark ?? grade.mark ?? grade.score ?? 0);
                  const total = grade.total || 100;
                  const pct = Math.round((mark / total) * 100);
                  const color = pct >= 80 ? '#2e7d32' : pct >= 60 ? '#ed6c02' : '#c62828';
                  return (
                    <Grid item xs={12} sm={6} key={i}>
                      <Card sx={{ borderRadius: 2, border: '1px solid #f0f0f0', boxShadow: 0 }}>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {grade.course_name || grade.exam_name || grade.course || '—'}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color }}>
                              {mark}
                              <Typography component="span" variant="caption" color="text.secondary">
                                /{total}
                              </Typography>
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={pct}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                            {pct}% · {grade.published_at ? new Date(grade.published_at).toLocaleDateString('ar-SA') : ''}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Grid>
        )}
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

export default Dashboard;