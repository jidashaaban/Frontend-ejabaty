import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
} from '@mui/material';
import { getExamModels, uploadExamModel } from '../../services/teacherService';
import Toast from '../../components/common/Toast';

const ExamModels = () => {
  const subjects = ['رياضيات', 'فيزياء', 'لغة عربية'];
  const [models, setModels] = useState([]);
  const [form, setForm] = useState({ subject: '', description: '', fileName: '' });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    const data = await getExamModels();
    setModels(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await uploadExamModel(form);
    setToast({ open: true, message: 'تم إضافة النموذج', severity: 'success' });
    setForm({ subject: '', description: '', fileName: '' });
    fetchData();
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        نماذج امتحانية
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">إضافة نموذج جديد</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="المادة"
            fullWidth
            margin="normal"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          >
            {subjects.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="الوصف"
            fullWidth
            margin="normal"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextField
            label="اسم الملف (اختياري)"
            fullWidth
            margin="normal"
            value={form.fileName}
            onChange={(e) => setForm({ ...form, fileName: e.target.value })}
          />
          <Button type="submit" variant="contained" sx={{ mt: 1 }}>
            إضافة
          </Button>
        </form>
      </Paper>
      {models.length > 0 && (
        <div>
          <Typography variant="h6" gutterBottom>
            النماذج الحالية
          </Typography>
          {models.map((model) => (
            <Paper key={model.id} sx={{ p: 2, mb: 1 }}>
              <Typography>المادة: {model.subject}</Typography>
              <Typography>الوصف: {model.description}</Typography>
              {model.fileName && <Typography>الملف: {model.fileName}</Typography>}
            </Paper>
          ))}
        </div>
      )}
      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </div>
  );
};

export default ExamModels;