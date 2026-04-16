import { createSlice } from '@reduxjs/toolkit';

/**
 * شريحة الطالب
 * تخزن بيانات الجدول، الاختبارات، المهام، الدرجات، الأقساط، الشكاوى، الاستبيانات، النقاط، والإشعارات.
 */
const initialState = {
  schedule: [],           // جدول الدوام (فقط المواد الخاصة بالطالب)
  exams: [],              // جدول الامتحانات (فقط المواد الخاصة بالطالب)
  tasks: [],
  grades: [],
  installments: [],
  complaints: [],
  surveys: [],
  points: 0,
  notifications: [],
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    // ========== جدول الدوام ==========
    setSchedule: (state, action) => {
      state.schedule = action.payload;
    },
    addToSchedule: (state, action) => {
      state.schedule.push(action.payload);
    },
    updateSchedule: (state, action) => {
      const index = state.schedule.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) state.schedule[index] = action.payload;
    },
    deleteFromSchedule: (state, action) => {
      state.schedule = state.schedule.filter((s) => s.id !== action.payload);
    },

    // ========== جدول الامتحانات ==========
    setExams: (state, action) => {
      state.exams = action.payload;
    },
    addToExams: (state, action) => {
      state.exams.push(action.payload);
    },
    updateExam: (state, action) => {
      const index = state.exams.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) state.exams[index] = action.payload;
    },
    deleteExam: (state, action) => {
      state.exams = state.exams.filter((e) => e.id !== action.payload);
    },

    // ========== المهام ==========
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) state.tasks[index] = action.payload;
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },

    // ========== الدرجات ==========
    setGrades: (state, action) => {
      state.grades = action.payload;
    },
    updateGrade: (state, action) => {
      const index = state.grades.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) state.grades[index] = action.payload;
    },

    // ========== الأقساط ==========
    setInstallments: (state, action) => {
      state.installments = action.payload;
    },
    updateInstallment: (state, action) => {
      const index = state.installments.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) state.installments[index] = action.payload;
    },

    // ========== الشكاوى ==========
    setComplaints: (state, action) => {
      state.complaints = action.payload;
    },
    addComplaint: (state, action) => {
      state.complaints.push(action.payload);
    },

    // ========== الاستبيانات ==========
    setSurveys: (state, action) => {
      state.surveys = action.payload;
    },

    // ========== النقاط ==========
    setPoints: (state, action) => {
      state.points = action.payload;
    },
    addPoints: (state, action) => {
      state.points += action.payload;
    },

    // ========== الإشعارات ==========
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload); // الإشعارات الجديدة بالأعلى
    },
    markNotificationAsRead: (state, action) => {
      const index = state.notifications.findIndex((n) => n.id === action.payload);
      if (index !== -1) state.notifications[index].isRead = true;
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }));
    },
    deleteNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
  },
});

export const {
  // Schedule (جدول الدوام)
  setSchedule,
  addToSchedule,
  updateSchedule,
  deleteFromSchedule,
  
  // Exams (جدول الامتحانات)
  setExams,
  addToExams,
  updateExam,
  deleteExam,
  
  // Tasks
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  
  // Grades
  setGrades,
  updateGrade,
  
  // Installments
  setInstallments,
  updateInstallment,
  
  // Complaints
  setComplaints,
  addComplaint,
  
  // Surveys
  setSurveys,
  
  // Points
  setPoints,
  addPoints,
  
  // Notifications
  setNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  
} = studentSlice.actions;

export default studentSlice.reducer;