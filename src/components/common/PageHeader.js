import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const PageHeader = ({ title, subtitle, icon }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
        {icon && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: '#1976d2',
            borderRadius: 2,
            p: 0.8,
            color: '#fff'
          }}>
            {icon}
          </Box>
        )}
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#1976d2',
            fontSize: '1.5rem',
          }}
        >
          {title}
        </Typography>
      </Box>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {subtitle}
        </Typography>
      )}
      <Divider sx={{ borderColor: '#e0e0e0' }} />
    </Box>
  );
};

export default PageHeader;