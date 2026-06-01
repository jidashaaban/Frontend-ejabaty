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

export const registerCourse = async ( courseId ) =>
{
  try {
    const response = await apiClient.post(`/student/courses/${courseId}/register`);
    return response.data;
  } catch (error) {
    console.error('خطأ في تسجيل المادة:', error);
    throw error;
  }
};
export const getAvailableCourses = async () => {
  try {
    const response = await apiClient.get('/student/available-courses');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب المواد المتاحة:', error);
    throw error;
  }
};
export const getActiveCourses = async () => {
  try {
    const response = await apiClient.get('/student/active-courses');
    console.log(' المواد المفعلة:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب المواد المفعلة:', error);
    return { success: false, active_courses: [] };
  }
};

export const getPendingCourses = async () => {
  try {
    const response = await apiClient.get('/student/pending-courses');
    console.log(' المواد المعلقة:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب المواد المعلقة:', error);
    return { success: false, pending_courses: [] };
  }
};
export const getPendingRegistrations = async () =>
{
  try {
    const response = await apiClient.get('/admin/course-registrations/pending');
    console.log('الطلبات المعلقة:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الطلبات المعلقة:', error);
    throw error;
  }
};

export const activateCourse = async (userId, courseId) => {
  try {
    const response = await apiClient.post('/admin/course-registrations/activate', {
      user_id: userId,
      course_id: courseId,
    });
    return response.data;
  } catch (error) {
    console.error('خطأ في تفعيل المادة:', error);
    throw error;
  }
};

export const rejectRegistration = async (userId, courseId, reason = '') => {
  try {
    const response = await apiClient.post('/admin/course-registrations/reject', {
      user_id: userId,
      course_id: courseId,
      reason: reason,
    });
    return response.data;
  } catch (error) {
    console.error('خطأ في رفض الطلب:', error);
    throw error;
  }
};

export { apiClient };
