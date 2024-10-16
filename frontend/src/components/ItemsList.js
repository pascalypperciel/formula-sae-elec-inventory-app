import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { getItems, updateItem, exportItems } from '../services/ItemService';
import ItemCard from './ItemCard';
import { useNavigate } from 'react-router-dom';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openCsvDialog, setOpenCsvDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
      setFilteredItems(data);
    } catch (err) {
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedItem) => {
    try {
      await updateItem(updatedItem);
      const updatedItems = items.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );
      setItems(updatedItems);
      filterItems(searchQuery, updatedItems);
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterItems(query, items);
  };

  const filterItems = (query, itemsToFilter) => {
    const filtered = itemsToFilter.filter(
      (item) =>
        item.identifier.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.description || '').toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  };

  const handleViewHistory = () => {
    navigate('/item-history');
  };

  const handleCsvDialogOpen = () => setOpenCsvDialog(true);
  const handleCsvDialogClose = () => setOpenCsvDialog(false);

  const handleImportCsv = () => {
    handleCsvDialogClose();
    navigate('/upload');
  };

  const handleExportCsv = async () => {
    await exportItems();
    handleCsvDialogClose();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={2} sx={{ height: 'calc(100vh - 80px)', overflowY: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Inventory
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            onClick={handleViewHistory}
            sx={{
              padding: '5px 10px',
              fontSize: '0.8rem',
              minWidth: '100px',
            }}
          >
            View History
          </Button>
          <Button
            variant="outlined"
            onClick={handleCsvDialogOpen}
            sx={{
              padding: '5px 10px',
              fontSize: '0.8rem',
              minWidth: '100px',
            }}
          >
            Import/Export
          </Button>
        </Box>
      </Box>

      <TextField
        fullWidth
        label="Search Items"
        variant="outlined"
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {filteredItems.length === 0 ? (
        <Typography variant="body1" textAlign="center">
          No items found.
        </Typography>
      ) : (
        filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} onSave={handleSave} />
        ))
      )}

      <Dialog open={openCsvDialog} onClose={handleCsvDialogClose} fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>CSV Actions</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ height: 120, fontSize: '1.2rem' }}
              onClick={handleImportCsv}
            >
              Import CSV
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ height: 120, fontSize: '1.2rem' }}
              onClick={handleExportCsv}
            >
              Export CSV
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ItemsList;
