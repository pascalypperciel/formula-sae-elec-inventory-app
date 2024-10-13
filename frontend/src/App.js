import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import ItemsList from './components/ItemsList';
import BottomNav from './components/BottomNav';
import CreateItemForm from './components/CreateItemForm';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Routes>
              <Route path="/" element={<ItemsList />} />
              <Route path="/create-item" element={<CreateItemForm />} />
            </Routes>
          </Box>
          <BottomNav />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;