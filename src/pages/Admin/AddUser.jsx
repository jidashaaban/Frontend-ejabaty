// src/pages/Admin/AddUser.jsx
import React, { useState } from 'react';
import {
  Typography,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  MenuItem,
  Table as MuiTable,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { addTeacher, addStudent, addParent } from '../../services/adminService';
import Toast from '../../components/common/Toast';

function AddUser() {
  const [tab, setTab] = useState(0);
  const [teacherForm, setTeacherForm] = useState({ 
    name: '', phone: '', email: '', subjects: '', password: '' 
  });
  const [studentForm, setStudentForm] = useState({
    firstName: '',
    fatherName: '',
    lastName: '',
    phoneNumber: '',
    course: '',
    classNumber: '',
    health: '',
    previousSchool: '',
    average: '',
    status: 'active',
  });
  const [parentForm, setParentForm] = useState({ 
    name: '', phone: '', email: '', password: '' 
  });
  const [credentials, setCredentials] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
    setCredentials(null);
  };

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTeacher(teacherForm);
      setToast({ open: true, message: 'تم إضافة الأستاذ بنجاح', severity: 'success' });
      setTeacherForm({ name: '', phone: '', email: '', subjects: '', password: '' });
    } catch (err) {
      setToast({ open: true, message: err.message, severity: 'error' });
    }
  };

  const generateCredentials = () => {
    const username = 'std' + Math.floor(Math.random() * 100000);
    const password = Math.random().toString(36).slice(-8);
    return { username, password };
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      const creds = generateCredentials();
      setCredentials(creds);
      const fullName = `${studentForm.firstName} ${studentForm.fatherName} ${studentForm.lastName}`;
      await addStudent({ ...studentForm, fullName, username: creds.username, password: creds.password });
      setToast({ open: true, message: 'تم إضافة الطالب بنجاح', severity: 'success' });
      setStudentForm({ 
        firstName: '', fatherName: '', lastName: '', phoneNumber: '', course: '', 
        classNumber: '', health: '', previousSchool: '', average: '', status: 'active' 
      });
    } catch (err) {
      setToast({ open: true, message: err.message, severity: 'error' });
    }
  };

  const handleParentSubmit = async (e) => {
    e.preventDefault();
    try {
      await addParent(parentForm);
      setToast({ open: true, message: 'تم إضافة ولي الأمر بنجاح', severity: 'success' });
      setParentForm({ name: '', phone: '', email: '', password: '' });
    } catch (err) {
      setToast({ open: true, message: err.message, severity: 'error' });
    }
  };

  const courses = [
    { value: 'الرياضيات', label: 'دورة الرياضيات' },
    { value: 'الفيزياء', label: 'دورة الفيزياء' },
    { value: 'اللغة الإنجليزية', label: 'دورة اللغة الإنجليزية' },
  ];

  const statuses = [
    { value: 'active', label: 'نشط' },
    { value: 'inactive', label: 'منقطع' },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        إضافة مستخدم
      </Typography>
      
      <Tabs value={tab} onChange={handleChangeTab} aria-label="user type tabs" sx={{ mb: 2 }} centered>
        <Tab label="أستاذ" />
        <Tab label="طالب" />
        <Tab label="ولي أمر" />
      </Tabs>
      
      {tab === 0 && (
        <Box component="form" onSubmit={handleTeacherSubmit} noValidate>
          <TextField label="الاسم الثلاثي" fullWidth margin="normal" value={teacherForm.name} onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })} />
          <TextField label="رقم الهاتف" fullWidth margin="normal" value={teacherForm.phone} onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })} />
          <TextField label="البريد الإلكتروني" fullWidth margin="normal" value={teacherForm.email} onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })} />
          <TextField label="المواد التي يدرسها" fullWidth margin="normal" helperText="يمكن كتابة أكثر من مادة مفصولة بفاصلة" value={teacherForm.subjects} onChange={(e) => setTeacherForm({ ...teacherForm, subjects: e.target.value })} />
          <TextField label="كلمة مرور مؤقتة" fullWidth margin="normal" value={teacherForm.password} onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })} />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>إضافة أستاذ</Button>
        </Box>
      )}
      
      {tab === 1 && (
        <Box component="form" onSubmit={handleStudentSubmit} noValidate>
          <TextField label="الاسم الأول" fullWidth margin="normal" value={studentForm.firstName} onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })} />
          <TextField label="اسم الأب" fullWidth margin="normal" value={studentForm.fatherName} onChange={(e) => setStudentForm({ ...studentForm, fatherName: e.target.value })} />
          <TextField label="الكنية" fullWidth margin="normal" value={studentForm.lastName} onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })} />
          <TextField label="رقم الهاتف" fullWidth margin="normal" value={studentForm.phoneNumber} onChange={(e) => setStudentForm({ ...studentForm, phoneNumber: e.target.value })} />
          <TextField select label="الدورة المسجل فيها" fullWidth margin="normal" value={studentForm.course} onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}>
            {courses.map((course) => (<MenuItem key={course.value} value={course.value}>{course.label}</MenuItem>))}
          </TextField>
          <TextField label="الصف" fullWidth margin="normal" value={studentForm.classNumber} onChange={(e) => setStudentForm({ ...studentForm, classNumber: e.target.value })} />
          <TextField label="الحالة الصحية (اختياري)" fullWidth margin="normal" value={studentForm.health} onChange={(e) => setStudentForm({ ...studentForm, health: e.target.value })} />
          <TextField label="مكان الدراسة السابق" fullWidth margin="normal" value={studentForm.previousSchool} onChange={(e) => setStudentForm({ ...studentForm, previousSchool: e.target.value })} />
          <TextField label="المجموع في آخر سنة دراسية" type="number" fullWidth margin="normal" value={studentForm.average} onChange={(e) => setStudentForm({ ...studentForm, average: e.target.value })} />
          <TextField select label="حالة الطالب" fullWidth margin="normal" value={studentForm.status} onChange={(e) => setStudentForm({ ...studentForm, status: e.target.value })}>
            {statuses.map((status) => (<MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>))}
          </TextField>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>إضافة طالب</Button>
        </Box>
      )}
      
      {tab === 2 && (
        <Box component="form" onSubmit={handleParentSubmit} noValidate>
          <TextField label="الاسم الثلاثي" fullWidth margin="normal" value={parentForm.name} onChange={(e) => setParentForm({ ...parentForm, name: e.target.value })} />
          <TextField label="رقم الهاتف" fullWidth margin="normal" value={parentForm.phone} onChange={(e) => setParentForm({ ...parentForm, phone: e.target.value })} />
          <TextField label="البريد الإلكتروني" fullWidth margin="normal" value={parentForm.email} onChange={(e) => setParentForm({ ...parentForm, email: e.target.value })} />
          <TextField label="كلمة مرور مؤقتة" fullWidth margin="normal" value={parentForm.password} onChange={(e) => setParentForm({ ...parentForm, password: e.target.value })} />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>إضافة ولي أمر</Button>
        </Box>
      )}
      
      {credentials && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>بيانات اعتماد الطالب</Typography>
          <MuiTable>
            <TableHead>
              <TableRow>
                <TableCell>اسم المستخدم</TableCell>
                <TableCell>كلمة المرور</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{credentials.username}</TableCell>
                <TableCell>{credentials.password}</TableCell>
              </TableRow>
            </TableBody>
          </MuiTable>
        </Box>
      )}
      
      <Toast open={toast.open} onClose={() => setToast({ ...toast, open: false })} message={toast.message} severity={toast.severity} />
    </Box>
  );
}

export default AddUser;