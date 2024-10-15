import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Typography,
  Button,
  Avatar,
} from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';
import { getCartItems, removeFromCart, updateCartItem, refreshReorders } from '../../services/ShoppingCartService';
import ShoppingCartReasons from '../../enums/ShoppingCartReasons';

const DigiKeyShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [editedItems, setEditedItems] = useState({});

  const fetchCartItems = async () => {
    try {
      const data = await getCartItems();
      setCartItems(data || []);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleQuantityChange = (id, value) => {
    const quantity = Math.max(0, Number(value));
    setEditedItems((prev) => ({
      ...prev,
      [id]: {
        quantity,
        reason: 3,
      },
    }));
  };

  const handleIncrement = (id) => {
    const currentQuantity = editedItems[id]?.quantity ?? cartItems.find(item => item.id === id).quantity;
    handleQuantityChange(id, currentQuantity + 1);
  };

  const handleDecrement = (id) => {
    const currentQuantity = editedItems[id]?.quantity ?? cartItems.find(item => item.id === id).quantity;
    handleQuantityChange(id, currentQuantity - 1);
  };

  const handleApplyChanges = async (id) => {
    const { quantity, reason } = editedItems[id];
  
    try {
      await updateCartItem(id, { quantity, reason });
      if (quantity === 0) await removeFromCart(id);
  
      setEditedItems((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
  
      await fetchCartItems();
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };
  

  const handleRemoveItem = async (id) => {
    try {
      await removeFromCart(id);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    }
  };

  const handleRefreshReorders = async () => {
    try {
      await refreshReorders();
      await fetchCartItems();
    } catch (error) {
      console.error('Failed to refresh reorders:', error);
    }
  };

  const renderCartItem = (cartItem) => {
    const { item, quantity } = cartItem;
    const { id } = cartItem;
    const { name, imageUrl, identifier } = item || {};

    const editedQuantity = editedItems[id]?.quantity ?? quantity;
    const reason = editedItems[id]?.reason ?? cartItem.reason;

    return (
      <ListItem key={id} sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={imageUrl || ''}
          alt={name || 'Unknown'}
          sx={{ width: 50, height: 50, mr: 2 }}
        />
        <ListItemText
          primary={`Item: ${identifier || 'Unknown Item'}`}
          secondary={`Reason: ${ShoppingCartReasons[reason] || 'Unknown Reason'}`}
        />
        {editedQuantity !== quantity && (
          <Button variant="outlined" onClick={() => handleApplyChanges(id)} sx={{ ml: 2 }}>
            Apply
          </Button>
        )}
        <IconButton onClick={() => handleDecrement(id)}>
          <Remove />
        </IconButton>
        <TextField
          type="number"
          value={editedQuantity}
          onChange={(e) => handleQuantityChange(id, e.target.value)}
          sx={{ width: 60, mx: 1 }}
        />
        <IconButton onClick={() => handleIncrement(id)}>
          <Add />
        </IconButton>
        <IconButton onClick={() => handleRemoveItem(id)}>
          <Delete />
        </IconButton>
      </ListItem>
    );
  };

  return (
    <Box p={2} sx={{ height: 'calc(100vh - 80px)', overflowY: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>
        <Button variant="contained" onClick={handleRefreshReorders}>
          Refresh Reorders
        </Button>
      </Box>
      <List>
        {cartItems.map(renderCartItem)}
      </List>
      {cartItems.length === 0 && (
        <Typography variant="body1" textAlign="center">
          Your cart is empty.
        </Typography>
      )}
    </Box>
  );
};

export default DigiKeyShoppingCart;