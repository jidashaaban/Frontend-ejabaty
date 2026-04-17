import React, { useState, useEffect } from 'react';
import { Typography, Paper } from '@mui/material';
import { getExams } from '../../services/studentService';

const Exams = () => {
  const [exams, setExams] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getExams();
      setExams(data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        الاختبارات القادمة
      </Typography>
      {exams.map((exam) => (
        <Paper key={exam.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1">المادة: {exam.course}</Typography>
          <Typography variant="body2">التاريخ: {exam.date}</Typography>
          <Typography variant="body2">الوقت: {exam.time}</Typography>
          <Typography variant="body2">المكان: {exam.place}</Typography>
        </Paper>
      ))}
    </div>
  );
};

export default Exams;