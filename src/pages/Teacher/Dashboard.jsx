import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import DashboardSummary from '../../components/layout/DashboardSummary';
import { getStudents, getAnnouncedTests, getExamModels } from '../../services/teacherService';

const Dashboard = () => {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const students = await getStudents();
      const tests = await getAnnouncedTests();
      const models = await getExamModels();
      setSummary([
        { label: 'عدد الطلاب', value: students.length },
        { label: 'اختبارات معلنة', value: tests.length },
        { label: 'نماذج امتحانية', value: models.length },
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