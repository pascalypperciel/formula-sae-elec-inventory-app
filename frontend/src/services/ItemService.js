import axios from 'axios';

const API_URL = 'http://localhost:5127/api/items';

// Get all items
export const getItems = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch items:', error);
    return [];
  }
};

// Create a new item
export const createItem = async (item) => {
  try {
    const response = await axios.post(API_URL, item);
    return response.data;
  } catch (error) {
    console.error('Failed to create item:', error);
    throw error;
  }
};

// Update an item
export const updateItem = async (item) => {
  try {
    const response = await axios.put(`${API_URL}/${item.id}`, item);
    return response.data;
  } catch (error) {
    console.error('Failed to update item:', error);
    throw error;
  }
};

// Export items through CSV file
export const exportItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/export`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'items.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Failed to export items:', error);
  }
};

// Update just the quantity of a component
export const updateQuantities = async (usages) => {
  try {
    const response = await axios.put(`${API_URL}/update-quantities`, usages);
    return response.data;
  } catch (error) {
    console.error('Failed to update quantities:', error);
    throw error;
  }
};

// Get item history
export const getItemHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/history`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch item history:', error);
    return [];
  }
};
