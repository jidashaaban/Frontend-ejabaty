import { v4 as uuidv4 } from 'uuid';

let teacherStudents = [
  { id: uuidv4(), name: 'طارق', course: 'الرياضيات', notes: [] },
  { id: uuidv4(), name: 'ليلى', course: 'الفيزياء', notes: [] },
];

let teacherSchedule = [
  {
    id: uuidv4(),
    day: 'الأحد',
    startTime: '09:00',
    endTime: '11:00',
    subject: 'الرياضيات',
    className: 'السنة الأولى',
    roomName: 'قاعة 1',
    teacherId: 1,
  },
  {
    id: uuidv4(),
    day: 'الثلاثاء',
    startTime: '11:00',
    endTime: '13:00',
    subject: 'الفيزياء',
    className: 'السنة الثانية',
    roomName: 'قاعة 3',
    teacherId: 1,
  },
];

let examModels = [];

let announcedTests = [];

export const getStudents = async () => {
  return Promise.resolve([...teacherStudents]);
};

export const addNote = async (studentId, note) => {
  teacherStudents = teacherStudents.map((student) => {
    if (student.id === studentId) {
      return {
        ...student,
        notes: [...student.notes, { id: uuidv4(), text: note }],
      };
    }
    return student;
  });
  return Promise.resolve(
    teacherStudents.find((student) => student.id === studentId)
  );
};


export const getTeacherSchedule = async (teacherId) => {
  const filteredSchedule = teacherSchedule.filter(
    (session) => session.teacherId === teacherId
  );
  return Promise.resolve([...filteredSchedule]);
};

export const getSchedule = async () => {
  return Promise.resolve([...teacherSchedule]);
};

export const getExamModels = async () => {
  return Promise.resolve([...examModels]);
};

export const uploadExamModel = async (model) => {
  const newModel = { id: uuidv4(), ...model };
  examModels.push(newModel);
  return Promise.resolve(newModel);
};

export const announceTest = async (test) => {
  const newTest = { id: uuidv4(), ...test };
  announcedTests.push(newTest);
  return Promise.resolve(newTest);
};

export const getAnnouncedTests = async () => {
  return Promise.resolve([...announcedTests]);
};

export const addTeacherSchedule = async (session) => {
  const newSession = { id: uuidv4(), ...session };
  teacherSchedule.push(newSession);
  return Promise.resolve(newSession);
};

export const updateTeacherSchedule = async (id, data) => {
  const index = teacherSchedule.findIndex(s => s.id === id);
  if (index !== -1) {
    teacherSchedule[index] = { ...teacherSchedule[index], ...data };
    return Promise.resolve(teacherSchedule[index]);
  }
  return Promise.resolve(null);
};

export const deleteTeacherSchedule = async (id) => {
  teacherSchedule = teacherSchedule.filter(s => s.id !== id);
  return Promise.resolve();
};