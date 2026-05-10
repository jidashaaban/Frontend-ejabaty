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

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/login', { email, password });
    if (response.data && response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('role', response.data.role);
    }
    return response.data;
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await apiClient.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    return { success: true };
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/user');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب معلومات المستخدم:', error);
    throw error;
  }
};

export const getDashboardMetrics = async () => {
  try {
    const response = await apiClient.get('/admin/dashboard');
    const metrics = response.data.metrics || {};
    return {
      studentsCount: metrics.students || 0,
      teachersCount: metrics.teachers || 0,
      parentsCount: metrics.parents || 0,
      pendingComplaintsCount: metrics.pending_complaints || 0,
      totalCoursesCount: metrics.total_courses || 0,
      totalPollsCount: metrics.total_polls || 0,
    };
  } catch (error) {
    console.error('خطأ في جلب إحصائيات لوحة التحكم:', error);
    throw error;
  }
};

export const getReports = async () => {
  try {
    const response = await apiClient.get('/admin/reports');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب التقارير:', error);
    throw error;
  }
};

export const getReportsByRole = async (role) => {
  try {
    const response = await apiClient.get('/admin/reports', { params: { role } });
    return response.data;
  } catch (error) {
    console.error(`خطأ في جلب تقارير ${role}:`, error);
    throw error;
  }
};

export const saveReport = async (role) => {
  try {
    const response = await apiClient.post('/admin/reports/save', null, { params: { role } });
    return response.data;
  } catch (error) {
    console.error('خطأ في حفظ التقرير:', error);
    throw error;
  }
};

export const getReportsHistory = async () => {
  try {
    const response = await apiClient.get('/admin/reports/history');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب تاريخ التقارير:', error);
    return [];
  }
};

export const getAllCourses = async () => {
  try {
    const response = await apiClient.get('/admin/courses');
    console.log(' المواد المستلمة:', response.data);
    
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && response.data.courses && Array.isArray(response.data.courses)) {
      return response.data.courses;
    }
    return [];
  } catch (error) {
    console.error(' خطأ في جلب المواد:', error);
    return [];
  }
};

export const getCourses = getAllCourses;

export const getAllStudents = async () => {
  try {
    const response = await apiClient.get('/admin/simple-students');
    console.log('الطلاب المستلمة:', response.data);
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('❌ خطأ في جلب الطلاب:', error);
    return [];
  }
};

export const addTeacherViaAPI = async (teacherData) => {
  try {
    const response = await apiClient.post('/admin/users', {
      name: teacherData.name,
      father_name: teacherData.father_name,
      last_name: teacherData.last_name,
      phone_number: teacherData.phone_number,
      email: teacherData.email,
      password: teacherData.password,
      role: 'teacher',
      subjects: teacherData.subjects || '',
      course_ids: teacherData.course_ids || [],
    });
    return response.data;
  } catch (error) {
    console.error('خطأ في إضافة الأستاذ:', error);
    throw error;
  }
};

export const addStudentViaAPI = async (studentData) => {
  try {
    const fullName = `${studentData.name} ${studentData.father_name} ${studentData.last_name}`;
    const response = await apiClient.post('/admin/users', {
      name: fullName,
      father_name: studentData.father_name,
      last_name: studentData.last_name,
      phone_number: studentData.phone_number,
      email: studentData.email || `${Date.now()}@student.edu`,
      password: studentData.password,
      role: 'student',
      grade: studentData.grade,
      past_education: studentData.past_education,
      last_years_mark: studentData.last_years_mark,
      health_state: studentData.health_state,
      status: studentData.status || 'active',
      course_ids: studentData.course_ids || [],
    });
    return response.data;
  } catch (error) {
    console.error('خطأ في إضافة الطالب:', error);
    throw error;
  }
};

export const addParentViaAPI = async (parentData) => {
  try {
    const response = await apiClient.post('/admin/users', {
      name: parentData.name,
      father_name: parentData.father_name,
      last_name: parentData.last_name,
      phone_number: parentData.phone_number,
      email: parentData.email,
      password: parentData.password,
      role: 'parent',
      student_ids: parentData.student_ids || [],
    });
    return response.data;
  } catch (error) {
    console.error('خطأ في إضافة ولي الأمر:', error);
    throw error;
  }
};

export const getAllUsers = async (role = null) => {
  try {
    if (role === 'student') {
      return await getAllStudents();
    }
    const params = role ? { role } : {};
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب المستخدمين:', error);
    return [];
  }
};

export const getWeeklyProgram = async () => {
  try {
    const response = await apiClient.get('/admin-schedule', { params: { type: 'course' } });
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب برنامج الدوام:', error);
    return null;
  }
};

export const getExamProgram = async () => {
  try {
    const response = await apiClient.get('/admin-schedule', { params: { type: 'exam' } });
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب برنامج الامتحانات:', error);
    return null;
  }
};

export const generateWeeklySchedule = async () => {
  const response = await apiClient.post('/schedule/generate', { type: 'course' });
  return response.data;
};

