// src/pages/Admin/WeeklyProgram.jsx
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

  // جلب البيانات
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

  // توليد برنامج دوام تلقائي
  const handleGenerateWeekly = async () => {
    setGenerating(true);
    try {
      const result = await generateWeeklySchedule();
      setToast({ open: true, message: '✅ تم توليد برنامج الدوام بنجاح!', severity: 'success' });
      fetchData(); // تحديث الجدول
    } catch (error) {
      setToast({ open: true, message: error.message || 'فشل في التوليد', severity: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  // توليد برنامج امتحانات تلقائي
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

  // حذف جلسة دوام
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

  // حذف امتحان
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

  // جلب اسم القاعة
  const getRoomName = (id) => {
    const room = rooms.find(r => r.id === id);
    return room ? room.name : id;
  };

  // جلب اسم الصف
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
      <Typography variant="h4" gutterBottom>
        📅 البرنامج الأسبوعي
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>📌 آلية العمل:</strong>
        <ul style={{ margin: '8px 0 0 20px' }}>
          <li>يمكنك <strong>توليد برنامج تلقائي</strong> بالضغط على زر "توليد برنامج"</li>
          <li>النظام سيوزع المواد على أيام الأسبوع (الأحد - الخميس) من 8 صباحاً إلى 3 ظهراً</li>
          <li>سيتم تجنب التعارضات بحيث لا يكون للطالب مادتان في نفس الوقت</li>
          <li>برنامج الدوام: يرسل للأستاذ والطالب</li>
          <li>برنامج الامتحان: يرسل للطالب فقط</li>
        </ul>
      </Alert>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }} centered>
        <Tab label="📅 برنامج الدوام" />
        <Tab label="📝 برنامج الامتحان" />
      </Tabs>

      {/* ========== تبويب برنامج الدوام ========== */}
      {tab === 0 && (
        <Paper sx={{ p: 2 }}>
          <Box display="flex" justifyContent="flex-end" mb={2} gap={2}>
            <Button
              variant="contained"
              startIcon={<AutoAwesomeIcon />}
              onClick={handleGenerateWeekly}
              disabled={generating}
              color="secondary"
            >
              {generating ? 'جاري التوليد...' : '🔄 توليد برنامج تلقائي'}
            </Button>
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>اليوم</TableCell>
                <TableCell>الوقت</TableCell>
                <TableCell>المادة</TableCell>
                <TableCell>معرف الأستاذ</TableCell>
                <TableCell>القاعة</TableCell>
                <TableCell>الصف</TableCell>
                <TableCell align="center">إجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scheduleList.map((item) => (
                <TableRow key={item.id}>
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

      {/* ========== تبويب برنامج الامتحان ========== */}
      {tab === 1 && (
        <Paper sx={{ p: 2 }}>
          <Box display="flex" justifyContent="flex-end" mb={2} gap={2}>
            <Button
              variant="contained"
              startIcon={<AutoAwesomeIcon />}
              onClick={handleGenerateExam}
              disabled={generating}
              color="secondary"
            >
              {generating ? 'جاري التوليد...' : '🔄 توليد امتحانات تلقائي'}
            </Button>
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>المادة</TableCell>
                <TableCell>اليوم</TableCell>
                <TableCell>التاريخ</TableCell>
                <TableCell>الوقت</TableCell>
                <TableCell>القاعة</TableCell>
                <TableCell align="center">إجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {examList.map((item) => (
                <TableRow key={item.id}>
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