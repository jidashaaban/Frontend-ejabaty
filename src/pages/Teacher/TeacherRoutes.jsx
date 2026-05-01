import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TeacherLayout from '../../components/layout/TeacherLayout';
import Dashboard from './Dashboard';
import StudentsRate from './StudentsRate';
import Schedule from './Schedule';
import ExamModels from './ExamModels';
import AnnounceTest from './AnnounceTest';
import Inquiries from '../Admin/Complaints';

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route element={<TeacherLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="evaluations" element={<StudentsRate />} />
        <Route path="schedule" element={<Schedule />} />        
        <Route path="schedule" element={<Schedule />} />   
        <Route path="exam-models" element={<ExamModels />} />
        <Route path="announce-test" element={<AnnounceTest />} />
        <Route path="inquiries" element={<Inquiries />} />
      </Route>
    </Routes>
  );
};

export default TeacherRoutes;