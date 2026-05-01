import { v4 as uuidv4 } from 'uuid';
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

let teacherStudents = [
  { id: uuidv4(), name: 'طارق', course: 'الرياضيات', notes: [] },
  { id: uuidv4(), name: 'ليلى', course: 'الفيزياء', notes: [] },
];

let teacherSchedule = [
  {
    id: uuidv4(),
    day: 'الأحد',
    startTime: '09:00',
    endTime: '11:00',
    subject: 'الرياضيات',
    className: 'السنة الأولى',
    roomName: 'قاعة 1',
    teacherId: 1,
  },
  {
    id: uuidv4(),
    day: 'الثلاثاء',
    startTime: '11:00',
    endTime: '13:00',
    subject: 'الفيزياء',
    className: 'السنة الثانية',
    roomName: 'قاعة 3',
    teacherId: 1,
  },
];

let examModels = [];
let announcedTests = [];

export const getStudents = async () => {
  return Promise.resolve([...teacherStudents]);
};

export const addNote = async (studentId, note) => {
  teacherStudents = teacherStudents.map((student) => {
    if (student.id === studentId) {
      return {
        ...student,
        notes: [...student.notes, { id: uuidv4(), text: note }],
      };
    }
    return student;
  });
  return Promise.resolve(
    teacherStudents.find((student) => student.id === studentId)
  );
};

export const getTeacherSchedule = async (teacherId) => {
  const filteredSchedule = teacherSchedule.filter(
    (session) => session.teacherId === teacherId
  );
  return Promise.resolve([...filteredSchedule]);
};

export const getSchedule = async () => {
  return Promise.resolve([...teacherSchedule]);
};

export const addTeacherSchedule = async (session) => {
  const newSession = { id: uuidv4(), ...session };
  teacherSchedule.push(newSession);
  return Promise.resolve(newSession);
};

export const updateTeacherSchedule = async (id, data) => {
  const index = teacherSchedule.findIndex(s => s.id === id);
  if (index !== -1) {
    teacherSchedule[index] = { ...teacherSchedule[index], ...data };
    return Promise.resolve(teacherSchedule[index]);
  }
  return Promise.resolve(null);
};

export const deleteTeacherSchedule = async (id) => {
  teacherSchedule = teacherSchedule.filter(s => s.id !== id);
  return Promise.resolve();
};

export const getExamModels = async () => {
  return Promise.resolve([...examModels]);
};

export const uploadExamModel = async (modelData) => {
  const newModel = { id: uuidv4(), ...modelData };
  examModels.push(newModel);
  return Promise.resolve(newModel);
};

export const deleteExamModel = async (modelId) => {
  examModels = examModels.filter(model => model.id !== modelId);
  return Promise.resolve({ success: true });
};

export const announceTest = async (test) => {
  const newTest = { id: uuidv4(), ...test };
  announcedTests.push(newTest);
  return Promise.resolve(newTest);
};

export const getAnnouncedTests = async () => {
  return Promise.resolve([...announcedTests]);
};

export const deleteAnnouncedTest = async (id) => {
  announcedTests = announcedTests.filter(test => test.id !== id);
  return Promise.resolve({ success: true });
};

export const getTeacherStats = async (teacherId) => {
  const schedule = await getTeacherSchedule(teacherId);
  const models = await getExamModels();
  const tests = await getAnnouncedTests();
  
  return Promise.resolve({
    totalSessions: schedule.length,
    totalExamModels: models.length,
    totalAnnouncedTests: tests.length,
    schedule: schedule,
    examModels: models,
    announcedTests: tests,
  });
};

export const getTeacherExams = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teacher/${teacherId}/exams`);
    return response.data;
  } catch (error) {
    return [
      { id: 1, subject: 'الرياضيات', date: '2026-04-25', day: 'الأحد', time: '10:00-12:00', room: 'قاعة 101' },
      { id: 2, subject: 'الفيزياء', date: '2026-04-27', day: 'الثلاثاء', time: '10:00-12:00', room: 'قاعة 102' },
      { id: 3, subject: 'الكيمياء', date: '2026-04-29', day: 'الخميس', time: '10:00-12:00', room: 'مختبر الكيمياء' },
    ];
  }
};

export const getStudentEvaluations = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teacher/${teacherId}/evaluations`);
    return response.data;
  } catch (error) {
    // بيانات وهمية
    return [
      { id: 1, studentId: 1, studentName: 'أحمد محمد', subject: 'الرياضيات', points: 15, notes: 'متميز', date: '2026-04-25' },
      { id: 2, studentId: 2, studentName: 'سارة خالد', subject: 'الفيزياء', points: 10, notes: 'مشاركة ممتازة', date: '2026-04-24' },
    ];
  }
};

// إضافة تقييم جديد
export const addStudentEvaluation = async (evaluationData) => {
  try {
    const response = await apiClient.post('/teacher/evaluations', evaluationData);
    return response.data;
  } catch (error) {
    return { id: Date.now(), ...evaluationData, success: true };
  }
};

// تحديث تقييم
export const updateStudentEvaluation = async (id, evaluationData) => {
  try {
    const response = await apiClient.put(`/teacher/evaluations/${id}`, evaluationData);
    return response.data;
  } catch (error) {
    return { id, ...evaluationData, success: true };
  }
};

// حذف تقييم
export const deleteStudentEvaluation = async (id) => {
  try {
    const response = await apiClient.delete(`/teacher/evaluations/${id}`);
    return response.data;
  } catch (error) {
    return { success: true };
  }
};