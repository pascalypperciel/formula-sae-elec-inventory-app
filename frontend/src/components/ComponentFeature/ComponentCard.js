import React, { useState } from "react";
import { Typography, Button, Card, CardContent } from "@mui/material";
import ComponentOrder from "./ComponentOrder";

const ComponentCard = ({ component, onEdit }) => {
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  const handleOrder = () => {
    setShowOrderDialog(true);
  };

  const handleCloseOrderDialog = () => {
    setShowOrderDialog(false);
  };

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {component.name}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {component.description}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => onEdit(component.id)}
            sx={{ mr: 2 }}
          >
            Edit
          </Button>
          <Button variant="outlined" onClick={handleOrder}>
            Order
          </Button>
        </CardContent>
      </Card>
      {showOrderDialog && (
        <ComponentOrder
          componentId={component.id}
          onClose={handleCloseOrderDialog}
        />
      )}
    </>
  );
};

export default ComponentCard;
