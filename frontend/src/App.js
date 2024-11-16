import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import CreateItem from './components/ItemFeature/CreateItem';
import ItemsList from './components/ItemFeature/ItemsList';
import BottomNav from './components/BottomNav';
import UploadItems from './components/ItemFeature/UploadItems';
import ItemHistoryList from './components/ItemFeature/ItemHistoryList';
import DigiKeyPage from './components/DigiKey/DigiKeyPage';
import ComponentsPage from './components/ComponentFeature/ComponentsPage';
import CreateComponent from './components/ComponentFeature/CreateComponent';
import EditComponent from './components/ComponentFeature/EditComponent';
import DigiKeyShoppingCart from './components/DigiKey/DigiKeyShoppingCart';

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
              <Route path="/create-item" element={<CreateItem />} />
              <Route path="/item-history" element={<ItemHistoryList />} />
              <Route path="/components" element={<ComponentsPage />} />
              <Route path="/components/create" element={<CreateComponent />} />
              <Route path="/components/edit/:id" element={<EditComponent />} />
              <Route path="/digikey" element={<DigiKeyPage />} />
              <Route path="/digikey/cart" element={<DigiKeyShoppingCart />} />
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
