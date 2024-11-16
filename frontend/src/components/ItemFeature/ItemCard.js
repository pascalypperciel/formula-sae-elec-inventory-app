import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Avatar,
  Collapse,
  Grid,
} from '@mui/material';
import { Save, Cancel, Delete, Edit, Link as LinkIcon } from '@mui/icons-material';
import { addToCart } from '../../services/ShoppingCartService';
import { deleteItem } from '../../services/ItemService';

const ItemCard = ({ item, onSave }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState({ ...item });
  const [quantity, setQuantity] = useState(1);

  const handleFieldChange = (field, value) => {
    setEditedItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave(editedItem);
  };

  const handleAddToCart = async () => {
    const vendorId = item.vendor?.id || '';
    if (vendorId && item.id) {
      await addToCart(item.id, vendorId, quantity);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the item "${item.identifier}"?`)) {
      await deleteItem(item.id);
      window.location.reload();
    }
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
            <Typography variant="body2">{item.description}</Typography>
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
                disabled
                label="Quantity"
                type="number"
                value={editedItem.quantity}
                onChange={(e) => handleFieldChange('quantity', e.target.value)}
              />
              <TextField
                label="Description"
                value={editedItem.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
              />
              <TextField
                label="Vendor"
                value={editedItem.vendor?.name || 'Unknown'}
                onChange={(e) =>
                  setEditedItem((prev) => ({
                    ...prev,
                    vendor: { ...prev.vendor, name: e.target.value },
                  }))
                }
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
                label="Cost Per Item"
                type="number"
                value={editedItem.costPerItem}
                onChange={(e) => handleFieldChange('costPerItem', e.target.value)}
              />
              <TextField
                label="Discontinued"
                value={editedItem.discontinued ? 'Yes' : 'No'}
                onChange={(e) =>
                  handleFieldChange('discontinued', e.target.value === 'Yes')
                }
              />
              <TextField
                label="Link"
                value={editedItem.link}
                onChange={(e) => handleFieldChange('link', e.target.value)}
              />
              <TextField
                label="Image URL"
                value={editedItem.imageUrl}
                onChange={(e) => handleFieldChange('imageUrl', e.target.value)}
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
            <Grid>
              <Grid 
                container 
                spacing={2} 
                justifyContent="center" 
                alignItems="center"
              >
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Vendor:
                  </Typography>
                  <Typography variant="body2">{item.vendor?.name || 'Unknown'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Location:
                  </Typography>
                  <Typography variant="body2">{item.location || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Last Order Date:
                  </Typography>
                  <Typography variant="body2">{item.lastOrderDate || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Cost Per Item:
                  </Typography>
                  <Typography variant="body2">${Number(item.costPerItem || 0).toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Reorder Level:
                  </Typography>
                  <Typography variant="body2">{item.reorderLevel}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Reorder Quantity:
                  </Typography>
                  <Typography variant="body2">{item.reorderQuantity}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Discontinued:
                  </Typography>
                  <Typography variant="body2">{item.discontinued ? 'Yes' : 'No'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  {item.link ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<LinkIcon />}
                    >
                      Manufacturer's Link
                    </Button>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No Link Available
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="center" alignItems="center" mt={4} gap={20}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="contained"
                    startIcon={<Edit />}
                    sx={{
                      height: '56px',
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="outlined"
                    startIcon={<Delete />}
                    sx={{
                      height: '56px',
                    }}
                  >
                    Delete
                  </Button>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <TextField
                    label="Qty"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    sx={{
                      width: 80,
                      backgroundColor: 'white',
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddToCart}
                    sx={{
                      height: '56px',
                    }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Box>
            </Grid>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ItemCard;
