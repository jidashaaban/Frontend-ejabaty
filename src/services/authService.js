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
  console.log('📧 محاولة تسجيل دخول:', email);
  
  try {
    const response = await apiClient.post('/login', { email, password });
    
    console.log('✅ الاستجابة:', response.data);
    
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    
    if (response.data.role) {
      const user = {
        id: 1,
        name: email === 'admin@school.com' ? 'مدير النظام' : 'مستخدم',
        email: email,
        role: response.data.role
      };
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return {
      token: response.data.access_token,
      user: {
        id: 1,
        name: email === 'admin@school.com' ? 'مدير النظام' : 'مستخدم',
        email: email,
        role: response.data.role
      }
    };
  } catch (error) {
    console.error('❌ خطأ:', error.response?.data || error.message);
    throw error.response?.data || { message: 'فشل في تسجيل الدخول' };
  }
};

export const logout = async () => {
  try {
    await apiClient.post('/logout');
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getCurrentToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};