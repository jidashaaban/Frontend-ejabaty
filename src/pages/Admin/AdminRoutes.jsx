import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Dashboard from './Dashboard';
import Announcements from './Announcements';
import AddUser from './AddUser';
import Polls from './Polls';
import Reports from './Reports';
import WeeklyProgram from './WeeklyProgram';
import Complaints from './Complaints';
import AdminNotifications from './AdminNotifications';
// import ExamHalls from './ExamHalls';  ← تم حذفها

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="add-user" element={<AddUser />} />
        <Route path="polls" element={<Polls />} />
        <Route path="reports" element={<Reports />} />
        <Route path="weekly-program" element={<WeeklyProgram />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="notifications" element={<AdminNotifications />} />
        {/* <Route path="exam-halls" element={<ExamHalls />} />  ← تم حذفها */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;