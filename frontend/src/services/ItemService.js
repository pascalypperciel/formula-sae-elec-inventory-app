import axios from 'axios';

const API_URL = 'http://localhost:5127/api';

export const getItems = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch items:', error);
    return [];
  }
};

export const createItem = async (item) => {
  const response = await axios.post(`${API_URL}/items`, item);
  return response.data;
};
