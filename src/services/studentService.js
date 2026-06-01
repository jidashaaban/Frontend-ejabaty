import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getStudentSchedule = async () => {
  try {
    const response = await apiClient.get('/student/my-schedule');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الجدول:', error);
    return null;
  }
};

export const getStudentExams = async () => {
  try {
    const response = await apiClient.get('/student/upcoming-exams');
    if (response.data?.exams) return response.data;
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الامتحانات:', error);
    return null;
  }
};

export const getSchedule = getStudentSchedule;
export const getExams = getStudentExams;

export const getGrades = async () => {
  try {
    const response = await apiClient.get('/student/exam-history');
    console.log(' العلامات:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب العلامات:', error.message);
    return { data: [] };
  }
};

export const getPoints = async () => {
  try {
    const response = await apiClient.get('/student/my-points');
    console.log(' نقاط الطالب:', response.data);
    return { points: response.data?.points || 0 };
  } catch (error) {
    console.error('خطأ في جلب النقاط:', error.message);
    return { points: 0 };
  }
};

export const submitComplaint = async (complaintData) => {
  try {
    const response = await apiClient.post('/parent/complaints/submit', complaintData);
    return response.data;
  } catch (error) {
    console.error('خطأ في إرسال الشكوى:', error);
    throw error;
  }
};

export const getComplaints = async () => {
  try {
    const response = await apiClient.get('/parent/complaints');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الشكاوى:', error);
    return [];
  }
};

export const getNotifications = async () => {
  try {
    const response = await apiClient.get('/notifications');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الإشعارات:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiClient.post(`/notifications/${notificationId}/read`);
    console.log('✅ تم تحديث الإشعار:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في تحديث الإشعار:', error);
    throw error;
  }
};

export const getStudentPolls = async () => {
  try {
    const response = await apiClient.get('/student/polls');
    console.log(' استبيانات الطالب:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الاستبيانات:', error);
    return [];
  }
};

export const getPollById = async (pollId) => {
  try {
    const response = await apiClient.get(`/student/polls/${pollId}`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الاستبيان:', error);
    throw error;
  }
};

export const submitPollAnswers = async (pollId, answers) => {
  try {
    const formattedAnswers = Object.entries(answers).map(([questionId, optionId]) => ({
      question_id: parseInt(questionId),
      option_id: parseInt(optionId),
    }));
    console.log(' إرسال إجابات الاستبيان:', { pollId, answers: formattedAnswers });
    const response = await apiClient.post(`/student/polls/${pollId}/submit`, { answers: formattedAnswers });
    return response.data;
  } catch (error) {
    console.error('خطأ في إرسال إجابات الاستبيان:', error);
    console.error('تفاصيل الخطأ:', error.response?.data);
    throw error;
  }
};
export const getNotes = async () => {
  try {
    const response = await apiClient.get('/student/my-notes');
    const notes = response.data?.notes || [];
    return { data: notes };
  } catch (error) {
    console.error('خطأ في جلب ملاحظات الطالب:', error);
    return { data: [] };
  }
};

export const getMyInquiries = async () => {
  try {
    const response = await apiClient.get('/student/questions');
    return response.data?.data || [];
  } catch (error) {
    console.error('خطأ في جلب الاستفسارات:', error);
    return [];
  }
};

export const sendInquiry = async ({ teacher_id, course_name, question }) => {
  const response = await apiClient.post('/student/questions/ask', {
    teacher_id,
    course_name,
    question,
  });
  return response.data;
};

export const updateInquiry = async (id, question) => {
  const response = await apiClient.put(`/student/questions/${id}`, { question });
  return response.data;
};

export const deleteInquiry = async (id) => {
  const response = await apiClient.delete(`/student/questions/${id}`);
  return response.data;
};

export const getActiveCourses = async () => {
  try {
    const response = await apiClient.get('/student/active-courses');
    return response.data?.active_courses || [];
  } catch (error) {
    console.error('خطأ في جلب المواد المفعلة:', error);
    return [];
  }
};

export const getAvailableCourses = async () => {
  try {
    const response = await apiClient.get('/student/available-courses');
    console.log(' المواد المتاحة:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في جلب المواد المتاحة:', error);
    return { available_courses: [] };
  }
};

export const getActiveCoursesEnhanced = async () => {
  try {
    const response = await apiClient.get('/student/my-courses');
    console.log('✅ المواد المفعلة :', response.data);
    
    let courses = [];
    if (Array.isArray(response.data)) {
      courses = response.data.filter(c => c.status === 'approved' || c.pivot?.status === 'approved');
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      courses = response.data.data.filter(c => c.status === 'approved' || c.pivot?.status === 'approved');
    } else if (response.data?.courses && Array.isArray(response.data.courses)) {
      courses = response.data.courses.filter(c => c.status === 'approved' || c.pivot?.status === 'approved');
    }
    
    return { success: true, active_courses: courses };
  } catch (error) {
    console.error('❌ خطأ في جلب المواد المفعلة:', error);
    return { success: false, active_courses: [] };
  }
};

export const getPendingCourses = async () => {
  try {
    const response = await apiClient.get('/student/pending-courses');
    console.log(' المواد المعلقة :', response.data);
    
    let courses = [];
    if (Array.isArray(response.data)) {
      courses = response.data.filter(c => c.status === 'pending' || c.pivot?.status === 'pending');
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      courses = response.data.data.filter(c => c.status === 'pending' || c.pivot?.status === 'pending');
    } else if (response.data?.courses && Array.isArray(response.data.courses)) {
      courses = response.data.courses.filter(c => c.status === 'pending' || c.pivot?.status === 'pending');
    }
    
    return { success: true, pending_courses: courses };
  } catch (error) {
    console.error('❌ خطأ في جلب المواد المعلقة:', error);
    return { success: false, pending_courses: [] };
  }
};

export const registerCourse = async (courseId) => {
  try {
    const response = await apiClient.post(`/student/courses/${courseId}/join`, { status: 'pending' });
    console.log('✅ تم إرسال طلب التسجيل:', response.data);
    return { success: true, message: 'تم إرسال طلب التسجيل بنجاح' };
  } catch (error) {
    console.error('❌ خطأ في إرسال طلب التسجيل:', error);
    throw error;
  }
};

export const joinCourseWithStatus = async (courseId, status = 'pending') => {
  try {
    const response = await apiClient.post(`/student/courses/${courseId}/join`, { status });
    console.log('✅ تم التسجيل في المادة:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في التسجيل في المادة:', error);
    throw error;
  }
};

export { apiClient };