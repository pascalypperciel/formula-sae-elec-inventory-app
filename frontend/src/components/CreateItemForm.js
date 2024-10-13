import React, { useEffect, useState } from 'react';
import { getCategories } from '../services/CategoryService';
import { getVendors } from '../services/VendorService';
import { createItem } from '../services/ItemService';
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';

const CreateItemForm = () => {
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newVendor, setNewVendor] = useState('');
  const [item, setItem] = useState({
    id: '',
    name: '',
    category: '',
    vendor: '',
    quantity: 0,
    price: 0,
    description: '',
  });

  useEffect(() => {
    loadEnums();
  }, []);

  const loadEnums = async () => {
    const categoryData = await getCategories();
    const vendorData = await getVendors();
    setCategories(categoryData);
    setVendors(vendorData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createItem(item);
      alert('Item created successfully');
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Failed to create item');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
      <Typography variant="h2" color="primary">
        Create New Item
      </Typography>

      <TextField label="Item Name" name="name" value={item.name} onChange={handleChange} required />

      <FormControl>
        <InputLabel>Category</InputLabel>
        <Select
          name="category"
          value={item.category}
          onChange={handleChange}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
          <MenuItem value="new">Create New Category</MenuItem>
        </Select>
        {item.category === 'new' && (
          <TextField
            label="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        )}
      </FormControl>

      <FormControl>
        <InputLabel>Vendor</InputLabel>
        <Select
          name="vendor"
          value={item.vendor}
          onChange={handleChange}
        >
          {vendors.map((vendor) => (
            <MenuItem key={vendor} value={vendor}>
              {vendor}
            </MenuItem>
          ))}
          <MenuItem value="new">Create New Vendor</MenuItem>
        </Select>
        {item.vendor === 'new' && (
          <TextField
            label="New Vendor"
            value={newVendor}
            onChange={(e) => setNewVendor(e.target.value)}
          />
        )}
      </FormControl>

      <TextField label="Quantity" name="quantity" type="number" value={item.quantity} onChange={handleChange} />
      <TextField label="Price" name="price" type="number" value={item.price} onChange={handleChange} />
      <TextField label="Description" name="description" value={item.description} onChange={handleChange} />

      <Button type="submit" variant="contained" color="primary">
        Create Item
      </Button>
    </Box>
  );
};

export default CreateItemForm;
