import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, TextField, Avatar } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate, useParams } from "react-router-dom";
import { editComponent, getComponents } from "../../services/ComponentService";
import { getItems } from "../../services/ItemService";

const EditComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsData, components] = await Promise.all([getItems(), getComponents()]);
        setAvailableItems(itemsData);

        const component = components.find((comp) => comp.id === parseInt(id, 10));
        if (component) {
          setName(component.name);
          setDescription(component.description || "");
          setItems(
            component.componentItems.map((item) => ({
              itemId: item.itemId,
              quantityRequired: item.quantityRequired,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

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
      description,
      componentItems: validItems.map((item) => ({
        itemId: parseInt(item.itemId, 10),
        quantityRequired: parseInt(item.quantityRequired, 10),
      })),
    };

    try {
      await editComponent(id, component);
      alert("Component updated successfully!");
      navigate("/components");
    } catch (error) {
      console.error("Error updating component:", error);
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Edit Component
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
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        <Button variant="contained" type="submit">
          Update Component
        </Button>
      </form>
    </Box>
  );
};

export default EditComponent;
