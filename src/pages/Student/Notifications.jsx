import React, { useState, useEffect } from 'react';
import { Typography, Paper } from '@mui/material';
import { getNotifications } from '../../services/studentService';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getNotifications();
      setNotifications(data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        الإشعارات
      </Typography>
      {notifications.map((n) => (
        <Paper key={n.id} sx={{ p: 2, mb: 2 }}>
          <Typography>{n.message}</Typography>
          <Typography variant="caption" color="text.secondary">
            {n.date}
          </Typography>
        </Paper>
      ))}
    </div>
  );
};

export default Notifications;