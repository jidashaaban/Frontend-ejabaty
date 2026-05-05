import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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

let announcements = [
  { id: uuidv4(), title: 'إعلان عن دورة الرياضيات', description: 'سيتم افتتاح دورة رياضيات جديدة في الأسبوع القادم.', date: '2026-04-01', published: true },
  { id: uuidv4(), title: 'مسابقة البرمجة', description: 'نعلن عن مسابقة برمجية لطلاب السنة الثانية.', date: '2026-03-15', published: false },
];

let polls = [
  { 
    id: uuidv4(), 
    title: 'استبيان رضا الطلاب', 
    description: 'ما مدى رضاك عن خدمات المعهد؟', 
    date: '2026-04-01', 
    questions: [
      { id: 1, text: 'كيف تقيم جودة التدريس؟', options: ['ممتاز', 'جيد', 'متوسط', 'ضعيف'] },
      { id: 2, text: 'كيف تقيم نظافة المرافق؟', options: ['ممتاز', 'جيد', 'متوسط', 'ضعيف'] },
    ],
    results: [] 
  },
  { 
    id: uuidv4(), 
    title: 'تقييم جودة التدريس', 
    description: 'قيم مستوى التدريس في المعهد', 
    date: '2026-04-05', 
    questions: [
      { id: 1, text: 'مدى فهم المادة؟', options: ['ممتاز', 'جيد', 'متوسط', 'ضعيف'] },
      { id: 2, text: 'وضوح الشرح؟', options: ['ممتاز', 'جيد', 'متوسط', 'ضعيف'] },
    ],
    results: [] 
  },
  { 
    id: uuidv4(), 
    title: 'استبيان المرافق', 
    description: 'تقييم نظافة وتجهيزات المعهد', 
    date: '2026-04-10', 
    questions: [
      { id: 1, text: 'نظافة القاعات؟', options: ['ممتاز', 'جيد', 'متوسط', 'ضعيف'] },
      { id: 2, text: 'جاهزية المختبرات؟', options: ['ممتاز', 'جيد', 'متوسط', 'ضعيف'] },
    ],
    results: [] 
  },
];

let users = { teachers: [], students: [], parents: [] };
let points = [];
let weeklyPrograms = [];
let examPrograms = [];
let complaints = [
  {
    id: uuidv4(),
    parentName: 'محمد أحمد',
    studentName: 'أحمد محمد',
    message: 'ابني يعاني من صعوبة في فهم مادة الرياضيات، هل هناك دعم إضافي؟',
    date: new Date().toISOString(),
    replied: false,
    reply: '',
    replyDate: null,
  },
  {
    id: uuidv4(),
    parentName: 'سارة خالد',
    studentName: 'ليلى سارة',
    message: 'المواصلات المدرسية تتأخر كثيراً عن موعدها المحدد',
    date: new Date().toISOString(),
    replied: true,
    reply: 'تم التواصل مع شركة النقل لحل المشكلة',
    replyDate: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    parentName: 'نور علي',
    studentName: 'عمر نور',
    message: 'الكتب المدرسية غير متوفرة في المكتبة',
    date: new Date().toISOString(),
    replied: false,
    reply: '',
    replyDate: null,
  },
];

let examHalls = [
  { id: 1, name: 'قاعة A' },
  { id: 2, name: 'قاعة B' },
  { id: 3, name: 'قاعة C' },
];

let examHallCapacities = {
  1: 4,  
  2: 4,  
  3: 4,  
};

try {
  const savedCapacities = localStorage.getItem('examHallCapacities');
  if (savedCapacities) {
    examHallCapacities = JSON.parse(savedCapacities);
  }
} catch (e) {
  console.error('خطأ في تحميل سعات القاعات:', e);
}

export const getAnnouncements = async () => {
  return Promise.resolve([...announcements]);
};

export const createAnnouncement = async (data) => {
  const newAnnouncement = { id: uuidv4(), ...data };
  announcements.push(newAnnouncement);
  return Promise.resolve(newAnnouncement);
};

export const updateAnnouncement = async (id, data) => {
  announcements = announcements.map(ann => ann.id === id ? { ...ann, ...data } : ann);
  return Promise.resolve(announcements.find(ann => ann.id === id));
};

export const deleteAnnouncement = async (id) => {
  announcements = announcements.filter(ann => ann.id !== id);
  return Promise.resolve();
};

