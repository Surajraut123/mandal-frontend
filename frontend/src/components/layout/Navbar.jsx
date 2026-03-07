import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Settings,
  Dashboard,
  People,
  Person,
} from '@mui/icons-material';
import api from '../../axios/api';
import { useDispatch } from 'react-redux';
import { clearRole } from '../../redux/slice/slice';
import Logo from '../../assets/Banner.png'
import { postCall } from '../../axios/apis';
import { apiEndPointConstants } from '../../axios/endpoint';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onDrawerToggle, name, profileImage}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch()
  const avatar = name[0]
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    try {
      const response = await postCall(apiEndPointConstants.LOGOUT_ENDPOINT)
      if(response?.data?.status) {
        dispatch(clearRole());
        window.location.reload();
      }
    } catch (error) {
      console.log(error?.message)
    }
  };

  const navigate = useNavigate()
  const handleProfile = () => {
    navigate("/myprofile")
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        background: 'linear-gradient(45deg, #FF6B35 30%, #FF8A65 90%)',
        boxShadow: '0px 4px 20px rgba(255, 107, 53, 0.3)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onDrawerToggle}
              sx={{
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'rotate(90deg)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <img 
            src={Logo} 
            alt="Logo"
            style={{ 
              marginRight: '8px',
              width: isMobile ? '150px' : '300px',
              height: 'auto',
              maxWidth: '100%',
              transition: 'width 0.3s ease-in-out'
            }} 
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isMobile && (
            <Typography
              variant="body1"
              sx={{
                color: 'white',
                fontWeight: 500,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {name}
            </Typography>
          )}
          
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <Avatar
              src={profileImage || avatar}
              sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(45deg, #FFC107 30%, #FFEB3B 90%)',
                color: '#2E2E2E',
                fontWeight: 600,
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <Person sx={{ fontSize: 60 }} />
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          TransitionComponent={Fade}
          sx={{
            '& .MuiPaper-root': {
              borderRadius: 2,
              minWidth: 200,
              boxShadow: '0px 8px 32px rgba(255, 107, 53, 0.2)',
              border: '1px solid rgba(255, 107, 53, 0.1)',
            },
          }}
        >
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              gap: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                transform: 'translateX(4px)',
              },
            }}
          >
            <Dashboard fontSize="small" />
            Dashboard
          </MenuItem>
          <MenuItem
            onClick={handleProfile}
            sx={{
              gap: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                transform: 'translateX(4px)',
              },
            }}
          >
            <Person fontSize="small" />
            Profile
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            sx={{
              gap: 2,
              color: theme.palette.error.main,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                transform: 'translateX(4px)',
              },
            }}
          >
            <Logout fontSize="small" />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;