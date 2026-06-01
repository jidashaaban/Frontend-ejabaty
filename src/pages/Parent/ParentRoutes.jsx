import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ParentLayout from '../../components/layout/ParentLayout';
import Dashboard from './Dashboard';
import ComplaintsParent from './ComplaintsParent';
import Points from './Points';
import ParentNotifications from './ParentNotifications';  

const ParentRoutes = () => {
  return (
    <Routes>
      <Route element={<ParentLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="complaints" element={<ComplaintsParent />} />
        <Route path="points" element={<Points />} />
        <Route path="notifications" element={<ParentNotifications />} />
      </Route>
    </Routes>
  );
};

export default ParentRoutes;