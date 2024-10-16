import axios from 'axios';

const API_URL = 'http://localhost:5127/api/shoppingcart';

// Get all cart items
export const getCartItems = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch cart items:', error);
    return [];
  }
};

// Update a cart item
export const updateCartItem = async (id, { quantity, reason }) => {
    try {
      await axios.put(`http://localhost:5127/api/shoppingcart/${id}`, {
        quantity,
        reason,
      });
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  };

// Remove an item from the cart
export const removeFromCart = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Failed to remove cart item:', error);
    throw error;
  }
};

// Refresh reorders
export const refreshReorders = async () => {
  try {
    await axios.post(`${API_URL}/refresh-reorders`);
  } catch (error) {
    console.error('Failed to refresh reorders:', error);
    throw error;
  }
};

// Add an item to the cart from ItemCard.js
export const addToCart = async (itemId, vendorId, quantity) => {
  try {
    const response = await axios.post(`${API_URL}/add-to-cart`, {
      itemId: itemId, 
      vendorId: vendorId, 
      quantity: quantity
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
  }
};