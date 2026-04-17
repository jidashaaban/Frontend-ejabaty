import React, { useState, useEffect } from 'react';
import { Typography, Paper } from '@mui/material';
import { getPoints } from '../../services/studentService';

const Points = () => {
  const [points, setPoints] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const pts = await getPoints();
      setPoints(pts);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        النقاط
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">رصيدك من النقاط: {points}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          حافظ على نشاطك لتحصل على المزيد من النقاط.
        </Typography>
      </Paper>
    </div>
  );
};

export default Points;