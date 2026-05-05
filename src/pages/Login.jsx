import React, { useState } from 'react';
import { Box, Button, Paper, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import { login } from '../services/authService';
import Toast from '../components/common/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('📧 محاولة تسجيل الدخول:', email);
    
    try {
      const response = await login(email, password);
      console.log('✅ الاستجابة من الخادم:', response);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      console.log('👤 دور المستخدم:', response.user?.role);
      
      dispatch(loginSuccess({ 
        token: response.token, 
        role: response.user?.role, 
        user: response.user 
      }));
      
      const role = response.user?.role;
      console.log('🚀 التوجيه إلى:', `/${role}`);
      
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'teacher') {
        navigate('/teacher');
      } else if (role === 'student') {
        navigate('/student');
      } else if (role === 'parent') {
        navigate('/parent');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('❌ خطأ في تسجيل الدخول:', err);
      setError(err.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        bgcolor: '#f5f7fa',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          p: 5, 
          width: 420, 
          borderRadius: 5,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          bgcolor: '#fff',
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            منصة إجابتي
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            نظام إدارة المعاهد التعليمية
          </Typography>
        </Box>

        <Typography variant="h5" mb={3} align="center" fontWeight="bold">
          تسجيل الدخول
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="البريد الإلكتروني"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@school.com"
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            label="كلمة المرور"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            disabled={loading}
            sx={{ 
              mt: 3, 
              py: 1.5, 
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'تسجيل الدخول'}
          </Button>
        </form>

        <Box sx={{ mt: 4, p: 2, bgcolor: '#f8f9fa', borderRadius: 3 }}>
          <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
            بيانات تسجيل الدخول التجريبية:
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" textAlign="center" sx={{ mt: 0.5 }}>
            📧 admin@school.com | 🔑 password
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
            📧 registrar@school.com | 🔑 password
          </Typography>
        </Box>
      </Paper>
      
      <Toast
        open={Boolean(error)}
        onClose={() => setError('')}
        message={error}
        severity="error"
      />
    </Box>
  );
};

export default Login;