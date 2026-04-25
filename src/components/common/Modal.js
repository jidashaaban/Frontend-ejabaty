import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

/**
 * @param {boolean} open 
 * @param {function} onClose 
 * @param {string} title 
 * @param {React.ReactNode} children 
 * @param {React.ReactNode} actions 
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