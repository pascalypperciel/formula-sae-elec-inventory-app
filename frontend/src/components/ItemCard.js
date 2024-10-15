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
  Collapse,
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';

const ItemCard = ({ item, onSave }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState({ ...item });

  const handleFieldChange = (field, value) => {
    setEditedItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave(editedItem);
  };

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <Card variant="outlined" sx={{ marginBottom: 2 }}>
      <CardContent onClick={toggleExpand} sx={{ cursor: 'pointer' }}>
        <Box display="flex" alignItems="center" gap={2}>
          {item.imageUrl ? (
            <Avatar
              src={item.imageUrl}
              alt={item.name}
              sx={{ width: 80, height: 80 }}
            />
          ) : (
            <Avatar sx={{ width: 80, height: 80 }}>
              {item.name?.[0] || "?"}
            </Avatar>
          )}
          <Box flexGrow={1}>
            <Typography variant="h6">{item.identifier}</Typography>
            <Typography variant="body2" color="textSecondary">
              Category: {item.category}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Quantity: {item.quantity}
            </Typography>
            <Typography variant="body2">
              Quantity: {item.description}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
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
                label="Description"
                value={editedItem.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
              />
              <TextField
                label="Vendor"
                value={editedItem.vendor}
                onChange={(e) => handleFieldChange('vendor', e.target.value)}
              />
              <TextField
                disabled 
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
                label="Reorder Level"
                type="number"
                value={editedItem.reorderLevel}
                onChange={(e) => handleFieldChange('reorderLevel', e.target.value)}
              />
              <TextField
                label="Reorder Quantity"
                type="number"
                value={editedItem.reorderQuantity}
                onChange={(e) => handleFieldChange('reorderQuantity', e.target.value)}
              />
              <TextField
                label="Location"
                value={editedItem.location}
                onChange={(e) => handleFieldChange('location', e.target.value)}
              />
              <TextField
                label="Last Order Date"
                type="date"
                value={editedItem.lastOrderDate}
                onChange={(e) => handleFieldChange('lastOrderDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Link"
                value={editedItem.link}
                onChange={(e) => handleFieldChange('link', e.target.value)}
              />
              <TextField
                label="Discontinued"
                value={editedItem.discontinued ? 'Yes' : 'No'}
                onChange={(e) =>
                  handleFieldChange('discontinued', e.target.value === 'Yes')
                }
              />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Button
                  onClick={handleSave}
                  variant="contained"
                  startIcon={<Save />}
                >
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
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2">
                Vendor: {item.vendor}
              </Typography>
              <Typography variant="body2">
                Location: {item.location || 'N/A'}
              </Typography>
              <Typography variant="body2">
                Last Order Date: {item.lastOrderDate || 'N/A'}
              </Typography>
              <Typography variant="body2">
                Reorder Level: {item.reorderLevel}
              </Typography>
              <Typography variant="body2">
                Reorder Quantity: {item.reorderQuantity}
              </Typography>
              <Typography variant="body2">
                Cost Per Item: ${item.costPerItem.toFixed(2)}
              </Typography>
              <Typography variant="body2">
                Discontinued: {item.discontinued ? 'Yes' : 'No'}
              </Typography>
              <Typography variant="body2">
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.link ? 'View Link' : 'No Link Available'}
                </a>
              </Typography>
              <IconButton onClick={() => setIsEditing(true)} sx={{ mt: 2 }}>
                <Edit />
              </IconButton>
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ItemCard;
