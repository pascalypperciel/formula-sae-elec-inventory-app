import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import ItemsList from './components/ItemsList';
import BottomNav from './components/BottomNav';
import UploadItems from './components/UploadItems';
import ItemHistoryList from './components/ItemHistoryList';
import DigiKeyPage from './components/DigiKey/DigiKeyPage';
import ComponentsPage from './components/ComponentsPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Routes>
              <Route path="/" element={<ItemsList />} />
              <Route path="/upload" element={<UploadItems />} />
              <Route path="/item-history" element={<ItemHistoryList />} />
              <Route path="/components" element={<ComponentsPage />} />
              <Route path="/digikey" element={<DigiKeyPage />} />
              <Route path="/digikey/order" element={<div>Place an Order</div>} />
              <Route path="/digikey/orders" element={<div>Previously Placed Orders</div>} />
              <Route path="/digikey/identify" element={<div>Identify Product or Order</div>} />
            </Routes>
          </Box>
          <BottomNav />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
