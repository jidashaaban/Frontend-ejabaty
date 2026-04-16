import { createSlice } from '@reduxjs/toolkit';

/**
 * شريحة الأستاذ
 * تخزن بيانات الطلاب الذين يدرسهم، الجدول، النماذج الامتحانية، وغيرها.
 */
const initialState = {
  students: [],           // قائمة الطلاب المرتبطين بالأستاذ
  schedule: [],           // جدول الأستاذ (فقط المواد التي يدرسها)
  examModels: [],         // النماذج الامتحانية التي رفعها الأستاذ
  tests: [],              // الاختبارات التي أعلن عنها الأستاذ
  inquiries: [],          // الاستفسارات الموجهة للأستاذ
  notes: [],              // ملاحظات الأستاذ على الطلاب
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    // ========== الطلاب ==========
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    addStudent: (state, action) => {
      state.students.push(action.payload);
    },
    updateStudent: (state, action) => {
      const index = state.students.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) state.students[index] = action.payload;
    },
    deleteStudent: (state, action) => {
      state.students = state.students.filter((s) => s.id !== action.payload);
    },

    // ========== جدول الأستاذ ==========
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

    // ========== النماذج الامتحانية ==========
    setExamModels: (state, action) => {
      state.examModels = action.payload;
    },
    addExamModel: (state, action) => {
      state.examModels.push(action.payload);
    },
    deleteExamModel: (state, action) => {
      state.examModels = state.examModels.filter((m) => m.id !== action.payload);
    },

    // ========== الاختبارات المعلنة ==========
    setTests: (state, action) => {
      state.tests = action.payload;
    },
    addTest: (state, action) => {
      state.tests.push(action.payload);
    },
    updateTest: (state, action) => {
      const index = state.tests.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) state.tests[index] = action.payload;
    },
    deleteTest: (state, action) => {
      state.tests = state.tests.filter((t) => t.id !== action.payload);
    },

    // ========== الاستفسارات ==========
    setInquiries: (state, action) => {
      state.inquiries = action.payload;
    },
    addInquiry: (state, action) => {
      state.inquiries.push(action.payload);
    },
    replyToInquiry: (state, action) => {
      const index = state.inquiries.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.inquiries[index].reply = action.payload.reply;
        state.inquiries[index].replied = true;
      }
    },

    // ========== ملاحظات الطلاب ==========
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    addNote: (state, action) => {
      const { studentId, note } = action.payload;
      // إضافة الملاحظة للطالب المحدد
      const studentIndex = state.students.findIndex((s) => s.id === studentId);
      if (studentIndex !== -1) {
        if (!state.students[studentIndex].notes) {
          state.students[studentIndex].notes = [];
        }
        state.students[studentIndex].notes.push({
          id: Date.now(),
          text: note,
          date: new Date().toISOString(),
        });
      }
      state.notes.push({ studentId, note, date: new Date().toISOString() });
    },
  },
});

export const {
  // Students
  setStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  
  // Schedule (جدول الأستاذ)
  setSchedule,
  addToSchedule,
  updateSchedule,
  deleteFromSchedule,
  
  // Exam Models
  setExamModels,
  addExamModel,
  deleteExamModel,
  
  // Tests
  setTests,
  addTest,
  updateTest,
  deleteTest,
  
  // Inquiries
  setInquiries,
  addInquiry,
  replyToInquiry,
  
  // Notes
  setNotes,
  addNote,
  
} = teacherSlice.actions;

export default teacherSlice.reducer;