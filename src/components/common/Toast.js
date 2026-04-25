import React from 'react';
import { Snackbar, Alert } from '@mui/material';

/**
 * @param {boolean} open 
 * @param {function} onClose 
 * @param {string} message 
 * @param {string} severity 
 */
const Toast = ({ open, onClose, message, severity = 'success' }) => {
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;