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
  Alert,
  CircularProgress,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Badge,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  AutoAwesome as AutoAwesomeIcon,
  CalendarMonth as CalendarMonthIcon,
  MeetingRoom as MeetingRoomIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
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
  const [capacityError, setCapacityError] = useState(null);
  const [adminAlerts, setAdminAlerts] = useState([]);
  const [showAlertsDialog, setShowAlertsDialog] = useState(false);

  const daysMap = {
    'Sunday': 'الأحد',
    'Monday': 'الإثنين',
    'Tuesday': 'الثلاثاء',
    'Wednesday': 'الأربعاء',
    'Thursday': 'الخميس'
  };

  const dayOrder = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

  const checkCapacity = (scheduleData, roomsData) => {
    if (!scheduleData || !scheduleData.master_grid) return null;
    
    const masterGrid = scheduleData.master_grid;
    const capacityIssues = [];
    
    Object.keys(masterGrid).forEach(day => {
      const timeSlots = masterGrid[day];
      Object.keys(timeSlots).forEach(time => {
        const slot = timeSlots[time];
        if (slot.status === 'Occupied' && slot.course_id) {
          const course = courses.find(c => c.id === slot.course_id);
          const hallName = slot.halls && slot.halls.length > 0 ? slot.halls[0] : null;
          const room = roomsData.find(r => r.name === hallName);
          
          if (course && room && course.capacity > room.capacity) {
            capacityIssues.push({
              day: daysMap[day] || day,
              time: slot.start_time,
              course_name: slot.course_name,
              hall_name: hallName,
              course_capacity: course.capacity,
              hall_capacity: room.capacity,
            });
          }
        }
      });
    });
    
    return capacityIssues.length > 0 ? capacityIssues : null;
  };

  const checkExamCapacity = (examData, roomsData, coursesData) => {
    if (!examData || !examData.master_grid) return null;
    
    const masterGrid = examData.master_grid;
    const capacityIssues = [];
    
    Object.keys(masterGrid).forEach(day => {
      const timeSlots = masterGrid[day];
      Object.keys(timeSlots).forEach(time => {
        const slot = timeSlots[time];
        if (slot.status === 'Occupied' && slot.course_id) {
          const course = coursesData.find(c => c.id === slot.course_id);
          const hallName = slot.halls && slot.halls.length > 0 ? slot.halls[0] : null;
          const room = roomsData.find(r => r.name === hallName);
          
          if (course && room && course.capacity > room.capacity) {
            capacityIssues.push({
              day: daysMap[day] || day,
              time: slot.start_time,
              course_name: slot.course_name,
              hall_name: hallName,
              course_capacity: course.capacity,
              hall_capacity: room.capacity,
            });
          }
        }
      });
    });
    
    return capacityIssues.length > 0 ? capacityIssues : null;
  };

  const fetchData = async () => {
    setLoading(true);
    setCapacityError(null);
    try {
      const [scheduleRes, examRes, coursesRes, roomsRes] = await Promise.all([
        getWeeklyProgram(),
        getExamProgram(),
        getCourses(),
        getRooms(),
      ]);
      
      setCourses(coursesRes);
      setRooms(roomsRes);
      
      const capacityIssues = checkCapacity(scheduleRes, roomsRes);
      if (capacityIssues && capacityIssues.length > 0) {
        setCapacityError(capacityIssues);
      }
      
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
                halls: slot.halls || [],
                hall_name: slot.halls && slot.halls.length > 0 ? slot.halls.join('، ') : 'غير محدد',
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
          halls: session.halls || (session.hall ? [session.hall.name] : []),
          hall_name: session.halls ? session.halls.join('، ') : (session.hall?.name || 'غير محدد'),
        }));
      } else if (Array.isArray(scheduleRes)) {
        formattedSchedule = scheduleRes.map(item => ({
          id: item.id,
          day: daysMap[item.day] || item.day,
          start_time: item.start_time,
          end_time: item.end_time,
          course_name: item.course?.name || item.course_name,
          halls: item.halls || (item.hall ? [item.hall.name] : []),
          hall_name: item.halls ? item.halls.join('، ') : (item.hall?.name || 'غير محدد'),
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
                halls: slot.halls || [],
                hall_name: slot.halls && slot.halls.length > 0 ? slot.halls.join('، ') : 'غير محدد',
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
          halls: session.halls || (session.hall ? [session.hall.name] : []),
          hall_name: session.halls ? session.halls.join('، ') : (session.hall?.name || 'غير محدد'),
        }));
      } else if (Array.isArray(examRes)) {
        formattedExams = examRes.map(item => ({
          id: item.id,
          day: daysMap[item.day] || item.day,
          start_time: item.start_time,
          end_time: item.end_time,
          course_name: item.course?.name || item.course_name,
          halls: item.halls || (item.hall ? [item.hall.name] : []),
          hall_name: item.halls ? item.halls.join('، ') : (item.hall?.name || 'غير محدد'),
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
    setCapacityError(null);
    setAdminAlerts([]);
    
    try {
      const [roomsRes, coursesRes] = await Promise.all([
        getRooms(),
        getCourses(),
      ]);
      
      const response = await generateWeeklySchedule();
      const generatedSchedule = response.data;
      
      if (response.admin_alerts && response.admin_alerts.length > 0) {
        setAdminAlerts(response.admin_alerts);
        setShowAlertsDialog(true);
      }
      
      const capacityIssues = checkCapacity(generatedSchedule, roomsRes);
      
      if (capacityIssues && capacityIssues.length > 0) {
        setCapacityError(capacityIssues);
        
        const capacityAlerts = capacityIssues.map(issue => 
          `⚠️ ${issue.day} - ${issue.time}: مادة "${issue.course_name}" في قاعة "${issue.hall_name}" (سعة القاعة: ${issue.hall_capacity}، عدد الطلاب: ${issue.course_capacity})`
        );
        setAdminAlerts(prev => [...prev, ...capacityAlerts]);
        setShowAlertsDialog(true);
        setToast({ 
          open: true, 
          message: `⚠️ تم توليد الجدول ولكن مع ${capacityIssues.length} مشكلة في سعة القاعات`, 
          severity: 'warning' 
        });
        await fetchData();
        setGenerating(false);
        return;
      }
      
      setToast({ 
        open: true, 
        message: response.message || '✅ تم توليد برنامج الدوام بنجاح!', 
        severity: 'success' 
      });
      await fetchData();
      
    } catch (error) {
      const errorAlerts = error.response?.data?.admin_alerts || [];
      if (errorAlerts.length > 0) {
        setAdminAlerts(errorAlerts);
        setShowAlertsDialog(true);
      }
      
      setToast({ 
        open: true, 
        message: error.response?.data?.message || '❌ فشل في التوليد', 
        severity: 'error' 
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateExam = async () => {
    setGenerating(true);
    setCapacityError(null);
    setAdminAlerts([]);
    
    try {
      const [roomsRes, coursesRes] = await Promise.all([
        getRooms(),
        getCourses(),
      ]);
      
      const response = await generateExamSchedule();
      const generatedExam = response.data;
      
      if (response.admin_alerts && response.admin_alerts.length > 0) {
        setAdminAlerts(response.admin_alerts);
        setShowAlertsDialog(true);
      }
      
      const capacityIssues = checkExamCapacity(generatedExam, roomsRes, coursesRes);
      
      if (capacityIssues && capacityIssues.length > 0) {
        setCapacityError(capacityIssues);
        
        const capacityAlerts = capacityIssues.map(issue => 
          `⚠️ ${issue.day} - ${issue.time}: مادة "${issue.course_name}" في قاعة "${issue.hall_name}" (سعة القاعة: ${issue.hall_capacity}، عدد الطلاب: ${issue.course_capacity})`
        );
        setAdminAlerts(prev => [...prev, ...capacityAlerts]);
        setShowAlertsDialog(true);
        setToast({ 
          open: true, 
          message: `⚠️ تم توليد جدول الامتحانات مع ${capacityIssues.length} مشكلة في سعة القاعات`, 
          severity: 'warning' 
        });
        await fetchData();
        setGenerating(false);
        return;
      }
      
      setToast({ 
        open: true, 
        message: response.message || '✅ تم توليد برنامج الامتحانات بنجاح!', 
        severity: 'success' 
      });
      await fetchData();
      
    } catch (error) {
      const errorAlerts = error.response?.data?.admin_alerts || [];
      if (errorAlerts.length > 0) {
        setAdminAlerts(errorAlerts);
        setShowAlertsDialog(true);
      }
      
      setToast({ 
        open: true, 
        message: error.response?.data?.message || '❌ فشل في التوليد', 
        severity: 'error' 
      });
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
        ملاحظة: عند الضغط على زر التوليد، سيتم إنشاء جدول تلقائي مع تجنب التعارضات والتحقق من سعة القاعات.
      </Alert>

      {capacityError && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          icon={<WarningIcon />}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            ⚠️ تحذير: عدد الطلاب أكبر من سعة القاعة
          </Typography>
          {capacityError.map((issue, idx) => (
            <Box key={idx} sx={{ mb: 1, fontSize: '0.9rem' }}>
              • {issue.day} - {issue.time?.substring(0, 5)} : 
              مادة <strong>{issue.course_name}</strong> في قاعة <strong>{issue.hall_name}</strong> 
              (سعة القاعة: {issue.hall_capacity} طالب، عدد الطلاب المسجلين: {issue.course_capacity} طالب)
            </Box>
          ))}
        </Alert>
      )}

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }} centered>
        <Tab label="جدول الدوام" />
        <Tab label="جدول الامتحانات" />
      </Tabs>

      {tab === 0 && (
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              bgcolor: '#e3f2fd',
              color: '#1565c0',
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <SchoolIcon fontSize="small" />
              جدول الدوام الأسبوعي لجميع المواد
            </Box>
          </Alert>

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
                position: 'relative',
              }}
            >
              {generating ? 'جاري التوليد...' : 'توليد برنامج تلقائي'}
              {adminAlerts.length > 0 && !generating && (
                <Badge 
                  badgeContent={adminAlerts.length} 
                  color="error"
                  sx={{ position: 'absolute', top: -8, right: -8 }}
                />
              )}
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
                    
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow sx={{ 
                          backgroundColor: '#1565c0',
                          '& .MuiTableCell-root': { 
                            color: '#fff', 
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            border: 'none',
                          }
                        }}>
                          <TableCell align="center">الوقت</TableCell>
                          <TableCell align="center">المادة</TableCell>
                          <TableCell align="center">القاعات</TableCell>
                          <TableCell align="center">إجراءات</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sessions.map((item) => (
                          <TableRow key={item.id} hover>
                            <TableCell align="center">
                              <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                <AccessTimeIcon sx={{ fontSize: 14, color: '#1565c0' }} />
                                <Typography variant="body2">
                                  {item.start_time?.substring(0, 5) || item.start_time} - {item.end_time?.substring(0, 5) || item.end_time}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                <Avatar sx={{ width: 28, height: 28, bgcolor: '#e3f2fd' }}>
                                  <SchoolIcon sx={{ fontSize: 16, color: '#1565c0' }} />
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {item.course_name || 'غير محدد'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                <MeetingRoomIcon sx={{ fontSize: 14, color: '#1565c0' }} />
                                <Typography variant="body2">
                                  {item.hall_name}
                                </Typography>
                              </Box>
                            </TableCell>
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
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              bgcolor: '#fff3e0',
              color: '#ed6c02',
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <SchoolIcon fontSize="small" />
              جدول الامتحانات الأسبوعي لجميع المواد
            </Box>
          </Alert>

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
                position: 'relative',
              }}
            >
              {generating ? 'جاري التوليد...' : 'توليد امتحانات تلقائي'}
              {adminAlerts.length > 0 && !generating && (
                <Badge 
                  badgeContent={adminAlerts.length} 
                  color="error"
                  sx={{ position: 'absolute', top: -8, right: -8 }}
                />
              )}
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
                    
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow sx={{ 
                          backgroundColor: '#ed6c02',
                          '& .MuiTableCell-root': { 
                            color: '#fff', 
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            border: 'none',
                          }
                        }}>
                          <TableCell align="center">الوقت</TableCell>
                          <TableCell align="center">المادة</TableCell>
                          <TableCell align="center">القاعات</TableCell>
                          <TableCell align="center">إجراءات</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {exams.map((item) => (
                          <TableRow key={item.id} hover>
                            <TableCell align="center">
                              <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                <AccessTimeIcon sx={{ fontSize: 14, color: '#ed6c02' }} />
                                <Typography variant="body2">
                                  {item.start_time?.substring(0, 5) || item.start_time} - {item.end_time?.substring(0, 5) || item.end_time}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                <Avatar sx={{ width: 28, height: 28, bgcolor: '#fff3e0' }}>
                                  <SchoolIcon sx={{ fontSize: 16, color: '#ed6c02' }} />
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {item.course_name || 'غير محدد'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                <MeetingRoomIcon sx={{ fontSize: 14, color: '#ed6c02' }} />
                                <Typography variant="body2">
                                  {item.hall_name}
                                </Typography>
                              </Box>
                            </TableCell>
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

      <Dialog 
        open={showAlertsDialog} 
        onClose={() => setShowAlertsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: '#ff9800', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <WarningIcon />
          <Typography variant="h6">تنبيهات المدير</Typography>
          <IconButton 
            onClick={() => setShowAlertsDialog(false)} 
            sx={{ color: 'white', position: 'absolute', left: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          {adminAlerts.map((alert, index) => (
            <Alert 
              key={index} 
              severity={
                alert.includes('✅') ? 'success' : 
                alert.includes('⚠️') ? 'warning' : 
                alert.includes('❌') ? 'error' : 'info'
              }
              sx={{ mb: 1.5, borderRadius: 1 }}
            >
              {alert}
            </Alert>
          ))}
          
          {adminAlerts.length === 0 && (
            <Alert severity="info">
              لا توجد تنبيهات. جميع العمليات تمت بنجاح!
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            عدد التنبيهات: {adminAlerts.length}
          </Typography>
          <Button 
            onClick={() => setShowAlertsDialog(false)} 
            variant="contained"
            color="primary"
          >
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>

      <Fab 
        color="warning" 
        size="medium"
        sx={{ position: 'fixed', bottom: 20, left: 20 }}
        onClick={() => setShowAlertsDialog(true)}
      >
        <Badge 
          badgeContent={adminAlerts.length} 
          color="error"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <WarningIcon />
        </Badge>
      </Fab>

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