import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material';
import { getStudents, addNote } from '../../services/teacherService';
import Toast from '../../components/common/Toast';

const StudentNotes = () => {
  const [students, setStudents] = useState([]);
  const [notes, setNotes] = useState({});
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    const data = await getStudents();
    setStudents(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (studentId) => {
    const note = notes[studentId] || '';
    if (!note) return;
    await addNote(studentId, note);
    setToast({ open: true, message: 'تم حفظ الملاحظة', severity: 'success' });
    setNotes({ ...notes, [studentId]: '' });
    fetchData();
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        ملاحظات الطلاب
      </Typography>
      {students.map((student) => (
        <Paper key={student.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1">{student.name} - {student.course}</Typography>
          {/* عرض الملاحظات السابقة */}
          {student.notes && student.notes.length > 0 && (
            <List dense sx={{ mb: 1 }}>
              {student.notes.map((n) => (
                <ListItem key={n.id}>
                  <ListItemText primary={n.text} />
                </ListItem>
              ))}
            </List>
          )}
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              label="ملاحظة"
              fullWidth
              multiline
              minRows={2}
              value={notes[student.id] || ''}
              onChange={(e) => setNotes({ ...notes, [student.id]: e.target.value })}
            />
            <Button variant="contained" onClick={() => handleSave(student.id)}>
              حفظ
            </Button>
          </Stack>
        </Paper>
      ))}
      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </div>
  );
};

export default StudentNotes;