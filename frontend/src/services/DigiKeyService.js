import axios from 'axios';

const API_URL = 'http://localhost:5127/api/digikey';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch external products:', error);
    throw error;
  }
};
