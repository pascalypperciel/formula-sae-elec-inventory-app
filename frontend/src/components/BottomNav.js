import React, { useState } from 'react';
import {
  AppBar, IconButton, Toolbar, Fab, Dialog, DialogTitle, DialogContent, Button, Box,
} from '@mui/material';
import { FaCamera, FaFileCsv, FaList } from 'react-icons/fa';
import { FiSettings, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { exportItems } from '../services/ItemService';
import ManualEntryDialog from './ManualEntryDialog';

const BottomNav = () => {
  const [openCsvDialog, setOpenCsvDialog] = useState(false);
  const [openManualDialog, setOpenManualDialog] = useState(false);
  const navigate = useNavigate();

  const handleFabClick = () => setOpenManualDialog(true);

  const handleCsvClick = () => setOpenCsvDialog(true);
  const handleCsvDialogClose = () => setOpenCsvDialog(false);

  const handleImportCsv = () => {
    handleCsvDialogClose();
    navigate('/upload');
  };

  const handleExportCsv = async () => {
    await exportItems();
    handleCsvDialogClose();
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

      <ManualEntryDialog open={openManualDialog} onClose={() => setOpenManualDialog(false)} />

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
              sx={{ height: 120, fontSize: '1.2rem' }}
              onClick={handleImportCsv}
            >
              Import CSV
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ height: 120, fontSize: '1.2rem' }}
              onClick={handleExportCsv}
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
