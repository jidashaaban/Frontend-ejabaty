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
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  Poll as PollIcon,
  EmojiEvents as EmojiEventsIcon,
  Star as StarIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { getReports } from '../../services/adminService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

function Reports() {
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
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل التقارير...</Typography>
      </Box>
    );
  }

  const studentsCount = reports?.studentsCount || 0;
  const teachersCount = reports?.teachersCount || 0;
  const activeCoursesCount = reports?.activeCoursesCount || 0;
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
        subtitle="عرض إحصائيات المنصة وتقارير الأداء"
        icon={<AssessmentIcon sx={{ fontSize: 20 }} />}
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            minWidth: 275, 
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdef5 100%)',
            borderRadius: 3,
            transition: '0.3s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="#1565c0" gutterBottom>
                    عدد الطلاب
                  </Typography>
                  <Typography variant="h3" component="div" color="#1976d2" fontWeight="bold">
                    {studentsCount}
                  </Typography>
                  <Typography variant="body2" color="#37474f">
                    إجمالي الطلاب المسجلين
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                  <PeopleIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            minWidth: 275, 
            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
            borderRadius: 3,
            transition: '0.3s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="#2e7d32" gutterBottom>
                    عدد الأساتذة
                  </Typography>
                  <Typography variant="h3" component="div" color="#388e3c" fontWeight="bold">
                    {teachersCount}
                  </Typography>
                  <Typography variant="body2" color="#37474f">
                    إجمالي الأساتذة العاملين
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2e7d32', width: 56, height: 56 }}>
                  <SchoolIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            minWidth: 275, 
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            borderRadius: 3,
            transition: '0.3s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="#ed6c02" gutterBottom>
                    الدورات النشطة
                  </Typography>
                  <Typography variant="h3" component="div" color="#ed6c02" fontWeight="bold">
                    {activeCoursesCount}
                  </Typography>
                  <Typography variant="body2" color="#37474f">
                    الدورات المفتوحة حالياً
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#ed6c02', width: 56, height: 56 }}>
                  <MenuBookIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <PollIcon color="primary" />
          <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 'bold' }}>نتائج الاستبيان</Typography>
        </Box>

        {surveyResults.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 2 }}>لا توجد نتائج استبيانات متاحة حالياً</Alert>
        ) : (
          <Grid container spacing={3}>
            {surveyResults.map((survey, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                      {survey.title}
                    </Typography>
                    {survey.results?.map((result, idx) => (
                      <Box key={idx} sx={{ mb: 1 }}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">{result.question}</Typography>
                          <Typography variant="body2" fontWeight="bold" color="#1976d2">
                            {result.averageRating || result.percentage}%
                          </Typography>
                        </Box>
                        <Box sx={{ width: '100%', bgcolor: '#e0e0e0', borderRadius: 1, mt: 0.5 }}>
                          <Box
                            sx={{
                              width: `${result.averageRating ? (result.averageRating / 5) * 100 : result.percentage}%`,
                              background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                              height: 8,
                              borderRadius: 1,
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

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <EmojiEventsIcon sx={{ color: '#FFD700' }} />
          <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 'bold' }}>🏆 ترتيب الطلاب حسب النقاط</Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" align="center" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              🎓 الصف التاسع
            </Typography>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                  <TableCell align="center">الترتيب</TableCell>
                  <TableCell>اسم الطالب</TableCell>
                  <TableCell align="center">النقاط</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topStudents.grade9?.length > 0 ? (
                  topStudents.grade9.map((student, idx) => (
                    <TableRow key={student.id} hover>
                      <TableCell align="center">
                        {idx === 0 && <StarIcon sx={{ color: medalColors[0] }} />}
                        {idx === 1 && <StarIcon sx={{ color: medalColors[1] }} />}
                        {idx === 2 && <StarIcon sx={{ color: medalColors[2] }} />}
                        {idx > 2 && `${idx + 1}`}
                      </TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell align="center">
                        <Chip label={student.points} size="small" sx={{ bgcolor: '#1976d2', color: '#fff' }} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography color="text.secondary">لا توجد بيانات</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" align="center" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
              🔬 البكالوريا - علمي
            </Typography>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e8f5e9' }}>
                  <TableCell align="center">الترتيب</TableCell>
                  <TableCell>اسم الطالب</TableCell>
                  <TableCell align="center">النقاط</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topStudents.scientific?.length > 0 ? (
                  topStudents.scientific.map((student, idx) => (
                    <TableRow key={student.id} hover>
                      <TableCell align="center">
                        {idx === 0 && <StarIcon sx={{ color: medalColors[0] }} />}
                        {idx === 1 && <StarIcon sx={{ color: medalColors[1] }} />}
                        {idx === 2 && <StarIcon sx={{ color: medalColors[2] }} />}
                        {idx > 2 && `${idx + 1}`}
                      </TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell align="center">
                        <Chip label={student.points} size="small" sx={{ bgcolor: '#2e7d32', color: '#fff' }} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography color="text.secondary">لا توجد بيانات</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" align="center" gutterBottom sx={{ color: '#ed6c02', fontWeight: 'bold' }}>
              📚 البكالوريا - أدبي
            </Typography>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fff3e0' }}>
                  <TableCell align="center">الترتيب</TableCell>
                  <TableCell>اسم الطالب</TableCell>
                  <TableCell align="center">النقاط</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topStudents.literary?.length > 0 ? (
                  topStudents.literary.map((student, idx) => (
                    <TableRow key={student.id} hover>
                      <TableCell align="center">
                        {idx === 0 && <StarIcon sx={{ color: medalColors[0] }} />}
                        {idx === 1 && <StarIcon sx={{ color: medalColors[1] }} />}
                        {idx === 2 && <StarIcon sx={{ color: medalColors[2] }} />}
                        {idx > 2 && `${idx + 1}`}
                      </TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell align="center">
                        <Chip label={student.points} size="small" sx={{ bgcolor: '#ed6c02', color: '#fff' }} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
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