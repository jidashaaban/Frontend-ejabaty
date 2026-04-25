import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  IconButton,
  Stack,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Announcement as AnnouncementIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../../services/adminService';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      setToast({ open: true, message: 'فشل في جلب الإعلانات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setCurrent({ title: '', description: '', date: new Date().toISOString().split('T')[0], published: false, image: '' });
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setCurrent({ ...row });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      try {
        await deleteAnnouncement(id);
        setToast({ open: true, message: 'تم حذف الإعلان بنجاح', severity: 'success' });
        fetchData();
      } catch (error) {
        setToast({ open: true, message: error.message, severity: 'error' });
      }
    }
  };

  const handleSave = async () => {
    if (!current.title || !current.description) {
      setToast({ open: true, message: 'الرجاء تعبئة العنوان والنص', severity: 'error' });
      return;
    }
    try {
      if (current.id) {
        await updateAnnouncement(current.id, current);
        setToast({ open: true, message: 'تم تعديل الإعلان بنجاح', severity: 'success' });
      } else {
        await createAnnouncement(current);
        setToast({ open: true, message: 'تم إضافة الإعلان بنجاح', severity: 'success' });
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setToast({ open: true, message: err.message, severity: 'error' });
    }
  };

  const handleTogglePublish = async (row) => {
    try {
      await updateAnnouncement(row.id, { published: !row.published });
      fetchData();
    } catch (error) {
      setToast({ open: true, message: error.message, severity: 'error' });
    }
  };

  return (
    <Box>
      <PageHeader 
        title="الإعلانات"
        subtitle="أضف أو عدل أو احذف الإعلانات"
        icon={<AnnouncementIcon sx={{ fontSize: 20 }} />}
      />

      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 0.8,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          إعلان جديد
        </Button>
      </Box>

      {announcements.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 4 }}>
          <AnnouncementIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">لا توجد إعلانات حالياً</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>اضغط على "إعلان جديد" لإضافة أول إعلان</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {announcements.map((announcement) => (
            <Grid item xs={12} md={6} lg={4} key={announcement.id}>
              <Card sx={{
                borderRadius: 3,
                transition: '0.3s',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdef5 100%)',
                border: announcement.published ? '1px solid #4caf50' : '1px solid #90caf9',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: '0 8px 25px rgba(25,118,210,0.25)',
                }
              }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Chip
                      label={announcement.published ? 'منشور' : 'مسودة'}
                      size="small"
                      color={announcement.published ? 'success' : 'default'}
                      icon={announcement.published ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    />
                    <Box>
                      <IconButton onClick={() => handleEdit(announcement)} color="primary" size="small" title="تعديل">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(announcement.id)} color="error" size="small" title="حذف">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: '#1565c0' }}>
                    <AnnouncementIcon color="primary" fontSize="small" />
                    {announcement.title}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 2, color: '#37474f' }}>
                    {announcement.description.length > 100 
                      ? `${announcement.description.substring(0, 100)}...` 
                      : announcement.description}
                  </Typography>

                  <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                    <Chip 
                      label={announcement.date} 
                      size="small" 
                      variant="outlined"
                      sx={{ borderColor: '#1976d2', color: '#1976d2' }}
                    />
                    <Button
                      size="small"
                      onClick={() => handleTogglePublish(announcement)}
                      sx={{ 
                        textTransform: 'none',
                        color: announcement.published ? '#f44336' : '#4caf50',
                      }}
                    >
                      {announcement.published ? 'إلغاء النشر' : 'نشر'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', 
          color: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}>
          <AnnouncementIcon />
          {current?.id ? 'تعديل إعلان' : 'إضافة إعلان جديد'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            label="عنوان الإعلان"
            fullWidth
            margin="normal"
            value={current?.title || ''}
            onChange={(e) => setCurrent({ ...current, title: e.target.value })}
            required
            variant="outlined"
          />
          <TextField
            label="نص الإعلان"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={current?.description || ''}
            onChange={(e) => setCurrent({ ...current, description: e.target.value })}
            required
            variant="outlined"
          />
          <TextField
            label="التاريخ"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={current?.date || ''}
            onChange={(e) => setCurrent({ ...current, date: e.target.value })}
            variant="outlined"
          />
          <FormControlLabel
            control={
              <Switch
                checked={current?.published || false}
                onChange={(e) => setCurrent({ ...current, published: e.target.checked })}
                color="primary"
              />
            }
            label={current?.published ? 'منشور (مرئي للجميع)' : 'مسودة (غير منشور)'}
            sx={{ mt: 1 }}
          />
          <TextField
            label="رابط الصورة (اختياري)"
            fullWidth
            margin="normal"
            value={current?.image || ''}
            onChange={(e) => setCurrent({ ...current, image: e.target.value })}
            variant="outlined"
            helperText="أدخل رابط صورة للإعلان (اختياري)"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setModalOpen(false)} variant="outlined">إلغاء</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#1976d2' }}>حفظ</Button>
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

export default Announcements;