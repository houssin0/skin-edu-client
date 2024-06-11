import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';

const NotificationWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: '80px', // Adjust based on the height of the chat icon
  right: '20px',
  zIndex: 1001,
  backgroundColor: '#00b894',
  color: 'white',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  alignItems: 'center',
}));

const Notification = ({ message, onClose }) => (
  <NotificationWrapper>
    <Typography variant="body1" sx={{ flexGrow: 1 }}>
      {message}
    </Typography>
    <IconButton onClick={onClose} sx={{ color: 'white' }}>
      <CloseIcon />
    </IconButton>
  </NotificationWrapper>
);

export default Notification;
