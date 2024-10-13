import React, { useState } from 'react';
import { AppBar, IconButton, Toolbar, Fab, Dialog, DialogTitle, DialogContent, Button, Box } from '@mui/material';
import { TbPlusMinus } from "react-icons/tb";
import { FiHome, FiSettings, FiSearch, FiUser } from 'react-icons/fi';
import { MdOutlineQrCodeScanner } from "react-icons/md";

const BottomNav = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleFabClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          top: 'auto',
          bottom: 0,
          backgroundColor: '#ffffff',
          height: 80,
          boxShadow: '0px -1px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <IconButton color="default">
            <FiHome size={28} />
          </IconButton>

          <IconButton color="default">
            <FiSearch size={28} />
          </IconButton>

          <Fab
            color="primary"
            aria-label="add"
            onClick={handleFabClick}
            sx={{ boxShadow: 'none' }}
          >
            <TbPlusMinus size={28} />
          </Fab>

          <IconButton color="default">
            <FiUser size={28} />
          </IconButton>

          <IconButton color="default">
            <FiSettings size={28} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>Quick Inventory Change</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                height: 120,
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => alert("Scan Selected")}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: 'inherit', 
                }}
              >
                <span>Scan</span>
                <IconButton color="inherit" sx={{ padding: 0 }}>
                  <MdOutlineQrCodeScanner size={60} />
                </IconButton>
              </Box>
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => alert("Manual Selected")}
            >
              Enter Manually
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BottomNav;
