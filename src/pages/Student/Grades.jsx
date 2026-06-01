import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, Chip, CircularProgress, Alert,
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import { getGrades } from '../../services/studentService';
import PageHeader from '../../components/common/PageHeader';

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getGrades();
        const list = data?.data || (Array.isArray(data) ? data : []);
        setGrades(list.map(g => ({
          id: g.exam_id || g.id,
          course_name: g.course_name || '-',
          mark: g.my_mark || g.mark || 0,
          max_mark: 100,
          date: g.published_at || '-',
          type: g.title || 'امتحان',
        })));
      } catch (error) {
        console.error('خطأ في جلب العلامات:', error);
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
        <Typography sx={{ mr: 2 }}>جاري تحميل العلامات...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="نتائج الامتحانات"
        subtitle="علاماتك في جميع المواد"
        icon={<SchoolIcon sx={{ fontSize: 20 }} />}
      />

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', p: 2, px: 3 }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>العلامات التفصيلية</Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          {grades.length === 0 ? (
            <Alert severity="info">لا توجد علامات مسجلة حالياً</Alert>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>المادة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>العلامة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>النوع</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grades.map((grade, idx) => {
                  const mark = grade.mark || 0;
                  const max = grade.max_mark || 100;
                  return (
                    <TableRow key={grade.id || idx} hover>
                      <TableCell>{grade.course_name || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${mark} / ${max}`}
                          size="small"
                          sx={{
                            bgcolor: mark >= 90 ? '#e8f5e9' : mark >= 70 ? '#fff3e0' : '#ffebee',
                            color: mark >= 90 ? '#2e7d32' : mark >= 70 ? '#ed6c02' : '#d32f2f',
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                      <TableCell>{grade.date || '-'}</TableCell>
                      <TableCell>
                        <Chip label={grade.type || 'امتحان'} size="small" variant="outlined" />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Grades;
