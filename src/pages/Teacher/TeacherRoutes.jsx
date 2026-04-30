import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TeacherLayout from '../../components/layout/TeacherLayout';
import Dashboard from './Dashboard';
import StudentNotes from './StudentNotes';
import Schedule from './Schedule';
import ExamModels from './ExamModels';
import AnnounceTest from './AnnounceTest';
import Inquiries from '../Admin/Complaints';

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route element={<TeacherLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="notes" element={<StudentNotes />} />
        <Route path="schedule" element={<Schedule />} />        {/* ← أضيفي هذا */}  
        <Route path="schedule" element={<Schedule />} />     {/* ← وهذا */}
        <Route path="exam-models" element={<ExamModels />} />
        <Route path="announce-test" element={<AnnounceTest />} />
        <Route path="inquiries" element={<Inquiries />} />
      </Route>
    </Routes>
  );
};

export default TeacherRoutes;