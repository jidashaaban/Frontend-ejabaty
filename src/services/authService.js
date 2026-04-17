const users = {
  admin: { token: 'admin-token', role: 'admin', name: 'مدير' },
  teacher: { token: 'teacher-token', role: 'teacher', name: 'أستاذ' },
  student: { token: 'student-token', role: 'student', name: 'طالب' },
};

/**
 * @param {Object} credentials - بيانات الاعتماد (اسم المستخدم وكلمة المرور)
 * @returns {Promise<Object>} بيانات المصادقة (token, role, user)
 */
export const login = async ({ username, password }) => {
  const key = username.toLowerCase();
  if (users[key]) {
    return Promise.resolve({
      token: users[key].token,
      role: users[key].role,
      user: { id: 1, name: users[key].name, username: key },
    });
  }
  return Promise.reject(new Error('بيانات الدخول غير صحيحة'));
};

/**
 * @returns {Promise<void>}
 */
export const logout = async () => {
  return Promise.resolve();
};