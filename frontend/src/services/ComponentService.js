import axios from "axios";

const API_URL = "http://localhost:5127/api/components";

// Get all components
export const getComponents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching components:", error);
    throw error;
  }
};

// Create a new component
export const createComponent = async (component) => {
  try {
    const response = await axios.post(API_URL, component);
    return response.data;
  } catch (error) {
    console.error("Error creating component:", error);
    throw error;
  }
};

// Edit an existing component
export const editComponent = async (id, component) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, component);
      console.log("PUT request successful:", response);
      return response.data;
    } catch (error) {
      console.error("PUT request failed:", error.response || error.message);
      throw error;
    }
  };
  
