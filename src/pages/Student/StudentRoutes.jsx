import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import Dashboard from './Dashboard';
import InquiriesStudent from './InquiriesStudent';
import PollStudent from './PollStudent';
import Points from './Points';
import StudentNotifications from './StudentNotifications';

const StudentRoutes = () => {
  return (
    <Routes>
      <Route element={<StudentLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="inquiries" element={<InquiriesStudent />} />
        <Route path="poll" element={<PollStudent />} />
        <Route path="points" element={<Points />} />
        <Route path="notifications" element={<StudentNotifications />} />
      </Route>
    </Routes>
  );
};

export default StudentRoutes;