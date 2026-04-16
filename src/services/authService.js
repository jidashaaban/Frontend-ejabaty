/**
 * خدمات المصادقة
 * حالياً تُعيد هذه الوظائف بيانات وهمية (mock data). لاحقاً يمكن استبدالها بطلبات API حقيقية.
 */

// بيانات افتراضية للمستخدمين لاستخدامها في تسجيل الدخول.
const users = {
  admin: { token: 'admin-token', role: 'admin', name: 'مدير' },
  teacher: { token: 'teacher-token', role: 'teacher', name: 'أستاذ' },
  student: { token: 'student-token', role: 'student', name: 'طالب' },
};

/**
 * تسجيل الدخول
 * @param {Object} credentials - بيانات الاعتماد (اسم المستخدم وكلمة المرور)
 * @returns {Promise<Object>} بيانات المصادقة (token, role, user)
 */
export const login = async ({ username, password }) => {
  // التحقق البسيط: إذا كان اسم المستخدم موجوداً في قائمة المستخدمين، يتم إرجاع بياناته
  const key = username.toLowerCase();
  if (users[key]) {
    return Promise.resolve({
      token: users[key].token,
      role: users[key].role,
      user: { id: 1, name: users[key].name, username: key },
    });
  }
  // في حالة بيانات خاطئة، نعيد خطأ
  return Promise.reject(new Error('بيانات الدخول غير صحيحة'));
};

/**
 * تسجيل الخروج
 * @returns {Promise<void>}
 */
export const logout = async () => {
  return Promise.resolve();
};