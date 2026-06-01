import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';
import { getActiveCourses, getPendingCourses, getAvailableCourses ,registerCourse } from '../../services/courseRegistrationService';

const RegisterCourses = () => {
  const [tabValue, setTabValue] = useState(0);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [activeCourses, setActiveCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const availableData = await getAvailableCourses();
      if (availableData && availableData.available_courses) {
        setAvailableCourses(availableData.available_courses);
      }

      const activeData = await getActiveCourses();
      if (activeData.success) {
        setActiveCourses(activeData.active_courses || []);
      }

      const pendingData = await getPendingCourses();
      if (pendingData.success) {
        setPendingCourses(pendingData.pending_courses || []);
      }

    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
      setToast({ open: true, message: 'حدث خطأ في جلب البيانات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = (course) => {
    setSelectedCourse(course);
    setOpenDialog(true);
  };

  const handleConfirmRegister = async () => {
    if (!selectedCourse) return;

    try {
      setRegistering(true);
      const response = await registerCourse(selectedCourse.id);
      
      if (response.success) {
        setToast({ open: true, message: response.message, severity: 'success' });
        setOpenDialog(false);
        setTimeout(() => {
          fetchData();
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'حدث خطأ في التسجيل';
      setToast({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setRegistering(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCourse(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل المواد...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader 
        title="تسجيل المواد الدراسية"
        subtitle="اختر المواد التي ترغب في التسجيل بها"
        icon={<SchoolIcon sx={{ fontSize: 20 }} />}
      />

      <Container maxWidth="lg">
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 3, bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary">المواد المتاحة</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                      {availableCourses.length}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#1976d2', width: 50, height: 50 }}>
                    <MenuBookIcon sx={{ fontSize: 28, color: '#fff' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 3, bgcolor: '#e8f5e9' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary">المواد المسجلة</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                      {activeCourses.length}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#2e7d32', width: 50, height: 50 }}>
                    <AssignmentTurnedInIcon sx={{ fontSize: 28, color: '#fff' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 3, bgcolor: '#fff3e0' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary">قيد الانتظار</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>
                      {pendingCourses.length}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#ed6c02', width: 50, height: 50 }}>
                    <PendingIcon sx={{ fontSize: 28, color: '#fff' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="course tabs" centered>
            <Tab label={`المواد المتاحة (${availableCourses.length})`} />
            <Tab label={`المواد المسجلة (${activeCourses.length})`} />
            <Tab label={`قيد الانتظار (${pendingCourses.length})`} />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Box>
            <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
              المواد ذات الشارة "غير مفعلة" يمكن التسجيل فيها لكن سيتم وضع طلبك في قائمة الانتظار حتى موافقة الإدارة
            </Alert>
            {availableCourses.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2 }}>لا توجد مواد متاحة للتسجيل حالياً</Alert>
            ) : (
              <Grid container spacing={2}>
                {availableCourses.map((course) => {
                  const isActiveCourse = course.is_active === 1;
                  return (
                    <Grid item xs={12} sm={6} md={4} key={course.id}>
                      <Card sx={{ 
                        borderRadius: 3,
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        border: isActiveCourse ? '1px solid #4caf50' : '1px solid #ff9800',
                        transition: '0.3s',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
                      }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                            <Chip 
                              label={course.code} 
                              size="small" 
                              variant="outlined"
                              sx={{ borderColor: '#1976d2', color: '#1976d2' }}
                            />
                            <Chip 
                              label={isActiveCourse ? 'مفعلة' : 'غير مفعلة'} 
                              size="small"
                              sx={{
                                bgcolor: isActiveCourse ? '#4caf50' : '#ff9800',
                                color: '#fff',
                                fontWeight: 'bold'
                              }}
                            />
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#1565c0' }}>
                            {course.name}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <PersonIcon sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="body2" color="text.secondary">
                              المعلم: {course.teacher_name || 'لم يتم تعيينه بعد'}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <GroupIcon sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="body2" color="text.secondary">
                              السعة: {course.capacity} طالب
                            </Typography>
                          </Box>
                          {!isActiveCourse && (
                            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#ff9800' }}>
                              هذا الكورس لم يتم تفعيله بعد، سيتم إعلامك عند التفعيل
                            </Typography>
                          )}
                        </CardContent>
                        <Box sx={{ p: 2 }}>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleRegisterClick(course)}
                            disabled={registering}
                            sx={{
                              bgcolor: isActiveCourse ? '#1976d2' : '#ff9800',
                              borderRadius: 2,
                              '&:hover': {
                                bgcolor: isActiveCourse ? '#1565c0' : '#ed6c02'
                              }
                            }}
                            startIcon={isActiveCourse ? <AssignmentTurnedInIcon /> : <PendingIcon />}
                          >
                            {isActiveCourse ? 'تسجيل الآن' : 'تسجيل (قيد الانتظار)'}
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32', display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssignmentTurnedInIcon /> المواد المسجلة في برنامجك
            </Typography>
            {activeCourses.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2 }}>لا توجد مواد مسجلة حالياً</Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#e8f5e9' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>اسم المادة</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>الكود</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>المعلم</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>تاريخ التسجيل</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeCourses.map((course) => (
                      <TableRow key={course.id} hover>
                        <TableCell>{course.name}</TableCell>
                        <TableCell><Chip label={course.code} size="small" variant="outlined" /></TableCell>
                        <TableCell>{course.teacher_name || 'سيتم تعيينه لاحقاً'}</TableCell>
                        <TableCell>
                          <Chip
                            label="مسجل"
                            size="small"
                            icon={<CheckCircleIcon />}
                            sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell>{new Date(course.booked_at).toLocaleDateString('ar-SA')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}

        {tabValue === 2 && (
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#ed6c02', display: 'flex', alignItems: 'center', gap: 1 }}>
              <PendingIcon /> طلبات التسجيل المعلقة (بانتظار موافقة الإدارة)
            </Typography>
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
              هذه المواد التي سجلت فيها ولكن لم يتم تفعيلها بعد من قبل الإدارة. سيتم إعلامك عند الموافقة عليها.
            </Alert>
            {pendingCourses.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2 }}>لا توجد طلبات معلقة</Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#fff3e0' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>اسم المادة</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>الكود</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>المعلم</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>تاريخ الطلب</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingCourses.map((course) => (
                      <TableRow key={course.id} hover>
                        <TableCell>{course.name}</TableCell>
                        <TableCell><Chip label={course.code} size="small" variant="outlined" /></TableCell>
                        <TableCell>{course.teacher_name || 'سيتم تعيينه لاحقاً'}</TableCell>
                        <TableCell>
                          <Chip
                            label="قيد الانتظار"
                            size="small"
                            icon={<PendingIcon />}
                            sx={{ bgcolor: '#fff3e0', color: '#ed6c02', fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell>{new Date(course.booked_at).toLocaleDateString('ar-SA')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: '#fff' }}>
            تأكيد التسجيل على المادة
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedCourse && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2"><strong>اسم المادة:</strong> {selectedCourse.name}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2"><strong>الكود:</strong> {selectedCourse.code}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2"><strong>المعلم:</strong> {selectedCourse.teacher_name || 'لم يتم تعيينه بعد'}</Typography>
                  </Grid>
                </Grid>
                {selectedCourse.is_active === 1 ? (
                  <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
                  سيتم إضافة المادة إلى موادك مباشرة بعد تأكيد التسجيل.
                  </Alert>
                ) : (
                  <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                    هذه المادة غير مفعلة حالياً. سيتم وضع طلبك في قائمة الانتظار، وستتلقى إشعاراً عند موافقة الإدارة على تفعيل المادة.
                  </Alert>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog} disabled={registering} variant="outlined">
              إلغاء
            </Button>
            <Button
              onClick={handleConfirmRegister}
              variant="contained"
              disabled={registering}
              sx={{ bgcolor: '#1976d2' }}
            >
              {registering ? <CircularProgress size={24} /> : 'تأكيد التسجيل'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </Box>
  );
};

export default RegisterCourses;