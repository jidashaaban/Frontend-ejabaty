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
    console.log('إحصائيات لوحة التحكم:', response.data);
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

export const getTeacherSubjects = async () => {
  try {
    const response = await apiClient.get('/my-courses');
    console.log(' المواد المستلمة:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب المواد:', error);
    return [];
  }
};

export const getExamForMarking = async (examId) => {
  try {
    const response = await apiClient.get(`/teacher/exams/${examId}/questions`);
    console.log(' أسئلة الامتحان:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب أسئلة الامتحان:', error);
    throw error;
  }
};

export const saveAnswers = async (examId, answersData) => {
  try {
    const response = await apiClient.post(`/teacher/exams/${examId}/submit-marking`, answersData);
    console.log('✅ تم حفظ الإجابات:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في حفظ الإجابات:', error);
    throw error;
  }
};

export const submitMarkingScheme = saveAnswers;

export const getMarkingSchemesByCourse = async (courseName) => {
  try {
    const response = await apiClient.get(`/teacher/courses/${encodeURIComponent(courseName)}/marking-schemes`);
    console.log(' نماذج التصحيح:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب نماذج التصحيح:', error);
    throw error;
  }
};

export const createExam = async (examData) => {
  try {
    const response = await apiClient.post('/teacher/exams/create', examData);
    console.log('✅ تم إنشاء الامتحان:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في إنشاء الامتحان:', error);
    throw error;
  }
};

export const getInquiries = async () => {
  try {
    const response = await apiClient.get('/teacher/questions/pending');
    console.log('📋 الاستفسارات المستلمة:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الاستفسارات:', error);
    throw error;
  }
};

export const replyToInquiry = async (questionId, reply) => {
  try {
    const response = await apiClient.post(`/questions/${questionId}/answer`, { answer: reply });
    console.log('✅ تم إرسال الرد:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في الرد على الاستفسار:', error);
    throw error;
  }
};

export const getTeacherNotifications = async () => {
  try {
    const response = await apiClient.get('/notifications');
    console.log(' الإشعارات:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الإشعارات:', error);
    throw error;
  }
};

export const markTeacherNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiClient.post(`/notifications/${notificationId}/read`);
    console.log('✅ تم تحديث الإشعار:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في تحديث الإشعار:', error);
    throw error;
  }
};

export const markNotificationAsRead = markTeacherNotificationAsRead;

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


export const announceTest = async (test) => {
  try {
    const payload = {
      course_name: test.course_name,
      quiz_date: test.quiz_date,
      start_time: test.start_time,
      included_content: test.included_content,
      teacher_name: test.teacher_name,
    };
    
    console.log(' إرسال بيانات الاختبار:', payload);
    const response = await apiClient.post('/teacher/announce-quiz', payload);
    console.log('✅ تم إعلان الاختبار:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في إعلان الاختبار:', error);
    throw error;
  }
};

export const getAnnouncedTests = async () => {
  try {
    const response = await apiClient.get('/teacher/quizzes');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الاختبارات المعلنة:', error);
    throw error;
  }
};

export const deleteAnnouncedTest = async (id) => {
  try {
    const response = await apiClient.delete(`/teacher/quizzes/${id}`);
    return response.data;
  } catch (error) {
    console.error('خطأ في حذف الاختبار:', error);
    throw error;
  }
};

export const getUpcomingQuizzesForStudent = async (studentId) => {
  try {
    const response = await apiClient.get(`/student/upcoming-quizzes/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الاختبارات القادمة:', error);
    throw error;
  }
};

export const getPastQuizzesForStudent = async (studentId) => {
  try {
    const response = await apiClient.get(`/student/past-quizzes/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الاختبارات السابقة:', error);
    throw error;
  }
};

export const submitQuizPoints = async (data) => {
  try {
    const payload = {
      course_name: data.course_name,
      student_name: data.student_name,
      points: data.points,
      comment: data.comment || ''
    };
    const response = await apiClient.post('/teacher/quiz/submit-points', payload);
    return response.data;
  } catch (error) {
    console.error('خطأ في إضافة نقاط الاختبار:', error);
    throw error;
  }
};

export const getAllStudents = async () => {
  try {
    const response = await apiClient.get('/admin/simple-students');
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

export const getTeacherRatings = async () => {
  try {
    const response = await apiClient.get('/teacher/ratings');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب التقييمات:', error);
    return [];
  }
};

export { apiClient };