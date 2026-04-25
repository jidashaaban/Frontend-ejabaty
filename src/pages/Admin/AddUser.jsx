import React, { useState } from 'react';
import {
  Typography,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Grid,
  Divider,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  PeopleAlt as ParentIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { addTeacher, addStudent, addParent } from '../../services/adminService';
import Toast from '../../components/common/Toast';

function AddUser() {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
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

  const handleCopyCredentials = (text) => {
    navigator.clipboard.writeText(text);
    setToast({ open: true, message: 'تم نسخ البيانات', severity: 'success' });
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
    { value: 'active', label: 'نشط', color: '#4caf50' },
    { value: 'inactive', label: 'منقطع', color: '#f44336' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          👥 إضافة مستخدم جديد
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          أضف أساتذة، طلاب، أو أولياء أمور إلى النظام
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Tabs 
          value={tab} 
          onChange={handleChangeTab} 
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              py: 2,
              fontSize: '1rem',
              fontWeight: 500,
            },
            '& .Mui-selected': {
              color: '#1976d2',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#1976d2',
              height: 3,
            },
          }}
        >
          <Tab 
            icon={<SchoolIcon />} 
            iconPosition="start" 
            label="أستاذ" 
          />
          <Tab 
            icon={<PersonIcon />} 
            iconPosition="start" 
            label="طالب" 
          />
          <Tab 
            icon={<ParentIcon />} 
            iconPosition="start" 
            label="ولي أمر" 
          />
        </Tabs>

        {tab === 0 && (
          <Box component="form" onSubmit={handleTeacherSubmit} sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="الاسم الثلاثي"
                  fullWidth
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  variant="outlined"
                  placeholder="مثال: أحمد محمد علي"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="رقم الهاتف"
                  fullWidth
                  value={teacherForm.phone}
                  onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                  variant="outlined"
                  placeholder="09xxxxxxxx"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="البريد الإلكتروني"
                  type="email"
                  fullWidth
                  value={teacherForm.email}
                  onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                  variant="outlined"
                  placeholder="example@domain.com"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="المواد التي يدرسها"
                  fullWidth
                  value={teacherForm.subjects}
                  onChange={(e) => setTeacherForm({ ...teacherForm, subjects: e.target.value })}
                  variant="outlined"
                  helperText="يمكن كتابة أكثر من مادة مفصولة بفاصلة"
                  placeholder="رياضيات, فيزياء, كيمياء"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="كلمة مرور مؤقتة"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={teacherForm.password}
                  onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<PersonAddIcon />}
              sx={{ mt: 4, px: 4, py: 1.5, borderRadius: 3 }}
            >
              إضافة أستاذ
            </Button>
          </Box>
        )}

        {tab === 1 && (
          <Box component="form" onSubmit={handleStudentSubmit} sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
              📝 المعلومات الشخصية
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="الاسم الأول"
                  fullWidth
                  value={studentForm.firstName}
                  onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="اسم الأب"
                  fullWidth
                  value={studentForm.fatherName}
                  onChange={(e) => setStudentForm({ ...studentForm, fatherName: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="الكنية"
                  fullWidth
                  value={studentForm.lastName}
                  onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="رقم الهاتف"
                  fullWidth
                  value={studentForm.phoneNumber}
                  onChange={(e) => setStudentForm({ ...studentForm, phoneNumber: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="الدورة المسجل فيها"
                  fullWidth
                  value={studentForm.course}
                  onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}
                  variant="outlined"
                >
                  {courses.map((course) => (
                    <MenuItem key={course.value} value={course.value}>
                      {course.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#1976d2' }}>
              🎓 المعلومات الدراسية
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="الصف / الشعبة"
                  fullWidth
                  value={studentForm.classNumber}
                  onChange={(e) => setStudentForm({ ...studentForm, classNumber: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="مكان الدراسة السابق"
                  fullWidth
                  value={studentForm.previousSchool}
                  onChange={(e) => setStudentForm({ ...studentForm, previousSchool: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="المجموع في آخر سنة دراسية"
                  type="number"
                  fullWidth
                  value={studentForm.average}
                  onChange={(e) => setStudentForm({ ...studentForm, average: e.target.value })}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#1976d2' }}>
              🏥 معلومات إضافية
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="الحالة الصحية (اختياري)"
                  fullWidth
                  value={studentForm.health}
                  onChange={(e) => setStudentForm({ ...studentForm, health: e.target.value })}
                  variant="outlined"
                  placeholder="مثال: حساسية ضد البنسلين"
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="حالة الطالب"
                  fullWidth
                  value={studentForm.status}
                  onChange={(e) => setStudentForm({ ...studentForm, status: e.target.value })}
                  variant="outlined"
                >
                  {statuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: status.color }} />
                        {status.label}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<PersonAddIcon />}
              sx={{ mt: 4, px: 4, py: 1.5, borderRadius: 3 }}
            >
              إضافة طالب
            </Button>
          </Box>
        )}

        {tab === 2 && (
          <Box component="form" onSubmit={handleParentSubmit} sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="الاسم الثلاثي"
                  fullWidth
                  value={parentForm.name}
                  onChange={(e) => setParentForm({ ...parentForm, name: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="رقم الهاتف"
                  fullWidth
                  value={parentForm.phone}
                  onChange={(e) => setParentForm({ ...parentForm, phone: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="البريد الإلكتروني"
                  type="email"
                  fullWidth
                  value={parentForm.email}
                  onChange={(e) => setParentForm({ ...parentForm, email: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="كلمة مرور مؤقتة"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={parentForm.password}
                  onChange={(e) => setParentForm({ ...parentForm, password: e.target.value })}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<PersonAddIcon />}
              sx={{ mt: 4, px: 4, py: 1.5, borderRadius: 3 }}
            >
              إضافة ولي أمر
            </Button>
          </Box>
        )}
      </Paper>

      {credentials && (
        <Paper elevation={0} sx={{ mt: 4, p: 3, borderRadius: 3, bgcolor: '#e8f5e9' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAddIcon color="success" />
            بيانات اعتماد الطالب
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>اسم المستخدم</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>كلمة المرور</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>نسخ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{credentials.username}</TableCell>
                <TableCell>{credentials.password}</TableCell>
                <TableCell>
                  <Tooltip title="نسخ اسم المستخدم">
                    <IconButton onClick={() => handleCopyCredentials(credentials.username)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="نسخ كلمة المرور">
                    <IconButton onClick={() => handleCopyCredentials(credentials.password)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      )}

      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </Box>
  );
}

export default AddUser;