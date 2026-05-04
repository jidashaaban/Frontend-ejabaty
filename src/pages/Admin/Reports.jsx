import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Avatar,
  Button,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  Poll as PollIcon,
  EmojiEvents as EmojiEventsIcon,
  Star as StarIcon,
  Assessment as AssessmentIcon,
  PeopleAlt as ParentsIcon,
  ReportProblem as ReportProblemIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getReports } from '../../services/adminService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await getReports();
        setReports(data);
      } catch (error) {
        console.error('خطأ في جلب التقارير:', error);
        setToast({ open: true, message: 'فشل في جلب التقارير', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography sx={{ mr: 2, fontSize: '1.1rem' }}>جاري تحميل التقارير...</Typography>
      </Box>
    );
  }

  const studentsCount = reports?.studentsCount || 0;
  const teachersCount = reports?.teachersCount || 0;
  const activeCoursesCount = reports?.activeCoursesCount || 0;
  const parentsCount = reports?.parentsCount || 0;
  const pendingComplaintsCount = reports?.pendingComplaintsCount || 0;
  const unseenPollResultsCount = reports?.unseenPollResultsCount || 0;
  const surveyResults = reports?.surveyResults || [];
  const topStudents = reports?.topStudents || {
    grade9: [],
    scientific: [],
    literary: [],
  };

  const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

  return (
    <Box>
      <PageHeader 
        title="التقارير والإحصائيات"
        subtitle="لوحة تحليلية شاملة لأداء المنصة"
        icon={<AssessmentIcon sx={{ fontSize: 20 }} />}
      />

      {/* بطاقات الإحصائيات الرئيسية */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '2px solid #e3f2fd',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            transition: '0.3s',
            '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 30px rgba(25,118,210,0.15)' }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="#1565c0" sx={{ mb: 1, fontWeight: 600 }}>إجمالي الطلاب</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2' }}>{studentsCount}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#e3f2fd', width: 55, height: 55 }}>
                  <PeopleIcon sx={{ color: '#1976d2', fontSize: 30 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '2px solid #e8f5e9',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            transition: '0.3s',
            '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 30px rgba(46,125,50,0.15)' }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="#2e7d32" sx={{ mb: 1, fontWeight: 600 }}>إجمالي الأساتذة</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>{teachersCount}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#e8f5e9', width: 55, height: 55 }}>
                  <SchoolIcon sx={{ color: '#2e7d32', fontSize: 30 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '2px solid #f3e5f5',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            transition: '0.3s',
            '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 30px rgba(156,39,176,0.15)' }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="#9c27b0" sx={{ mb: 1, fontWeight: 600 }}>أولياء الأمور</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>{parentsCount}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#f3e5f5', width: 55, height: 55 }}>
                  <ParentsIcon sx={{ color: '#9c27b0', fontSize: 30 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '2px solid #fff3e0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            transition: '0.3s',
            '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 30px rgba(237,108,2,0.15)' }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="#ed6c02" sx={{ mb: 1, fontWeight: 600 }}>الدورات النشطة</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>{activeCoursesCount}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#fff3e0', width: 55, height: 55 }}>
                  <MenuBookIcon sx={{ color: '#ed6c02', fontSize: 30 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* بطاقات الإجراءات السريعة */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
              border: '1px solid #00838f',
              cursor: 'pointer',
              transition: '0.3s',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: 6 }
            }}
            onClick={() => navigate('/admin/polls')}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Avatar sx={{ bgcolor: '#00838f', width: 45, height: 45 }}>
                    <PollIcon sx={{ fontSize: 24, color: '#fff' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#006064' }}>نتائج استبيانات لم ترى بعد</Typography>
                    <Typography variant="caption" color="#004d40">نتائج الاستبيانات الجاهزة للاطلاع</Typography>
                  </Box>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#006064' }}>{unseenPollResultsCount}</Typography>
                  <Button size="small" variant="contained" sx={{ bgcolor: '#00838f', mt: 0.5, '&:hover': { bgcolor: '#006064' }, fontSize: '0.7rem', py: 0.5 }}>عرض النتائج →</Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
              border: '1px solid #c62828',
              cursor: 'pointer',
              transition: '0.3s',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: 6 }
            }}
            onClick={() => navigate('/admin/complaints')}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Avatar sx={{ bgcolor: '#c62828', width: 45, height: 45 }}>
                    <ReportProblemIcon sx={{ fontSize: 24, color: '#fff' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#b71c1c' }}>شكاوى معلقة</Typography>
                    <Typography variant="caption" color="#b71c1c">في انتظار الرد من الإدارة</Typography>
                  </Box>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#b71c1c' }}>{pendingComplaintsCount}</Typography>
                  <Button size="small" variant="contained" sx={{ bgcolor: '#c62828', mt: 0.5, '&:hover': { bgcolor: '#b71c1c' }, fontSize: '0.7rem', py: 0.5 }}>عرض التفاصيل →</Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* نتائج الاستبيان - تدرج أزرق هادئ */}
      <Paper sx={{ 
        p: 3, 
        mb: 5, 
        borderRadius: 4,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdef5 100%)',
        border: '2px solid #1976d2',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <Box display="flex" alignItems="center" gap={1.5} mb={3}>
          <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40 }}>
            <PollIcon sx={{ color: '#fff' }} />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1565c0' }}>نتائج الاستبيانات</Typography>
        </Box>

        {surveyResults.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 3, bgcolor: '#fff' }}>لا توجد نتائج استبيانات متاحة حالياً</Alert>
        ) : (
          <Grid container spacing={3}>
            {surveyResults.map((survey, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ borderRadius: 4, bgcolor: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#1565c0', fontWeight: 'bold' }}>
                      📊 {survey.title}
                    </Typography>
                    <Divider sx={{ my: 2, borderColor: '#90caf9' }} />
                    {survey.results?.map((result, idx) => (
                      <Box key={idx} sx={{ mb: 2 }}>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2" fontWeight="500" sx={{ color: '#37474f' }}>{result.question}</Typography>
                          <Typography variant="body2" fontWeight="bold" color="#1976d2">
                            {result.averageRating || result.percentage}%
                          </Typography>
                        </Box>
                        <Box sx={{ width: '100%', bgcolor: '#e0e0e0', borderRadius: 2, height: 10 }}>
                          <Box
                            sx={{
                              width: `${result.averageRating ? (result.averageRating / 5) * 100 : result.percentage}%`,
                              background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                              height: 10,
                              borderRadius: 2,
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* ترتيب الطلاب حسب النقاط */}
      <Paper sx={{ 
        p: 3, 
        borderRadius: 4,
        border: '2px solid #e3f2fd',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <Box display="flex" alignItems="center" gap={1.5} mb={3}>
          <Avatar sx={{ bgcolor: '#ff9800', width: 40, height: 40 }}>
            <EmojiEventsIcon sx={{ color: '#fff' }} />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>🏆 ترتيب الطلاب حسب النقاط</Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" align="center" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold', mb: 2 }}>
              🎓 الصف التاسع
            </Typography>
            <Table sx={{ border: '2px solid #1976d2', borderRadius: 2, overflow: 'hidden' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                  <TableCell align="center" sx={{ borderBottom: '2px solid #1976d2', fontWeight: 'bold', color: '#1565c0' }}>الترتيب</TableCell>
                  <TableCell sx={{ borderBottom: '2px solid #1976d2', fontWeight: 'bold', color: '#1565c0' }}>اسم الطالب</TableCell>
                  <TableCell align="center" sx={{ borderBottom: '2px solid #1976d2', fontWeight: 'bold', color: '#1565c0' }}>النقاط</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topStudents.grade9?.length > 0 ? (
                  topStudents.grade9.map((student, idx) => (
                    <TableRow key={student.id} hover>
                      <TableCell align="center" sx={{ borderBottom: '1px solid #bbdef5' }}>
                        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                          {idx === 0 && <StarIcon sx={{ color: medalColors[0], fontSize: 18 }} />}
                          {idx === 1 && <StarIcon sx={{ color: medalColors[1], fontSize: 18 }} />}
                          {idx === 2 && <StarIcon sx={{ color: medalColors[2], fontSize: 18 }} />}
                          {idx > 2 && `${idx + 1}`}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #bbdef5' }}>{student.name}</TableCell>
                      <TableCell align="center" sx={{ borderBottom: '1px solid #bbdef5' }}>
                        <Chip label={student.points} size="small" sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 'bold', height: 24, fontSize: '0.7rem' }} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">لا توجد بيانات</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" align="center" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 2 }}>
              🔬 البكالوريا - علمي
            </Typography>
            <Table sx={{ border: '2px solid #2e7d32', borderRadius: 2, overflow: 'hidden' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e8f5e9' }}>
                  <TableCell align="center" sx={{ borderBottom: '2px solid #2e7d32', fontWeight: 'bold', color: '#2e7d32' }}>الترتيب</TableCell>
                  <TableCell sx={{ borderBottom: '2px solid #2e7d32', fontWeight: 'bold', color: '#2e7d32' }}>اسم الطالب</TableCell>
                  <TableCell align="center" sx={{ borderBottom: '2px solid #2e7d32', fontWeight: 'bold', color: '#2e7d32' }}>النقاط</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topStudents.scientific?.length > 0 ? (
                  topStudents.scientific.map((student, idx) => (
                    <TableRow key={student.id} hover>
                      <TableCell align="center" sx={{ borderBottom: '1px solid #c8e6c9' }}>
                        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                          {idx === 0 && <StarIcon sx={{ color: medalColors[0], fontSize: 18 }} />}
                          {idx === 1 && <StarIcon sx={{ color: medalColors[1], fontSize: 18 }} />}
                          {idx === 2 && <StarIcon sx={{ color: medalColors[2], fontSize: 18 }} />}
                          {idx > 2 && `${idx + 1}`}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #c8e6c9' }}>{student.name}</TableCell>
                      <TableCell align="center" sx={{ borderBottom: '1px solid #c8e6c9' }}>
                        <Chip label={student.points} size="small" sx={{ bgcolor: '#2e7d32', color: '#fff', fontWeight: 'bold', height: 24, fontSize: '0.7rem' }} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">لا توجد بيانات</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" align="center" gutterBottom sx={{ color: '#ed6c02', fontWeight: 'bold', mb: 2 }}>
              📚 البكالوريا - أدبي
            </Typography>
            <Table sx={{ border: '2px solid #ed6c02', borderRadius: 2, overflow: 'hidden' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fff3e0' }}>
                  <TableCell align="center" sx={{ borderBottom: '2px solid #ed6c02', fontWeight: 'bold', color: '#ed6c02' }}>الترتيب</TableCell>
                  <TableCell sx={{ borderBottom: '2px solid #ed6c02', fontWeight: 'bold', color: '#ed6c02' }}>اسم الطالب</TableCell>
                  <TableCell align="center" sx={{ borderBottom: '2px solid #ed6c02', fontWeight: 'bold', color: '#ed6c02' }}>النقاط</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topStudents.literary?.length > 0 ? (
                  topStudents.literary.map((student, idx) => (
                    <TableRow key={student.id} hover>
                      <TableCell align="center" sx={{ borderBottom: '1px solid #ffe0b2' }}>
                        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                          {idx === 0 && <StarIcon sx={{ color: medalColors[0], fontSize: 18 }} />}
                          {idx === 1 && <StarIcon sx={{ color: medalColors[1], fontSize: 18 }} />}
                          {idx === 2 && <StarIcon sx={{ color: medalColors[2], fontSize: 18 }} />}
                          {idx > 2 && `${idx + 1}`}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #ffe0b2' }}>{student.name}</TableCell>
                      <TableCell align="center" sx={{ borderBottom: '1px solid #ffe0b2' }}>
                        <Chip label={student.points} size="small" sx={{ bgcolor: '#ed6c02', color: '#fff', fontWeight: 'bold', height: 24, fontSize: '0.7rem' }} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">لا توجد بيانات</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
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

export default Reports;