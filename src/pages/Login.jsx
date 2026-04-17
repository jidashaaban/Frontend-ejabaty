import React, { useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import { login } from '../services/authService';
import Toast from '../components/common/Toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ username, password });
      localStorage.setItem('token', response.token);
      dispatch(loginSuccess({ token: response.token, role: response.role, user: response.user }));
      navigate('/' + response.role);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Paper sx={{ p: 4, width: 350 }} elevation={3}>
        <Typography variant="h5" mb={2} align="center">
          تسجيل الدخول
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="اسم المستخدم"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="كلمة المرور"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            دخول
          </Button>
        </form>
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