export const generateExamSchedule = async () => {
  const response = await apiClient.post('/schedule/generate', { type: 'exam' });
  return response.data;
};

export const deleteSession = async (sessionId) => {
  try {
    const response = await apiClient.delete(`/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('خطأ في حذف الجلسة:', error);
    throw error;
  }
};

export const deleteWeeklyProgram = deleteSession;
export const deleteExamProgram = deleteSession;

export const getHalls = async () => {
  try {
    const response = await apiClient.get('/admin/halls');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب القاعات:', error);
    return [];
  }
};

export const getRooms = getHalls;

export const addHall = async (hallData) => {
  try {
    const response = await apiClient.post('/admin/setup-halls', hallData);
    return response.data;
  } catch (error) {
    console.error('خطأ في إضافة القاعة:', error);
    throw error;
  }
};

export const updateHall = async (id, hallData) => {
  try {
    const response = await apiClient.put(`/admin/halls/${id}`, hallData);
    return response.data;
  } catch (error) {
    console.error('خطأ في تحديث القاعة:', error);
    throw error;
  }
};

export const deleteHall = async (id) => {
  try {
    const response = await apiClient.delete(`/admin/halls/${id}`);
    return response.data;
  } catch (error) {
    console.error('خطأ في حذف القاعة:', error);
    throw error;
  }
};

export const getAllPolls = async () => {
  try {
    const response = await apiClient.get('/admin/polls');
    console.log('📊 الاستبيانات المستلمة:', response.data);
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('خطأ في جلب الاستبيانات:', error);
    return [];
  }
};

export const getPolls = getAllPolls;
export const getAllPollsFromAPI = getAllPolls;

export const createPoll = async (pollData) => {
  try {
    const response = await apiClient.post('/admin/create-poll', pollData);
    return response.data;
  } catch (error) {
    console.error('خطأ في إنشاء الاستبيان:', error);
    throw error;
  }
};

export const deletePoll = async (id) => {
  try {
    const response = await apiClient.delete(`/admin/polls/${id}`);
    return response.data;
  } catch (error) {
    console.error('خطأ في حذف الاستبيان:', error);
    throw error;
  }
};

export const getPollResults = async (pollId) => {
  try {
    const response = await apiClient.get(`/admin/polls/${pollId}/results`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب نتائج الاستبيان:', error);
    throw error;
  }
};

export const getAnnouncements = async () => {
  try {
    const response = await apiClient.get('/announcements');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الإعلانات:', error);
    return [];
  }
};

export const createAnnouncement = async (data) => {
  try {
    const response = await apiClient.post('/announcements', data);
    return response.data;
  } catch (error) {
    console.error('خطأ في إنشاء الإعلان:', error);
    throw error;
  }
};

export const updateAnnouncement = async (id, data) => {
  try {
    const response = await apiClient.put(`/announcements/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('خطأ في تحديث الإعلان:', error);
    throw error;
  }
};

export const deleteAnnouncement = async (id) => {
  try {
    const response = await apiClient.delete(`/announcements/${id}`);
    return response.data;
  } catch (error) {
    console.error('خطأ في حذف الإعلان:', error);
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

export const submitComplaint = async (complaintData) => {
  try {
    const response = await apiClient.post('/parent/complaints/submit', complaintData);
    return response.data;
  } catch (error) {
    console.error('خطأ في إرسال الشكوى:', error);
    throw error;
  }
};

export const answerComplaint = async (complaintId, answer) => {
  try {
    const response = await apiClient.post(`/admin/complaints/${complaintId}/answer`, { answer });
    return response.data;
  } catch (error) {
    console.error('خطأ في الرد على الشكوى:', error);
    throw error;
  }
};

export const replyToComplaint = answerComplaint;

export const getUpcomingQuizzes = async () => {
  try {
    const response = await apiClient.get('/student/upcoming-quizzes');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الاختبارات القادمة:', error);
    return [];
  }
};

export const submitQuizPoints = async (data) => {
  try {
    const response = await apiClient.post('/quiz/submit-points', data);
    return response.data;
  } catch (error) {
    console.error('خطأ في إضافة نقاط الاختبار:', error);
    throw error;
  }
};

export const getPoints = async () => {
  try {
    const response = await apiClient.get('/student/points');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب النقاط:', error);
    return [];
  }
};

export const getStudentSchedule = async (studentId) => {
  try {
    const response = await apiClient.get(`/student/my-schedule`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب جدول الطالب:', error);
    return null;
  }
};

export const getStudentExams = async (studentId) => {
  try {
    const response = await apiClient.get(`/student/upcoming-exams`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب امتحانات الطالب:', error);
    return null;
  }
};

export const getTeacherSchedule = async (teacherId) => {
  try {
    const response = await apiClient.get(`/my-schedule/${teacherId}`, { params: { type: 'course' } });
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب جدول المعلم:', error);
    return null;
  }
};

export const getClasses = async () => {
  try {
    const response = await apiClient.get('/classes');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الصفوف:', error);
    return [];
  }
};

export { apiClient };