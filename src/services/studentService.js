import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor لإضافة التوكن
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============= دوال جدول الطالب =============

// جلب جدول الطالب (الدوام)
export const getStudentSchedule = async () => {
  try {
    const response = await apiClient.get('/student/my-schedule');
    console.log('📅 جدول الطالب:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في جلب جدول الطالب:', error);
    if (error.response?.status === 404) {
      return { success: false, message: 'لا يوجد جدول دوام' };
    }
    throw error;
  }
};

// جلب الامتحانات القادمة
export const getUpcomingExams = async () => {
  try {
    const response = await apiClient.get('/student/upcoming-exams');
    console.log('📝 الامتحانات القادمة:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في جلب الامتحانات القادمة:', error);
    return [];
  }
};

// جلب سجل الامتحانات السابقة (مع الدرجات)
export const getExamHistory = async () => {
  try {
    const response = await apiClient.get('/student/exam-history');
    console.log('📊 سجل الامتحانات:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في جلب سجل الامتحانات:', error);
    return [];
  }
};

// ============= دوال الاختبارات (Quizzes) =============

// جلب الاختبارات القادمة
export const getUpcomingQuizzes = async () => {
  try {
    const response = await apiClient.get('/student/upcoming-quizzes');
    console.log('📚 الاختبارات القادمة:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في جلب الاختبارات القادمة:', error);
    return [];
  }
};

// جلب الاختبارات السابقة
export const getPastQuizzes = async () => {
  try {
    const response = await apiClient.get('/student/past-quizzes');
    console.log('📚 الاختبارات السابقة:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في جلب الاختبارات السابقة:', error);
    return [];
  }
};

// ============= دوال النقاط =============

// جلب النقاط - ✅ ترجع قيمة رقمية مباشرة
export const getPoints = async () => {
  try {
    const examHistory = await getExamHistory();
    let totalPoints = 0;
    
    if (Array.isArray(examHistory)) {
      totalPoints = examHistory.reduce((sum, exam) => sum + (exam.marks_obtained || exam.points || 0), 0);
    } else if (examHistory?.data && Array.isArray(examHistory.data)) {
      totalPoints = examHistory.data.reduce((sum, exam) => sum + (exam.marks_obtained || exam.points || 0), 0);
    }
    
    console.log('⭐ مجموع النقاط:', totalPoints);
    // ✅ إرجاع رقم مباشرة وليس كائن
    return totalPoints;
  } catch (error) {
    console.error('❌ خطأ في جلب النقاط:', error);
    return 0;
  }
};

// جلب النقاط (اسم بديل) - ✅ أيضاً يرجع رقم
export const getStudentPoints = getPoints;

// ============= دوال المواد الدراسية =============

// جلب المواد المتاحة للتسجيل
export const getAvailableCourses = async () => {
  try {
    const response = await apiClient.get('/student/available-courses');
    console.log('📚 المواد المتاحة:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في جلب المواد المتاحة:', error);
    return [];
  }
};

// جلب المواد التي سجل فيها الطالب
export const getMyCourses = async () => {
  try {
    const response = await apiClient.get('/student/my-courses');
    console.log('📚 المواد المسجلة (خام):', response.data);
    
    let coursesArray = [];
    
    if (Array.isArray(response.data)) {
      coursesArray = response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      coursesArray = response.data.data;
    } else if (response.data?.courses && Array.isArray(response.data.courses)) {
      coursesArray = response.data.courses;
    }
    
    coursesArray = coursesArray.map(course => ({
      id: course.id,
      name: course.name,
      code: course.code,
      status: course.pivot?.status || course.status || 'approved',
    }));
    
    console.log('✅ المواد بعد المعالجة:', coursesArray);
    return coursesArray;
  } catch (error) {
    console.error('❌ خطأ في جلب المواد المسجلة:', error);
    return [];
  }
};

// التسجيل في مادة
export const joinCourse = async (courseId) => {
  try {
    const response = await apiClient.post(`/student/courses/${courseId}/join`);
    console.log('✅ تم التسجيل في المادة:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في التسجيل في المادة:', error);
    throw error;
  }
};

// ============= دوال الاستبيانات (Polls / Surveys) =============

// جلب جميع الاستبيانات
export const getSurveys = async () => {
  try {
    const response = await apiClient.get('/student/polls');
    console.log('📊 الاستبيانات:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في جلب الاستبيانات:', error);
    return [];
  }
};

// جلب جميع الاستبيانات
export const getStudentPolls = getSurveys;

// جلب استبيان محدد
export const getPollById = async (pollId) => {
  try {
    const response = await apiClient.get(`/student/polls/${pollId}`);
    console.log('📊 تفاصيل الاستبيان:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في جلب تفاصيل الاستبيان:', error);
    throw error;
  }
};

// إرسال إجابات الاستبيان
export const submitSurveyResponse = async (pollId, answers) => {
  try {
    const response = await apiClient.post(`/student/polls/${pollId}/submit`, { answers });
    console.log('✅ تم إرسال إجابات الاستبيان:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في إرسال الإجابات:', error);
    throw error;
  }
};

// إرسال إجابات الاستبيان (اسم بديل)
export const submitPollAnswers = submitSurveyResponse;

// ============= دوال الاستفسارات (للاستاذ) =============

// إرسال استفسار للأستاذ
export const submitInquiry = async (inquiryData) => {
  try {
    const response = await apiClient.post('/student/questions/ask', inquiryData);
    console.log('✅ تم إرسال الاستفسار للأستاذ:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في إرسال الاستفسار:', error);
    throw error;
  }
};

// إرسال سؤال (اسم بديل)
export const askQuestion = submitInquiry;

// جلب استفساراتي
export const getMyInquiries = async () => {
  try {
    const response = await apiClient.get('/student/questions');
    console.log('❓ استفساراتي:', response.data);
    
    let inquiriesArray = [];
    if (Array.isArray(response.data)) {
      inquiriesArray = response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      inquiriesArray = response.data.data;
    } else if (response.data?.questions && Array.isArray(response.data.questions)) {
      inquiriesArray = response.data.questions;
    }
    
    return inquiriesArray;
  } catch (error) {
    console.error('❌ خطأ في جلب الاستفسارات:', error);
    return [];
  }
};

// جلب أسئلتي (اسم بديل)
export const getMyQuestions = getMyInquiries;

// تعديل استفسار
export const updateInquiry = async (id, inquiryData) => {
  try {
    const response = await apiClient.put(`/student/questions/${id}`, inquiryData);
    console.log('✏️ تم تعديل الاستفسار:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في تعديل الاستفسار:', error);
    throw error;
  }
};

// تعديل سؤال (اسم بديل)
export const updateQuestion = updateInquiry;

// حذف استفسار
export const deleteInquiry = async (id) => {
  try {
    const response = await apiClient.delete(`/student/questions/${id}`);
    console.log('🗑️ تم حذف الاستفسار:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في حذف الاستفسار:', error);
    throw error;
  }
};

// حذف سؤال (اسم بديل)
export const deleteQuestion = deleteInquiry;

// ============= دوال الإشعارات =============

// جلب الإشعارات
export const getNotifications = async () => {
  try {
    const response = await apiClient.get('/notifications');
    console.log('🔔 الإشعارات:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في جلب الإشعارات:', error);
    return { unread_count: 0, notifications: [] };
  }
};

export { apiClient };