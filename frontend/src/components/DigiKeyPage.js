import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DigiKeyPage = () => {
  const navigate = useNavigate();

  const handleFeatureClick = (path) => {
    navigate(path);
  };

  return (
    <Box p={4} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" gutterBottom>
        Digi-Key Electronics
      </Typography>

      <Grid container spacing={2} mt={2} maxWidth="600px">
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ 
              padding: '20px', 
              fontSize: '1.2rem', 
              height: '100px' 
            }}
            onClick={() => handleFeatureClick('/digikey/search')}
          >
            Search for Products and Information
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ 
              padding: '20px', 
              fontSize: '1.2rem', 
              height: '100px' 
            }}
            onClick={() => handleFeatureClick('/digikey/quote')}
          >
            Request a Quote
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            sx={{ 
              padding: '20px', 
              fontSize: '1.2rem', 
              height: '100px' 
            }}
            onClick={() => handleFeatureClick('/digikey/order')}
          >
            Place an Order
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="warning"
            sx={{ 
              padding: '20px', 
              fontSize: '1.2rem', 
              height: '100px' 
            }}
            onClick={() => handleFeatureClick('/digikey/orders')}
          >
            View Previously Placed Orders
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="info"
            sx={{ 
              padding: '20px', 
              fontSize: '1.2rem', 
              height: '100px' 
            }}
            onClick={() => handleFeatureClick('/digikey/identify')}
          >
            Identify a Product or an Order
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DigiKeyPage;
