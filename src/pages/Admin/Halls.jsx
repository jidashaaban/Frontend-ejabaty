import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MeetingRoom as MeetingRoomIcon,
  EventSeat as SeatIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { getHalls, addHall, updateHall, deleteHall } from '../../services/adminService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

function Halls() {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentHall, setCurrentHall] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
  });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchHalls = async () => {
    setLoading(true);
    try {
      const data = await getHalls();
      setHalls(data);
    } catch (error) {
      console.error('خطأ في جلب القاعات:', error);
      setToast({ open: true, message: 'فشل في جلب القاعات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHalls();
  }, []);

  const handleOpenAddDialog = () => {
    setIsEditing(false);
    setCurrentHall(null);
    setFormData({ name: '', capacity: '' });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (hall) => {
    setIsEditing(true);
    setCurrentHall(hall);
    setFormData({
      name: hall.name,
      capacity: hall.capacity || '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentHall(null);
    setFormData({ name: '', capacity: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setToast({ open: true, message: 'الرجاء إدخال رقم القاعة', severity: 'error' });
      return;
    }
    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      setToast({ open: true, message: 'الرجاء إدخال سعة صحيحة للقاعة', severity: 'error' });
      return;
    }

    try {
      if (isEditing && currentHall) {
        await updateHall(currentHall.id, {
          name: formData.name,
          capacity: parseInt(formData.capacity),
        });
        setToast({ open: true, message: 'تم تعديل القاعة بنجاح', severity: 'success' });
      } else {
        await addHall({
          name: formData.name,
          capacity: parseInt(formData.capacity),
        });
        setToast({ open: true, message: 'تم إضافة القاعة بنجاح', severity: 'success' });
      }
      handleCloseDialog();
      fetchHalls();
    } catch (error) {
      setToast({ open: true, message: error.message || 'حدث خطأ', severity: 'error' });
    }
  };

  const handleDelete = async (id, hallName) => {
    if (window.confirm(`هل أنت متأكد من حذف القاعة "${hallName}"؟`)) {
      try {
        await deleteHall(id);
        setToast({ open: true, message: 'تم حذف القاعة بنجاح', severity: 'success' });
        fetchHalls();
      } catch (error) {
        setToast({ open: true, message: error.message || 'حدث خطأ', severity: 'error' });
      }
    }
  };

  const getCardGradient = (capacity) => {
    if (capacity >= 40) {
      return 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'; 
    } else if (capacity >= 20) {
      return 'linear-gradient(135deg, #e3f2fd 0%, #bbdef5 100%)'; 
    } else {
      return 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'; 
    }
  };

  const getCapacityColor = (capacity) => {
    if (capacity >= 40) return '#2e7d32';
    if (capacity >= 20) return '#1565c0';
    return '#ed6c02';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل القاعات...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="إدارة القاعات"
        subtitle="أضف أو عدل أو احذف القاعات الامتحانية"
        icon={<MeetingRoomIcon sx={{ fontSize: 20 }} />}
      />

      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            boxShadow: '0 4px 15px rgba(25,118,210,0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          إضافة قاعة جديدة
        </Button>
      </Box>

      {halls.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 4, bgcolor: '#f8f9fa' }}>
          <MeetingRoomIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            لا توجد قاعات حالياً
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            اضغط على "إضافة قاعة جديدة" لإضافة أول قاعة
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {halls.map((hall, index) => (
            <Grid item xs={12} sm={6} md={4} key={hall.id}>
              <Card
                sx={{
                  borderRadius: 4,
                  transition: '0.3s',
                  background: getCardGradient(hall.capacity || 0),
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <MeetingRoomIcon sx={{ color: '#1976d2', fontSize: 28 }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                        {hall.name}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        onClick={() => handleOpenEditDialog(hall)}
                        sx={{ color: '#1976d2', bgcolor: 'rgba(25,118,210,0.1)', mr: 0.5 }}
                        size="small"
                        title="تعديل"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(hall.id, hall.name)}
                        sx={{ color: '#f44336', bgcolor: 'rgba(244,67,54,0.1)' }}
                        size="small"
                        title="حذف"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2} mt={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <SeatIcon sx={{ color: getCapacityColor(hall.capacity || 0) }} />
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 'bold',
                          color: getCapacityColor(hall.capacity || 0),
                          fontSize: '2rem',
                        }}
                      >
                        {hall.capacity || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        طالب
                      </Typography>
                    </Box>
                    <Chip
                      label={hall.capacity >= 40 ? 'سعة كبيرة' : hall.capacity >= 20 ? 'سعة متوسطة' : 'سعة صغيرة'}
                      size="small"
                      sx={{
                        bgcolor:
                          hall.capacity >= 40
                            ? '#4caf50'
                            : hall.capacity >= 20
                            ? '#1976d2'
                            : '#ff9800',
                        color: '#fff',
                      }}
                    />
                  </Box>

                  <Box mt={2}>
                    <Typography variant="caption" color="text.secondary">
                      رقم القاعة: {hall.name}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <MeetingRoomIcon />
            {isEditing ? '✏️ تعديل قاعة' : '➕ إضافة قاعة جديدة'}
          </Box>
          <IconButton onClick={handleCloseDialog} sx={{ color: '#fff' }} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            name="name"
            label="رقم القاعة"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            placeholder="مثال: قاعة 101"
            required
            variant="outlined"
            InputProps={{
              startAdornment: <MeetingRoomIcon sx={{ color: '#1976d2', mr: 1 }} />,
            }}
          />
          <TextField
            name="capacity"
            label="سعة القاعة"
            type="number"
            fullWidth
            margin="normal"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="مثال: 30"
            required
            variant="outlined"
            InputProps={{
              startAdornment: <SeatIcon sx={{ color: '#1976d2', mr: 1 }} />,
              inputProps: { min: 1 },
            }}
            helperText="عدد الطلاب الذين يتسع لهم القاعة"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseDialog} variant="outlined" sx={{ borderRadius: 2 }}>
            إلغاء
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              },
            }}
          >
            {isEditing ? 'تعديل' : 'حفظ'}
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

export default Halls;