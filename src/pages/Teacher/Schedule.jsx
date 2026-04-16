// src/pages/Teacher/TeacherSchedule.jsx
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
} from '@mui/material';
import { useSelector } from 'react-redux';
import { getTeacherSchedule } from '../../services/adminService';

// Map Arabic day names to English names returned by the backend API
const dayMapToEnglish = {
  'الأحد': 'Sunday',
  'الإثنين': 'Monday',
  'الثلاثاء': 'Tuesday',
  'الأربعاء': 'Wednesday',
  'الخميس': 'Thursday',
};

function TeacherSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await getTeacherSchedule(user.id);
        setSchedule(data);
      } catch (error) {
        console.error('خطأ في جلب الجدول:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
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
        <Typography sx={{ mr: 2 }}>جاري تحميل جدولك...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        📅 جدولي الأسبوعي
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        📌 هذا جدول الدوام الخاص بك - يعرض فقط المواد التي تدرسها
      </Alert>

      <Paper sx={{ p: 2, overflowX: 'auto' }}>
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
                            🏫 {session.room_name || 'غير محدد'} | 👨‍🎓 {session.class_name || ''}
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
    </Box>
  );
}

export default TeacherSchedule;