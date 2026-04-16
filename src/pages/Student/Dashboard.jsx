import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import DashboardSummary from '../../components/layout/DashboardSummary';
import { getTasks, getExams, getPoints, getNotifications } from '../../services/studentService';

const Dashboard = () => {
  const [summary, setSummary] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const tasks = await getTasks();
      const exams = await getExams();
      const points = await getPoints();
      const notifications = await getNotifications();
      setSummary([
        { label: 'المهام', value: tasks.length },
        { label: 'الاختبارات القادمة', value: exams.length },
        { label: 'النقاط', value: points },
        { label: 'الإشعارات', value: notifications.length },
      ]);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        لوحة التحكم
      </Typography>
      <DashboardSummary items={summary} />
    </div>
  );
};

export default Dashboard;