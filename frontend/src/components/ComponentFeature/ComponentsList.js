import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ComponentCard from "./ComponentCard";
import { getComponents } from "../../services/ComponentService";

const ComponentsList = ({ onEdit }) => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const data = await getComponents();
        setComponents(data);
      } catch (error) {
        console.error("Failed to fetch components:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (components.length === 0) {
    return <Typography>No components found.</Typography>;
  }

  return (
    <Box>
      {components.map((component) => (
        <ComponentCard key={component.id} component={component} onEdit={onEdit} />
      ))}
    </Box>
  );
};

export default ComponentsList;
