// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import AdminRoutes from './pages/Admin/AdminRoutes';
import TeacherRoutes from './pages/Teacher/TeacherRoutes';
import StudentRoutes from './pages/Student/StudentRoutes';
import ParentRoutes from './pages/Parent/ParentRoutes';

function App() {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // ✅ أضيفي هذا useEffect
  useEffect(() => {
    document.body.style.background = "linear-gradient(135deg, #114b58 0%, #011217 100%)";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/admin/*"
        element={
          isAuthenticated && role === 'admin' ? (
            <AdminRoutes />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/teacher/*"
        element={
          isAuthenticated && role === 'teacher' ? (
            <TeacherRoutes />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/student/*"
        element={
          isAuthenticated && role === 'student' ? (
            <StudentRoutes />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/parent/*"
        element={
          isAuthenticated && role === 'parent' ? (
            <ParentRoutes />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;