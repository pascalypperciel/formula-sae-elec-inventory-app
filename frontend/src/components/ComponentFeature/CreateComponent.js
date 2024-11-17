import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, TextField, Avatar } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate } from "react-router-dom";
import { createComponent } from "../../services/ComponentService";
import { getItems } from "../../services/ItemService";

const CreateComponent = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [items, setItems] = useState([{ itemId: "", quantityRequired: "" }]);
  const [availableItems, setAvailableItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems();
        setAvailableItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { itemId: "", quantityRequired: "" }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleChangeItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validItems = items.filter((item) => item.itemId && item.quantityRequired);
    if (validItems.length === 0) {
      alert("Please add at least one valid item.");
      return;
    }

    const component = {
      name,
      componentItems: validItems.map((item) => ({
        itemId: parseInt(item.itemId, 10),
        quantityRequired: parseInt(item.quantityRequired, 10),
      })),
    };

    try {
      await createComponent(component);
      alert("Component created successfully!");
      navigate("/components");
    } catch (error) {
      console.error("Error creating component:", error);
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Create Component
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Component Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          sx={{ mb: 3 }}
        />
        <Typography variant="h6">Items</Typography>
        {items.map((item, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
            <Grid item xs={5}>
              <Autocomplete
                options={availableItems}
                getOptionLabel={(option) =>
                  `${option.id} - ${option.description || "No description"}`
                }
                value={
                  availableItems.find((opt) => opt.id === parseInt(item.itemId, 10)) || null
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Avatar src={option.imageUrl} alt={option.name} />
                    <Box>
                      <Typography variant="body1">
                        {option.id} - {option.description || "No description"}
                      </Typography>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => <TextField {...params} label="Select Item" />}
                onChange={(e, value) =>
                  handleChangeItem(index, "itemId", value ? value.id : "")
                }
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Quantity Required"
                fullWidth
                value={item.quantityRequired}
                onChange={(e) =>
                  handleChangeItem(index, "quantityRequired", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={2}>
              <Button color="error" onClick={() => handleRemoveItem(index)}>
                Remove
              </Button>
            </Grid>
          </Grid>
        ))}
        <Button variant="outlined" onClick={handleAddItem} sx={{ mb: 3 }}>
          Add Item
        </Button>
        <br />
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/components")}
          >
            Cancel
          </Button>
        <Button variant="contained" type="submit">
          Create Component
        </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateComponent;
