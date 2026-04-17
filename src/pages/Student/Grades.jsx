import React, { useState, useEffect } from 'react';
import { Typography, Paper } from '@mui/material';
import { getGrades } from '../../services/studentService';

const Grades = () => {
  const [grades, setGrades] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getGrades();
      setGrades(data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        نتائج الامتحانات
      </Typography>
      {grades.map((grade) => (
        <Paper key={grade.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1">المادة: {grade.course}</Typography>
          <Typography variant="body2">العلامة: {grade.grade}</Typography>
        </Paper>
      ))}
    </div>
  );
};

export default Grades;