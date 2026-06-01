import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  TextField,
  Chip,
  Card,
  CardContent,
  Grid,
  Avatar,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  People as PeopleIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';
import {
  getPendingRegistrations,
  activateCourse,
  rejectRegistration,
} from '../../services/courseRegistrationService';

const ActivateCourses = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('activate');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingRegistrations();
  }, []);

  const fetchPendingRegistrations = async () => {
    try {
      setLoading(true);
      const response = await getPendingRegistrations();
      if (response.success) {
        setRegistrations(response.pending_registrations || []);
      }
    } catch (error) {
      console.error('خطأ في جلب الطلبات:', error);
      setToast({ open: true, message: 'حدث خطأ في جلب الطلبات المعلقة', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleActivateClick = (registration) => {
    setSelectedRegistration(registration);
    setDialogAction('activate');
    setRejectionReason('');
    setOpenDialog(true);
  };

  const handleRejectClick = (registration) => {
    setSelectedRegistration(registration);
    setDialogAction('reject');
    setRejectionReason('');
    setOpenDialog(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedRegistration) return;

    try {
      setProcessing(true);

      if (dialogAction === 'activate') {
        const response = await activateCourse(
          selectedRegistration.user_id,
          selectedRegistration.course_id
        );
        if (response.success) {
          setToast({ open: true, message: response.message, severity: 'success' });
          setOpenDialog(false);
          fetchPendingRegistrations();
        }
      } else if (dialogAction === 'reject') {
        const response = await rejectRegistration(
          selectedRegistration.user_id,
          selectedRegistration.course_id,
          rejectionReason
        );
        if (response.success) {
          setToast({ open: true, message: response.message, severity: 'success' });
          setOpenDialog(false);
          fetchPendingRegistrations();
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'حدث خطأ في العملية';
      setToast({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRegistration(null);
    setRejectionReason('');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل طلبات التسجيل...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader 
        title="إدارة طلبات التسجيل"
        subtitle="الموافقة على طلبات تسجيل الطلاب أو رفضها"
        icon={<AssignmentTurnedInIcon sx={{ fontSize: 20 }} />}
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            borderRadius: 3, 
            bgcolor: '#fff3e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">إجمالي الطلبات المعلقة</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>
                    {registrations.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#ed6c02', width: 55, height: 55 }}>
                  <PendingIcon sx={{ fontSize: 30, color: '#fff' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {registrations.length === 0 ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Avatar sx={{ 
              bgcolor: '#e8f5e9', 
              width: 70, 
              height: 70, 
              mx: 'auto', 
              mb: 2 
            }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50' }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary">لا توجد طلبات معلقة</Typography>
            <Typography variant="body2" color="text.secondary">
              جميع الطلبات تمت معالجتها
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>اسم الطالب</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>بريد الطالب</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>اسم المادة</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>كود المادة</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>تاريخ الطلب</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow key={`${registration.user_id}-${registration.course_id}`} hover>
                    <TableCell align="right">{registration.student_name}</TableCell>
                    <TableCell align="right">{registration.student_email}</TableCell>
                    <TableCell align="right">{registration.course_name}</TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={registration.course_code} 
                        size="small" 
                        variant="outlined"
                        sx={{ borderColor: '#1976d2', color: '#1976d2' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {new Date(registration.booked_at).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleActivateClick(registration)}
                          disabled={processing}
                          sx={{ borderRadius: 2, textTransform: 'none' }}
                        >
                          تفعيل
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<CancelIcon />}
                          onClick={() => handleRejectClick(registration)}
                          disabled={processing}
                          sx={{ borderRadius: 2, textTransform: 'none' }}
                        >
                          رفض
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          background: dialogAction === 'activate' 
            ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)' 
            : 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
          color: '#fff',
          fontWeight: 'bold'
        }}>
          {dialogAction === 'activate' ? '✅ تفعيل المادة' : '❌ رفض طلب التسجيل'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedRegistration && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>اسم الطالب:</strong> {selectedRegistration.student_name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>اسم المادة:</strong> {selectedRegistration.course_name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>كود المادة:</strong> {selectedRegistration.course_code}
                  </Typography>
                </Grid>
              </Grid>

              {dialogAction === 'reject' && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="سبب الرفض (اختياري)"
                  placeholder="أدخل سبب رفض الطلب..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  sx={{ mb: 2 }}
                />
              )}

              <Alert 
                severity={dialogAction === 'activate' ? 'success' : 'warning'} 
                sx={{ borderRadius: 2 }}
              >
                {dialogAction === 'activate'
                  ? 'سيتم تفعيل المادة للطالب وسيتمكن من الوصول إليها فوراً'
                  : 'سيتم رفض الطلب وسيتلقى الطالب إشعاراً بالرفض'}
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined" 
            disabled={processing}
            sx={{ borderRadius: 2 }}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            color={dialogAction === 'activate' ? 'success' : 'error'}
            disabled={processing}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {processing ? <CircularProgress size={24} /> : (dialogAction === 'activate' ? 'تأكيد التفعيل' : 'تأكيد الرفض')}
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

export default ActivateCourses;