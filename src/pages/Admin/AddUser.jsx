import React, { useState, useEffect } from 'react';
import {
  Typography,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
  OutlinedInput,
  Select,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  PeopleAlt as PeopleAltIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ContentCopy as ContentCopyIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import Toast from '../../components/common/Toast';
import {
  getAllCourses,
  getAllStudents,
  getAvailableStudents,
  addTeacherViaAPI,
  addStudentViaAPI,
  addParentViaAPI,
} from '../../services/adminService';

function AddUser() {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [allCourses, setAllCourses] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [dataError, setDataError] = useState('');

  const [teacherForm, setTeacherForm] = useState({
    name: '',
    father_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    subjects: '',
    password: '',
    course_ids: [],
  });

  const [studentForm, setStudentForm] = useState({
    name: '',
    father_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    grade: '',
    past_education: '',
    last_years_mark: '',
    health_state: '',
    status: 'active',
    course_ids: [],
  });

  const [parentForm, setParentForm] = useState({
    name: '',
    father_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    password: '',
    student_ids: [],
  });

  const [credentials, setCredentials] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      setDataError('');
      
      const token = localStorage.getItem('token');
      console.log('========== بدء التشخيص ==========');
      console.log('1. التوكن موجود؟', !!token);
      console.log('2. الدور:', localStorage.getItem('role'));
      
      try {
        console.log('3. جلب المواد عبر fetch مباشر...');
        const fetchResponse = await fetch('http://127.0.0.1:8000/api/admin/courses', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        console.log('4. حالة الطلب المباشر:', fetchResponse.status);
        const fetchData = await fetchResponse.json();
        console.log('5. البيانات من الطلب المباشر:', fetchData);
        console.log('6. نوع البيانات:', typeof fetchData);
        console.log('7. هل هي مصفوفة؟', Array.isArray(fetchData));
        console.log('8. عدد العناصر:', Array.isArray(fetchData) ? fetchData.length : (fetchData.data?.length || 'غير معروف'));
        
        if (Array.isArray(fetchData) && fetchData.length > 0) {
          console.log('✅ المواد موجودة:', fetchData.map(c => c.name));
          setAllCourses(fetchData);
        } else if (fetchData.data && Array.isArray(fetchData.data) && fetchData.data.length > 0) {
          console.log('✅ المواد موجودة في data:', fetchData.data.map(c => c.name));
          setAllCourses(fetchData.data);
        } else {
          console.warn('⚠️ لا توجد مواد في الاستجابة');
        }
        
      } catch (error) {
        console.error('❌ خطأ في الطلب المباشر:', error);
      }
      
      try {
        console.log('9. جلب الطلاب المتاحين عبر الدالة...');
        const students = await getAvailableStudents();
        console.log('10. عدد الطلاب المتاحين:', students.length);
        setAllStudents(Array.isArray(students) ? students : []);
      } catch (error) {
        console.error('❌ خطأ في جلب الطلاب:', error);
      }
      try {
        console.log('11. جلب المواد عبر الدالة getAllCourses...');
        const coursesFromFunction = await getAllCourses();
        console.log('12. المواد من الدالة:', coursesFromFunction.length);
      } catch (error) {
        console.error('❌ خطأ في الدالة:', error);
      }
      
      console.log('========== انتهى التشخيص ==========');
      setLoadingData(false);
    };
    
    loadData();
  }, []);

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
    setCredentials(null);
    setActiveStep(0);
    setFormErrors({});
  };

  const generateCredentials = () => {
    const username = 'student_' + Math.floor(Math.random() * 10000);
    const password = Math.random().toString(36).slice(-8);
    return { username, password };
  };

  const handleCopyCredentials = (text) => {
    navigator.clipboard.writeText(text);
    setToast({ open: true, message: 'تم نسخ البيانات', severity: 'success' });
  };

  const handleNextStep = () => {
    let hasError = false;
    const newErrors = {};

    if (activeStep === 0) {
      if (!studentForm.name.trim()) {
        newErrors.name = 'اسم الطالب مطلوب';
        hasError = true;
      }
      if (!studentForm.father_name.trim()) {
        newErrors.father_name = 'اسم الأب مطلوب';
        hasError = true;
      }
      if (!studentForm.last_name.trim()) {
        newErrors.last_name = 'الكنية مطلوبة';
        hasError = true;
      }
      if (!studentForm.phone_number.trim()) {
        newErrors.phone_number = 'رقم الهاتف مطلوب';
        hasError = true;
      }
    }

    if (activeStep === 1) {
      if (!studentForm.grade.trim()) {
        newErrors.grade = 'الصف مطلوب';
        hasError = true;
      }
      if (!studentForm.past_education.trim()) {
        newErrors.past_education = 'مكان الدراسة السابق مطلوب';
        hasError = true;
      }
    }

    setFormErrors(newErrors);
    if (!hasError) {
      setActiveStep(activeStep + 1);
    } else {
      setToast({ open: true, message: 'يرجى إكمال جميع الحقول المطلوبة', severity: 'error' });
    }
  };

  const handlePrevStep = () => setActiveStep(activeStep - 1);

  const handleTeacherSubmit = async () => {
    if (
      !teacherForm.name.trim() ||
      !teacherForm.father_name.trim() ||
      !teacherForm.last_name.trim() ||
      !teacherForm.phone_number.trim() ||
      !teacherForm.email.trim()
    ) {
      setToast({ open: true, message: 'يرجى إكمال جميع الحقول المطلوبة', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      await addTeacherViaAPI({
        name: teacherForm.name,
        father_name: teacherForm.father_name,
        last_name: teacherForm.last_name,
        phone_number: teacherForm.phone_number,
        email: teacherForm.email,
        password: teacherForm.password || 'password123',
        subjects: teacherForm.subjects,
        course_ids: teacherForm.course_ids,
      });

      setToast({ open: true, message: '✅ تم إضافة الأستاذ بنجاح', severity: 'success' });
      setTeacherForm({
        name: '',
        father_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        subjects: '',
        password: '',
        course_ids: [],
      });
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.message || err.message || 'فشل في الإضافة',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = async () => {
    const errors = {};
    let hasError = false;
    if (!studentForm.name.trim()) {
      errors.name = 'مطلوب';
      hasError = true;
    }
    if (!studentForm.father_name.trim()) {
      errors.father_name = 'مطلوب';
      hasError = true;
    }
    if (!studentForm.last_name.trim()) {
      errors.last_name = 'مطلوب';
      hasError = true;
    }
    if (!studentForm.phone_number.trim()) {
      errors.phone_number = 'مطلوب';
      hasError = true;
    }
    if (!studentForm.grade.trim()) {
      errors.grade = 'مطلوب';
      hasError = true;
    }
    if (!studentForm.past_education.trim()) {
      errors.past_education = 'مطلوب';
      hasError = true;
    }

    if (hasError) {
      setFormErrors(errors);
      setToast({ open: true, message: 'يرجى إكمال جميع الحقول المطلوبة', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      const creds = generateCredentials();

      await addStudentViaAPI({
        name: studentForm.name,
        father_name: studentForm.father_name,
        last_name: studentForm.last_name,
        phone_number: studentForm.phone_number,
        email: studentForm.email || `${creds.username}@student.edu`,
        password: creds.password,
        grade: studentForm.grade,
        past_education: studentForm.past_education,
        last_years_mark: studentForm.last_years_mark ? parseFloat(studentForm.last_years_mark) : 0,
        health_state: studentForm.health_state || 'لا يوجد',
        status: studentForm.status,
        course_ids: studentForm.course_ids,
      });

      setCredentials(creds);
      setToast({ open: true, message: '✅ تم إضافة الطالب بنجاح', severity: 'success' });

      setStudentForm({
        name: '',
        father_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        grade: '',
        past_education: '',
        last_years_mark: '',
        health_state: '',
        status: 'active',
        course_ids: [],
      });
      setFormErrors({});
      setActiveStep(0);

      const updatedStudents = await getAllStudents();
      setAllStudents(updatedStudents);
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.message || err.message || 'فشل في الإضافة',
        severity: 'error',
      });
      setCredentials(null);
    } finally {
      setLoading(false);
    }
  };

  const handleParentSubmit = async () => {
    if (
      !parentForm.name.trim() ||
      !parentForm.father_name.trim() ||
      !parentForm.last_name.trim() ||
      !parentForm.phone_number.trim() ||
      !parentForm.email.trim()
    ) {
      setToast({ open: true, message: 'يرجى إكمال جميع الحقول المطلوبة', severity: 'error' });
      return;
    }
    if (parentForm.student_ids.length === 0) {
      setToast({ open: true, message: 'يرجى اختيار طالب واحد على الأقل', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      await addParentViaAPI({
        name: parentForm.name,
        father_name: parentForm.father_name,
        last_name: parentForm.last_name,
        phone_number: parentForm.phone_number,
        email: parentForm.email,
        password: parentForm.password || 'password123',
        student_ids: parentForm.student_ids,
      });

      setToast({ open: true, message: '✅ تم إضافة ولي الأمر بنجاح', severity: 'success' });
      setParentForm({
        name: '',
        father_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        password: '',
        student_ids: [],
      });
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.message || err.message || 'فشل في الإضافة',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const statuses = [
    { value: 'active', label: 'نشط' },
    { value: 'unactive', label: 'غير نشط' },
  ];

  const renderSelectedCourses = (selectedIds) => {
    if (!selectedIds?.length)
      return (
        <Typography variant="body2" color="text.secondary">
          لم يتم اختيار أي مادة
        </Typography>
      );
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selectedIds.map((id) => {
          const course = allCourses.find((c) => c.id === id);
          return <Chip key={id} label={course?.name || `مادة ${id}`} size="small" />;
        })}
      </Box>
    );
  };

  const renderSelectedStudents = (selectedIds) => {
    if (!selectedIds?.length)
      return (
        <Typography variant="body2" color="text.secondary">
          لم يتم اختيار أي طالب
        </Typography>
      );
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selectedIds.map((id) => {
          const student = allStudents.find((s) => s.id === id);
          return <Chip key={id} label={student?.name || `طالب ${id}`} size="small" />;
        })}
      </Box>
    );
  };

  if (loadingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" flexDirection="column">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>جاري تحميل البيانات...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f7fb', minHeight: '100vh', py: 4 }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: '#e3f2fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PersonAddIcon sx={{ fontSize: 28, color: '#42a5f5' }} />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: '#42a5f5',
                  fontSize: '1.3rem',
                }}
              >
                إضافة مستخدم
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mt: 0.5, fontSize: '0.75rem' }}>
                أضف أساتذة، طلاب، أو أولياء أمور إلى النظام
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mt: 2 }} />
        </Box>

        {dataError && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            {dataError}
          </Alert>
        )}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: '#e0e0e0',
            bgcolor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <Box sx={{ borderBottom: '1px solid #e0e0e0', bgcolor: '#f8fafc' }}>
            <Tabs
              value={tab}
              onChange={handleChangeTab}
              sx={{
                '& .MuiTab-root': {
                  py: 2.5,
                  px: 4,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  minHeight: 'auto',
                  color: '#666',
                  transition: 'all 0.3s',
                  '&.Mui-selected': {
                    color: '#1976d2',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#1976d2',
                  height: 3,
                },
              }}
            >
              <Tab icon={<SchoolIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="أستاذ" />
              <Tab icon={<PersonIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="طالب" />
              <Tab icon={<PeopleAltIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="ولي أمر" />
            </Tabs>
          </Box>

          {tab === 0 && (
            <Box sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#1976d2',
                      mb: 2,
                      borderRight: '3px solid #1976d2',
                      pr: 1.5,
                    }}
                  >
                    المعلومات الشخصية
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="الاسم "
                        fullWidth
                        required
                        size="small"
                        value={teacherForm.name}
                        onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="اسم الأب"
                        fullWidth
                        required
                        size="small"
                        value={teacherForm.father_name}
                        onChange={(e) =>
                          setTeacherForm({ ...teacherForm, father_name: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="الكنية"
                        fullWidth
                        required
                        size="small"
                        value={teacherForm.last_name}
                        onChange={(e) =>
                          setTeacherForm({ ...teacherForm, last_name: e.target.value })
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#1976d2',
                      mb: 2,
                      borderRight: '3px solid #1976d2',
                      pr: 1.5,
                    }}
                  >
                    معلومات التواصل
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="رقم الهاتف"
                        fullWidth
                        required
                        size="small"
                        value={teacherForm.phone_number}
                        onChange={(e) =>
                          setTeacherForm({ ...teacherForm, phone_number: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="البريد الإلكتروني"
                        type="email"
                        fullWidth
                        required
                        size="small"
                        value={teacherForm.email}
                        onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#1976d2',
                      mb: 2,
                      borderRight: '3px solid #1976d2',
                      pr: 1.5,
                    }}
                  >
                    المعلومات الأكاديمية
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>المواد التي يدرسها</InputLabel>
                        <Select
                          multiple
                          value={teacherForm.course_ids}
                          onChange={(e) =>
                            setTeacherForm({ ...teacherForm, course_ids: e.target.value })
                          }
                          input={<OutlinedInput label="المواد التي يدرسها" />}
                          renderValue={renderSelectedCourses}
                        >
                          {allCourses.length === 0 ? (
                            <MenuItem disabled>لا توجد مواد متاحة</MenuItem>
                          ) : (
                            allCourses.map((course) => (
                              <MenuItem key={course.id} value={course.id}>
                                {course.name}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="كلمة مرور مؤقتة"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        size="small"
                        value={teacherForm.password}
                        onChange={(e) =>
                          setTeacherForm({ ...teacherForm, password: e.target.value })
                        }
                        helperText="اتركه فارغاً لإنشاء كلمة مرور عشوائية"
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Button
                onClick={handleTeacherSubmit}
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 4,
                  px: 5,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: '#1976d2',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#1565c0' },
                }}
                startIcon={loading ? <CircularProgress size={18} /> : <PersonAddIcon />}
              >
                {loading ? 'جاري الإضافة...' : 'إضافة أستاذ جديد'}
              </Button>
            </Box>
          )}

          {tab === 1 && (
            <Box sx={{ p: 4 }}>
              <Box
                sx={{
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  borderBottom: '1px solid #e0e0e0',
                  pb: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: activeStep >= 0 ? '#1976d2' : '#e0e0e0',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                    }}
                  >
                    1
                  </Box>
                  <Typography sx={{ fontSize: '0.875rem', color: activeStep >= 0 ? '#1976d2' : '#999' }}>
                    المعلومات الشخصية
                  </Typography>
                </Box>
                <Typography sx={{ color: '#ccc' }}>—</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: activeStep >= 1 ? '#1976d2' : '#e0e0e0',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                    }}
                  >
                    2
                  </Box>
                  <Typography sx={{ fontSize: '0.875rem', color: activeStep >= 1 ? '#1976d2' : '#999' }}>
                    المعلومات الدراسية
                  </Typography>
                </Box>
                <Typography sx={{ color: '#ccc' }}>—</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: activeStep >= 2 ? '#1976d2' : '#e0e0e0',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                    }}
                  >
                    3
                  </Box>
                  <Typography sx={{ fontSize: '0.875rem', color: activeStep >= 2 ? '#1976d2' : '#999' }}>
                    معلومات إضافية
                  </Typography>
                </Box>
              </Box>

              {activeStep === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography
                      sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1976d2', mb: 2 }}
                    >
                       المعلومات الشخصية
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="اسم الطالب"
                          fullWidth
                          required
                          size="small"
                          value={studentForm.name}
                          onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                          error={!!formErrors.name}
                          helperText={formErrors.name}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="اسم الأب"
                          fullWidth
                          required
                          size="small"
                          value={studentForm.father_name}
                          onChange={(e) =>
                            setStudentForm({ ...studentForm, father_name: e.target.value })
                          }
                          error={!!formErrors.father_name}
                          helperText={formErrors.father_name}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="الكنية"
                          fullWidth
                          required
                          size="small"
                          value={studentForm.last_name}
                          onChange={(e) =>
                            setStudentForm({ ...studentForm, last_name: e.target.value })
                          }
                          error={!!formErrors.last_name}
                          helperText={formErrors.last_name}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="رقم الهاتف"
                          fullWidth
                          required
                          size="small"
                          value={studentForm.phone_number}
                          onChange={(e) =>
                            setStudentForm({ ...studentForm, phone_number: e.target.value })
                          }
                          error={!!formErrors.phone_number}
                          helperText={formErrors.phone_number}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth size="small">
                          <InputLabel>المواد المسجل فيها</InputLabel>
                          <Select
                            multiple
                            value={studentForm.course_ids}
                            onChange={(e) =>
                              setStudentForm({ ...studentForm, course_ids: e.target.value })
                            }
                            input={<OutlinedInput label="المواد المسجل فيها" />}
                            renderValue={renderSelectedCourses}
                          >
                            {allCourses.length === 0 ? (
                              <MenuItem disabled>لا توجد مواد متاحة</MenuItem>
                            ) : (
                              allCourses.map((course) => (
                                <MenuItem key={course.id} value={course.id}>
                                  {course.name}
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="البريد الإلكتروني"
                          type="email"
                          fullWidth
                          size="small"
                          value={studentForm.email}
                          onChange={(e) =>
                            setStudentForm({ ...studentForm, email: e.target.value })
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {activeStep === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography
                      sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1976d2', mb: 2 }}
                    >
                       المعلومات الدراسية
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="الصف "
                          fullWidth
                          required
                          size="small"
                          value={studentForm.grade}
                          onChange={(e) =>
                            setStudentForm({ ...studentForm, grade: e.target.value })
                          }
                          error={!!formErrors.grade}
                          helperText={formErrors.grade}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="مكان الدراسة السابق"
                          fullWidth
                          required
                          size="small"
                          value={studentForm.past_education}
                          onChange={(e) =>
                            setStudentForm({ ...studentForm, past_education: e.target.value })
                          }
                          error={!!formErrors.past_education}
                          helperText={formErrors.past_education}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="المجموع في آخر سنة دراسية"
                          type="number"
                          fullWidth
                          size="small"
                          value={studentForm.last_years_mark}
                          onChange={(e) =>
                            setStudentForm({ ...studentForm, last_years_mark: e.target.value })
                          }
                          helperText="من 0 إلى 100"
                          inputProps={{ min: 0, max: 100, step: 0.5 }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {activeStep === 2 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography
                      sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1976d2', mb: 2 }}
                    >
                       معلومات إضافية
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="الحالة الصحية"
                          fullWidth
                          size="small"
                          value={studentForm.health_state}
                          onChange={(e) =>
                            setStudentForm({ ...studentForm, health_state: e.target.value })
                          }
                          placeholder="لا يوجد"
                          multiline
                          rows={2}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          select
                          label="حالة الطالب"
                          fullWidth
                          required
                          size="small"
                          value={studentForm.status}
                          onChange={(e) =>
                            setStudentForm({ ...studentForm, status: e.target.value })
                          }
                        >
                          {statuses.map((status) => (
                            <MenuItem key={status.value} value={status.value}>
                              {status.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              <Box display="flex" justifyContent="space-between" sx={{ mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handlePrevStep}
                  variant="outlined"
                  size="medium"
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  السابق
                </Button>
                {activeStep === 2 ? (
                  <Button
                    onClick={handleStudentSubmit}
                    variant="contained"
                    disabled={loading}
                    size="medium"
                    sx={{ bgcolor: '#1976d2', textTransform: 'none', borderRadius: 2 }}
                  >
                    {loading ? <CircularProgress size={20} /> : 'إضافة طالب'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextStep}
                    variant="contained"
                    size="medium"
                    sx={{ bgcolor: '#1976d2', textTransform: 'none', borderRadius: 2 }}
                  >
                    التالي
                  </Button>
                )}
              </Box>
            </Box>
          )}

          {tab === 2 && (
            <Box sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#1976d2',
                      mb: 2,
                      borderRight: '3px solid #1976d2',
                      pr: 1.5,
                    }}
                  >
                    المعلومات الشخصية
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="الاسم "
                        fullWidth
                        required
                        size="small"
                        value={parentForm.name}
                        onChange={(e) => setParentForm({ ...parentForm, name: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="اسم الأب"
                        fullWidth
                        required
                        size="small"
                        value={parentForm.father_name}
                        onChange={(e) =>
                          setParentForm({ ...parentForm, father_name: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="الكنية"
                        fullWidth
                        required
                        size="small"
                        value={parentForm.last_name}
                        onChange={(e) =>
                          setParentForm({ ...parentForm, last_name: e.target.value })
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#1976d2',
                      mb: 2,
                      borderRight: '3px solid #1976d2',
                      pr: 1.5,
                    }}
                  >
                    معلومات التواصل 
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="رقم الهاتف"
                        fullWidth
                        required
                        size="small"
                        value={parentForm.phone_number}
                        onChange={(e) =>
                          setParentForm({ ...parentForm, phone_number: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="البريد الإلكتروني"
                        type="email"
                        fullWidth
                        required
                        size="small"
                        value={parentForm.email}
                        onChange={(e) => setParentForm({ ...parentForm, email: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>الأبناء (اختر طالباً أو أكثر)</InputLabel>
                        <Select
                          multiple
                          value={parentForm.student_ids}
                          onChange={(e) =>
                            setParentForm({ ...parentForm, student_ids: e.target.value })
                          }
                          input={<OutlinedInput label="الأبناء" />}
                          renderValue={renderSelectedStudents}
                        >
                          {allStudents.length === 0 ? (
                            <MenuItem disabled>⚠️ لا يوجد طلاب متاحين</MenuItem>
                          ) : (
                            allStudents.map((student) => (
                              <MenuItem key={student.id} value={student.id}>
                                {student.name}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="كلمة مرور مؤقتة"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        size="small"
                        value={parentForm.password}
                        onChange={(e) =>
                          setParentForm({ ...parentForm, password: e.target.value })
                        }
                        helperText="اتركه فارغاً لإنشاء كلمة مرور عشوائية"
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Button
                onClick={handleParentSubmit}
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 4,
                  px: 5,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: '#1976d2',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#1565c0' },
                }}
                startIcon={loading ? <CircularProgress size={18} /> : <PersonAddIcon />}
              >
                {loading ? 'جاري الإضافة...' : 'إضافة ولي أمر جديد'}
              </Button>
            </Box>
          )}
        </Paper>

        {credentials && (
          <Paper
            elevation={0}
            sx={{ mt: 4, p: 3, borderRadius: 3, border: '1px solid #4caf50', bgcolor: '#f1f8e9' }}
          >
            <Typography
              variant="subtitle1"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#2e7d32', mb: 2 }}
            >
              <CheckCircleIcon /> تم إنشاء حساب الطالب بنجاح
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <Typography variant="caption" color="text.secondary">
                  اسم المستخدم:
                </Typography>
                <Typography sx={{ fontFamily: 'monospace' }}>{credentials.username}</Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography variant="caption" color="text.secondary">
                  كلمة المرور:
                </Typography>
                <Typography sx={{ fontFamily: 'monospace' }}>{credentials.password}</Typography>
              </Grid>
              <Grid item xs={12} md={2}>
                <Tooltip title="نسخ اسم المستخدم">
                  <IconButton onClick={() => handleCopyCredentials(credentials.username)}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="نسخ كلمة المرور">
                  <IconButton onClick={() => handleCopyCredentials(credentials.password)}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Toast
          open={toast.open}
          onClose={() => setToast({ ...toast, open: false })}
          message={toast.message}
          severity={toast.severity}
        />
      </Box>
    </Box>
  );
}

export default AddUser;