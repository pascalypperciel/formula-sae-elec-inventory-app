import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../services/ItemService';
import { CreateItemDTO } from '../DTOs/CreateItemDTO';

const CreateItem = () => {
  const [newItem, setNewItem] = useState({
    ...CreateItemDTO,
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFieldChange = (field, value) => {
    setNewItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const formattedItem = {
        ...newItem,
        lastOrderDate: newItem.lastOrderDate
          ? new Date(newItem.lastOrderDate).toISOString()
          : null,
      };
      
      await createItem(formattedItem);
      navigate('/');
    } catch (error) {
      setError('Failed to create item. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Card variant="outlined" sx={{ height: 'calc(100vh - 80px)', overflowY: 'auto' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create a New Item
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box display="flex" flexDirection="column" gap={2} >
          <TextField
            label="Identifier"
            value={newItem.identifier}
            onChange={(e) => handleFieldChange('identifier', e.target.value)}
            required
          />
          <TextField
            label="Category"
            value={newItem.category}
            onChange={(e) => handleFieldChange('category', e.target.value)}
          />
          <TextField
            label="Quantity"
            type="number"
            value={newItem.quantity}
            onChange={(e) => handleFieldChange('quantity', e.target.value)}
            required
          />
          <TextField
            label="Description"
            value={newItem.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
          />
          <TextField
            label="Vendor Name"
            value={newItem.vendorName}
            onChange={(e) => handleFieldChange('vendorName', e.target.value)}
            required
          />
          <TextField
            label="Location"
            value={newItem.location}
            onChange={(e) => handleFieldChange('location', e.target.value)}
          />
          <TextField
            label="Last Order Date"
            type="date"
            value={newItem.lastOrderDate}
            onChange={(e) => handleFieldChange('lastOrderDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Reorder Level"
            type="number"
            value={newItem.reorderLevel}
            onChange={(e) => handleFieldChange('reorderLevel', e.target.value)}
          />
          <TextField
            label="Reorder Quantity"
            type="number"
            value={newItem.reorderQuantity}
            onChange={(e) => handleFieldChange('reorderQuantity', e.target.value)}
          />
          <TextField
            label="Cost Per Item"
            type="number"
            value={newItem.costPerItem}
            onChange={(e) => handleFieldChange('costPerItem', e.target.value)}
          />
          <TextField
            label="Discontinued"
            select
            SelectProps={{
              native: true,
            }}
            value={newItem.discontinued ? 'Yes' : 'No'}
            onChange={(e) =>
              handleFieldChange('discontinued', e.target.value === 'Yes')
            }
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </TextField>
          <TextField
            label="Link"
            value={newItem.link}
            onChange={(e) => handleFieldChange('link', e.target.value)}
          />

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              onClick={handleSave}
              variant="contained"
              startIcon={<Save />}
              sx={{ minWidth: 120 }}
            >
              Save
            </Button>
            <Button
              onClick={handleCancel}
              variant="outlined"
              startIcon={<Cancel />}
              sx={{ minWidth: 120 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreateItem;
