import React from 'react';
import { AppBar, IconButton, Toolbar, Fab } from '@mui/material';
import { FaCamera, FaList } from 'react-icons/fa';
import { FiSettings, FiUser } from 'react-icons/fi';
import { SiDigikeyelectronics } from "react-icons/si";
import { useNavigate } from 'react-router-dom';
import ManualEntryDialog from './ManualEntryDialog';

const BottomNav = () => {
  const [openManualDialog, setOpenManualDialog] = React.useState(false);
  const navigate = useNavigate();

  const handleFabClick = () => setOpenManualDialog(true);

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

          <IconButton color="default">
            <SiDigikeyelectronics size={28} />
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
    </>
  );
};

export default BottomNav;
