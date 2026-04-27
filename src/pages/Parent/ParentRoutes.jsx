import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ParentLayout from '../../components/layout/ParentLayout';
import Dashboard from './Dashboard';
import Complaints from './Complaints';
import Points from './Points';
import Exams from './Exams';
import ParentNotifications from './ParentNotifications';  

const ParentRoutes = () => {
  return (
    <Routes>
      <Route element={<ParentLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="points" element={<Points />} />
        <Route path="exams" element={<Exams />} />
        <Route path="notifications" element={<ParentNotifications />} />
      </Route>
    </Routes>
  );
};

export default ParentRoutes;