const API_BASE_URL = 'http://127.0.0.1:8000/api';

const getToken = () => localStorage.getItem('token');

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || 'حدث خطأ في الطلب');
  }
  return data;
};

export const getAllCourses = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/courses`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data.data || data.courses || [];
};

export const getAllStudents = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/users?role=student`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data.data || [];
};

export const addTeacherViaAPI = async (teacherData) => {
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...teacherData, role: 'teacher' })
  });
  const data = await handleResponse(response);
  return data;
};

export const addStudentViaAPI = async (studentData) => {
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...studentData, role: 'student' })
  });
  const data = await handleResponse(response);
  return data;
};

export const addParentViaAPI = async (parentData) => {
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...parentData, role: 'parent' })
  });
  const data = await handleResponse(response);
  return data;
};

export const getAnnouncements = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/announcements`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data.data || [];
};

export const createAnnouncement = async (announcement) => {
  const response = await fetch(`${API_BASE_URL}/admin/announcements`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(announcement)
  });
  const data = await handleResponse(response);
  return data.data;
};

export const updateAnnouncement = async (id, announcement) => {
  const response = await fetch(`${API_BASE_URL}/admin/announcements/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(announcement)
  });
  const data = await handleResponse(response);
  return data.data;
};

export const deleteAnnouncement = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/announcements/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
};

export const getAllPolls = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/polls`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data.data || [];
};

export const createPoll = async (pollData) => {
  const response = await fetch(`${API_BASE_URL}/admin/create-poll`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pollData)
  });
  const data = await handleResponse(response);
  return data.data;
};

export const deletePoll = async (pollId) => {
  const response = await fetch(`${API_BASE_URL}/admin/polls/${pollId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
};

export const getPollResults = async (pollId) => {
  const response = await fetch(`${API_BASE_URL}/admin/polls/${pollId}/results`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data.data || [];
};

export const votePoll = async (pollId, answers) => {
  const response = await fetch(`${API_BASE_URL}/student/polls/${pollId}/vote`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ answers })
  });
  const data = await handleResponse(response);
  return data;
};

export const getDashboardStats = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data;
};

export const getDashboardMetrics = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/metrics`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data;
};

export const submitMark = async (markData) => {
  const response = await fetch(`${API_BASE_URL}/admin/submit-mark`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(markData)
  });
  return handleResponse(response);
};

export const addCourse = async (courseData) => {
  const response = await fetch(`${API_BASE_URL}/admin/add-course`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(courseData)
  });
  return handleResponse(response);
};

export const confirmPayment = async (paymentData) => {
  const response = await fetch(`${API_BASE_URL}/admin/confirm-payment`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paymentData)
  });
  return handleResponse(response);
};

export const getReports = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/reports`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data;
};

export const saveReport = async (reportData) => {
  const response = await fetch(`${API_BASE_URL}/admin/reports/save`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reportData)
  });
  return handleResponse(response);
};

export const getReportHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/reports/history`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data;
};

export const getReportsHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/reports/history`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data;
};

export const getReportsByRole = async (role) => {
  const response = await fetch(`${API_BASE_URL}/admin/reports?role=${role}`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data;
};

export const createPollViaAPI = async (pollData) => {
  const response = await fetch(`${API_BASE_URL}/admin/create-poll`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pollData)
  });
  const data = await handleResponse(response);
  return data;
};

export const getPollsForStudents = async () => {
  const response = await fetch(`${API_BASE_URL}/student/polls`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data.data || [];
};

export const getAllPollsFromAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/polls`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data.data || [];
};

export const setupHalls = async (hallsData) => {
  const response = await fetch(`${API_BASE_URL}/admin/setup-halls`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(hallsData)
  });
  return handleResponse(response);
};

export const getHalls = async () => {
  const response = await fetch(`${API_BASE_URL}/halls`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data.data || [];
};

export const addHall = async (hallData) => {
  const response = await fetch(`${API_BASE_URL}/admin/halls`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(hallData)
  });
  const data = await handleResponse(response);
  return data.data;
};

export const updateHall = async (id, hallData) => {
  const response = await fetch(`${API_BASE_URL}/admin/halls/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(hallData)
  });
  const data = await handleResponse(response);
  return data.data;
};

