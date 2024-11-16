import React from "react";
import { Typography, Button, Card, CardContent } from "@mui/material";

const ComponentCard = ({ component, onEdit }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {component.name}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {component.description}
        </Typography>
        <Button variant="outlined" onClick={() => onEdit(component.id)}>
          Edit
        </Button>
      </CardContent>
    </Card>
  );
};

export default ComponentCard;