export const getUsers = async () => {
  return Promise.resolve({ ...users });
};

export const addTeacher = async (teacher) => {
  const newTeacher = { id: uuidv4(), ...teacher };
  users.teachers.push(newTeacher);
  return Promise.resolve(newTeacher);
};

export const addStudent = async (student) => {
  const newStudent = { id: uuidv4(), ...student };
  users.students.push(newStudent);
  return Promise.resolve(newStudent);
};

export const addParent = async (parent) => {
  const newParent = { id: uuidv4(), ...parent };
  users.parents.push(newParent);
  return Promise.resolve(newParent);
};

export const getPolls = async () => {
  console.log('📊 getPolls تم استدعاؤها, عدد الاستبيانات:', polls.length);
  return Promise.resolve([...polls]);
};

export const createPoll = async (pollData) => {
  const newPoll = {
    id: uuidv4(),
    title: pollData.title,
    description: pollData.description,
    questions: pollData.questions,
    date: new Date().toISOString().split('T')[0],
    results: [],
  };
  polls.push(newPoll);
  console.log('✅ تم إضافة استبيان جديد:', newPoll);
  return Promise.resolve(newPoll);
};

export const deletePoll = async (id) => {
  polls = polls.filter(p => p.id !== id);
  console.log('🗑️ تم حذف استبيان:', id);
  return Promise.resolve();
};

export const getPollResults = async (pollId) => {
  const poll = polls.find(p => p.id === pollId);
  if (!poll) return Promise.resolve([]);
  
  const results = poll.questions.map(question => {
    const totalVotes = 100;
    const optionsWithStats = question.options.map((option, idx) => {
      const votes = Math.floor(Math.random() * 50) + 10;
      return {
        text: option,
        votes: votes,
        percentage: Math.floor((votes / totalVotes) * 100),
      };
    });
    return {
      question: question.text,
      options: optionsWithStats,
    };
  });
  
  return Promise.resolve(results);
};

export const submitPollResponse = async (pollId, answers) => {
  const poll = polls.find(p => p.id === pollId);
  if (poll) {
    poll.results.push({
      id: uuidv4(),
      answers,
      submittedAt: new Date().toISOString(),
    });
  }
  return Promise.resolve({ success: true });
};

export const getReports = async () => {
  return Promise.resolve({
    studentsCount: users.students.length,
    teachersCount: users.teachers.length,
    parentsCount: users.parents.length,
    activeCoursesCount: 12,
    pendingComplaintsCount: complaints.filter(c => !c.replied).length,
    unpublishedPollsCount: polls.filter(p => !p.published).length,
    unseenPollResultsCount: polls.filter(p => !p.published).length,
    surveyResults: [
      {
        title: 'تقييم جودة التدريس',
        results: [
          { question: 'مدى فهم المادة', averageRating: 4.5 },
          { question: 'وضوح الشرح', averageRating: 4.2 },
        ],
      },
      {
        title: 'تقييم المرافق',
        results: [
          { question: 'نظافة القاعات', averageRating: 4.0 },
          { question: 'جاهزية المختبرات', averageRating: 3.8 },
        ],
      },
    ],
    topStudents: {
      grade9: [
        { id: 1, name: 'أحمد محمد', points: 250 },
        { id: 2, name: 'سارة خالد', points: 230 },
        { id: 3, name: 'محمد علي', points: 210 },
      ],
      scientific: [
        { id: 4, name: 'نور حسين', points: 280 },
        { id: 5, name: 'عمر وائل', points: 260 },
        { id: 6, name: 'ليلى كريم', points: 240 },
      ],
      literary: [
        { id: 7, name: 'هدى سمير', points: 270 },
        { id: 8, name: 'رامي نضال', points: 245 },
        { id: 9, name: 'فاطمة زكي', points: 220 },
      ],
    },
  });
};

export const getComplaints = async () => {
  return Promise.resolve([...complaints]);
};

export const replyToComplaint = async (id, replyMessage) => {
  complaints = complaints.map(complaint =>
    complaint.id === id
      ? {
          ...complaint,
          reply: replyMessage,
          replied: true,
          replyDate: new Date().toISOString(),
        }
      : complaint
  );
  return Promise.resolve(complaints.find(complaint => complaint.id === id));
};

