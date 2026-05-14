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

// ============= ✅ دوال ولي الأمر (Parent) ✅ =============

// جلب أبناء ولي الأمر
export const getChildren = async () => {
  try {
    const response = await apiClient.get('/parent/children');
    console.log('👨‍👧‍👦 أبناء ولي الأمر:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب أبناء ولي الأمر:', error);
    throw error;
  }
};

// جلب تقدم الطالب
export const getChildProgress = async (childId) => {
  try {
    const response = await apiClient.get(`/parent/child/${childId}/progress`);
    console.log('📊 تقدم الطالب:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب تقدم الطالب:', error);
    throw error;
  }
};

// جلب جدول امتحانات الطالب
export const getChildExamSchedule = async (childId) => {
  try {
    const response = await apiClient.get(`/parent/child/${childId}/exam-schedule`);
    console.log('📚 جدول امتحانات الطالب:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب جدول امتحانات الطالب:', error);
    throw error;
  }
};

// جلب نقاط الطالب
export const getStudentPoints = async (studentId) => {
  try {
    const response = await getChildProgress(studentId);
    let totalPoints = 0;
    
    if (response && response.success === true) {
      const quizProgress = Array.isArray(response.quiz_progress) ? response.quiz_progress : [];
      totalPoints = quizProgress.reduce((sum, quiz) => sum + (parseInt(quiz.points) || 0), 0);
    }
    
    return { points: totalPoints };
  } catch (error) {
    console.error('خطأ في جلب نقاط الطالب:', error);
    throw error;
  }
};

// جلب امتحانات الطالب
export const getStudentExams = async (studentId) => {
  try {
    const response = await getChildExamSchedule(studentId);
    let examsList = [];
    
    if (response && response.success === true && response.exam_schedule) {
      examsList = response.exam_schedule.map(session => ({
        id: session.id,
        subject: session.course?.name || 'غير محدد',
        date: session.date || session.exam_date || '',
        time: session.start_time && session.end_time 
          ? `${session.start_time.substring(0, 5)} - ${session.end_time.substring(0, 5)}` 
          : (session.time || ''),
        room: session.hall?.name || session.room || 'غير محدد',
        teacher: session.course?.teacher?.name || 'غير محدد',
      }));
    }
    
    return examsList;
  } catch (error) {
    console.error('خطأ في جلب امتحانات الطالب:', error);
    throw error;
  }
};

// جلب ملاحظات الطالب
export const getStudentNotes = async (studentId) => {
  try {
    const response = await apiClient.get(`/parent/child/${studentId}/notes`);
    console.log('📝 ملاحظات الطالب:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب ملاحظات الطالب:', error);
    throw error;
  }
};

// جلب درجات الطالب
export const getStudentGrades = async (studentId) => {
  try {
    const response = await apiClient.get(`/parent/child/${studentId}/grades`);
    console.log('📊 درجات الطالب:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب درجات الطالب:', error);
    throw error;
  }
};

// ============= ✅ دوال الشكاوى (Complaints) ✅ =============

// إرسال شكوى
export const submitComplaint = async (subject, complaintText) => {
  try {
    const payload = {
      subject: subject,
      complaint_text: complaintText
    };
    console.log('📤 إرسال الشكوى:', payload);
    
    const response = await apiClient.post('/parent/complaints/submit', payload);
    console.log('✅ تم إرسال الشكوى:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في إرسال الشكوى:', error);
    throw error;
  }
};

// جلب الشكاوى السابقة
export const getComplaints = async () => {
  try {
    const response = await apiClient.get('/parent/complaints');
    console.log('📋 الشكاوى:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الشكاوى:', error);
    throw error;
  }
};

// حذف شكوى
export const deleteComplaint = async (id) => {
  try {
    const response = await apiClient.delete(`/parent/complaints/${id}`);
    console.log('🗑️ تم حذف الشكوى:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في حذف الشكوى:', error);
    throw error;
  }
};

// تحديث شكوى
export const updateComplaint = async (id, complaintData) => {
  try {
    const payload = {
      subject: complaintData.title,
      complaint_text: complaintData.message,
    };
    const response = await apiClient.put(`/parent/complaints/${id}`, payload);
    console.log('✏️ تم تحديث الشكوى:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في تحديث الشكوى:', error);
    throw error;
  }
};

// ============= ✅ دوال الإشعارات (Notifications) ✅ =============

// جلب إشعارات ولي الأمر
export const getParentNotifications = async () => {
  try {
    const response = await apiClient.get('/notifications');
    console.log('🔔 إشعارات ولي الأمر:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الإشعارات:', error);
    throw error;
  }
};

// تحديث إشعار كمقروء
export const markParentNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiClient.post(`/notifications/${notificationId}/read`);
    console.log('✅ تم تحديث الإشعار:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في تحديث الإشعار:', error);
    throw error;
  }
};

export { apiClient };