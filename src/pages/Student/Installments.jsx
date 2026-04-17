import React, { useState, useEffect } from 'react';
import { Typography, Paper, LinearProgress, Box } from '@mui/material';
import { getInstallments } from '../../services/studentService';

const Installments = () => {
  const [installments, setInstallments] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getInstallments();
      setInstallments(data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        الأقساط
      </Typography>
      {installments.map((inst) => {
        const percentage = (inst.paid / inst.amount) * 100;
        return (
          <Paper key={inst.id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1">{inst.label}</Typography>
            <Typography variant="body2">
              المدفوع: {inst.paid} / {inst.amount}
            </Typography>
            <Box sx={{ width: '100%', mt: 1 }}>
              <LinearProgress variant="determinate" value={percentage} />
            </Box>
          </Paper>
        );
      })}
    </div>
  );
};

export default Installments;