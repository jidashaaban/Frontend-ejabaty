import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import { login } from '../services/authService';
import Toast from '../components/common/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await login(email, password);
      if (response.token) localStorage.setItem('token', response.token);
      if (response.user) localStorage.setItem('user', JSON.stringify(response.user));
      dispatch(loginSuccess({ token: response.token, role: response.user?.role, user: response.user }));
      const role = response.user?.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'teacher') navigate('/teacher');
      else if (role === 'student') navigate('/student');
      else if (role === 'parent') navigate('/parent');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0e1a;
          position: relative;
          overflow: hidden;
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.5;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #1a3a6b 0%, transparent 70%);
          top: -150px; right: -100px;
          animation: orbFloat 8s ease-in-out infinite;
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #0d2a4a 0%, transparent 70%);
          bottom: -100px; left: -80px;
          animation: orbFloat 10s ease-in-out infinite reverse;
        }
        .orb-3 {
          width: 250px; height: 250px;
          background: radial-gradient(circle, #1e4976 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: orbPulse 6s ease-in-out infinite;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes orbPulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
        }

        .grid-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .card-wrap {
          position: relative;
          z-index: 10;
          display: flex;
          width: 920px;
          max-width: 95vw;
          min-height: 560px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .card-wrap.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        /* Left panel */
        .panel-left {
          flex: 1;
          background: linear-gradient(145deg, #0f1f3d 0%, #162847 50%, #0d1e38 100%);
          padding: 52px 44px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-left: 1px solid rgba(255,255,255,0.07);
        }

        .brand {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .brand-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #1e6fd4, #3b9eff);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          box-shadow: 0 8px 24px rgba(30,111,212,0.4);
        }
        .brand-icon svg { width: 26px; height: 26px; }
        .brand-name {
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
        }
        .brand-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          font-weight: 400;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .feature-dot {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(30,111,212,0.15);
          border: 1px solid rgba(30,111,212,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .feature-dot svg { width: 18px; height: 18px; color: #5aabff; }
        .feature-text { font-size: 14px; color: rgba(255,255,255,0.55); font-weight: 400; }

        .panel-footer {
          font-size: 12px;
          color: rgba(255,255,255,0.2);
        }

        /* Right panel - form */
        .panel-right {
          width: 420px;
          background: #f4f6fb;
          padding: 52px 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 28px;
        }

        .form-header {}
        .form-title {
          font-size: 26px;
          font-weight: 700;
          color: #0f1e35;
          margin-bottom: 6px;
        }
        .form-subtitle {
          font-size: 14px;
          color: #8693a6;
        }

        .error-box {
          background: #fff0f0;
          border: 1px solid #fcc;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          color: #c0392b;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .fields { display: flex; flex-direction: column; gap: 16px; }

        .field-group { display: flex; flex-direction: column; gap: 6px; }
        .field-label {
          font-size: 13px;
          font-weight: 500;
          color: #4a5568;
        }
        .field-wrap {
          position: relative;
        }
        .field-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
          pointer-events: none;
          transition: color 0.2s;
        }
        .field-wrap.focused .field-icon { color: #1e6fd4; }
        .field-input {
          width: 100%;
          padding: 12px 44px 12px 44px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          font-family: 'Tajawal', sans-serif;
          background: #fff;
          color: #0f1e35;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          direction: ltr;
          text-align: right;
        }
        .field-input:focus {
          border-color: #1e6fd4;
          box-shadow: 0 0 0 4px rgba(30,111,212,0.1);
        }
        .field-input::placeholder { color: #bcc5d0; }

        .toggle-pass {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #a0aec0;
          padding: 2px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .toggle-pass:hover { color: #1e6fd4; }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #1e6fd4 0%, #2e86f5 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Tajawal', sans-serif;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 6px 20px rgba(30,111,212,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(30,111,212,0.45);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0px); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 20px; height: 20px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .demo-box {
          background: #fff;
          border: 1px solid #e8edf4;
          border-radius: 12px;
          padding: 14px 16px;
        }
        .demo-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #a0aec0;
          margin-bottom: 10px;
        }
        .demo-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #f0f4f8;
          cursor: pointer;
          transition: background 0.15s;
          border-radius: 6px;
          padding: 6px 8px;
          margin: 0 -8px;
        }
        .demo-row:last-child { border-bottom: none; }
        .demo-row:hover { background: #f4f6fb; }
        .demo-role {
          font-size: 12px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 6px;
          background: #e8f0fe;
          color: #1e6fd4;
        }
        .demo-email {
          font-size: 12px;
          color: #8693a6;
          direction: ltr;
        }
      `}</style>

      <div className="login-root">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
        <div className="grid-lines" />

        <div className={`card-wrap ${mounted ? 'mounted' : ''}`}>
          {/* Left panel */}
          <div className="panel-left">
            <div className="brand">
              <div className="brand-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <div className="brand-name">منصة إجابتي</div>
              <div className="brand-sub">نظام إدارة المعاهد التعليمية</div>
            </div>

            <div className="features">
              {[
                {
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
                  text: 'إدارة الجداول والبرامج الأسبوعية'
                },
                {
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                  text: 'متابعة الطلاب وإدارة التسجيل'
                },
                {
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
                  text: 'تتبع الدرجات والنقاط والتقارير'
                },
              ].map((f, i) => (
                <div className="feature-item" key={i}>
                  <div className="feature-dot" style={{ color: '#5aabff' }}>{f.icon}</div>
                  <span className="feature-text">{f.text}</span>
                </div>
              ))}
            </div>

            <div className="panel-footer">© 2026 منصة إجابتي · جميع الحقوق محفوظة</div>
          </div>

          {/* Right panel */}
          <div className="panel-right">
            <div className="form-header">
              <div className="form-title">مرحباً بعودتك </div>
              <div className="form-subtitle">سجّل دخولك للمتابعة</div>
            </div>

            {error && (
              <div className="error-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="fields">
                <div className="field-group">
                  <label className="field-label">البريد الإلكتروني</label>
                  <div className={`field-wrap ${focused === 'email' ? 'focused' : ''}`}>
                    <span className="field-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </span>
                    <input
                      className="field-input"
                      type="email"
                      placeholder="example@school.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                      required
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">كلمة المرور</label>
                  <div className={`field-wrap ${focused === 'password' ? 'focused' : ''}`}>
                    <span className="field-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </span>
                    <input
                      className="field-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused('')}
                      required
                    />
                    <button type="button" className="toggle-pass" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword
                        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
                style={{ marginTop: '24px' }}
              >
                {loading
                  ? <><div className="spinner" /> جاري الدخول...</>
                  : <>
                      تسجيل الدخول
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </>
                }
              </button>
            </form>

            <div className="demo-box">
              <div className="demo-title">بيانات تجريبية</div>
              {[
                { role: 'مدير', email: 'admin@school.com' },
                { role: 'معلم', email: 'registrar@school.com' },
              ].map((d, i) => (
                <div
                  key={i}
                  className="demo-row"
                  onClick={() => { setEmail(d.email); setPassword('admin123'); }}
                >
                  <span className="demo-role">{d.role}</span>
                  <span className="demo-email">{d.email} · admin123</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Toast
        open={Boolean(error)}
        onClose={() => setError('')}
        message={error}
        severity="error"
      />
    </>
  );
};

export default Login;