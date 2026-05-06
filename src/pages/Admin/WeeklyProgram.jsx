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
  IconButton,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  AutoAwesome as AutoAwesomeIcon,
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

  const daysMap = {
    'Sunday': 'الأحد',
    'Monday': 'الإثنين',
    'Tuesday': 'الثلاثاء',
    'Wednesday': 'الأربعاء',
    'Thursday': 'الخميس'
  };

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
      
      console.log(' رد API لجدول الدوام (كامل):', scheduleRes);
      console.log(' رد API لجدول الامتحانات (كامل):', examRes);
      
      let formattedSchedule = [];
      
      if (scheduleRes && scheduleRes.master_grid) {
        console.log(' باستخدام master_grid للدوام');
        const masterGrid = scheduleRes.master_grid;
        
        Object.keys(masterGrid).forEach(day => {
          const timeSlots = masterGrid[day];
          Object.keys(timeSlots).forEach(time => {
            const slot = timeSlots[time];
            if (slot.status === 'Occupied') {
              formattedSchedule.push({
                id: slot.session_id,
                day: daysMap[day] || day,
                start_time: slot.start_time,
                end_time: slot.end_time,
                course: { name: slot.course_name },
                course_name: slot.course_name,
                hall_name: slot.halls && slot.halls.length > 0 ? slot.halls[0] : 'غير محدد',
              });
            }
          });
        });
      } 
      else if (Array.isArray(scheduleRes)) {
        console.log(' باستخدام المصفوفة للدوام');
        formattedSchedule = scheduleRes.map(item => ({
          ...item,
          day: daysMap[item.day] || item.day,
          course_name: item.course?.name || item.course_name,
          hall_name: item.room_name || item.hall_name || item.room_id,
        }));
      }
      else if (scheduleRes && scheduleRes.sessions) {
        console.log(' باستخدام sessions للدوام');
        formattedSchedule = scheduleRes.sessions.map(session => ({
          id: session.id,
          day: daysMap[session.day] || session.day,
          start_time: session.start_time,
          end_time: session.end_time,
          course: session.course,
          course_name: session.course?.name,
          hall_name: session.hall?.name || session.hall_name,
        }));
      }
      
      console.log('جدول الدوام بعد التنسيق:', formattedSchedule);
      let formattedExams = [];
      
      if (examRes && examRes.master_grid) {
        console.log(' باستخدام master_grid للامتحانات');
        const examGrid = examRes.master_grid;
        
        Object.keys(examGrid).forEach(day => {
          const timeSlots = examGrid[day];
          Object.keys(timeSlots).forEach(time => {
            const slot = timeSlots[time];
            if (slot.status === 'Occupied') {
              formattedExams.push({
                id: slot.session_id,
                course: { name: slot.course_name },
                course_name: slot.course_name,
                day: daysMap[day] || day,
                start_time: slot.start_time,
                end_time: slot.end_time,
                hall_name: slot.halls && slot.halls.length > 0 ? slot.halls.join(', ') : 'غير محدد',
              });
            }
          });
        });
      } 
      else if (Array.isArray(examRes)) {
        console.log(' باستخدام المصفوفة للامتحانات');
        formattedExams = examRes.map(item => ({
          ...item,
          day: daysMap[item.day] || item.day,
          course_name: item.course?.name || item.course_name,
          hall_name: item.room_name || item.hall_name,
        }));
      }
      else if (examRes && examRes.sessions) {
        console.log(' باستخدام sessions للامتحانات');
        formattedExams = examRes.sessions.map(session => ({
          id: session.id,
          course: session.course,
          course_name: session.course?.name,
          day: daysMap[session.day] || session.day,
          start_time: session.start_time,
          end_time: session.end_time,
          hall_name: session.hall?.name,
        }));
      }
      
      console.log(' جدول الامتحانات بعد التنسيق:', formattedExams);
      
      setScheduleList(formattedSchedule);
      setExamList(formattedExams);
      setCourses(coursesRes);
      setRooms(roomsRes);
      setClasses(classesRes);
      
      if (formattedSchedule.length === 0 && formattedExams.length === 0) {
        console.log('⚠️ لا توجد بيانات في الجداول');
      }
      
    } catch (error) {
      console.error('❌ خطأ في جلب البيانات:', error);
      setToast({ open: true, message: 'فشل في جلب البيانات: ' + (error.response?.data?.message || error.message), severity: 'error' });
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
      console.log('✅ نتيجة توليد جدول الدوام:', result);
      setToast({ open: true, message: '✅ تم توليد برنامج الدوام بنجاح!', severity: 'success' });
      await fetchData();
    } catch (error) {
      console.error('❌ فشل في التوليد:', error);
      setToast({ 
        open: true, 
        message: error.response?.data?.message || error.message || 'فشل في التوليد', 
        severity: 'error' 
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateExam = async () => {
    setGenerating(true);
    try {
      const result = await generateExamSchedule();
      console.log('✅ نتيجة توليد جدول الامتحانات:', result);
      setToast({ open: true, message: '✅ تم توليد برنامج الامتحانات بنجاح!', severity: 'success' });
      await fetchData();
    } catch (error) {
      console.error('❌ فشل في التوليد:', error);
      setToast({ 
        open: true, 
        message: error.response?.data?.message || error.message || 'فشل في التوليد', 
        severity: 'error' 
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleScheduleDelete = async (id) => {
    if (window.confirm('⚠️ هل أنت متأكد من حذف هذه الجلسة؟')) {
      try {
        await deleteWeeklyProgram(id);
        setToast({ open: true, message: 'تم الحذف بنجاح', severity: 'success' });
        await fetchData();
      } catch (error) {
        console.error('❌ فشل في الحذف:', error);
        setToast({ open: true, message: error.response?.data?.message || error.message || 'فشل في الحذف', severity: 'error' });
      }
    }
  };

  const handleExamDelete = async (id) => {
    if (window.confirm('⚠️ هل أنت متأكد من حذف هذا الامتحان؟')) {
      try {
        await deleteExamProgram(id);
        setToast({ open: true, message: 'تم الحذف بنجاح', severity: 'success' });
        await fetchData();
      } catch (error) {
        console.error('❌ فشل في الحذف:', error);
        setToast({ open: true, message: error.response?.data?.message || error.message || 'فشل في الحذف', severity: 'error' });
      }
    }
  };

  const getRoomName = (id) => {
    if (!id) return 'غير محدد';
    const room = rooms.find(r => r.id === id);
    return room ? room.name : id;
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
          label=" برنامج الدوام" 
          sx={{ '&.Mui-selected': { color: '#1976d2' } }}
        />
        <Tab 
          label=" برنامج الامتحان" 
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

          {scheduleList.length === 0 ? (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              لا توجد جلسات في جدول الدوام. اضغط على "توليد برنامج تلقائي" لإنشاء جدول.
            </Alert>
          ) : (
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>اليوم</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الوقت</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>المادة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>القاعة</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scheduleList.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Chip label={item.day} color="primary" size="small" />
                    </TableCell>
                    <TableCell>
                      {item.start_time?.substring(0, 5) || item.start_time} - {item.end_time?.substring(0, 5) || item.end_time}
                    </TableCell>
                    <TableCell>{item.course_name || item.course?.name || 'غير محدد'}</TableCell>
                    <TableCell>{item.hall_name || getRoomName(item.room_id)}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        onClick={() => handleScheduleDelete(item.id)} 
                        color="error" 
                        size="small"
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

          {examList.length === 0 ? (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              لا توجد امتحانات في الجدول. اضغط على "توليد امتحانات تلقائي" لإنشاء جدول.
            </Alert>
          ) : (
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>المادة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>اليوم</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الوقت</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>القاعة</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {examList.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.course_name || item.course?.name || 'غير محدد'}</TableCell>
                    <TableCell>
                      <Chip label={item.day} color="warning" size="small" />
                    </TableCell>
                    <TableCell>
                      {item.start_time?.substring(0, 5) || item.start_time} - {item.end_time?.substring(0, 5) || item.end_time}
                    </TableCell>
                    <TableCell>{item.hall_name || getRoomName(item.room_id)}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        onClick={() => handleExamDelete(item.id)} 
                        color="error" 
                        size="small"
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