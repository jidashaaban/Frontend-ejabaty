import React from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { AccountCircle, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: '#165ca1', 
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderRadius: 2,
        mb: 2,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            color: '#fff',
            letterSpacing: 1,
          }}
        >
          منصة إجابتي
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" sx={{ color: '#fff', opacity: 0.9 }}>
            {user?.name || 'مرحباً بك'}
          </Typography>
          
          <IconButton onClick={handleMenu} color="inherit">
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#1565c0' }}>
              {user?.name?.charAt(0) || 'م'}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <MenuItem onClick={handleLogout}>
              <Logout fontSize="small" sx={{ ml: 1 }} />
              تسجيل الخروج
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;