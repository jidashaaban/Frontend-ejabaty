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
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Save as SaveIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
  getDashboardMetrics,
  getReportsByRole,
  saveReport,
  getReportsHistory,
  getAllPollsFromAPI,
  getPoints
} from '../../services/adminService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

function Reports() {
  const navigate = useNavigate();
  
  const [metrics, setMetrics] = useState({
    studentsCount: 0,
    teachersCount: 0,
    parentsCount: 0,
    pendingComplaintsCount: 0,
    totalCoursesCount: 0,
    totalPollsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);
  const [selectedRole, setSelectedRole] = useState('student');
  const [roleReport, setRoleReport] = useState(null);
  const [loadingRoleReport, setLoadingRoleReport] = useState(false);
  const [savingReport, setSavingReport] = useState(false);
  const [reportHistory, setReportHistory] = useState([]);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [selectedHistoryReport, setSelectedHistoryReport] = useState(null);
  
  const [surveyResults, setSurveyResults] = useState([]);
  const [topStudents, setTopStudents] = useState({
    grade9: [],
    scientific: [],
    literary: [],
  });
  const [loadingPolls, setLoadingPolls] = useState(false);
  const [loadingTopStudents, setLoadingTopStudents] = useState(false);

  const roles = [
    { value: 'student', label: 'الطلاب', color: '#1976d2' },
    { value: 'teacher', label: 'المعلمين', color: '#2e7d32' },
    { value: 'parent', label: 'أولياء الأمور', color: '#9c27b0' },
    { value: 'admin', label: 'المديرين', color: '#ed6c02' },
  ];

  const fetchPollsFromAPI = async () => {
    setLoadingPolls(true);
    try {
      const polls = await getAllPollsFromAPI();
      console.log(' الاستبيانات من API:', polls);
      
      if (polls && polls.length > 0) {
        const results = polls.map(poll => ({
          id: poll.id,
          title: poll.title,
          description: poll.description,
          results: poll.questions?.map(q => ({
            question: q.text,
            averageRating: q.averageRating || 0,
            totalVotes: q.totalVotes || 0,
          })) || []
        }));
        setSurveyResults(results);
      } else {
        setSurveyResults([]);
      }
    } catch (error) {
      console.error(' فشل جلب الاستبيانات من API:', error);
      setSurveyResults([]);
      setToast({
        open: true,
        message: 'فشل في جلب الاستبيانات',
        severity: 'error'
      });
    } finally {
      setLoadingPolls(false);
    }
  };

  const fetchTopStudentsFromAPI = async () => {
    setLoadingTopStudents(true);
    try {
      const points = await getPoints();
      console.log(' نقاط الطلاب من API:', points);
      
      if (points && points.length > 0) {
        const sortedStudents = [...points].sort((a, b) => b.points - a.points);
        
        const grade9Students = sortedStudents.filter((_, idx) => idx < 3);
        const scientificStudents = sortedStudents.filter((_, idx) => idx >= 3 && idx < 6);
        const literaryStudents = sortedStudents.filter((_, idx) => idx >= 6 && idx < 9);
        
        setTopStudents({
          grade9: grade9Students.map(s => ({
            id: s.studentId,
            name: s.studentName || `طالب ${s.studentId}`,
            points: s.points
          })),
          scientific: scientificStudents.map(s => ({
            id: s.studentId,
            name: s.studentName || `طالب ${s.studentId}`,
            points: s.points
          })),
          literary: literaryStudents.map(s => ({
            id: s.studentId,
            name: s.studentName || `طالب ${s.studentId}`,
            points: s.points
          })),
        });
      } else {
        setTopStudents({
          grade9: [],
          scientific: [],
          literary: [],
        });
      }
    } catch (error) {
      console.error(' فشل جلب ترتيب الطلاب من API:', error);
      setTopStudents({
        grade9: [],
        scientific: [],
        literary: [],
      });
      setToast({
        open: true,
        message: 'فشل في جلب ترتيب الطلاب',
        severity: 'error'
      });
    } finally {
      setLoadingTopStudents(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const metricsData = await getDashboardMetrics();
        console.log(' إحصائيات لوحة التحكم:', metricsData);
        
        setMetrics({
          studentsCount: metricsData.studentsCount || 0,
          teachersCount: metricsData.teachersCount || 0,
          parentsCount: metricsData.parentsCount || 0,
          pendingComplaintsCount: metricsData.pendingComplaintsCount || 0,
          totalCoursesCount: metricsData.totalCoursesCount || 0,
          totalPollsCount: metricsData.totalPollsCount || 0,
        });
        
      } catch (error) {
        console.error(' فشل في جلب البيانات:', error);
        setToast({
          open: true,
          message: 'فشل في جلب البيانات من الخادم',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    fetchPollsFromAPI();
    fetchTopStudentsFromAPI();
    
    const fetchHistory = async () => {
      try {
        const history = await getReportsHistory();
        setReportHistory(history);
      } catch (error) {
        console.error(' فشل في جلب تاريخ التقارير:', error);
      }
    };
    fetchHistory();
  }, []);

  const fetchRoleReport = async () => {
    setLoadingRoleReport(true);
    try {
      const response = await getReportsByRole(selectedRole);
      setRoleReport(response);
      setToast({
        open: true,
        message: `تم جلب تقرير ${roles.find(r => r.value === selectedRole)?.label} بنجاح`,
        severity: 'success'
      });
    } catch (error) {
      console.error('خطأ في جلب التقرير:', error);
      setToast({
        open: true,
        message: error.response?.data?.message || 'فشل في جلب التقرير',
        severity: 'error'
      });
    } finally {
      setLoadingRoleReport(false);
    }
  };

  const handleSaveReport = async () => {
    setSavingReport(true);
    try {
      await saveReport(selectedRole);
      setToast({
        open: true,
        message: `تم حفظ تقرير ${roles.find(r => r.value === selectedRole)?.label} بنجاح`,
        severity: 'success'
      });
      const history = await getReportsHistory();
      setReportHistory(history);
    } catch (error) {
      console.error('خطأ في حفظ التقرير:', error);
      setToast({
        open: true,
        message: error.response?.data?.message || 'فشل في حفظ التقرير',
        severity: 'error'
      });
    } finally {
      setSavingReport(false);
    }
  };

  const exportReport = () => {
    if (!roleReport) return;
    
    const dataStr = JSON.stringify(roleReport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `report_${selectedRole}_${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setToast({
      open: true,
      message: 'تم تصدير التقرير بنجاح',
      severity: 'success'
    });
  };

  const viewHistoryReport = (report) => {
    setSelectedHistoryReport(report);
    setOpenHistoryDialog(true);
  };

  const renderRoleReportContent = () => {
    if (!roleReport) {
      return (
        <Box textAlign="center" py={6}>
          <Typography variant="h6" color="text.secondary">
            اختر دور واضغط على "عرض التقرير"
          </Typography>
        </Box>
      );
    }

    const { reports: reportData } = roleReport;

    if (selectedRole === 'student') {
      return (
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
              <TableCell><strong>اسم الطالب</strong></TableCell>
              <TableCell><strong>المساقات</strong></TableCell>
              <TableCell><strong>علامات الامتحانات</strong></TableCell>
              <TableCell><strong>نقاط الاختبارات</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData?.map((student, idx) => (
              <TableRow key={idx} hover>
                <TableCell>{student.name}</TableCell>
                <TableCell>
                  {student.enrolled_courses?.map((c, i) => (
                    <Chip key={i} label={c} size="small" sx={{ m: 0.3, bgcolor: '#e3f2fd' }} />
                  ))}
                </TableCell>
                <TableCell>
                  {student.exam_marks?.map((e, i) => (
                    <div key={i}>{e.exam}: <strong>{e.mark}</strong></div>
                  ))}
                </TableCell>
                <TableCell>
                  {student.quiz_points?.map((q, i) => (
                    <div key={i}>{q.course}: <strong>{q.points}</strong></div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (selectedRole === 'teacher') {
      return (
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e8f5e9' }}>
              <TableCell><strong>اسم المعلم</strong></TableCell>
              <TableCell><strong>المواد التي يدرسها</strong></TableCell>
              <TableCell><strong>عدد الاختبارات</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData?.map((teacher, idx) => (
              <TableRow key={idx} hover>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>
                  {teacher.teaching_courses?.map((c, i) => (
                    <Chip key={i} label={c} size="small" sx={{ m: 0.3, bgcolor: '#e8f5e9' }} />
                  ))}
                </TableCell>
                <TableCell>{teacher.quizzes_announced || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (selectedRole === 'parent') {
      return (
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f3e5f5' }}>
              <TableCell><strong>اسم ولي الأمر</strong></TableCell>
              <TableCell><strong>الأبناء</strong></TableCell>
              <TableCell><strong>عدد الشكاوى</strong></TableCell>
              <TableCell><strong>حالة الشكاوى</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData?.map((parent, idx) => (
              <TableRow key={idx} hover>
                <TableCell>{parent.name}</TableCell>
                <TableCell>
                  {parent.children?.map((c, i) => (
                    <Chip key={i} label={c} size="small" sx={{ m: 0.3, bgcolor: '#f3e5f5' }} />
                  ))}
                </TableCell>
                <TableCell>{parent.complaints_count || 0}</TableCell>
                <TableCell>
                  {parent.complaints_history?.map((ch, i) => (
                    <Chip key={i} label={ch.status} size="small" color={ch.status === 'Resolved' ? 'success' : 'warning'} sx={{ m: 0.3 }} />
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (selectedRole === 'admin') {
      return (
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fff3e0' }}>
              <TableCell><strong>اسم المدير</strong></TableCell>
              <TableCell><strong>الاستبيانات المنشأة</strong></TableCell>
              <TableCell><strong>الجداول المُنشأة</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData?.map((admin, idx) => (
              <TableRow key={idx} hover>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.total_polls_created || 0}</TableCell>
                <TableCell>{admin.total_schedules_generated || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    return <Alert severity="info">لا توجد بيانات متاحة</Alert>;
  };

  if (loading || loadingPolls || loadingTopStudents) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography sx={{ mr: 2, fontSize: '1.1rem' }}>جاري تحميل البيانات من الخادم...</Typography>
      </Box>
    );
  }

  const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

  return (
    <Box>
      <PageHeader 
        title="التقارير والإحصائيات"
        subtitle="لوحة تحليلية شاملة لأداء المنصة"
        icon={<AssessmentIcon sx={{ fontSize: 20 }} />}
      />

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3, borderBottom: 2, borderColor: 'divider' }}>
        <Tab label=" إحصائيات عامة" />
        <Tab label=" تقارير حسب الدور" />
        <Tab label=" تاريخ التقارير" />
      </Tabs>

      {tabValue === 0 && (
        <>
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '2px solid #e3f2fd',
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 30px rgba(25,118,210,0.15)' }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" color="#1565c0" sx={{ mb: 1, fontWeight: 600 }}>إجمالي الطلاب</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2' }}>{metrics.studentsCount}</Typography>
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
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 30px rgba(46,125,50,0.15)' }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" color="#2e7d32" sx={{ mb: 1, fontWeight: 600 }}>إجمالي الأساتذة</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>{metrics.teachersCount}</Typography>
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
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 30px rgba(156,39,176,0.15)' }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" color="#9c27b0" sx={{ mb: 1, fontWeight: 600 }}>أولياء الأمور</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>{metrics.parentsCount}</Typography>
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
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 30px rgba(237,108,2,0.15)' }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" color="#ed6c02" sx={{ mb: 1, fontWeight: 600 }}>الدورات النشطة</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>{metrics.totalCoursesCount}</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#fff3e0', width: 55, height: 55 }}>
                      <MenuBookIcon sx={{ color: '#ed6c02', fontSize: 30 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

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
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#006064' }}>الاستبيانات المنشورة</Typography>
                        <Typography variant="caption" color="#004d40">عدد الاستبيانات المتاحة</Typography>
                      </Box>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#006064' }}>{metrics.totalPollsCount}</Typography>
                      <Button size="small" variant="contained" sx={{ bgcolor: '#00838f', mt: 0.5, '&:hover': { bgcolor: '#006064' }, fontSize: '0.7rem', py: 0.5 }}>عرض التفاصيل →</Button>
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
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#b71c1c' }}>{metrics.pendingComplaintsCount}</Typography>
                      <Button size="small" variant="contained" sx={{ bgcolor: '#c62828', mt: 0.5, '&:hover': { bgcolor: '#b71c1c' }, fontSize: '0.7rem', py: 0.5 }}>عرض التفاصيل →</Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ 
            p: 3, 
            mb: 5, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdef5 100%)',
            border: '2px solid #1976d2',
          }}>
            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
              <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40 }}>
                <PollIcon sx={{ color: '#fff' }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1565c0' }}>نتائج الاستبيانات</Typography>
            </Box>

            {surveyResults.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 3, bgcolor: '#fff' }}>لا توجد استبيانات متاحة حالياً</Alert>
            ) : (
              <Grid container spacing={3}>
                {surveyResults.map((survey, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card sx={{ borderRadius: 4, bgcolor: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#1565c0', fontWeight: 'bold' }}>
                          📊 {survey.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {survey.description}
                        </Typography>
                        <Divider sx={{ my: 2, borderColor: '#90caf9' }} />
                        {survey.results?.map((result, idx) => (
                          <Box key={idx} sx={{ mb: 2 }}>
                            <Box display="flex" justifyContent="space-between" mb={0.5}>
                              <Typography variant="body2" fontWeight="500" sx={{ color: '#37474f' }}>{result.question}</Typography>
                              <Typography variant="body2" fontWeight="bold" color="#1976d2">
                                {result.averageRating} / 5
                              </Typography>
                            </Box>
                            <Box sx={{ width: '100%', bgcolor: '#e0e0e0', borderRadius: 2, height: 10 }}>
                              <Box
                                sx={{
                                  width: `${(result.averageRating / 5) * 100}%`,
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

          <Paper sx={{ 
            p: 3, 
            borderRadius: 4,
            border: '2px solid #e3f2fd',
          }}>
            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
              <Avatar sx={{ bgcolor: '#ff9800', width: 40, height: 40 }}>
                <EmojiEventsIcon sx={{ color: '#fff' }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>🏆 ترتيب الطلاب حسب النقاط</Typography>
            </Box>

            {topStudents.grade9.length === 0 && topStudents.scientific.length === 0 && topStudents.literary.length === 0 ? (
              <Alert severity="info">لا توجد نقاط مسجلة للطلاب حالياً</Alert>
            ) : (
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" align="center" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold', mb: 2 }}>
                     الصف التاسع
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
                      {topStudents.grade9.length > 0 ? (
                        topStudents.grade9.map((student, idx) => (
                          <TableRow key={student.id} hover>
                            <TableCell align="center">
                              <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                {idx === 0 && <StarIcon sx={{ color: medalColors[0], fontSize: 18 }} />}
                                {idx === 1 && <StarIcon sx={{ color: medalColors[1], fontSize: 18 }} />}
                                {idx === 2 && <StarIcon sx={{ color: medalColors[2], fontSize: 18 }} />}
                                {idx > 2 && `${idx + 1}`}
                              </Box>
                            </TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell align="center">
                              <Chip label={student.points} size="small" sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 'bold' }} />
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
                     البكالوريا - علمي
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
                      {topStudents.scientific.length > 0 ? (
                        topStudents.scientific.map((student, idx) => (
                          <TableRow key={student.id} hover>
                            <TableCell align="center">
                              <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                {idx === 0 && <StarIcon sx={{ color: medalColors[0], fontSize: 18 }} />}
                                {idx === 1 && <StarIcon sx={{ color: medalColors[1], fontSize: 18 }} />}
                                {idx === 2 && <StarIcon sx={{ color: medalColors[2], fontSize: 18 }} />}
                                {idx > 2 && `${idx + 1}`}
                              </Box>
                            </TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell align="center">
                              <Chip label={student.points} size="small" sx={{ bgcolor: '#2e7d32', color: '#fff', fontWeight: 'bold' }} />
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
                     البكالوريا - أدبي
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
                      {topStudents.literary.length > 0 ? (
                        topStudents.literary.map((student, idx) => (
                          <TableRow key={student.id} hover>
                            <TableCell align="center">
                              <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                {idx === 0 && <StarIcon sx={{ color: medalColors[0], fontSize: 18 }} />}
                                {idx === 1 && <StarIcon sx={{ color: medalColors[1], fontSize: 18 }} />}
                                {idx === 2 && <StarIcon sx={{ color: medalColors[2], fontSize: 18 }} />}
                                {idx > 2 && `${idx + 1}`}
                              </Box>
                            </TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell align="center">
                              <Chip label={student.points} size="small" sx={{ bgcolor: '#ed6c02', color: '#fff', fontWeight: 'bold' }} />
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
            )}
          </Paper>
        </>
      )}

      {tabValue === 1 && (
        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>اختر الدور</InputLabel>
                <Select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  label="اختر الدور"
                >
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      <Chip label={role.label} size="small" sx={{ bgcolor: role.color, color: 'white' }} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Button
                variant="contained"
                fullWidth
                onClick={fetchRoleReport}
                disabled={loadingRoleReport}
                sx={{ mt: 2 }}
              >
                {loadingRoleReport ? <CircularProgress size={24} /> : 'عرض التقرير'}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={handleSaveReport}
                disabled={savingReport || !roleReport}
                startIcon={<SaveIcon />}
                sx={{ mt: 1 }}
              >
                {savingReport ? <CircularProgress size={24} /> : 'حفظ التقرير'}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={exportReport}
                disabled={!roleReport}
                startIcon={<DownloadIcon />}
                sx={{ mt: 1 }}
              >
                تصدير التقرير
              </Button>
            </Grid>

            <Grid item xs={12} md={9}>
              <Paper sx={{ p: 2, overflowX: 'auto' }}>
                {renderRoleReportContent()}
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      )}

      {tabValue === 2 && (
        <Paper sx={{ p: 3, borderRadius: 4 }}>
          {reportHistory.length === 0 ? (
            <Alert severity="info">لا توجد تقارير محفوظة حتى الآن</Alert>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>الفئة</strong></TableCell>
                  <TableCell><strong>تاريخ الإنشاء</strong></TableCell>
                  <TableCell><strong>تم بواسطة</strong></TableCell>
                  <TableCell align="center"><strong>الإجراءات</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportHistory.map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>
                      <Chip 
                        label={report.category} 
                        size="small" 
                        sx={{ 
                          bgcolor: report.category === 'student' ? '#1976d2' : 
                                   report.category === 'teacher' ? '#2e7d32' :
                                   report.category === 'parent' ? '#9c27b0' : '#ed6c02',
                          color: 'white'
                        }} 
                      />
                    </TableCell>
                    <TableCell>{new Date(report.created_at).toLocaleString()}</TableCell>
                    <TableCell>{report.admin?.name || 'غير معروف'}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => viewHistoryReport(report)}
                        startIcon={<HistoryIcon />}
                      >
                        عرض التفاصيل
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      )}

      <Dialog open={openHistoryDialog} onClose={() => setOpenHistoryDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white' }}>
           تفاصيل التقرير المحفوظ
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedHistoryReport && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">الفئة:</Typography>
                  <Chip 
                    label={selectedHistoryReport.category} 
                    size="medium" 
                    sx={{ 
                      mt: 0.5,
                      bgcolor: selectedHistoryReport.category === 'student' ? '#1976d2' : 
                               selectedHistoryReport.category === 'teacher' ? '#2e7d32' :
                               selectedHistoryReport.category === 'parent' ? '#9c27b0' : '#ed6c02',
                      color: 'white'
                    }} 
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">تم بواسطة:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{selectedHistoryReport.admin?.name || 'غير معروف'}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">تاريخ الإنشاء:</Typography>
                  <Typography variant="body1">{new Date(selectedHistoryReport.created_at).toLocaleString()}</Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                 بيانات التقرير:
              </Typography>
              
              {selectedHistoryReport.category === 'student' && (
                <Paper sx={{ overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                        <TableCell><strong>#</strong></TableCell>
                        <TableCell><strong>اسم الطالب</strong></TableCell>
                        <TableCell><strong>المساقات المسجل فيها</strong></TableCell>
                        <TableCell><strong>علامات الامتحانات</strong></TableCell>
                        <TableCell><strong>نقاط الاختبارات</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedHistoryReport.report_data?.map((student, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            {student.enrolled_courses?.map((c, i) => (
                              <Chip key={i} label={c} size="small" sx={{ m: 0.3, bgcolor: '#e3f2fd' }} />
                            ))}
                          </TableCell>
                          <TableCell>
                            {student.exam_marks?.map((e, i) => (
                              <Box key={i}>
                                <Typography variant="body2">
                                  {e.exam}: <strong style={{ color: '#1976d2' }}>{e.mark}</strong>
                                </Typography>
                              </Box>
                            ))}
                          </TableCell>
                          <TableCell>
                            {student.quiz_points?.map((q, i) => (
                              <Box key={i}>
                                <Typography variant="body2">
                                  {q.course}: <strong style={{ color: '#2e7d32' }}>{q.points}</strong> نقطة
                                </Typography>
                              </Box>
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              )}

              {selectedHistoryReport.category === 'teacher' && (
                <Paper sx={{ overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#e8f5e9' }}>
                        <TableCell><strong>#</strong></TableCell>
                        <TableCell><strong>اسم المعلم</strong></TableCell>
                        <TableCell><strong>المواد التي يدرسها</strong></TableCell>
                        <TableCell><strong>عدد الاختبارات المعلنة</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedHistoryReport.report_data?.map((teacher, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{teacher.name}</TableCell>
                          <TableCell>
                            {teacher.teaching_courses?.map((c, i) => (
                              <Chip key={i} label={c} size="small" sx={{ m: 0.3, bgcolor: '#e8f5e9' }} />
                            ))}
                          </TableCell>
                          <TableCell>
                            <Chip label={teacher.quizzes_announced || 0} size="small" color="success" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              )}

              {selectedHistoryReport.category === 'parent' && (
                <Paper sx={{ overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f3e5f5' }}>
                        <TableCell><strong>#</strong></TableCell>
                        <TableCell><strong>اسم ولي الأمر</strong></TableCell>
                        <TableCell><strong>الأبناء</strong></TableCell>
                        <TableCell><strong>عدد الشكاوى</strong></TableCell>
                        <TableCell><strong>حالة الشكاوى</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedHistoryReport.report_data?.map((parent, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{parent.name}</TableCell>
                          <TableCell>
                            {parent.children?.map((c, i) => (
                              <Chip key={i} label={c} size="small" sx={{ m: 0.3, bgcolor: '#f3e5f5' }} />
                            ))}
                          </TableCell>
                          <TableCell>{parent.complaints_count || 0}</TableCell>
                          <TableCell>
                            {parent.complaints_history?.map((ch, i) => (
                              <Chip key={i} label={ch.status} size="small" color={ch.status === 'Resolved' ? 'success' : 'warning'} sx={{ m: 0.3 }} />
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              )}

              {selectedHistoryReport.category === 'admin' && (
                <Paper sx={{ overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#fff3e0' }}>
                        <TableCell><strong>#</strong></TableCell>
                        <TableCell><strong>اسم المدير</strong></TableCell>
                        <TableCell><strong>الاستبيانات المنشأة</strong></TableCell>
                        <TableCell><strong>الجداول المُنشأة</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedHistoryReport.report_data?.map((admin, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{admin.name}</TableCell>
                          <TableCell>
                            <Chip label={admin.total_polls_created || 0} size="small" color="info" />
                          </TableCell>
                          <TableCell>
                            <Chip label={admin.total_schedules_generated || 0} size="small" color="warning" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHistoryDialog(false)} variant="contained" color="primary">
            إغلاق
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

export default Reports;