import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { getItems, updateItem } from '../services/ItemService';
import ItemCard from './ItemCard';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
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
    } catch (error) {
      console.error('Failed to update item:', error);
    }
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
    <Box p={2}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Inventory
      </Typography>
      {items.length === 0 ? (
        <Typography variant="body1" textAlign="center">
          No items found.
        </Typography>
      ) : (
        items.map((item) => (
          <ItemCard key={item.id} item={item} onSave={handleSave} />
        ))
      )}
    </Box>
  );
};

export default ItemsList;
