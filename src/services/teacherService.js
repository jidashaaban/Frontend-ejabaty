import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

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

// ============= دوال الأستاذ (Teacher) =============

// جلب إحصائيات لوحة تحكم الأستاذ
export const getTeacherDashboardStats = async () => {
  try {
    const response = await apiClient.get('/teacher/dashboard');
    console.log('📊 إحصائيات لوحة التحكم:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب إحصائيات لوحة التحكم:', error);
    throw error;
  }
};

// جلب طلاب الأستاذ
export const getStudents = async () => {
  try {
    const response = await apiClient.get('/teacher/students');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الطلاب:', error);
    throw error;
  }
};

// إضافة ملاحظة على طالب
export const addNote = async (studentId, note) => {
  try {
    const response = await apiClient.post(`/teacher/students/${studentId}/notes`, { note });
    return response.data;
  } catch (error) {
    console.error('خطأ في إضافة الملاحظة:', error);
    throw error;
  }
};

// جلب جدول الأستاذ (الدوام)
export const getTeacherSchedule = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teacher/${teacherId}/schedule`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب جدول الأستاذ:', error);
    throw error;
  }
};

// جلب جميع الجداول
export const getSchedule = async () => {
  try {
    const response = await apiClient.get('/teacher/schedule');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الجداول:', error);
    throw error;
  }
};

// إضافة جدول جديد للأستاذ
export const addTeacherSchedule = async (session) => {
  try {
    const response = await apiClient.post('/teacher/schedule', session);
    return response.data;
  } catch (error) {
    console.error('خطأ في إضافة الجدول:', error);
    throw error;
  }
};

// تحديث جدول الأستاذ
export const updateTeacherSchedule = async (id, data) => {
  try {
    const response = await apiClient.put(`/teacher/schedule/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('خطأ في تحديث الجدول:', error);
    throw error;
  }
};

// حذف جدول الأستاذ
export const deleteTeacherSchedule = async (id) => {
  try {
    const response = await apiClient.delete(`/teacher/schedule/${id}`);
    return response.data;
  } catch (error) {
    console.error('خطأ في حذف الجدول:', error);
    throw error;
  }
};

// جلب المواد التي يدرسها الأستاذ
export const getTeacherSubjects = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teacher/${teacherId}/subjects`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب المواد:', error);
    throw error;
  }
};

// جلب نماذج الامتحانات
export const getExamModels = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teacher/${teacherId}/exam-models`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب نماذج الامتحانات:', error);
    throw error;
  }
};

// حفظ إجابات نموذج امتحان
export const saveAnswers = async (modelId, answers) => {
  try {
    const response = await apiClient.post(`/teacher/exam-models/${modelId}/answers`, { answers });
    return response.data;
  } catch (error) {
    console.error('خطأ في حفظ الإجابات:', error);
    throw error;
  }
};

// جلب تقييمات الطلاب
export const getStudentEvaluations = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teacher/${teacherId}/evaluations`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب التقييمات:', error);
    throw error;
  }
};

// إضافة تقييم طالب
export const addStudentEvaluation = async (evaluationData) => {
  try {
    const response = await apiClient.post('/teacher/evaluations', evaluationData);
    return response.data;
  } catch (error) {
    console.error('خطأ في إضافة التقييم:', error);
    throw error;
  }
};

// تحديث تقييم طالب
export const updateStudentEvaluation = async (id, evaluationData) => {
  try {
    const response = await apiClient.put(`/teacher/evaluations/${id}`, evaluationData);
    return response.data;
  } catch (error) {
    console.error('خطأ في تحديث التقييم:', error);
    throw error;
  }
};

// حذف تقييم طالب
export const deleteStudentEvaluation = async (id) => {
  try {
    const response = await apiClient.delete(`/teacher/evaluations/${id}`);
    return response.data;
  } catch (error) {
    console.error('خطأ في حذف التقييم:', error);
    throw error;
  }
};

// جلب امتحانات الأستاذ
export const getTeacherExams = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teacher/${teacherId}/exams`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الامتحانات:', error);
    throw error;
  }
};

// إعلان اختبار جديد
export const announceTest = async (test) => {
  try {
    const response = await apiClient.post('/teacher/announce-quiz', test);
    return response.data;
  } catch (error) {
    console.error('خطأ في إعلان الاختبار:', error);
    throw error;
  }
};

// جلب الاختبارات المعلنة
export const getAnnouncedTests = async () => {
  try {
    const response = await apiClient.get('/teacher/quizzes');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الاختبارات المعلنة:', error);
    throw error;
  }
};

// حذف اختبار معلن
export const deleteAnnouncedTest = async (id) => {
  try {
    const response = await apiClient.delete(`/teacher/quizzes/${id}`);
    return response.data;
  } catch (error) {
    console.error('خطأ في حذف الاختبار:', error);
    throw error;
  }
};

// جلب إحصائيات الأستاذ
export const getTeacherStats = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teacher/${teacherId}/stats`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الإحصائيات:', error);
    throw error;
  }
};

// جلب إشعارات الأستاذ
export const getTeacherNotifications = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teacher/${teacherId}/notifications`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الإشعارات:', error);
    throw error;
  }
};

// تحديث إشعار كمقروء
export const markTeacherNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiClient.put(`/teacher/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('خطأ في تحديث الإشعار:', error);
    throw error;
  }
};

// Alias للتوافق مع الكود القديم
export const markNotificationAsRead = markTeacherNotificationAsRead;

// ========== دوال الاستفسارات ==========

// جلب استفسارات الأستاذ
export const getInquiries = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teacher/${teacherId}/inquiries`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الاستفسارات:', error);
    throw error;
  }
};

// الرد على استفسار
export const replyToInquiry = async (inquiryId, reply) => {
  try {
    const response = await apiClient.put(`/teacher/inquiries/${inquiryId}/reply`, { reply });
    return response.data;
  } catch (error) {
    console.error('خطأ في الرد على الاستفسار:', error);
    throw error;
  }
};

export { apiClient };