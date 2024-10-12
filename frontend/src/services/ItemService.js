import axios from 'axios';

const API_URL = 'http://localhost:5127/api/items';

export const getItems = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addItem = async (item) => {
  const response = await axios.post(API_URL, item);
  return response.data;
};
