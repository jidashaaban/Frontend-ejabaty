import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import Dashboard from './Dashboard';
import Schedule from './Schedule';
import Exams from './Exams';
import Grades from './Grades';
import Points from './Points';
import StudentNotifications from './StudentNotifications';
import PollStudent from './PollStudent';
import RegisterCourses from './RegisterCourses';
import ExamPapers from './ExamPapers';
import StudentInquiries from './StudentInquiries';

const StudentRoutes = () => {
  return (
    <Routes>
      <Route element={<StudentLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="exams" element={<Exams />} />
        <Route path="grades" element={<Grades />} />
        <Route path="points" element={<Points />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="surveys" element={<PollStudent />} />
        <Route path="register-courses" element={<RegisterCourses />} />
        <Route path="exam-papers" element={<ExamPapers />} />
        <Route path="inquiries" element={<StudentInquiries />} />
      </Route>
    </Routes>
  );
};

export default StudentRoutes;