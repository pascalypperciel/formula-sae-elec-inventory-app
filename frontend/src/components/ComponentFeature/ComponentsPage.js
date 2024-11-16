import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ComponentsList from "./ComponentsList";

const ComponentsPage = () => {
  const navigate = useNavigate();

  const handleCreateClick = () => navigate("/components/create");
  const handleEdit = (id) => navigate(`/components/edit/${id}`);

  return (
    <Box p={2}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4" gutterBottom>
          Components
        </Typography>
        <Button
          variant="contained"
          onClick={handleCreateClick}
        >
          Create New Component
        </Button>
      </Box>
      <ComponentsList onEdit={handleEdit} />
    </Box>
  );
};

export default ComponentsPage;
