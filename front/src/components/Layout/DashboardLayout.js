import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  MedicalServices as MedicalIcon,
  LocalHospital as HospitalIcon,
  Bed as BedIcon,
  Assignment as AssignmentIcon,
  Favorite as FavoriteIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Shield as ShieldIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeMode } from '../../contexts/ThemeContext';
import NotificationsBell from '../shared/NotificationsBell';
const drawerWidth = 240;
const getMenuItems = (roles) => {
  const items = [];
  if (roles?.includes('ADMINISTRATEUR')) {
    items.push(
      { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/admin/tableau-de-bord' },
      { text: 'Mon Profil', icon: <AccountIcon />, path: '/staff/profil' },
      { text: 'Notifications', icon: <NotificationsIcon />, path: '/admin/notifications' },
      { text: 'Utilisateurs', icon: <PeopleIcon />, path: '/admin/utilisateurs' },
      { text: 'Rôles', icon: <ShieldIcon />, path: '/admin/roles' },
      { text: 'Permissions', icon: <ShieldIcon />, path: '/admin/permissions' },
      { text: 'Patients', icon: <PeopleIcon />, path: '/patients' },
      { text: 'Rendez-vous', icon: <CalendarIcon />, path: '/rendezvous' },
      { text: 'Consultations', icon: <MedicalIcon />, path: '/consultations' },
      { text: 'Hospitalisations', icon: <HospitalIcon />, path: '/hospitalisations' },
      { text: 'Lits', icon: <BedIcon />, path: '/lits' },
      { text: 'Factures', icon: <ReceiptIcon />, path: '/factures' },
      { text: 'Paiements', icon: <PaymentIcon />, path: '/paiements' },
      { text: 'Assurances', icon: <ShieldIcon />, path: '/assurances' }
    );
  }
  if (roles?.includes('AGENT_ACCUEIL')) {
    items.push(
      { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/accueil/tableau-de-bord' },
      { text: 'Mon Profil', icon: <AccountIcon />, path: '/staff/profil' },
      { text: 'Patients', icon: <PeopleIcon />, path: '/patients' },
      { text: 'Rendez-vous', icon: <CalendarIcon />, path: '/rendezvous' },
      { text: 'Lits', icon: <BedIcon />, path: '/lits' }
    );
  }
  if (roles?.includes('MEDECIN')) {
    items.push(
      { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/medecin/tableau-de-bord' },
      { text: 'Mon Profil', icon: <AccountIcon />, path: '/staff/profil' },
      { text: 'Consultations', icon: <MedicalIcon />, path: '/consultations' },
      { text: 'Hospitalisations', icon: <HospitalIcon />, path: '/hospitalisations' },
      { text: 'Patients', icon: <PeopleIcon />, path: '/patients' },
      { text: 'Rendez-vous', icon: <CalendarIcon />, path: '/rendezvous' }
    );
  }
  if (roles?.includes('INFIRMIER')) {
    items.push(
      { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/infirmier/tableau-de-bord' },
      { text: 'Mon Profil', icon: <AccountIcon />, path: '/staff/profil' },
      { text: 'Patients', icon: <PeopleIcon />, path: '/patients' }
    );
  }
  if (roles?.includes('COMPTABLE')) {
    items.push(
      { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/comptabilite/tableau-de-bord' },
      { text: 'Mon Profil', icon: <AccountIcon />, path: '/staff/profil' },
      { text: 'Factures', icon: <ReceiptIcon />, path: '/factures' },
      { text: 'Paiements', icon: <PaymentIcon />, path: '/paiements' },
      { text: 'Assurances', icon: <ShieldIcon />, path: '/assurances' }
    );
  }
  if (roles?.includes('DIRECTEUR')) {
    items.push(
      { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/directeur/tableau-de-bord' },
      { text: 'Mon Profil', icon: <AccountIcon />, path: '/staff/profil' },
      { text: 'Statistiques', icon: <DashboardIcon />, path: '/directeur/statistiques' },
      { text: 'Patients', icon: <PeopleIcon />, path: '/patients' }
    );
  }
  if (roles?.includes('PATIENT')) {
    items.push(
      { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/patient/tableau-de-bord' },
      { text: 'Mon profil', icon: <AccountIcon />, path: '/patient/profil' },
      { text: 'Mes rendez-vous', icon: <CalendarIcon />, path: '/patient/rendezvous' },
      { text: 'Mes consultations', icon: <MedicalIcon />, path: '/patient/consultations' },
      { text: 'Mon dossier médical', icon: <AssignmentIcon />, path: '/patient/dossier-medical' },
      { text: 'Mes constantes vitales', icon: <FavoriteIcon />, path: '/patient/constantes-vitales' },
      { text: 'Mes hospitalisations', icon: <HospitalIcon />, path: '/patient/hospitalisations' },
      { text: 'Mes factures', icon: <ReceiptIcon />, path: '/patient/factures' },
      { text: 'Mes paiements', icon: <PaymentIcon />, path: '/patient/paiements' },
      { text: 'Mon assurance', icon: <ShieldIcon />, path: '/patient/assurances' }
    );
  }
  return items;
};
const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const menuItems = getMenuItems(user?.roles);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    await logout();
    navigate('/login');
    handleMenuClose();
  };
  const drawer = (
    <Box
      sx={{
        height: '100%',
        background: theme.palette.mode === 'dark' ? '#05070a' : '#ffffff',
        borderRight: theme.palette.mode === 'dark' 
          ? '1px solid rgba(255, 255, 255, 0.08)' 
          : '1px solid rgba(0, 0, 0, 0.08)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          minHeight: '64px !important',
          background: theme.palette.mode === 'dark' ? '#05070a' : '#ffffff',
          borderBottom: theme.palette.mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.08)' 
            : '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <HospitalIcon 
            sx={{ 
              fontSize: 28, 
              color: theme.palette.mode === 'dark' ? '#1976d2' : '#1976d2',
            }} 
          />
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              fontWeight: 600,
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#1a1a1a',
            }}
          >
            Système Hospitalier
          </Typography>
        </Box>
      </Toolbar>
      <List sx={{ px: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 0,
                py: 1.25,
                px: 2,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(25, 118, 210, 0.15)' 
                    : 'rgba(25, 118, 210, 0.08)',
                  color: theme.palette.mode === 'dark' ? '#42a5f5' : '#1976d2',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(25, 118, 210, 0.2)' 
                      : 'rgba(25, 118, 210, 0.12)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.mode === 'dark' ? '#42a5f5' : '#1976d2',
                  },
                },
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: location.pathname === item.path
                    ? theme.palette.mode === 'dark' ? '#42a5f5' : '#1976d2'
                    : theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.7)' 
                    : 'rgba(0, 0, 0, 0.6)',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  color: location.pathname === item.path
                    ? theme.palette.mode === 'dark' ? '#42a5f5' : '#1976d2'
                    : theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.7)' 
                    : 'rgba(0, 0, 0, 0.6)',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: theme.palette.mode === 'dark' ? '#05070a' : '#ffffff',
          borderBottom: theme.palette.mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.08)' 
            : '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important', px: 3 }}>
          <IconButton
            color="inherit"
            aria-label="ouvrir le menu"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              color: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.7)' 
                : 'rgba(0, 0, 0, 0.6)',
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#1a1a1a',
            }}
          >
            {menuItems.find((item) => item.path === location.pathname)?.text || 'Système Hospitalier'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <NotificationsBell />
            <IconButton 
              onClick={toggleMode} 
              size="small"
              sx={{
                color: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.7)' 
                  : 'rgba(0, 0, 0, 0.6)',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Typography 
              variant="body2" 
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                color: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.7)' 
                  : 'rgba(0, 0, 0, 0.6)',
                fontWeight: 500,
              }}
            >
              {user?.username}
            </Typography>
            <IconButton 
              onClick={handleMenuClick} 
              size="small"
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: theme.palette.mode === 'dark' ? '#1976d2' : '#1976d2',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  background: theme.palette.mode === 'dark' ? '#0c1017' : '#ffffff',
                  border: theme.palette.mode === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.08)' 
                    : '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0px 4px 16px rgba(0, 0, 0, 0.4)'
                    : '0px 4px 16px rgba(0, 0, 0, 0.1)',
                  mt: 1,
                },
              }}
            >
              <MenuItem 
                onClick={() => {
                  const isPatient = user?.roles?.includes('PATIENT');
                  if (isPatient) {
                    navigate('/patient/profil');
                  } else {
                    navigate('/staff/profil');
                  }
                  handleMenuClose();
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemIcon>
                  <AccountIcon 
                    fontSize="small"
                    sx={{
                      color: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.7)' 
                        : 'rgba(0, 0, 0, 0.6)',
                    }}
                  />
                </ListItemIcon>
                <Typography
                  sx={{
                    color: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.7)' 
                      : 'rgba(0, 0, 0, 0.6)',
                  }}
                >
                  Mon Profil
                </Typography>
              </MenuItem>
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemIcon>
                  <LogoutIcon 
                    fontSize="small" 
                    sx={{
                      color: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.7)' 
                        : 'rgba(0, 0, 0, 0.6)',
                    }}
                  />
                </ListItemIcon>
                <Typography
                  sx={{
                    color: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.7)' 
                      : 'rgba(0, 0, 0, 0.6)',
                  }}
                >
                  Déconnexion
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
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
              background: theme.palette.mode === 'dark' ? '#05070a' : '#ffffff',
              borderRight: theme.palette.mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.08)' 
                : '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: 'none',
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
              background: theme.palette.mode === 'dark' ? '#05070a' : '#ffffff',
              borderRight: theme.palette.mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.08)' 
                : '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: theme.palette.background.default,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
export default DashboardLayout;
