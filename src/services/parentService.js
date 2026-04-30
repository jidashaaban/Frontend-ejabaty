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

export const getStudentInfo = async () => {
  const response = await apiClient.get('/parent/student-info');
  return response.data;
};

export const getStudentPoints = async (studentId) => {
  const response = await apiClient.get(`/student/${studentId}/points`);
  return response.data;
};

export const getStudentExams = async (studentId) => {
  const response = await apiClient.get(`/student/${studentId}/exams`);
  return response.data;
};

export const getStudentNotes = async (studentId) => {
  const response = await apiClient.get(`/student/${studentId}/notes`);
  return response.data;
};

export const submitComplaint = async (complaintData) => {
  const response = await apiClient.post('/complaints', complaintData);
  return response.data;
};

export const getStudentGrades = async (studentId) => {
  try {
    const response = await apiClient.get(`/student/${studentId}/grades`);
    return response.data;
  } catch (error) {
    return [
      { id: 1, subject: 'الرياضيات', grade: 92, maxGrade: 100, date: '2026-04-20', type: 'اختبار نهائي' },
      { id: 2, subject: 'الفيزياء', grade: 88, maxGrade: 100, date: '2026-04-18', type: 'اختبار شهري' },
      { id: 3, subject: 'الكيمياء', grade: 95, maxGrade: 100, date: '2026-04-15', type: 'اختبار نهائي' },
    ];
  }
};