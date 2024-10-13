import React, { useState } from 'react';
import { AppBar, IconButton, Toolbar, Fab, Dialog, DialogTitle, DialogContent, Button, Box } from '@mui/material';
import { FaCamera, FaFileCsv, FaList } from "react-icons/fa";
import { FiSettings, FiUser } from 'react-icons/fi';
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const [openFabDialog, setOpenFabDialog] = useState(false);
  const [openCsvDialog, setOpenCsvDialog] = useState(false);
  const navigate = useNavigate();

  const handleFabClick = () => setOpenFabDialog(true);
  const handleFabDialogClose = () => setOpenFabDialog(false);

  const handleCsvClick = () => setOpenCsvDialog(true);
  const handleCsvDialogClose = () => setOpenCsvDialog(false);

  const handleImportCsv = () => {
    handleCsvDialogClose();
    navigate("/upload");
  };

  const handleNavigateToItemsList = () => {
    navigate('/');
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
          <IconButton color="default" onClick={handleNavigateToItemsList}>
            <FaList size={28} />
          </IconButton>

          <IconButton color="default" onClick={handleCsvClick}>
            <FaFileCsv size={28} />
          </IconButton>

          <Fab
            color="primary"
            aria-label="add"
            onClick={handleFabClick}
            sx={{ boxShadow: 'none' }}
          >
            <FaCamera size={25} />
          </Fab>

          <IconButton color="default">
            <FiUser size={28} />
          </IconButton>

          <IconButton color="default">
            <FiSettings size={28} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Dialog open={openFabDialog} onClose={handleFabDialogClose} fullWidth>
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

      <Dialog open={openCsvDialog} onClose={handleCsvDialogClose} fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>CSV Actions</DialogTitle>
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
              }}
              onClick={handleImportCsv}
            >
              Import CSV
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{
                height: 120,
                fontSize: '1.2rem',
              }}
              onClick={() => alert("Export CSV Selected")}
            >
              Export CSV
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BottomNav;
