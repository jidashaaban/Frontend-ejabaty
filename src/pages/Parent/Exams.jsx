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
} from '@mui/material';
import {
  EventNote as EventNoteIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  MeetingRoom as MeetingRoomIcon,
} from '@mui/icons-material';
import { getStudentExams } from '../../services/parentService';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const data = await getStudentExams(1);
        setExams(data || []);
      } catch (error) {
        setExams([
          { id: 1, subject: 'الرياضيات', date: '2026-04-25', day: 'الأحد', time: '10:00-12:00', room: 'قاعة 101', teacher: 'أ. أحمد' },
          { id: 2, subject: 'الفيزياء', date: '2026-04-27', day: 'الثلاثاء', time: '10:00-12:00', room: 'قاعة 102', teacher: 'أ. سارة' },
          { id: 3, subject: 'الكيمياء', date: '2026-04-29', day: 'الخميس', time: '10:00-12:00', room: 'مختبر الكيمياء', teacher: 'أ. خالد' },
          { id: 4, subject: 'اللغة العربية', date: '2026-05-02', day: 'الأحد', time: '09:00-11:00', room: 'قاعة 103', teacher: 'أ. مريم' },
          { id: 5, subject: 'اللغة الإنجليزية', date: '2026-05-04', day: 'الثلاثاء', time: '11:00-13:00', room: 'قاعة 104', teacher: 'أ. ناديا' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const subjectColors = {
    'الرياضيات': { bg: '#e3f2fd', color: '#1565c0', icon: '📐' },
    'الفيزياء': { bg: '#e8f5e9', color: '#2e7d32', icon: '⚛️' },
    'الكيمياء': { bg: '#fff3e0', color: '#ed6c02', icon: '🧪' },
    'اللغة العربية': { bg: '#fce4ec', color: '#c2185b', icon: '📖' },
    'اللغة الإنجليزية': { bg: '#e0f7fa', color: '#00838f', icon: '🇬🇧' },
  };

  const getSubjectStyle = (subject) => {
    return subjectColors[subject] || { bg: '#f5f5f5', color: '#616161', icon: '📚' };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={50} />
        <Typography sx={{ mr: 2 }}>جاري تحميل جدول الامتحانات...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="برنامج الامتحانات"
        subtitle="جدول امتحانات الطالب"
        icon={<EventNoteIcon sx={{ fontSize: 20 }} />}
      />

      <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Box sx={{ p: 2, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventNoteIcon /> جدول الامتحانات التفصيلي
          </Typography>
        </Box>

        {exams.length === 0 ? (
          <Alert severity="info" sx={{ m: 3, borderRadius: 3 }}>لا توجد امتحانات مسجلة حالياً</Alert>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>المادة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>اليوم</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>التاريخ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>الوقت</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>القاعة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>الأستاذ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exams.map((exam, index) => {
                  const style = getSubjectStyle(exam.subject);
                  return (
                    <TableRow 
                      key={exam.id} 
                      hover 
                      sx={{ 
                        '&:hover': { backgroundColor: style.bg, transition: '0.3s' }
                      }}
                    >
                      <TableCell sx={{ fontWeight: 'bold', color: style.color }}>{index + 1}</TableCell>
                      <TableCell>
                        <Chip 
                          label={`${style.icon} ${exam.subject}`} 
                          size="small" 
                          sx={{ bgcolor: style.bg, color: style.color, fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label={exam.day} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <CalendarTodayIcon fontSize="small" sx={{ color: '#666' }} />
                          {exam.date}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <AccessTimeIcon fontSize="small" sx={{ color: '#666' }} />
                          {exam.time}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <MeetingRoomIcon fontSize="small" sx={{ color: '#666' }} />
                          {exam.room}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={exam.teacher} size="small" variant="outlined" />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>

      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </Box>
  );
};

export default Exams;