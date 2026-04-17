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
} from '@mui/material';
import { useSelector } from 'react-redux';
import { getStudentSchedule, getStudentExams } from '../../services/adminService';

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
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [scheduleData, examsData] = await Promise.all([
          getStudentSchedule(user.id),
          getStudentExams(user.id),
        ]);
        setSchedule(scheduleData);
        setExams(examsData);
      } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  const timeSlots = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00'];

  const getScheduleAt = (day, time) => {
    // Convert the displayed Arabic day to the English key used by the backend
    const englishDay = dayMapToEnglish[day] || day;
    return schedule.find(s => s.day === englishDay && s.start_time.startsWith(time.split('-')[0]));
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
      <Typography variant="h4" gutterBottom>
        📅 برنامجي الأسبوعي
      </Typography>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }} centered>
        <Tab label="📅 جدول الدوام" />
        <Tab label="📝 جدول الامتحانات" />
      </Tabs>

      {tab === 0 && (
        <Paper sx={{ p: 2, overflowX: 'auto' }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            📌 هذا جدول دوامك الخاص - يعرض فقط المواد التي أنت مسجل عليها
          </Alert>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">الوقت</TableCell>
                {days.map(day => (
                  <TableCell key={day} align="center">{day}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {timeSlots.map(time => (
                <TableRow key={time}>
                  <TableCell align="center">{time}</TableCell>
                  {days.map(day => {
                    const session = getScheduleAt(day, time);
                    return (
                      <TableCell key={day} align="center">
                        {session ? (
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                            {session.course || session.course_id}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              🏫 {session.room_name || 'غير محدد'}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.disabled">—</Typography>
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
        <Paper sx={{ p: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            📌 هذا جدول امتحاناتك الخاص - يعرض فقط امتحانات المواد التي أنت مسجل عليها
          </Alert>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>المادة</TableCell>
                <TableCell>اليوم</TableCell>
                <TableCell>التاريخ</TableCell>
                <TableCell>الوقت</TableCell>
                <TableCell>القاعة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam, idx) => (
                <TableRow key={idx}>
                  <TableCell>{exam.course || exam.course_id}</TableCell>
                  <TableCell><Chip label={dayMapToArabic[exam.day] || exam.day} color="warning" size="small" /></TableCell>
                  <TableCell>{exam.date || '-'}</TableCell>
                  <TableCell>{exam.start_time} - {exam.end_time}</TableCell>
                  <TableCell>{exam.room_name}</TableCell>
                </TableRow>
              ))}
              {exams.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary">لا توجد امتحانات مسجلة</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}

export default StudentSchedule;