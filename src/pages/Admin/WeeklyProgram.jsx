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

  const dayOrder = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس' ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [scheduleRes, examRes, coursesRes, roomsRes] = await Promise.all([
        getWeeklyProgram(),
        getExamProgram(),
        getCourses(),
        getRooms(),
      ]);
      
      console.log('جدول الدوام:', scheduleRes);
      console.log( 'جدول الامتحانات:', examRes );
      
      let formattedSchedule = [];
      if (scheduleRes && scheduleRes.master_grid) {
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
                course_name: slot.course_name,
                hall_name: slot.halls && slot.halls.length > 0 ? slot.halls[0] : 'غير محدد',
              });
            }
          });
        });
      } else if (scheduleRes && scheduleRes.sessions) {
        formattedSchedule = scheduleRes.sessions.map(session => ({
          id: session.id,
          day: daysMap[session.day] || session.day,
          start_time: session.start_time,
          end_time: session.end_time,
          course_name: session.course?.name,
          hall_name: session.hall?.name,
        }));
      } else if (Array.isArray(scheduleRes)) {
        formattedSchedule = scheduleRes.map(item => ({
          id: item.id,
          day: daysMap[item.day] || item.day,
          start_time: item.start_time,
          end_time: item.end_time,
          course_name: item.course?.name || item.course_name,
          hall_name: item.hall?.name || item.hall_name,
        }));
      }
      
      let formattedExams = [];
      if (examRes && examRes.master_grid) {
        const examGrid = examRes.master_grid;
        Object.keys(examGrid).forEach(day => {
          const timeSlots = examGrid[day];
          Object.keys(timeSlots).forEach(time => {
            const slot = timeSlots[time];
            if (slot.status === 'Occupied') {
              formattedExams.push({
                id: slot.session_id,
                day: daysMap[day] || day,
                start_time: slot.start_time,
                end_time: slot.end_time,
                course_name: slot.course_name,
                hall_name: slot.halls && slot.halls.length > 0 ? slot.halls[0] : 'غير محدد',
              });
            }
          });
        });
      } else if (examRes && examRes.sessions) {
        formattedExams = examRes.sessions.map(session => ({
          id: session.id,
          day: daysMap[session.day] || session.day,
          start_time: session.start_time,
          end_time: session.end_time,
          course_name: session.course?.name,
          hall_name: session.hall?.name,
        }));
      } else if (Array.isArray(examRes)) {
        formattedExams = examRes.map(item => ({
          id: item.id,
          day: daysMap[item.day] || item.day,
          start_time: item.start_time,
          end_time: item.end_time,
          course_name: item.course?.name || item.course_name,
          hall_name: item.hall?.name || item.hall_name,
        }));
      }
      
      const sortByDay = (list) => {
        return list.sort((a, b) => {
          return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
        });
      };
      const sortByTime = (list) => {
        return list.sort((a, b) => {
          return (a.start_time || '').localeCompare(b.start_time || '');
        });
      };
      
      setScheduleList(sortByTime(sortByDay(formattedSchedule)));
      setExamList(sortByTime(sortByDay(formattedExams)));
      setCourses(coursesRes);
      setRooms(roomsRes);
      
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
      await generateWeeklySchedule();
      setToast({ open: true, message: 'تم توليد برنامج الدوام بنجاح!', severity: 'success' });
      await fetchData();
    } catch (error) {
      setToast({ open: true, message: error.response?.data?.message || 'فشل في التوليد', severity: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateExam = async () => {
    setGenerating(true);
    try {
      await generateExamSchedule();
      setToast({ open: true, message: 'تم توليد برنامج الامتحانات بنجاح!', severity: 'success' });
      await fetchData();
    } catch (error) {
      setToast({ open: true, message: error.response?.data?.message || 'فشل في التوليد', severity: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  const handleScheduleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الجلسة؟')) {
      try {
        await deleteWeeklyProgram(id);
        setToast({ open: true, message: 'تم الحذف بنجاح', severity: 'success' });
        await fetchData();
      } catch (error) {
        setToast({ open: true, message: 'فشل في الحذف', severity: 'error' });
      }
    }
  };

  const handleExamDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الامتحان؟')) {
      try {
        await deleteExamProgram(id);
        setToast({ open: true, message: 'تم الحذف بنجاح', severity: 'success' });
        await fetchData();
      } catch (error) {
        setToast({ open: true, message: 'فشل في الحذف', severity: 'error' });
      }
    }
  };

  const groupByDay = (list) => {
    const grouped = {};
    dayOrder.forEach(day => { grouped[day] = []; });
    list.forEach(item => {
      if (grouped[item.day]) {
        grouped[item.day].push(item);
      } else {
        grouped[item.day] = [item];
      }
    });
    return grouped;
  };

  const groupedSchedule = groupByDay(scheduleList);
  const groupedExams = groupByDay(examList);

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
         ملاحظة: عند الضغط على زر التوليد، سيتم إنشاء جدول تلقائي مع تجنب التعارضات.
      </Alert>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }} centered>
        <Tab label="جدول الدوام" />
        <Tab label="جدول الامتحانات" />
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
                bgcolor: '#1976d2',
                '&:hover': { bgcolor: '#1565c0' },
              }}
            >
              {generating ? 'جاري التوليد...' : 'توليد برنامج تلقائي'}
            </Button>
          </Box>

          {scheduleList.length === 0 ? (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              لا توجد جلسات في جدول الدوام. اضغط على "توليد برنامج تلقائي" لإنشاء جدول.
            </Alert>
          ) : (
            <Box>
              {dayOrder.map(day => {
                const sessions = groupedSchedule[day] || [];
                if (sessions.length === 0) return null;
                
                return (
                  <Box key={day} sx={{ mb: 4 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        bgcolor: '#e3f2fd', 
                        p: 1.5, 
                        borderRadius: 2, 
                        mb: 2,
                        fontWeight: 'bold',
                        color: '#1565c0'
                      }}
                    >
                       {day} ({sessions.length} مواد)
                    </Typography>
                    
                    <Table sx={{ minWidth: 600 }}>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                          <TableCell sx={{ fontWeight: 'bold' }}>الوقت</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>المادة</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>القاعة</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold' }}>إجراءات</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sessions.map((item) => (
                          <TableRow key={item.id} hover>
                            <TableCell>
                              {item.start_time?.substring(0, 5) || item.start_time} - {item.end_time?.substring(0, 5) || item.end_time}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={item.course_name || 'غير محدد'} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{item.hall_name || 'غير محدد'}</TableCell>
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
                  </Box>
                );
              })}
            </Box>
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
                bgcolor: '#1976d2',
                '&:hover': { bgcolor: '#1565c0' },
              }}
            >
              {generating ? 'جاري التوليد...' : 'توليد امتحانات تلقائي'}
            </Button>
          </Box>

          {examList.length === 0 ? (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              لا توجد امتحانات في الجدول. اضغط على "توليد امتحانات تلقائي" لإنشاء جدول.
            </Alert>
          ) : (
            <Box>
              {dayOrder.map(day => {
                const exams = groupedExams[day] || [];
                if (exams.length === 0) return null;
                
                return (
                  <Box key={day} sx={{ mb: 4 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        bgcolor: '#fff3e0', 
                        p: 1.5, 
                        borderRadius: 2, 
                        mb: 2,
                        fontWeight: 'bold',
                        color: '#ed6c02'
                      }}
                    >
                       {day} ({exams.length} امتحانات)
                    </Typography>
                    
                    <Table sx={{ minWidth: 600 }}>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                          <TableCell sx={{ fontWeight: 'bold' }}>الوقت</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>المادة</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>القاعة</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold' }}>إجراءات</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {exams.map((item) => (
                          <TableRow key={item.id} hover>
                            <TableCell>
                              {item.start_time?.substring(0, 5) || item.start_time} - {item.end_time?.substring(0, 5) || item.end_time}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={item.course_name || 'غير محدد'} 
                                size="small" 
                                color="warning" 
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{item.hall_name || 'غير محدد'}</TableCell>
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
                  </Box>
                );
              })}
            </Box>
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