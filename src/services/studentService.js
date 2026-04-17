import { v4 as uuidv4 } from 'uuid';

let studentSchedule = [
  { 
    id: uuidv4(), 
    day: 'الأحد', 
    startTime: '09:00', 
    endTime: '10:00', 
    subject: 'الرياضيات', 
    roomName: 'قاعة 1',
    classId: 1,
  },
  { 
    id: uuidv4(), 
    day: 'الإثنين', 
    startTime: '10:00', 
    endTime: '11:00', 
    subject: 'اللغة العربية', 
    roomName: 'قاعة 2',
    classId: 1,
  },
];

let studentExams = [
  { 
    id: uuidv4(), 
    subject: 'الرياضيات', 
    day: 'الأحد',
    date: '2026-04-15', 
    startTime: '09:00', 
    endTime: '11:00',
    roomName: 'قاعة 1',
  },
  { 
    id: uuidv4(), 
    subject: 'الفيزياء', 
    day: 'الثلاثاء',
    date: '2026-04-20', 
    startTime: '11:00', 
    endTime: '13:00',
    roomName: 'قاعة 3',
  },
];

const studentTasks = [
  { id: uuidv4(), title: 'حل تمارين الوحدة الأولى', dueDate: '2026-04-05', priority: 'عالية' },
  { id: uuidv4(), title: 'كتابة تقرير عن الكهرباء', dueDate: '2026-04-07', priority: 'متوسطة' },
];

const studentGrades = [
  { id: uuidv4(), course: 'الرياضيات', grade: 85 },
  { id: uuidv4(), course: 'الفيزياء', grade: 90 },
];

const studentInstallments = [
  { id: uuidv4(), label: 'القسط الأول', amount: 1000, paid: 800 },
  { id: uuidv4(), label: 'القسط الثاني', amount: 1000, paid: 0 },
];


let studentComplaints = [];


const studentSurveys = [
  { id: uuidv4(), title: 'تقييم خدمات المكتبة', questions: [ { id: uuidv4(), type: 'rating', question: 'قيم نظافة المكتبة' } ] },
];


let studentPoints = 10;


let studentNotifications = [
  { id: uuidv4(), message: 'تم إضافة اختبار جديد في مادة الفيزياء', date: '2026-03-30', isRead: false },
];



/**
 * @param {number} studentId - معرف الطالب
 * @returns {Promise<Array>} - قائمة الجلسات الخاصة بالطالب
 */
export const getStudentSchedule = async (studentId) => {
  return Promise.resolve([...studentSchedule]);
};

/**
 * @param {number} studentId - معرف الطالب
 * @returns {Promise<Array>} - قائمة الامتحانات الخاصة بالطالب
 */
export const getStudentExams = async (studentId) => {
  return Promise.resolve([...studentExams]);
};

export const getSchedule = async () => {
  return Promise.resolve([...studentSchedule]);
};

export const getExams = async () => {
  return Promise.resolve([...studentExams]);
};


export const getTasks = async () => {
  return Promise.resolve([...studentTasks]);
};

export const addTask = async (task) => {
  const newTask = { id: uuidv4(), ...task };
  studentTasks.push(newTask);
  return Promise.resolve(newTask);
};

export const updateTask = async (id, data) => {
  const index = studentTasks.findIndex(t => t.id === id);
  if (index !== -1) {
    studentTasks[index] = { ...studentTasks[index], ...data };
    return Promise.resolve(studentTasks[index]);
  }
  return Promise.resolve(null);
};

export const deleteTask = async (id) => {
  const index = studentTasks.findIndex(t => t.id === id);
  if (index !== -1) {
    studentTasks.splice(index, 1);
  }
  return Promise.resolve();
};

export const getGrades = async () => {
  return Promise.resolve([...studentGrades]);
};

export const getGradeByCourse = async (courseId) => {
  const grade = studentGrades.find(g => g.course === courseId);
  return Promise.resolve(grade || null);
};


export const getInstallments = async () => {
  return Promise.resolve([...studentInstallments]);
};

export const getRemainingAmount = async () => {
  const total = studentInstallments.reduce((sum, inst) => sum + inst.amount, 0);
  const paid = studentInstallments.reduce((sum, inst) => sum + inst.paid, 0);
  return Promise.resolve(total - paid);
};


export const submitComplaint = async (complaint) => {
  const newComplaint = { id: uuidv4(), ...complaint, date: new Date().toISOString(), status: 'pending' };
  studentComplaints.push(newComplaint);
  return Promise.resolve(newComplaint);
};

export const getComplaints = async () => {
  return Promise.resolve([...studentComplaints]);
};

export const getComplaintById = async (id) => {
  const complaint = studentComplaints.find(c => c.id === id);
  return Promise.resolve(complaint || null);
};


export const getSurveys = async () => {
  return Promise.resolve([...studentSurveys]);
};

export const getSurveyById = async (surveyId) => {
  const survey = studentSurveys.find(s => s.id === surveyId);
  return Promise.resolve(survey || null);
};

export const submitSurveyResponse = async (surveyId, responses) => {
  return Promise.resolve({ surveyId, responses, submittedAt: new Date().toISOString() });
};

export const getPoints = async () => {
  return Promise.resolve(studentPoints);
};

export const addPoints = async (delta) => {
  studentPoints += delta;
  return Promise.resolve(studentPoints);
};

export const getTopStudents = async (limit = 3) => {
  const topStudents = [
    { id: 1, name: 'أحمد', points: 250 },
    { id: 2, name: 'سارة', points: 180 },
    { id: 3, name: 'محمد', points: 150 },
  ];
  return Promise.resolve(topStudents.slice(0, limit));
};

export const getNotifications = async () => {
  return Promise.resolve([...studentNotifications]);
};

export const getUnreadNotificationsCount = async () => {
  const unreadCount = studentNotifications.filter(n => !n.isRead).length;
  return Promise.resolve(unreadCount);
};

export const markNotificationAsRead = async (id) => {
  const index = studentNotifications.findIndex(n => n.id === id);
  if (index !== -1) {
    studentNotifications[index].isRead = true;
    return Promise.resolve(studentNotifications[index]);
  }
  return Promise.resolve(null);
};

export const markAllNotificationsAsRead = async () => {
  studentNotifications = studentNotifications.map(n => ({ ...n, isRead: true }));
  return Promise.resolve();
};

export const addNotification = async (notification) => {
  const newNotification = { id: uuidv4(), ...notification, date: new Date().toISOString(), isRead: false };
  studentNotifications.unshift(newNotification);
  return Promise.resolve(newNotification);
};

/**
 * @param {Object} session - بيانات الجلسة الجديدة
 */
export const addToStudentSchedule = async (session) => {
  const newSession = { id: uuidv4(), ...session };
  studentSchedule.push(newSession);
  return Promise.resolve(newSession);
};

/**
 * @param {Object} exam - بيانات الامتحان الجديد
 */
export const addToStudentExams = async (exam) => {
  const newExam = { id: uuidv4(), ...exam };
  studentExams.push(newExam);
  
  await addNotification({
    message: `📝 تم إضافة امتحان جديد في مادة ${exam.subject} بتاريخ ${exam.date}`,
    type: 'exam',
  });
  
  return Promise.resolve(newExam);
};

/**
 * @param {Object} notificationData - بيانات الإشعار
 */
export const sendNotificationToStudent = async (notificationData) => {
  const newNotification = {
    id: uuidv4(),
    ...notificationData,
    date: new Date().toISOString(),
    isRead: false,
  };
  studentNotifications.unshift(newNotification);
  return Promise.resolve(newNotification);
};