export const addComplaint = async (complaint) => {
  const newComplaint = {
    id: uuidv4(),
    ...complaint,
    date: new Date().toISOString(),
    replied: false,
    reply: '',
    replyDate: null,
  };
  complaints.push(newComplaint);
  return Promise.resolve(newComplaint);
};

export const deleteComplaint = async (id) => {
  complaints = complaints.filter(complaint => complaint.id !== id);
  return Promise.resolve();
};

export const getInquiries = async () => {
  return Promise.resolve([...complaints]);
};

export const replyToInquiry = async (id, replyMessage) => {
  return replyToComplaint(id, replyMessage);
};

export const getPoints = async () => {
  return Promise.resolve([...points]);
};

export const updatePoints = async (studentId, delta) => {
  const existing = points.find(p => p.studentId === studentId);
  if (existing) {
    existing.points += delta;
  } else {
    points.push({ studentId, points: delta });
  }
  return Promise.resolve(points.find(p => p.studentId === studentId));
};

export const getTopStudents = async (category) => {
  const reports = await getReports();
  if (category === 'grade9') return reports.topStudents.grade9;
  if (category === 'scientific') return reports.topStudents.scientific;
  if (category === 'literary') return reports.topStudents.literary;
  return reports.topStudents;
};

export const getCourses = async () => {
  return Promise.resolve([
    { id: 1, name: 'الرياضيات' },
    { id: 2, name: 'الفيزياء' },
    { id: 3, name: 'الكيمياء' },
    { id: 4, name: 'اللغة العربية' },
    { id: 5, name: 'اللغة الإنجليزية' },
    { id: 6, name: 'التاريخ' },
    { id: 7, name: 'الجغرافيا' },
  ]);
};

export const getRooms = async () => {
  return Promise.resolve([
    { id: 1, name: 'قاعة 101' },
    { id: 2, name: 'قاعة 102' },
    { id: 3, name: 'قاعة 103' },
    { id: 4, name: 'قاعة 104' },
    { id: 5, name: 'مختبر الفيزياء' },
    { id: 6, name: 'مختبر الكيمياء' },
  ]);
};

export const getClasses = async () => {
  return Promise.resolve([
    { id: 1, name: 'الصف التاسع' },
    { id: 2, name: 'البكالوريا علمي' },
    { id: 3, name: 'البكالوريا أدبي' },
    { id: 4, name: 'الثاني علمي' },
    { id: 5, name: 'الثالث علمي' },
    { id: 6, name: 'الثاني أدبي' },
  ]);
};

export const getTeachers = async () => {
  return Promise.resolve(users.teachers || []);
};

export const getExamHall = async () => {
  try {
    const response = await apiClient.get('/halls');
    return response.data;
  } catch (error) {
    const hallsWithCapacity = examHalls.map(hall => ({
      ...hall,
      capacity: examHallCapacities[hall.id] || 0,
    }));
    return hallsWithCapacity;
  }
};

export const updateExamHallCapacity = async (hallId, capacity) => {
  try {
    const currentHalls = await getExamHall();
    const updatedHalls = currentHalls.map(h =>
      h.id === hallId ? { name: h.name, capacity } : { name: h.name, capacity: h.capacity || 0 }
    );
    await apiClient.post('/setup-halls', { halls: updatedHalls });
    return { id: hallId, capacity, success: true };
  } catch (error) {
    examHallCapacities[hallId] = capacity;
    localStorage.setItem('examHallCapacities', JSON.stringify(examHallCapacities));
    return { id: hallId, capacity, success: true };
  }
};

export const addExamHall = async (hallData) => {
  try {
    const currentHalls = await getExamHall();
    const updatedHalls = [
      ...currentHalls.map(h => ({ name: h.name, capacity: h.capacity || 0 })),
      { name: hallData.name, capacity: hallData.capacity || 0 },
    ];
    await apiClient.post('/setup-halls', { halls: updatedHalls });
    const hallsAfter = await getExamHall();
    const addedHall = hallsAfter.find(h => h.name === hallData.name && h.capacity === (hallData.capacity || 0));
    return addedHall || { name: hallData.name, capacity: hallData.capacity || 0 };
  } catch (error) {
    const newHall = {
      id: Date.now(),
      name: hallData.name,
    };
    examHalls.push(newHall);
    examHallCapacities[newHall.id] = hallData.capacity || 0;
    localStorage.setItem('examHallCapacities', JSON.stringify(examHallCapacities));
    return { ...newHall, capacity: examHallCapacities[newHall.id] };
  }
};

