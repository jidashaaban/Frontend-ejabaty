import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import Dashboard from './Dashboard';
import Schedule from './Schedule';
import Exams from './Exams';
import Tasks from './Tasks';
import Grades from './Grades';
import Installments from './Installments';
import Complaints from './Complaints';
import Surveys from './Surveys';
import Points from './Points';
import Notifications from './Notifications';

/**
 * تعريف مسارات الطالب
 */
const StudentRoutes = () => {
  return (
    <Routes>
      <Route element={<StudentLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="exams" element={<Exams />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="grades" element={<Grades />} />
        <Route path="installments" element={<Installments />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="surveys" element={<Surveys />} />
        <Route path="points" element={<Points />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
};

export default StudentRoutes;