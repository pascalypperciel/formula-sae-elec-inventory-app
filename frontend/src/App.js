import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import CreateItemForm from './components/CreateItemForm';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/create-item" replace />} />
          <Route path="/create-item" element={<CreateItemForm />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
