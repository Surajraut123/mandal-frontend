import React, { useState } from 'react';
import { Box, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children, name, profileImage }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  console.log("fullname : ", name)
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', width:"100%" }}>
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
          background: theme.palette.background.gradient,
          height: '100%',
        }}
      >
        <Toolbar />
        <Box
        data-testid="layout-content"
        sx={{
          p: { xs: 1, sm: 1.5 },
          height: 'calc(100% - 64px)',
          overflow: isDesktop ? 'hidden' : 'auto',
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