export const deleteExamHall = async (hallId) => {
  examHalls = examHalls.filter(hall => hall.id !== hallId);
  delete examHallCapacities[hallId];
  localStorage.setItem('examHallCapacities', JSON.stringify(examHallCapacities));
  return Promise.resolve({ success: true });
};

export const getExamHallCapacities = async () => {
  return Promise.resolve({ ...examHallCapacities });
};

export const getHalls = async () => {
  try {
    const response = await apiClient.get('/halls');
    return response.data;
  } catch (error) {
    const hallsWithCapacity = examHalls.map(hall => ({
      id: hall.id,
      name: hall.name,
      capacity: examHallCapacities[hall.id] || 0,
    }));
    return hallsWithCapacity;
  }
};

export const addHall = async (hallData) => {
  try {
    const response = await apiClient.post('/halls', hallData);
    return response.data;
  } catch (error) {
    const newHall = {
      id: Date.now(),
      name: hallData.name,
      capacity: hallData.capacity || 0,
    };
    examHalls.push({ id: newHall.id, name: newHall.name });
    examHallCapacities[newHall.id] = newHall.capacity;
    localStorage.setItem('examHallCapacities', JSON.stringify(examHallCapacities));
    return newHall;
  }
};

export const updateHall = async (id, hallData) => {
  try {
    const response = await apiClient.put(`/halls/${id}`, hallData);
    return response.data;
  } catch (error) {
    const hallIndex = examHalls.findIndex(h => h.id === id);
    if (hallIndex !== -1) {
      examHalls[hallIndex] = { ...examHalls[hallIndex], name: hallData.name };
    }
    examHallCapacities[id] = hallData.capacity;
    localStorage.setItem('examHallCapacities', JSON.stringify(examHallCapacities));
    return { id, ...hallData, success: true };
  }
};

export const deleteHall = async (id) => {
  try {
    const response = await apiClient.delete(`/halls/${id}`);
    return response.data;
  } catch (error) {
    const hallIndex = examHalls.findIndex(h => h.id === id);
    if (hallIndex !== -1) {
      examHalls.splice(hallIndex, 1);
    }
    delete examHallCapacities[id];
    localStorage.setItem('examHallCapacities', JSON.stringify(examHallCapacities));
    return { success: true };
  }
};

export const getHallById = async (id) => {
  try {
    const response = await apiClient.get(`/halls/${id}`);
    return response.data;
  } catch (error) {
    const hall = examHalls.find(h => h.id === id);
    if (hall) {
      return {
        ...hall,
        capacity: examHallCapacities[id] || 0,
      };
    }
    return null;
  }
};

export const generateWeeklySchedule = async () => {
  const response = await apiClient.post('/generate-schedule', { type: 'course' });
  return response.data;
};

export const generateExamSchedule = async () => {
  const response = await apiClient.post('/generate-schedule', { type: 'exam' });
  return response.data;
};

export const getWeeklyProgram = async () => {
  try {
    const response = await apiClient.get('/admin-schedule', { params: { type: 'course' } })
    const rawSessions = response.data?.sessions || [];
    const sessions = Array.isArray(rawSessions) ? rawSessions : Object.values(rawSessions);

    return sessions.map((session) => ({
      id:         session.id,
      day:        session.day,
      start_time: session.start_time,
      end_time:   session.end_time,
      course:     session.course ?? null,
      course_id:  session.course_id,
      teacher_id: session.course?.teacher_id ?? null,
      room_id:    session.hall?.id ?? session.hall_id ?? null,
      class_id:   null,
    }));
  } catch (error) {
    console.error('خطأ في جلب برنامج الدوام:', error);
    return [...weeklyPrograms]; 
  }
};

export const getExamProgram = async () => {
  try {
    const response = await apiClient.get('/admin-schedule', { params: { type: 'exam' } });

    const rawSessions = response.data?.sessions || [];
    const sessions = Array.isArray(rawSessions) ? rawSessions : Object.values(rawSessions);

    return sessions.map((session) => ({
      id:         session.id,
      day:        session.day,
      start_time: session.start_time,
      end_time:   session.end_time,
      course:     session.course ?? null,
      course_id:  session.course_id,
      hall_id:    session.hall?.id ?? session.hall_id ?? null,
    }));
  } catch (error) {
    console.error('خطأ في جلب برنامج الامتحانات:', error);
    return [...examPrograms]; 
  }
};

