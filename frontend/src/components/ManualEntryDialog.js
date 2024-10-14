import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Typography,
} from '@mui/material';
import { MdOutlineQrCodeScanner } from 'react-icons/md';
import { Add, Remove } from '@mui/icons-material';
import { getItems, updateQuantities } from '../services/ItemService';
import { Html5Qrcode } from 'html5-qrcode';

const ManualEntryDialog = ({ open, onClose }) => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState({});
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getItems();
      setItems(data);
    };
    fetchItems();
  }, []);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleToggleItem = (item) => {
    setSelectedItems((prev) => ({
      ...prev,
      [item.id]: prev[item.id] ? undefined : { ...item, quantityUsed: 1 },
    }));
    setSearchQuery('');
  };

  const handleQuantityChange = (id, value) => {
    const quantity = Math.max(0, Number(value));
    setSelectedItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], quantityUsed: quantity },
    }));
  };

  const handleIncrement = (id, delta) => {
    setSelectedItems((prev) => {
      const currentQuantity = prev[id].quantityUsed + delta;
      return {
        ...prev,
        [id]: { ...prev[id], quantityUsed: Math.max(0, currentQuantity) },
      };
    });
  };

  const handleScanIconClick = () => {
    setScanning(true);
    const scanner = new Html5Qrcode('reader');
    scanner.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText) => {
        handleScanSuccess(decodedText);
        scanner.stop().then(() => setScanning(false));
      }
    );
  };

  const handleScanSuccess = (identifier) => {
    const item = items.find((i) => i.identifier === identifier);
    if (item) {
      handleToggleItem(item);
    } else {
      alert('Item not found.');
    }
  };

  const handleSubmit = async () => {
    const usages = Object.values(selectedItems)
      .filter(Boolean)
      .map((item) => ({
        id: item.id,
        quantityUsed: item.quantityUsed,
      }));

    try {
      await updateQuantities(usages);
      onClose();
      window.location.reload();
    } catch (error) {
      alert('Failed to update quantities.');
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Select Components Used</DialogTitle>
      <DialogContent>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <TextField
          fullWidth
          label="Search Items"
          value={searchQuery}
          onChange={handleSearchChange}
          margin="none"
        />
        <Button
          onClick={handleScanIconClick}
          variant="contained"
          sx={{
            color: 'white',
            padding: '0 12px',
            height: '56px',
            minWidth: '120px',
            display: 'flex',
            alignItems: 'center',
          }}
          startIcon={<MdOutlineQrCodeScanner size={28} />}
        >
          Scan Item
        </Button>
      </Box>



        {scanning && <div id="reader" style={{ width: '100%' }}></div>}

        {searchQuery && (
          <List>
            {filteredItems.map((item) => (
              <ListItem key={item.id} disablePadding onClick={() => handleToggleItem(item)}>
                <ListItemAvatar>
                  <Avatar src={item.imageUrl}>{item.name ? item.name[0] : '?'}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.identifier} secondary={`Category: ${item.category}`} />
              </ListItem>
            ))}
          </List>
        )}

        <Box mt={2}>
          <Typography variant="h6">Selected Components</Typography>
          <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
            {Object.values(selectedItems)
              .filter(Boolean)
              .map((item) => (
                <Box
                  key={item.id}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  width={170}
                  border={1}
                  borderRadius={2}
                  padding={2}
                  sx={{
                    borderColor: 'divider',
                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Avatar src={item.imageUrl} sx={{ width: 64, height: 64, mb: 1 }}>
                    {item.name ? item.name[0] : '?'}
                  </Avatar>
                  <Typography align="center" noWrap sx={{ width: '100%' }}>
                    {item.identifier}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <IconButton onClick={() => handleIncrement(item.id, -1)}>
                      <Remove />
                    </IconButton>
                    <TextField
                      type="number"
                      value={item.quantityUsed}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      inputProps={{ min: 0, style: { textAlign: 'center' } }}
                      sx={{
                        width: 60,
                        mx: 1,
                        '& input[type=number]': {
                          '-moz-appearance': 'textfield',
                        },
                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                      }}
                    />
                    <IconButton onClick={() => handleIncrement(item.id, 1)}>
                      <Add />
                    </IconButton>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>

        <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ManualEntryDialog;
