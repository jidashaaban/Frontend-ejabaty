import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  announcements: [],
  polls: [],
  reports: {},
  // توحيد البرامج في مصفوفتين واضحتين
  weeklyProgram: [],      // برنامج الدوام (بدلاً من weekSchedule)
  examProgram: [],        // برنامج الامتحان (بدلاً من examSchedule)
  studentSchedule: [],
  teacherSchedule: [],
  Complaints: [],
  users: [],
  employees: [],
  examHall: [],
  points: [],
  pollResults: [],      
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // ========== الإعلانات ==========
    setAnnouncements: (state, action) => {
      state.announcements = action.payload;
    },
    addAnnouncement: (state, action) => {
      state.announcements.push(action.payload);
    },
    updateAnnouncement: (state, action) => {
      const index = state.announcements.findIndex(
        (a) => a.id === action.payload.id
      );
      if (index !== -1) state.announcements[index] = action.payload;
    },
    deleteAnnouncement: (state, action) => {
      state.announcements = state.announcements.filter(
        (a) => a.id !== action.payload
      );
    },
  
    // ========== الاستبيانات ==========
    setPolls: (state, action) => {
      state.polls = action.payload;
    },
    addPoll: (state, action) => {
      state.polls.push(action.payload);
    },
    deletePoll: (state, action) => {
      state.polls = state.polls.filter((p) => p.id !== action.payload);
    },
    getPollResults: (state, action) => {
      state.pollResults = action.payload;
    },

    // ========== التقارير ==========
    setReports: (state, action) => {
      state.reports = action.payload;
    },
    addReports: (state, action) => {
      state.reports[action.payload.id] = action.payload;
    },
    deleteReports: (state, action) => {
      delete state.reports[action.payload];
    },
    getReports: (state, action) => {
      state.reports = action.payload;
    },

    // ========== برنامج الدوام (weeklyProgram) ==========
    setWeeklyProgram: (state, action) => {
      state.weeklyProgram = action.payload;
    },
    addWeeklyProgram: (state, action) => {
      state.weeklyProgram.push(action.payload);
    },
    updateWeeklyProgram: (state, action) => {
      const index = state.weeklyProgram.findIndex((w) => w.id === action.payload.id);
      if (index !== -1) state.weeklyProgram[index] = action.payload;
    },
    deleteWeeklyProgram: (state, action) => {
      state.weeklyProgram = state.weeklyProgram.filter((w) => w.id !== action.payload);
    },

    // ========== برنامج الامتحان (examProgram) ==========
    setExamProgram: (state, action) => {
      state.examProgram = action.payload;
    },
    addExamProgram: (state, action) => {
      state.examProgram.push(action.payload);
    },
    updateExamProgram: (state, action) => {
      const index = state.examProgram.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) state.examProgram[index] = action.payload;
    },
    deleteExamProgram: (state, action) => {
      state.examProgram = state.examProgram.filter((e) => e.id !== action.payload);
    },

    // ========== جداول الطلاب والأساتذة ==========
    setStudentSchedule: (state, action) => {
      state.studentSchedule = action.payload;
    },
    addStudentSchedule: (state, action) => {
      state.studentSchedule.push(action.payload);
    },
    deleteStudentSchedule: (state, action) => {
      state.studentSchedule = state.studentSchedule.filter((s) => s.id !== action.payload);
    },

    setTeacherSchedule: (state, action) => {
      state.teacherSchedule = action.payload;
    },
    addTeacherSchedule: (state, action) => {
      state.teacherSchedule.push(action.payload);
    },
    deleteTeacherSchedule: (state, action) => {
      state.teacherSchedule = state.teacherSchedule.filter((t) => t.id !== action.payload);
    },

    // ========== المستخدمين ==========
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    addUsers: (state, action) => {
      state.users.push(action.payload);
    },
    deleteUsers: (state, action) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },

    // ========== الموظفين ==========
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    addEmployees: (state, action) => {
      state.employees.push(action.payload);
    },
    deleteEmployees: (state, action) => {
      state.employees = state.employees.filter((e) => e.id !== action.payload);
    },
    getEmployees: (state, action) => {
      state.employees = action.payload;
    },

    // ========== النقاط ==========
    setPoints: (state, action) => {
      state.points = action.payload;
    },
    getPoints: (state, action) => {
      state.points = action.payload;
    },
    addPoints: (state, action) => {
      state.points.push(action.payload);
    },
    deletePoints: (state, action) => {
      state.points = state.points.filter((p) => p.id !== action.payload);
    },

    // ========== الشكاوى ==========
    setComplaints: (state, action) => {
      state.Complaints = action.payload;
    },
    addComplaint: (state, action) => {
      state.Complaints.push(action.payload);
    },
    deleteComplaint: (state, action) => {
      state.Complaints = state.Complaints.filter((c) => c.id !== action.payload);
    },

    // ========== القاعات الامتحانية ==========
    setExamHall: (state, action) => {
      state.examHall = action.payload;
    },
    addExamHall: (state, action) => {
      state.examHall.push(action.payload);
    },
    deleteExamHall: (state, action) => {
      state.examHall = state.examHall.filter((h) => h.id !== action.payload);
    },
  },
});

export const {
  // Announcements
  setAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  
  // Polls
  setPolls,
  addPoll,
  deletePoll,
  getPollResults,
  
  // Reports
  setReports,
  addReports,
  deleteReports,
  getReports,
  
  // Weekly Program (الدوام)
  setWeeklyProgram,
  addWeeklyProgram,
  updateWeeklyProgram,
  deleteWeeklyProgram,
  
  // Exam Program (الامتحان)
  setExamProgram,
  addExamProgram,
  updateExamProgram,
  deleteExamProgram,
  
  // Student & Teacher Schedules
  setStudentSchedule,
  addStudentSchedule,
  deleteStudentSchedule,
  setTeacherSchedule,
  addTeacherSchedule,
  deleteTeacherSchedule,
  
  // Users
  setUsers,
  addUsers,
  deleteUsers,
  
  // Employees
  setEmployees,
  addEmployees,
  deleteEmployees,
  getEmployees,
  
  // Points
  setPoints,
  getPoints,
  addPoints,
  deletePoints,
  
  // Complaints
  setComplaints,
  addComplaint,
  deleteComplaint,
  
  // Exam Hall
  setExamHall,
  addExamHall,
  deleteExamHall,
  
} = adminSlice.actions;

export default adminSlice.reducer;