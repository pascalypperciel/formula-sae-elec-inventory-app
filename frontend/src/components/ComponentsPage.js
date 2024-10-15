import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ComponentsPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => navigate('/');

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        ComponentsPage
      </Typography>
      <Typography variant="body1">
        This is where the components features will be.
      </Typography>
      <Button variant="contained" onClick={handleBackClick} sx={{ mt: 2 }}>
        Back to Inventory
      </Button>
    </Box>
  );
};

export default ComponentsPage;
