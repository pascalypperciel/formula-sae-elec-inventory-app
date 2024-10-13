import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Box,
  Button,
  Avatar,
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';

const ItemCard = ({ item, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState({ ...item });

  const handleFieldChange = (field, value) => {
    setEditedItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave(editedItem);
  };

  return (
    <Card variant="outlined" sx={{ marginBottom: 2 }}>
      <CardContent>
        {isEditing ? (
          <Box display="flex" flexDirection="column" gap={1}>
            <TextField
              label="Identifier"
              value={editedItem.identifier}
              onChange={(e) => handleFieldChange('identifier', e.target.value)}
            />
            <TextField
              label="Category"
              value={editedItem.category}
              onChange={(e) => handleFieldChange('category', e.target.value)}
            />
            <TextField
              label="Vendor"
              value={editedItem.vendor}
              onChange={(e) => handleFieldChange('vendor', e.target.value)}
            />
            <TextField
              label="Quantity"
              type="number"
              value={editedItem.quantity}
              onChange={(e) => handleFieldChange('quantity', e.target.value)}
            />
            <TextField
              label="Cost Per Item"
              type="number"
              value={editedItem.costPerItem}
              onChange={(e) => handleFieldChange('costPerItem', e.target.value)}
            />
            <TextField
              label="Image URL"
              value={editedItem.imageUrl}
              onChange={(e) => handleFieldChange('imageUrl', e.target.value)}
            />
            <TextField
              label="Location"
              value={editedItem.location}
              onChange={(e) => handleFieldChange('location', e.target.value)}
            />
            <TextField
              label="Description"
              value={editedItem.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
            />
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Button onClick={handleSave} variant="contained" startIcon={<Save />}>
                Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outlined"
                startIcon={<Cancel />}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" gap={2}>
            {item.imageUrl ? (
              <Avatar
                src={item.imageUrl}
                alt={item.name}
                sx={{ width: 80, height: 80 }}
              />
            ) : (
              <Avatar sx={{ width: 80, height: 80 }}>{item.name?.[0] || "?"}</Avatar>
            )}
            <Box flexGrow={1}>
              <Typography variant="h6">{item.identifier}</Typography>
              <Typography variant="body2" color="textSecondary">
                Category: {item.category}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Quantity: {item.quantity}
              </Typography>
              <Typography variant="body">
                {item.description}
              </Typography>
            </Box>
            <IconButton onClick={() => setIsEditing(true)}>
              <Edit />
            </IconButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ItemCard;
