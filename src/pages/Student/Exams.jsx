import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, Chip, CircularProgress, Alert,
} from '@mui/material';
import {
  EventNote as EventNoteIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  MeetingRoom as MeetingRoomIcon,
} from '@mui/icons-material';
import { getExams } from '../../services/studentService';
import PageHeader from '../../components/common/PageHeader';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getExams();
        const list = data?.data || data?.exams || (Array.isArray(data) ? data : []);
        setExams(list.map(e => ({
          id: e.id,
          subject: e.course?.name || e.course_name || e.subject || '-',
          date: e.date || e.exam_date || '-',
          time: e.start_time && e.end_time
            ? `${e.start_time.substring(0, 5)} - ${e.end_time.substring(0, 5)}`
            : e.time || '-',
          room: e.hall?.name || e.room_name || e.room || '-',
        })));
      } catch (error) {
        console.error('خطأ في جلب الامتحانات:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل الامتحانات...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="الاختبارات القادمة"
        subtitle="جدول امتحاناتك"
        icon={<EventNoteIcon sx={{ fontSize: 20 }} />}
      />

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', p: 2, px: 3 }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>جدول الامتحانات</Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          {exams.length === 0 ? (
            <Alert severity="info">لا توجد امتحانات مسجلة حالياً</Alert>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>المادة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الوقت</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>القاعة</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exams.map((exam, idx) => (
                  <TableRow key={exam.id || idx} hover>
                    <TableCell>
                      <Chip label={exam.subject} size="small" sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 'bold' }} />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <CalendarTodayIcon fontSize="small" color="action" />
                        {exam.date}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        {exam.time}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <MeetingRoomIcon fontSize="small" color="action" />
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
    </Box>
  );
};

export default Exams;
