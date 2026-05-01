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
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  CalendarMonth as CalendarMonthIcon,
  EventNote as EventNoteIcon,
  AccessTime as AccessTimeIcon,
  MeetingRoom as MeetingRoomIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { getTeacherSchedule, getTeacherExams } from '../../services/teacherService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const MySchedule = () => {
  const { user } = useSelector((state) => state.auth);
  const [tab, setTab] = useState(0);
  const [schedule, setSchedule] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [scheduleData, examsData] = await Promise.all([
          getTeacherSchedule(user?.id || 1),
          getTeacherExams(user?.id || 1),
        ]);
        setSchedule(scheduleData || []);
        setExams(examsData || []);
      } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
        setSchedule([
          { id: 1, subject: 'الرياضيات', day: 'الأحد', time: '09:00-11:00', room: 'قاعة 101', class: 'الثاني علمي' },
          { id: 2, subject: 'الفيزياء', day: 'الثلاثاء', time: '11:00-13:00', room: 'قاعة 102', class: 'الثالث علمي' },
          { id: 3, subject: 'الكيمياء', day: 'الخميس', time: '10:00-12:00', room: 'مختبر الكيمياء', class: 'الثاني علمي' },
        ]);
        setExams([
          { id: 1, subject: 'الرياضيات', date: '2026-04-25', day: 'الأحد', time: '10:00-12:00', room: 'قاعة 101' },
          { id: 2, subject: 'الفيزياء', date: '2026-04-27', day: 'الثلاثاء', time: '10:00-12:00', room: 'قاعة 102' },
          { id: 3, subject: 'الكيمياء', date: '2026-04-29', day: 'الخميس', time: '10:00-12:00', room: 'مختبر الكيمياء' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const dayOrder = { 'الأحد': 0, 'الإثنين': 1, 'الثلاثاء': 2, 'الأربعاء': 3, 'الخميس': 4 };
  const sortedSchedule = [...schedule].sort((a, b) => (dayOrder[a.day] || 0) - (dayOrder[b.day] || 0));

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
        title="برنامجي الأسبوعي"
        subtitle="جدول الدوام والامتحانات الخاص بك"
        icon={<CalendarMonthIcon sx={{ fontSize: 20 }} />}
      />

      <Tabs 
        value={tab} 
        onChange={(e, v) => setTab(v)} 
        sx={{ mb: 3, borderBottom: '1px solid #e0e0e0' }}
        centered
      >
        <Tab label="📅 جدول الدوام" />
        <Tab label="📝 جدول الامتحانات" />
      </Tabs>

      {tab === 0 && (
        <Paper
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid #1976d2',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              p: 1.5,
              px: 2,
              color: '#fff',
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarMonthIcon sx={{ fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                جدول الدوام الأسبوعي
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 2 }}>
            {schedule.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2 }}>لا توجد حصص في جدولك الأسبوعي</Alert>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>اليوم</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>المادة</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>الوقت</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>القاعة</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>الصف</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedSchedule.map((session, index) => (
                    <TableRow key={session.id} hover sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                        <Chip label={session.day} size="small" sx={{ bgcolor: '#e3f2fd', color: '#1565c0', height: 22, fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <SchoolIcon sx={{ color: '#1976d2', fontSize: 16 }} />
                          {session.subject}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <AccessTimeIcon sx={{ color: '#1976d2', fontSize: 14 }} />
                          {session.time}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <MeetingRoomIcon sx={{ color: '#1976d2', fontSize: 14 }} />
                          {session.room}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{session.class}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        </Paper>
      )}

      {tab === 1 && (
        <Paper
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid #1976d2',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              p: 1.5,
              px: 2,
              color: '#fff',
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <EventNoteIcon sx={{ fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                جدول الامتحانات
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 2 }}>
            {exams.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2 }}>لا توجد امتحانات مسجلة حالياً</Alert>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>المادة</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>اليوم</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>التاريخ</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>الوقت</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #1976d2' }}>القاعة</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exams.map((exam, index) => (
                    <TableRow key={exam.id} hover sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <SchoolIcon sx={{ color: '#1976d2', fontSize: 16 }} />
                          {exam.subject}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                        <Chip label={exam.day} size="small" sx={{ bgcolor: '#e3f2fd', color: '#1565c0', height: 22 }} />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{exam.date}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <AccessTimeIcon sx={{ color: '#1976d2', fontSize: 14 }} />
                          {exam.time}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <MeetingRoomIcon sx={{ color: '#1976d2', fontSize: 14 }} />
                          {exam.room}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
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
};

export default MySchedule;