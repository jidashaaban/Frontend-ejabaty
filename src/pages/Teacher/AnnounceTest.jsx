import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Announcement as AnnouncementIcon,
} from '@mui/icons-material';
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../../services/adminService';
import Toast from '../../components/common/Toast';

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    published: true,
  });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('خطأ في جلب الإعلانات:', error);
      setToast({ open: true, message: 'فشل في جلب الإعلانات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleOpenAddDialog = () => {
    setEditingAnnouncement(null);
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      published: true,
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      description: announcement.description,
      date: announcement.date,
      published: announcement.published,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAnnouncement(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      setToast({ open: true, message: 'الرجاء تعبئة العنوان والوصف', severity: 'error' });
      return;
    }

    try {
      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement.id, formData);
        setToast({ open: true, message: 'تم تعديل الإعلان بنجاح', severity: 'success' });
      } else {
        await createAnnouncement(formData);
        setToast({ open: true, message: 'تم إضافة الإعلان بنجاح', severity: 'success' });
      }
      handleCloseDialog();
      fetchAnnouncements();
    } catch (error) {
      setToast({ open: true, message: error.message || 'حدث خطأ', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      try {
        await deleteAnnouncement(id);
        setToast({ open: true, message: 'تم حذف الإعلان بنجاح', severity: 'success' });
        fetchAnnouncements();
      } catch (error) {
        setToast({ open: true, message: error.message || 'حدث خطأ', severity: 'error' });
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل الإعلانات...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          📢 إدارة الإعلانات
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{ borderRadius: 2 }}
        >
          إعلان جديد
        </Button>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        {announcements.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            لا توجد إعلانات حالياً. اضغط على "إعلان جديد" لإضافة أول إعلان.
          </Alert>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>العنوان</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>الوصف</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                  إجراءات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {announcements.map((announcement) => (
                <TableRow key={announcement.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AnnouncementIcon color="primary" fontSize="small" />
                      <Typography fontWeight="medium">{announcement.title}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 300, wordBreak: 'break-word' }}>
                      {announcement.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={announcement.date}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={announcement.published ? 'منشور' : 'مسودة'}
                      color={announcement.published ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleOpenEditDialog(announcement)}
                      color="primary"
                      size="small"
                      title="تعديل"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(announcement.id)}
                      color="error"
                      size="small"
                      title="حذف"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingAnnouncement ? '✏️ تعديل إعلان' : '➕ إضافة إعلان جديد'}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="title"
            label="عنوان الإعلان"
            fullWidth
            margin="normal"
            value={formData.title}
            onChange={handleChange}
            required
            variant="outlined"
          />
          <TextField
            name="description"
            label="وصف الإعلان"
            fullWidth
            margin="normal"
            value={formData.description}
            onChange={handleChange}
            required
            multiline
            rows={4}
            variant="outlined"
          />
          <TextField
            name="date"
            label="التاريخ"
            type="date"
            fullWidth
            margin="normal"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                color="primary"
              />
            }
            label={formData.published ? 'منشور (مرئي للجميع)' : 'مسودة (غير منشور)'}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            إلغاء
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editingAnnouncement ? 'تعديل' : 'إضافة'}
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

export default Announcements;