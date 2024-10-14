import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField, Button, Box, List, ListItem, ListItemText, Checkbox, IconButton,
} from '@mui/material';
import { MdOutlineQrCodeScanner } from 'react-icons/md';
import { getItems, updateQuantities } from '../services/ItemService';
import { Html5Qrcode } from 'html5-qrcode';

const ManualEntryDialog = ({ open, onClose }) => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState({});
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getItems();
      setItems(data);
    };
    fetchItems();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleToggleItem = (item) => {
    setSelectedItems((prev) => ({
      ...prev,
      [item.id]: prev[item.id] ? undefined : { ...item, quantityUsed: 0 },
    }));
  };

  const handleQuantityChange = (id, quantity) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], quantityUsed: Number(quantity) },
    }));
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
    const usages = Object.values(selectedItems).filter(Boolean).map((item) => ({
      id: item.id,
      quantityUsed: item.quantityUsed,
    }));

    try {
      await updateQuantities(usages);
      onClose();
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
        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            fullWidth
            label="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            margin="normal"
          />
          <IconButton onClick={handleScanIconClick}>
            <MdOutlineQrCodeScanner size={28} />
          </IconButton>
        </Box>

        {scanning && <div id="reader" style={{ width: '100%' }}></div>}

        <List>
          {filteredItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <Checkbox
                checked={!!selectedItems[item.id]}
                onChange={() => handleToggleItem(item)}
              />
              <ListItemText
                primary={item.identifier}
                secondary={`Category: ${item.category}`}
              />
              {selectedItems[item.id] && (
                <TextField
                  type="number"
                  label="Quantity Used"
                  value={selectedItems[item.id].quantityUsed}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  sx={{ width: 100, marginLeft: 2 }}
                />
              )}
            </ListItem>
          ))}
        </List>

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
