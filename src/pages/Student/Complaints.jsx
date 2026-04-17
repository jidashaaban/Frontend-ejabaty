import React, { useState } from 'react';
import { Typography, TextField, Button, Paper } from '@mui/material';
import { submitComplaint } from '../../services/studentService';
import Toast from '../../components/common/Toast';

const Complaints = () => {
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitComplaint({ message });
    setToast({ open: true, message: 'تم إرسال الشكوى', severity: 'success' });
    setMessage('');
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        الشكاوى
      </Typography>
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="مضمون الشكوى"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit" variant="contained">
            إرسال
          </Button>
        </form>
      </Paper>
      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </div>
  );
};

export default Complaints;