import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Container,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LocalShipping as ParcelsIcon,
  Add as CreateIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  LocalShipping as TruckIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { alpha } from '@mui/material/styles';

const Navigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'My Parcels', icon: <ParcelsIcon />, path: '/parcels' },
    { text: 'New Delivery', icon: <CreateIcon />, path: '/create' },
  ];

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0066FF 0%, #00D4AA 100%)',
          }}
        >
          <TruckIcon sx={{ fontSize: 24, color: 'white' }} />
        </Box>
        <Typography variant="h6" fontWeight={800}>
          Deliveroo
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                mx: 1,
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: alpha('#0066FF', 0.1),
                  '&:hover': {
                    bgcolor: alpha('#0066FF', 0.15),
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 600 : 400 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0 } }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0066FF 0%, #00D4AA 100%)',
                }}
              >
                <TruckIcon sx={{ fontSize: 22, color: 'white' }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #0066FF 0%, #00D4AA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Deliveroo
              </Typography>
            </Box>

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, ml: 4 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    onClick={() => navigate(item.path)}
                    startIcon={item.icon}
                    sx={{
                      color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      bgcolor: location.pathname === item.path ? alpha('#0066FF', 0.1) : 'transparent',
                      '&:hover': {
                        bgcolor: alpha('#0066FF', 0.1),
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={handleMenuOpen}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;
