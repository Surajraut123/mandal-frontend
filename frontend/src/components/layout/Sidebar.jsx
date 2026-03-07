import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import {
  Dashboard,
  People,
  Settings,
  AccountBalance,
  Analytics,
  Event,
  AddCircle,
  CurrencyRupee,
  ScheduleSendOutlined,
  PersonAdd
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ADMIN_ROLE_NAME, TREASURER_ROLE_NAME } from '../../constant/DefaultValues';

const drawerWidth = 280;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const roleName = useSelector((state) => state.role.roleName)

  // { text: 'Analytics', icon: <Analytics />, path: '/analytics', allow: true },
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', allow: true },
    { text: 'User Details', icon: <People />, path: '/user-details', allow: true },
    { text: 'Events', icon: <Event />, path: '/events', allow: true },
    { text: 'Contributions', icon: <AccountBalance />, path: '/contributions', allow: false },
    { text: 'Add Contribution', icon: <AddCircle />, path: '/add-contribution', allow: true },
    { text: 'Add Investments', icon: <CurrencyRupee />, path: '/add-investment', allow: true },
    { text: 'Recent Update  ', icon: <ScheduleSendOutlined />, path: '/recent-requests', allow: true},
    { text: 'Add Member  ', icon: <PersonAdd />, path: '/add-member', allow: (roleName === ADMIN_ROLE_NAME || roleName === TREASURER_ROLE_NAME)},
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      handleDrawerToggle();
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', background: 'linear-gradient(180deg, #FFF8E1 0%, #FFE0B2 100%)'}}>

      <List sx={{ px: 2, py: isMobile ? 10 : 2 }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          

          if(item?.allow) {
            return (
              <Fade in timeout={300 + index * 100} key={item.text}>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 2,
                      transition: 'all 0.3s ease-in-out',
                      backgroundColor: isActive ? 'rgba(255, 107, 53, 0.15)' : 'transparent',
                      border: isActive ? '2px solid rgba(255, 107, 53, 0.3)' : '2px solid transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 107, 53, 0.1)',
                        transform: 'translateX(8px)',
                        boxShadow: '4px 4px 12px rgba(255, 107, 53, 0.2)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                        transition: 'color 0.3s ease-in-out',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        '& .MuiTypography-root': {
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                          transition: 'all 0.3s ease-in-out',
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Fade>
            );
          } 
        })}
      </List>

      <Divider sx={{ mx: 2, my: 2 }} />

      {roleName !== "3" && (
      <List sx={{ px: 2 }}>
        <Fade in timeout={800}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/settings')}
              sx={{
                borderRadius: 2,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  transform: 'translateX(8px)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                <Settings />
              </ListItemIcon>
              <ListItemText
                primary="Settings"
                sx={{
                  '& .MuiTypography-root': {
                    color: theme.palette.text.primary,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        </Fade>
      </List>)}

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          textAlign: 'center',
          background: 'rgba(255, 107, 53, 0.05)',
          borderTop: '1px solid rgba(255, 107, 53, 0.1)',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontStyle: 'italic',
          }}
        >
          Ganpati Bappa Morya! 🙏
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            zIndex: theme.zIndex.drawer,
            marginTop: '64px',
            height: 'calc(100vh - 64px)',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
