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
      localStorage.setItem('user_id', response.data.user_id || response.data.id);
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
    localStorage.removeItem('user_id');
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
    return { topStudents: {}, surveyResults: [] };
  }
};

export const getReportsByRole = async (role) => {
  try {
    const response = await apiClient.get('/admin/reports', { params: { role } });
    console.log(' تقرير الدور:', response.data);
    return response.data;
  } catch (error) {
    console.error(`خطأ في جلب تقارير ${role}:`, error);
    throw error;
  }
};

export const saveReport = async (role) => {
  try {
    const response = await apiClient.post('/admin/reports/save', null, { 
      params: { role } 
    });
    console.log(' حفظ التقرير:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في حفظ التقرير:', error);
    throw error;
  }
};

export const getReportsHistory = async () => {
  try {
    const response = await apiClient.get('/admin/reports/history');
    console.log(' تاريخ التقارير من API:', response.data);
    
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (response.data && response.data.reports && Array.isArray(response.data.reports)) {
      return response.data.reports;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
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
    return [];
  } catch (error) {
    console.error('خطأ في جلب المواد:', error);
    return [];
  }
};

export const getCourses = getAllCourses;

export const addCourse = async (courseData) => {
  try {
    const response = await apiClient.post('/admin/add-course', {
      name: courseData.name,
      code: courseData.code,
      capacity: courseData.capacity,
      teacher_name: courseData.teacher_name,
    });
    console.log('✅ تم إضافة المادة:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في إضافة المادة:', error);
    console.error('تفاصيل الخطأ:', error.response?.data);
    throw error;
  }
};

export const updateCourse = async (id, courseData) => {
  try {
    const response = await apiClient.put(`/admin/courses/${id}`, {
      name: courseData.name,
      code: courseData.code,
      capacity: courseData.capacity,
      teacher_name: courseData.teacher_name,
    });
    console.log('✅ تم تعديل المادة:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في تعديل المادة:', error);
    throw error;
  }
};

export const deleteCourse = async (id) => {
  try {
    const response = await apiClient.delete(`/admin/courses/${id}`);
    console.log('✅ تم حذف المادة:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في حذف المادة:', error);
    throw error;
  }
};

export const toggleCourseStatus = async (id, status) => {
  try {
    const response = await apiClient.patch(`/courses/${id}/toggle-status`, { is_active: status });
    console.log('✅ تم تغيير حالة المادة:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في تغيير حالة المادة:', error);
    throw error;
  }
};

export const getAnnouncements = getAllCourses;
export const createAnnouncement = addCourse;
export const updateAnnouncement = updateCourse;
export const deleteAnnouncement = deleteCourse;

export const getAllStudents = async () => {
  try {
    const response = await apiClient.get('/admin/simple-students');
    console.log('✅ الطلاب المستلمة:', response.data);
    
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

export const getAvailableStudents = async () => {
  try {
    const response = await apiClient.get('/admin/available-students');
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('خطأ في جلب الطلاب غير المرتبطين:', error);
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
    console.log('🏢 القاعات المستلمة:', response.data);
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('خطأ في جلب القاعات:', error);
    return [];
  }
};

export const getRooms = getHalls;

export const addHall = async (hallData) => {
  try {
    const response = await apiClient.post('/admin/setup-halls', {
      name: hallData.name,
      capacity: hallData.capacity
    });
    return response.data;
  } catch (error) {
    console.error('خطأ في إضافة القاعة:', error);
    throw error;
  }
};

export const updateHall = async (id, hallData) => {
  try {
    const response = await apiClient.put(`/admin/halls/${id}`, {
      name: hallData.name,
      capacity: hallData.capacity
    });
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
    const payload = {
      title: pollData.title,
      description: pollData.description || '',
      expires_at: pollData.expires_at,
      questions: pollData.questions
    };
    console.log('📤 بيانات الاستبيان المرسلة:', JSON.stringify(payload, null, 2));
    const response = await apiClient.post('/admin/create-poll', payload);
    return response.data;
  } catch (error) {
    console.error('خطأ في إنشاء الاستبيان:', error);
    console.error('تفاصيل الخطأ:', error.response?.data);
    throw error;
  }
};

export const updatePoll = async (id, pollData) => {
  try {
    const response = await apiClient.put(`/admin/polls/${id}`, {
      title: pollData.title,
      description: pollData.description || '',
      expires_at: pollData.expires_at,
      questions: pollData.questions
    });
    return response.data;
  } catch (error) {
    console.error('خطأ في تحديث الاستبيان:', error);
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
    return [];
  }
};

export const getPollById = async (id) => {
  try {
    const response = await apiClient.get(`/admin/polls/${id}`);
    console.log('استبيان واحد:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الاستبيان:', error);
    throw error;
  }
};

export const getRealNotifications = async () => {
  try {
    const response = await apiClient.get('/notifications');
    console.log(' الإشعارات المستلمة:', response.data);
    return {
      unread_count: response.data.unread_count || 0,
      notifications: response.data.notifications || []
    };
  } catch (error) {
    console.error('خطأ في جلب الإشعارات:', error);
    return { unread_count: 0, notifications: [] };
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiClient.post(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('خطأ في تحديث الإشعار:', error);
    throw error;
  }
};

export const getComplaints = async () => {
  try {
    const response = await apiClient.get('/admin/complaints');
    console.log(' الشكاوى:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الشكاوى:', error);
    return [];
  }
};

export const replyToComplaint = async (complaintId, answer) => {
  try {
    const response = await apiClient.post(`/admin/complaints/${complaintId}/answer`, {
      answer_text: answer
    });
    console.log('✅ تم إرسال الرد:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في الرد على الشكوى:', error);
    throw error;
  }
};

export const updateComplaintAnswer = async (complaintId, answer) => {
  try {
    const response = await apiClient.put(`/admin/complaints/${complaintId}/answer`, {
      answer_text: answer
    });
    console.log(' تم تحديث الرد:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في تحديث الرد:', error);
    throw error;
  }
};

export const deleteComplaint = async (id) => {
  try {
    const response = await apiClient.delete(`/admin/complaints/${id}`);
    console.log('تم حذف الشكوى:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في حذف الشكوى:', error);
    throw error;
  }
};

export const getUpcomingQuizzes = async () => {
  try {
    const response = await apiClient.get('/student/upcoming-quizzes');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الاختبارات القادمة:', error);
    return [];
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
    const response = await apiClient.get('/student/my-schedule');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب جدول الطالب:', error);
    return null;
  }
};

export const getStudentExams = async (studentId) => {
  try {
    const response = await apiClient.get('/student/upcoming-exams');
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