export const addWeeklyProgram = async (program) => {
  const newProgram = { id: uuidv4(), ...program };
  weeklyPrograms.push(newProgram);
  return Promise.resolve(newProgram);
};

export const addExamProgram = async (program) => {
  const newExam = { id: uuidv4(), ...program };
  examPrograms.push(newExam);
  return Promise.resolve(newExam);
};

export const updateWeeklyProgram = async (id, data) => {
  const index = weeklyPrograms.findIndex(p => p.id === id);
  if (index !== -1) {
    weeklyPrograms[index] = { ...weeklyPrograms[index], ...data };
    return Promise.resolve(weeklyPrograms[index]);
  }
  return Promise.resolve(null);
};

export const updateExamProgram = async (id, data) => {
  const index = examPrograms.findIndex(e => e.id === id);
  if (index !== -1) {
    examPrograms[index] = { ...examPrograms[index], ...data };
    return Promise.resolve(examPrograms[index]);
  }
  return Promise.resolve(null);
};

export const deleteWeeklyProgram = async (id) => {
  try {
    await apiClient.delete(`/sessions/${id}`);
  } catch (error) {
    weeklyPrograms = weeklyPrograms.filter(p => p.id !== id);
  }
  return Promise.resolve();
};

export const deleteExamProgram = async (id) => {
  try {
    await apiClient.delete(`/sessions/${id}`);
  } catch (error) {
    examPrograms = examPrograms.filter(e => e.id !== id);
  }
  return Promise.resolve();
};

export const getTeacherSchedule = async (teacherId) => {
  try {
    const response = await apiClient.get(`/my-schedule/${teacherId}`, {
      params: { type: 'course' },
    });
    const sessions = response.data.sessions || [];
    return sessions.map((session) => ({
      id: session.id,
      day: session.day,
      start_time: session.start_time,
      end_time: session.end_time,
      course: session.course,
      course_id: session.course,
      room_name: session.hall,
      class_name: session.class_name || '', 
    }));
  } catch (error) {
    const teacherSchedule = weeklyPrograms.filter(p => p.teacherId === teacherId);
    return teacherSchedule;
  }
};

export const getStudentSchedule = async (studentId) => {
  try {
    const response = await apiClient.get(`/my-schedule/${studentId}`, {
      params: { type: 'course' },
    });
    const sessions = response.data.sessions || [];
    return sessions.map((session) => ({
      id: session.id,
      day: session.day,
      start_time: session.start_time,
      end_time: session.end_time,
      course: session.course,
      course_id: session.course,
      room_name: session.hall,
    }));
  } catch (error) {
    const student = users.students.find(s => s.id === studentId);
    if (!student) return [];
    const studentSchedule = weeklyPrograms.filter(p => p.classId === student.classId);
    return studentSchedule;
  }
};

export const getStudentExams = async (studentId) => {
  try {
    const response = await apiClient.get(`/my-schedule/${studentId}`, {
      params: { type: 'exam' },
    });
    const sessions = response.data.sessions || [];
    return sessions.map((session) => ({
      id: session.id,
      day: session.day,
      start_time: session.start_time,
      end_time: session.end_time,
      course: session.course,
      course_id: session.course,
      room_name: session.hall,
    }));
  } catch (error) {
    const student = users.students.find(s => s.id === studentId);
    if (!student) return [];
    const studentCourses = weeklyPrograms
      .filter(p => p.classId === student.classId)
      .map(p => p.subject);
    const studentExams = examPrograms.filter(e => studentCourses.includes(e.subject));
    return studentExams;
  }
};

export const getAnnouncementsCount = async () => {
  return Promise.resolve(announcements.length);
};

export const getStudentsCount = async () => {
  return Promise.resolve(users.students.length);
};

export const getTeachersCount = async () => {
  return Promise.resolve(users.teachers.length);
};

export const getParentsCount = async () => {
  return Promise.resolve(users.parents.length);
};

export const getActiveCoursesCount = async () => {
  const courses = await getCourses();
  return Promise.resolve(courses.length);
};

export const getComplaintsCount = async () => {
  return Promise.resolve(complaints.length);
};

export const getUnrepliedComplaintsCount = async () => {
  return Promise.resolve(complaints.filter(c => !c.replied).length);
};

export const getPublishedPollsCount = async () => {
  return Promise.resolve(polls.length);
};