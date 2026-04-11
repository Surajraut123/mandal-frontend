import React, { useState } from 'react';
import { Box, Toolbar, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const HIDE_SCROLLBAR_SX = {
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': { display: 'none', width: 0, height: 0 },
};

const Layout = ({ children, name, profileImage }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  console.log("fullname : ", name)
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
    }}>
      <Navbar onDrawerToggle={handleDrawerToggle} name={name} profileImage={profileImage}/>
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - 280px)` },
          minWidth: 0,
          background: theme.palette.background.gradient,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Toolbar />
        <Box
          data-testid="layout-content"
          sx={{
            p: { xs: 1, sm: 1.5 },
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            ...HIDE_SCROLLBAR_SX,
          }}>
            {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
