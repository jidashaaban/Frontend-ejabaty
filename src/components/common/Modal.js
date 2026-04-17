import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

/**
 * @param {boolean} open - حالة فتح المودال
 * @param {function} onClose - دالة لإغلاق المودال
 * @param {string} title - عنوان المودال
 * @param {React.ReactNode} children - محتوى المودال
 * @param {React.ReactNode} actions - أزرار أسفل المودال (اختياري)
 */
const Modal = ({ open, onClose, title, children, actions }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent dividers>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default Modal;