import React from 'react';
import { Snackbar, Alert } from '@mui/material';

/**
 * مكون Toast لعرض رسائل قصيرة
 * @param {boolean} open - حالة فتح التوست
 * @param {function} onClose - دالة إغلاق التوست
 * @param {string} message - رسالة التوست
 * @param {string} severity - نوع الرسالة (success, error, warning, info)
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