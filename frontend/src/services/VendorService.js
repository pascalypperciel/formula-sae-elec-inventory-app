import axios from 'axios';

const API_URL = 'http://localhost:5127/api';

export const getVendors = async () => {
  const response = await axios.get(`${API_URL}/vendors`);
  return response.data;
};