import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  IconButton,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '../../components/common/Modal';
import Table from '../../components/common/Table';
import Toast from '../../components/common/Toast';
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../../services/adminService';

/**
 * صفحة إدارة الإعلانات
 */
const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    const data = await getAnnouncements();
    setAnnouncements(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setCurrent({ title: '', description: '', date: '', published: false });
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setCurrent({ ...row });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteAnnouncement(id);
    setToast({ open: true, message: 'تم حذف الإعلان', severity: 'success' });
    fetchData();
  };

  const handleSave = async () => {
    try {
      if (current.id) {
        await updateAnnouncement(current.id, current);
      } else {
        await createAnnouncement(current);
      }
      setModalOpen(false);
      setToast({ open: true, message: 'تم حفظ الإعلان', severity: 'success' });
      fetchData();
    } catch (err) {
      setToast({ open: true, message: err.message, severity: 'error' });
    }
  };

  const handleTogglePublish = async (row) => {
    await updateAnnouncement(row.id, { published: !row.published });
    fetchData();
  };

  const columns = [
    { field: 'title', headerName: 'العنوان' },
    { field: 'description', headerName: 'النص' },
    { field: 'date', headerName: 'التاريخ' },
    {
      field: 'published',
      headerName: 'نشر',
      renderCell: (row) => (
        <Switch
          checked={row.published}
          onChange={() => handleTogglePublish(row)}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'إجراءات',
      renderCell: (row) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleEdit(row)} color="primary" size="small">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.id)} color="error" size="small">
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  // تحويل البيانات إلى تنسيق الصفوف بخصائص مطابقة لأسماء الأعمدة
  const rows = announcements.map((ann) => ({
    id: ann.id,
    title: ann.title,
    description: ann.description,
    date: ann.date,
    published: ann.published,
    actions: ann, // سيتم استخدامه في renderCell
  }));

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        الإعلانات
      </Typography>
      <Button variant="contained" onClick={handleAdd} sx={{ mb: 2 }}>
        إضافة إعلان جديد
      </Button>
      <Table columns={columns} rows={rows} />
      {/* مودال إضافة/تعديل إعلان */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={current && current.id ? 'تعديل إعلان' : 'إضافة إعلان'}
        actions={
          <>
            <Button onClick={() => setModalOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              حفظ
            </Button>
          </>
        }
      >
        {current && (
          <>
            <TextField
              label="العنوان"
              fullWidth
              margin="normal"
              value={current.title}
              onChange={(e) => setCurrent({ ...current, title: e.target.value })}
            />
            <TextField
              label="النص"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={current.description}
              onChange={(e) => setCurrent({ ...current, description: e.target.value })}
            />
            <TextField
              label="التاريخ"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={current.date}
              onChange={(e) => setCurrent({ ...current, date: e.target.value })}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={current.published}
                  onChange={(e) => setCurrent({ ...current, published: e.target.checked })}
                />
              }
              label="نشر فوراً"
            />
            {/* حقل الصورة: في الوقت الحالي نحتفظ بمسار النص فقط */}
            <TextField
              label="رابط الصورة (اختياري)"
              fullWidth
              margin="normal"
              value={current.image || ''}
              onChange={(e) => setCurrent({ ...current, image: e.target.value })}
            />
          </>
        )}
      </Modal>
      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </div>
  );
};

export default Announcements;