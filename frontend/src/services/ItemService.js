import axios from 'axios';

const API_URL = 'http://localhost:5127/api';

export const createItem = async (item) => {
  const response = await axios.post(`${API_URL}/items`, item);
  return response.data;
};
