import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Box } from '@mui/material';
import { getItems } from '../services/ItemService';

const ItemsList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await getItems();
    setItems(data);
  };

  return (
    <Box p={2}>
      <List>
        {items.map((item) => (
          <ListItem key={item.id} divider>
            <ListItemText primary={item.name} secondary={`Quantity: ${item.quantity}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ItemsList;
