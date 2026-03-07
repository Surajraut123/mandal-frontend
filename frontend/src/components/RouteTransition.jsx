import React from 'react';
import { Fade, Slide, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

const RouteTransition = ({ children }) => {
  const location = useLocation();

  return (
    <Fade in timeout={400} key={location.pathname}>
      <Slide direction="up" in timeout={300}>
        <Box
          sx={{
            transition: 'all 0.3s ease-in-out',
            minHeight: '100%',
          }}
        >
          {children}
        </Box>
      </Slide>
    </Fade>
  );
};

export default RouteTransition;
