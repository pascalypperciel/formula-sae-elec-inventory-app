import React, { useState, useEffect } from 'react';
import { getItemHistory } from '../services/ItemService';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const ItemHistoryList = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getItemHistory();
      setHistory(data);
    };
    fetchHistory();
  }, []);

  const convertUTCToUSEast = (timestamp) => {
    const utcDate = new Date(`${timestamp}Z`);

    const options = {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };

    return utcDate.toLocaleString('en-US', options);
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Item History
      </Typography>
      <List>
        {history.map((entry) => (
          <ListItem key={entry.id}>
            <ListItemText
              primary={`Item: ${entry.itemIdentifier}, Change: ${entry.amountChanged}`}
              secondary={
                <>
                  New Quantity: {entry.newQuantity}
                  <br />
                  Time: {convertUTCToUSEast(entry.timestamp)}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ItemHistoryList;
