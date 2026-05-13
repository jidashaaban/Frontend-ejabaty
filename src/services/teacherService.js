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

export const getStudents = async () => {
  try {
    const response = await apiClient.get('/teacher/students');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الطلاب:', error);
    throw error;
  }
};

export const addNote = async (studentId, note) => {
  try {
    const response = await apiClient.post(`/teacher/students/${studentId}/notes`, { note });
    return response.data;
  } catch (error) {
    console.error('خطأ في إضافة الملاحظة:', error);
    throw error;
  }
};

export const getTeacherSchedule = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teacher/${teacherId}/schedule`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب جدول الأستاذ:', error);
    throw error;
  }
};

export const getSchedule = async () => {
  try {
    const response = await apiClient.get('/teacher/schedule');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الجداول:', error);
    throw error;
  }
};

export const addTeacherSchedule = async (session) => {
  try {
    const response = await apiClient.post('/teacher/schedule', session);
    return response.data;
  } catch (error) {
    console.error('خطأ في إضافة الجدول:', error);
    throw error;
  }
};

export const updateTeacherSchedule = async (id, data) => {
  try {
    const response = await apiClient.put(`/teacher/schedule/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('خطأ في تحديث الجدول:', error);
    throw error;
  }
};

export const deleteTeacherSchedule = async (id) => {
  try {
    const response = await apiClient.delete(`/teacher/schedule/${id}`);
    return response.data;
  } catch (error) {
    console.error('خطأ في حذف الجدول:', error);
    throw error;
  }
};

export const getTeacherSubjects = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teacher/${teacherId}/my-courses`);
    console.log('📚 المواد:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب المواد:', error);
    throw error;
  }
};

export const getExamModels = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teacher/${teacherId}/exam-models`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب نماذج الامتحانات:', error);
    throw error;
  }
};

export const saveAnswers = async (modelId, answers) => {
  try {
    const response = await apiClient.post(`/teacher/exam-models/${modelId}/answers`, { answers });
    return response.data;
  } catch (error) {
    console.error('خطأ في حفظ الإجابات:', error);
    throw error;
  }
};

export const getStudentEvaluations = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teacher/${teacherId}/evaluations`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب التقييمات:', error);
    throw error;
  }
};

export const addStudentEvaluation = async (evaluationData) => {
  try {
    const response = await apiClient.post('/teacher/evaluations', evaluationData);
    return response.data;
  } catch (error) {
    console.error('خطأ في إضافة التقييم:', error);
    throw error;
  }
};

export const updateStudentEvaluation = async (id, evaluationData) => {
  try {
    const response = await apiClient.put(`/teacher/evaluations/${id}`, evaluationData);
    return response.data;
  } catch (error) {
    console.error('خطأ في تحديث التقييم:', error);
    throw error;
  }
};

export const deleteStudentEvaluation = async (id) => {
  try {
    const response = await apiClient.delete(`/teacher/evaluations/${id}`);
    return response.data;
  } catch (error) {
    console.error('خطأ في حذف التقييم:', error);
    throw error;
  }
};

export const getTeacherExams = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teacher/${teacherId}/exams`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الامتحانات:', error);
    throw error;
  }
};

export const announceTest = async (test) => {
  try {
    const payload = {
      course_name: test.course_name,           
      quiz_date: test.quiz_date,               
      start_time: test.start_time,             
      included_content: test.included_content, 
      teacher_name: test.teacher_name,         
    };
    
    console.log(' إرسال بيانات الاختبار إلى الباك:', payload);
    const response = await apiClient.post('/teacher/announce-quiz', payload);
    console.log('✅ تم إعلان الاختبار:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في إعلان الاختبار:', error);
    throw error;
  }
};

export const getAnnouncedTests = async () => {
  console.warn('⚠️ لا يوجد endpoint مخصص لجلب اختبارات الأستاذ في الباك اند حالياً');
  return [];
};

export const deleteAnnouncedTest = async (id) => {
  console.warn(`⚠️ دالة حذف الاختبار (ID: ${id}) غير متوفرة في الباك اند حالياً`);
  throw new Error('حذف الاختبار غير متاح حالياً، هذه الميزة قيد التطوير');
};

export const getUpcomingQuizzesForStudent = async (studentId) => {
  try {
    const response = await apiClient.get(`/student/upcoming-quizzes/${studentId}`);
    console.log(' الاختبارات القادمة للطالب:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الاختبارات القادمة:', error);
    throw error;
  }
};

export const getPastQuizzesForStudent = async (studentId) => {
  try {
    const response = await apiClient.get(`/student/past-quizzes/${studentId}`);
    console.log('📋 الاختبارات السابقة:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الاختبارات السابقة:', error);
    throw error;
  }
};

export const getUpcomingQuizzes = async () => {
  try {
    console.warn('⚠️ استخدم getUpcomingQuizzesForStudent(studentId) بدلاً من getUpcomingQuizzes');
    const response = await apiClient.get('/student/upcoming-quizzes');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الاختبارات القادمة:', error);
    throw error;
  }
};

export const getPastQuizzes = async () => {
  try {
    console.warn('⚠️ استخدم getPastQuizzesForStudent(studentId) بدلاً من getPastQuizzes');
    const response = await apiClient.get('/student/past-quizzes');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الاختبارات السابقة:', error);
    throw error;
  }
};

export const getTeacherStats = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teacher/${teacherId}/stats`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الإحصائيات:', error);
    throw error;
  }
};

export const getTeacherNotifications = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teacher/${teacherId}/notifications`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الإشعارات:', error);
    throw error;
  }
};

export const markTeacherNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiClient.put(`/teacher/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('خطأ في تحديث الإشعار:', error);
    throw error;
  }
};

export const markNotificationAsRead = markTeacherNotificationAsRead;

export const submitQuizPoints = async (data) => {
  try {
    const payload = {
      course_name: data.course_name,
      student_name: data.student_name,
      points: data.points,
      comment: data.comment || ''
    };
    console.log('📤 إرسال نقاط الاختبار:', payload);
    const response = await apiClient.post('/teacher/quiz/submit-points', payload);
    console.log('✅ تم إضافة نقاط الاختبار:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في إضافة نقاط الاختبار:', error);
    throw error;
  }
};

export const getInquiries = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teacher/${teacherId}/inquiries`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الاستفسارات:', error);
    throw error;
  }
};

export const replyToInquiry = async (inquiryId, reply) => {
  try {
    const response = await apiClient.put(`/teacher/inquiries/${inquiryId}/reply`, { reply });
    return response.data;
  } catch (error) {
    console.error('خطأ في الرد على الاستفسار:', error);
    throw error;
  }
};

export const getTeachersList = async (courseName) => {
  try {
    const response = await apiClient.get(`/course/${encodeURIComponent(courseName)}/teachers`);
    console.log(' أساتذة المادة:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب أساتذة المادة:', error);
    return [];
  }
};

export const getAllStudents = async () => {
  try {
    const response = await apiClient.get('/admin/simple-students');
    console.log(' جميع الطلاب:', response.data);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('خطأ في جلب جميع الطلاب:', error);
    return [];
  }
};

export { apiClient };