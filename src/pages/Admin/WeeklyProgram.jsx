import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AutoAwesome as AutoAwesomeIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  CalendarMonth as CalendarMonthIcon,
} from '@mui/icons-material';
import {
  getWeeklyProgram,
  getExamProgram,
  generateWeeklySchedule,
  generateExamSchedule,
  deleteWeeklyProgram,
  deleteExamProgram,
  getCourses,
  getRooms,
  getClasses,
} from '../../services/adminService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

function WeeklyProgram() {
  const [tab, setTab] = useState(0);
  const [scheduleList, setScheduleList] = useState([]);
  const [examList, setExamList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [scheduleRes, examRes, coursesRes, roomsRes, classesRes] = await Promise.all([
        getWeeklyProgram(),
        getExamProgram(),
        getCourses(),
        getRooms(),
        getClasses(),
      ]);
      setScheduleList(scheduleRes);
      setExamList(examRes);
      setCourses(coursesRes);
      setRooms(roomsRes);
      setClasses(classesRes);
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
      setToast({ open: true, message: 'فشل في جلب البيانات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateWeekly = async () => {
    setGenerating(true);
    try {
      const result = await generateWeeklySchedule();
      setToast({ open: true, message: '✅ تم توليد برنامج الدوام بنجاح!', severity: 'success' });
      fetchData(); 
    } catch (error) {
      setToast({ open: true, message: error.message || 'فشل في التوليد', severity: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateExam = async () => {
    setGenerating(true);
    try {
      const result = await generateExamSchedule();
      setToast({ open: true, message: '✅ تم توليد برنامج الامتحانات بنجاح!', severity: 'success' });
      fetchData();
    } catch (error) {
      setToast({ open: true, message: error.message || 'فشل في التوليد', severity: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  const handleScheduleDelete = async (id) => {
    if (window.confirm('⚠️ هل أنت متأكد من حذف هذه الجلسة؟')) {
      try {
        await deleteWeeklyProgram(id);
        setToast({ open: true, message: 'تم الحذف بنجاح', severity: 'success' });
        fetchData();
      } catch (error) {
        setToast({ open: true, message: error.message, severity: 'error' });
      }
    }
  };

  const handleExamDelete = async (id) => {
    if (window.confirm('⚠️ هل أنت متأكد من حذف هذا الامتحان؟')) {
      try {
        await deleteExamProgram(id);
        setToast({ open: true, message: 'تم الحذف بنجاح', severity: 'success' });
        fetchData();
      } catch (error) {
        setToast({ open: true, message: error.message, severity: 'error' });
      }
    }
  };

  const getRoomName = (id) => {
    const room = rooms.find(r => r.id === id);
    return room ? room.name : id;
  };

  const getClassName = (id) => {
    const classItem = classes.find(c => c.id === id);
    return classItem ? classItem.name : id;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل البيانات...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header موحد */}
      <PageHeader 
        title="البرنامج الأسبوعي"
        subtitle="إدارة جداول الدوام والامتحانات"
        icon={<CalendarMonthIcon sx={{ fontSize: 20 }} />}
      />

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <strong>📌 ملاحظة:</strong> عند الضغط على زر التوليد، سيتم إنشاء جدول تلقائي مع تجنب التعارضات.
      </Alert>

      <Tabs 
        value={tab} 
        onChange={(e, v) => setTab(v)} 
        sx={{ mb: 3 }} 
        centered
        TabIndicatorProps={{ sx: { bgcolor: '#1976d2' } }}
      >
        <Tab 
          label="📅 برنامج الدوام" 
          sx={{ '&.Mui-selected': { color: '#1976d2' } }}
        />
        <Tab 
          label="📝 برنامج الامتحان" 
          sx={{ '&.Mui-selected': { color: '#1976d2' } }}
        />
      </Tabs>

      {tab === 0 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box display="flex" justifyContent="flex-end" mb={3}>
            <Button
              variant="contained"
              startIcon={<AutoAwesomeIcon />}
              onClick={handleGenerateWeekly}
              disabled={generating}
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
              {generating ? 'جاري التوليد...' : '🔄 توليد برنامج تلقائي'}
            </Button>
          </Box>

          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>اليوم</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>الوقت</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>المادة</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>معرف الأستاذ</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>القاعة</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>الصف</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scheduleList.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell><Chip label={item.day} color="primary" size="small" /></TableCell>
                  <TableCell>{item.start_time} - {item.end_time}</TableCell>
                  <TableCell>{item.course?.name || item.course_id}</TableCell>
                  <TableCell>{item.teacher_id}</TableCell>
                  <TableCell>{getRoomName(item.room_id)}</TableCell>
                  <TableCell>{getClassName(item.class_id)}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleScheduleDelete(item.id)} color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {scheduleList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary">
                      لا توجد جلسات. اضغط على "توليد برنامج تلقائي" لإنشاء جدول
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      {tab === 1 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box display="flex" justifyContent="flex-end" mb={3}>
            <Button
              variant="contained"
              startIcon={<AutoAwesomeIcon />}
              onClick={handleGenerateExam}
              disabled={generating}
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
              {generating ? 'جاري التوليد...' : '🔄 توليد امتحانات تلقائي'}
            </Button>
          </Box>

          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>المادة</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>اليوم</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>الوقت</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>القاعة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {examList.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.course?.name || item.course_id}</TableCell>
                  <TableCell><Chip label={item.day} color="warning" size="small" /></TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.start_time} - {item.end_time}</TableCell>
                  <TableCell>{getRoomName(item.room_id)}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleExamDelete(item.id)} color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {examList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary">
                      لا توجد امتحانات. اضغط على "توليد امتحانات تلقائي" لإنشاء جدول
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
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

export default WeeklyProgram;