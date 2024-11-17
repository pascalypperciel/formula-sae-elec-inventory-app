import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  Grid,
  Avatar,
} from "@mui/material";
import { getComponentById } from "../../services/ComponentService";
import { addToCart } from "../../services/ShoppingCartService";

const ComponentOrder = ({ componentId, onClose }) => {
  const [componentDetails, setComponentDetails] = useState(null);
  const [desiredQuantity, setDesiredQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [missingItems, setMissingItems] = useState([]);

  useEffect(() => {
    const fetchComponentDetails = async () => {
      try {
        const details = await getComponentById(componentId);
        setComponentDetails(details);
      } catch (error) {
        console.error("Error fetching component details:", error);
      }
    };

    fetchComponentDetails();
  }, [componentId]);

  const calculateMissingItems = useCallback(() => {
    if (!componentDetails) return;
  
    const updatedMissingItems = componentDetails.componentItems.map((item) => {
      const requiredQuantity = item.quantityRequired * desiredQuantity;
      const missingQuantity = Math.max(0, requiredQuantity - item.availableQuantity);
      return {
        ...item,
        requiredQuantity,
        missingQuantity,
        hasEnough: missingQuantity === 0,
        vendorId: item.vendorId || null,
      };
    });
  
    setMissingItems(updatedMissingItems);
  }, [componentDetails, desiredQuantity]);
  

  useEffect(() => {
    calculateMissingItems();
  }, [calculateMissingItems]);

  const handleAddToCart = async () => {
    setLoading(true);
  
    try {
      for (const item of missingItems) {
        if (item.missingQuantity > 0) {
          if (!item.vendorId) {
            console.error(`Vendor ID is missing for item ID: ${item.itemId}`);
            continue;
          }
          await addToCart(item.itemId, item.vendorId, item.missingQuantity, 2);
        }
      }
      alert("Missing quantities added to the shopping cart!");
      onClose();
    } catch (error) {
      console.error("Failed to add items to the cart:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!componentDetails) {
    return null;
  }

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Order Items for {componentDetails.name}</DialogTitle>
      <DialogContent>
        <TextField
          label="Desired Quantity"
          type="number"
          fullWidth
          value={desiredQuantity}
          onChange={(e) => setDesiredQuantity(parseInt(e.target.value, 10) || 1)}
          sx={{ mt: 3, mb: 3 }}
        />
        <Typography variant="h6" gutterBottom>
          Required Items:
        </Typography>
        <List>
          {missingItems.map((item) => (
            <ListItem key={item.itemId} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                src={item.imageUrl || "/placeholder.png"}
                alt={item.description || "Item Image"}
                variant="rounded"
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    ID: {item.itemId} - {item.identifier || "No identifier"}
                  </Typography>
                </Grid>
                <Grid item xs={6} style={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="textPrimary">
                    Available: {item.availableQuantity}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      color: item.hasEnough ? "green" : "red",
                    }}
                  >
                    Required: {item.requiredQuantity}
                  </Typography>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleAddToCart}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Adding to Cart..." : "Add Missing Items to Cart"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComponentOrder;
