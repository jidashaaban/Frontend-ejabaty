import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

/**
 * @param {Array<{label: string, value: string|number}>} items
 */
const DashboardSummary = ({ items }) => {
  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.label}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {item.value}
            </Typography>
            <Typography variant="body2">{item.label}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardSummary;