import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Schedule as ScheduleIcon,
  EventNote as EventNoteIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';
import { getStudentSchedule, getStudentExams } from '../../services/studentService';

const dayMapToEnglish = {
  'الأحد': 'Sunday',
  'الإثنين': 'Monday',
  'الثلاثاء': 'Tuesday',
  'الأربعاء': 'Wednesday',
  'الخميس': 'Thursday',
};

const dayMapToArabic = {
  Sunday: 'الأحد',
  Monday: 'الإثنين',
  Tuesday: 'الثلاثاء',
  Wednesday: 'الأربعاء',
  Thursday: 'الخميس',
};

function StudentSchedule() {
  const [tab, setTab] = useState(0);
  const [schedule, setSchedule] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [scheduleData, examsData] = await Promise.all([
          getStudentSchedule(),
          getStudentExams(),
        ]);

        const sList = scheduleData?.sessions || scheduleData?.data || scheduleData?.schedule || (Array.isArray(scheduleData) ? scheduleData : []);
        const eList = examsData?.exams || examsData?.data || (Array.isArray(examsData) ? examsData : []);

        setSchedule(sList);
        setExams(eList.map(e => ({
          ...e,
          course: e.course?.name || e.course_name || e.course || '-',
          room_name: e.hall?.name || e.room_name || e.room || '-',
          date: e.date || e.exam_date || '-',
        })));
      } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
        setToast({ open: true, message: 'فشل في جلب البيانات', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  const timeSlots = ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00'];

  const getScheduleAt = (day, time) => {
    const englishDay = dayMapToEnglish[day] || day;
    return schedule.find(s => {
      const sDay = s.day || '';
      const sTime = (s.start_time || '').substring(0, 5);
      return sDay === englishDay && sTime === time;
    });
  };

  const getEndTime = (time) => {
    const [h, m] = time.split(':').map(Number);
    const end = new Date(0, 0, 0, h, m + 90);
    return `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل برنامجك...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="برنامجي الأسبوعي"
        subtitle="جدول الدوام والامتحانات الخاص بك"
        icon={<CalendarIcon sx={{ fontSize: 20 }} />}
      />

      <Tabs 
        value={tab} 
        onChange={(e, v) => setTab(v)} 
        sx={{ 
          mb: 3,
          '& .MuiTab-root': {
            fontSize: '1rem',
            fontWeight: 'bold',
            py: 1.5,
          }
        }} 
        centered
      >
        <Tab icon={<ScheduleIcon />} iconPosition="start" label="جدول الدوام" />
        <Tab icon={<EventNoteIcon />} iconPosition="start" label="جدول الامتحانات" />
      </Tabs>

      {tab === 0 && (
        <Paper sx={{ p: 3, borderRadius: 3, overflowX: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
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
              هذا جدول دوامك الخاص - يعرض فقط المواد التي أنت مسجل عليها
            </Box>
          </Alert>
          
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
                {days.map(day => (
                  <TableCell key={day} align="center">{day}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {timeSlots.map((time, idx) => (
                <TableRow 
                  key={time} 
                  hover
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                    '&:hover': { backgroundColor: '#e8f0fe' },
                  }}
                >
                  <TableCell align="center" sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: '#f5f5f5',
                    borderBottom: '1px solid #e0e0e0',
                  }}>
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <TimeIcon sx={{ fontSize: 16, color: '#1565c0' }} />
                      <span>{time}–{getEndTime(time)}</span>
                    </Box>
                  </TableCell>
                  {days.map(day => {
                    const session = getScheduleAt(day, time);
                    return (
                      <TableCell key={day} align="center" sx={{ borderBottom: '1px solid #f0f0f0' }}>
                        {session ? (
                          <Box sx={{ py: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                              {session.course?.name || session.course_name || session.course || '-'}
                            </Typography>
                            <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} mt={0.5}>
                              <LocationIcon sx={{ fontSize: 12, color: '#9e9e9e' }} />
                              <Typography variant="caption" color="text.secondary">
                                {session.hall?.name || session.room_name || 'غير محدد'}
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.disabled">—</Typography>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
              هذا جدول امتحاناتك الخاص - يعرض فقط امتحانات المواد التي أنت مسجل عليها
            </Box>
          </Alert>
          
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
                <TableCell>المادة</TableCell>
                <TableCell align="center">اليوم</TableCell>
                <TableCell align="center">التاريخ</TableCell>
                <TableCell align="center">الوقت</TableCell>
                <TableCell align="center">القاعة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.length > 0 ? (
                exams.map((exam, idx) => (
                  <TableRow 
                    key={idx} 
                    hover
                    sx={{
                      '&:hover': { backgroundColor: '#fff8e1' },
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: '#fff3e0' }}>
                          <SchoolIcon sx={{ fontSize: 16, color: '#ed6c02' }} />
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {exam.course}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={dayMapToArabic[exam.day] || exam.day || 'غير محدد'}
                        size="small"
                        sx={{ 
                          bgcolor: '#fff3e0', 
                          color: '#ed6c02', 
                          fontWeight: 'bold',
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">{exam.date || '-'}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                        <TimeIcon sx={{ fontSize: 14, color: '#ed6c02' }} />
                        <Typography variant="body2">
                          {exam.start_time?.substring(0, 5)} - {exam.end_time?.substring(0, 5)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                        <LocationIcon sx={{ fontSize: 14, color: '#9e9e9e' }} />
                        <Typography variant="body2">{exam.room_name}</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <EventNoteIcon sx={{ fontSize: 48, color: '#ccc', mb: 1, opacity: 0.5 }} />
                      <Typography color="text.secondary">لا توجد امتحانات مسجلة</Typography>
                    </Box>
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

export default StudentSchedule;