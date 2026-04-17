import React, { useState, useEffect } from 'react';
import { Typography, Paper } from '@mui/material';
import { getTasks } from '../../services/studentService';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getTasks();
      setTasks(data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        المهام والواجبات
      </Typography>
      {tasks.map((task) => (
        <Paper key={task.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1">{task.title}</Typography>
          <Typography variant="body2">تاريخ التسليم: {task.dueDate}</Typography>
          <Typography variant="body2">الأولوية: {task.priority}</Typography>
        </Paper>
      ))}
    </div>
  );
};

export default Tasks;