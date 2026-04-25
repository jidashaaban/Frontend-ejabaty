// src/services/parentService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// جلب معلومات الطالب التابع لولي الأمر
export const getStudentInfo = async () => {
  const response = await apiClient.get('/parent/student-info');
  return response.data;
};

// جلب نقاط الطالب
export const getStudentPoints = async (studentId) => {
  const response = await apiClient.get(`/student/${studentId}/points`);
  return response.data;
};

// جلب جدول الامتحانات الخاص بالطالب
export const getStudentExams = async (studentId) => {
  const response = await apiClient.get(`/student/${studentId}/exams`);
  return response.data;
};

// جلب ملاحظات الأستاذ على الطالب
export const getStudentNotes = async (studentId) => {
  const response = await apiClient.get(`/student/${studentId}/notes`);
  return response.data;
};

// إرسال شكوى جديدة
export const submitComplaint = async (complaintData) => {
  const response = await apiClient.post('/complaints', complaintData);
  return response.data;
};