export const deleteHall = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/halls/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
};

export const generateSchedule = async (scheduleData) => {
  const response = await fetch(`${API_BASE_URL}/schedule/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(scheduleData)
  });
  return handleResponse(response);
};

export const getAdminSchedule = async () => {
  const response = await fetch(`${API_BASE_URL}/admin-schedule`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data;
};

export const getWeeklyProgram = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/weekly-program`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data.data || [];
};

export const getExamProgram = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/exam-program`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data.data || [];
};

export const generateWeeklySchedule = async (scheduleData) => {
  const response = await fetch(`${API_BASE_URL}/admin/weekly-schedule/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(scheduleData)
  });
  return handleResponse(response);
};

export const generateExamSchedule = async (scheduleData) => {
  const response = await fetch(`${API_BASE_URL}/admin/exam-schedule/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(scheduleData)
  });
  return handleResponse(response);
};

export const deleteWeeklyProgram = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/weekly-program/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
};

export const deleteExamProgram = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/exam-program/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
};

export const deleteSession = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
};

export const getNotifications = async () => {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data.data || [];
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
};

export const submitComplaint = async (complaintData) => {
  const response = await fetch(`${API_BASE_URL}/parent/complaints/submit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(complaintData)
  });
  return handleResponse(response);
};

export const getComplaints = async () => {
  const response = await fetch(`${API_BASE_URL}/parent/complaints`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data.data || [];
};

export const answerComplaint = async (complaintId, answer) => {
  const response = await fetch(`${API_BASE_URL}/admin/complaints/${complaintId}/answer`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ answer })
  });
  return handleResponse(response);
};

export const replyToComplaint = async (complaintId, replyData) => {
  const response = await fetch(`${API_BASE_URL}/admin/complaints/${complaintId}/reply`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(replyData)
  });
  return handleResponse(response);
};

export const getPoints = async () => {
  const response = await fetch(`${API_BASE_URL}/student/points`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data;
};

export const getStudentSchedule = async () => {
  const response = await fetch(`${API_BASE_URL}/student/my-schedule`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data.data || [];
};

export const getStudentExams = async () => {
  const response = await fetch(`${API_BASE_URL}/student/upcoming-exams`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data.data || [];
};

export const getCourses = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/courses`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data.data || [];
};

export const getRooms = async () => {
  const response = await fetch(`${API_BASE_URL}/halls`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data.data || [];
};

export const getClasses = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/classes`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return data.data || [];
};

export default {
  getAllCourses,
  getAllStudents,
  addTeacherViaAPI,
  addStudentViaAPI,
  addParentViaAPI,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAllPolls,
  createPoll,
  deletePoll,
  getPollResults,
  votePoll,
  getDashboardStats,
  getDashboardMetrics,
  submitMark,
  addCourse,
  confirmPayment,
  getReports,
  saveReport,
  getReportHistory,
  getReportsHistory,
  getReportsByRole,
  createPollViaAPI,
  getPollsForStudents,
  getAllPollsFromAPI,
  setupHalls,
  getHalls,
  addHall,
  updateHall,
  deleteHall,
  generateSchedule,
  getAdminSchedule,
  getWeeklyProgram,
  getExamProgram,
  generateWeeklySchedule,
  generateExamSchedule,
  deleteWeeklyProgram,
  deleteExamProgram,
  deleteSession,
  getNotifications,
  markNotificationAsRead,
  submitComplaint,
  getComplaints,
  answerComplaint,
  replyToComplaint,
  getPoints,
  getStudentSchedule,
  getStudentExams,
  getCourses,
  getRooms,
  getClasses
};