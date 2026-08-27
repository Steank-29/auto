// src/components/AdminBar.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
  Tooltip,
  Chip,
  Collapse as MuiCollapse,
  Fab,
  SwipeableDrawer,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Dashboard,
  ShoppingBag,
  People,
  LocalOffer,
  BarChart,
  Settings,
  Logout,
  Notifications,
  Menu as MenuIcon,
  ChevronLeft,
  Inventory,
  Help,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Warning,
  Cancel,
  Storage,
  TrendingUp,
  TrendingDown,
  Person,
  Email,
  CalendarToday,
  Wc,
  AdminPanelSettings,
  Close,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import PA from '../assets/PA.png';
import BDG from '../assets/BDG.png';
import axiosInstance from '../utils/axiosConfig';

const AdminBar = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [stockStats, setStockStats] = useState({
    full: 0,
    low: 0,
    out: 0,
    total: 0,
  });
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Get user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Fetch stock stats
  useEffect(() => {
    const fetchStockStats = async () => {
      try {
        const response = await axiosInstance.get('/products?limit=1000');
        if (response.data.success) {
          const products = response.data.data;
          const full = products.filter(p => p.stock > 5).length;
          const low = products.filter(p => p.stock > 0 && p.stock <= 5).length;
          const out = products.filter(p => p.stock === 0).length;
          setStockStats({
            full,
            low,
            out,
            total: products.length,
          });
        }
      } catch (error) {
        console.error('Error fetching stock stats:', error);
      }
    };

    fetchStockStats();
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleProfileOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleNotifOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const handleMenuToggle = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) setSidebarOpen(false);
    setMobileDrawerOpen(false);
  };

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberedEmail');
    handleProfileClose();
    navigate('/signin');
  };

  const handleMobileMenuOpen = () => {
    setMobileDrawerOpen(true);
  };

  const handleMobileMenuClose = () => {
    setMobileDrawerOpen(false);
  };

  // Handle alert dialog for unavailable features
  const handleFeatureUnavailable = (featureName) => {
    setAlertMessage(`La funzionalità "${featureName}" non è ancora disponibile. Il marketplace è ancora in fase di sviluppo.`);
    setAlertDialogOpen(true);
  };

  const handleAlertClose = () => {
    setAlertDialogOpen(false);
  };

  // Navigation items with stock badges
  const navItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/admin/dashboard',
    },
    {
      text: 'Prodotti',
      icon: <Inventory />,
      path: '/admin/products',
      subItems: [
        { text: 'Aggiungi Prodotto', path: '/admin/products/add' },
        { 
          text: 'Stock Di Prodotti', 
          path: '/admin/products/stock',
          badge: (
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <Chip
                label={`${stockStats.full}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(46,125,50,0.12)',
                  color: '#2e7d32',
                  fontWeight: 600,
                  fontSize: '0.6rem',
                  height: '18px',
                  minWidth: '18px',
                }}
              />
              <Chip
                label={`${stockStats.low}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255,152,0,0.12)',
                  color: '#ff9800',
                  fontWeight: 600,
                  fontSize: '0.6rem',
                  height: '18px',
                  minWidth: '18px',
                }}
              />
              <Chip
                label={`${stockStats.out}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255,68,68,0.12)',
                  color: '#ff4444',
                  fontWeight: 600,
                  fontSize: '0.6rem',
                  height: '18px',
                  minWidth: '18px',
                }}
              />
            </Box>
          ),
        },
      ],
    },
    {
      text: 'Ordini',
      icon: <ShoppingBag />,
      path: '/admin/orders',
      badge: 12,
    },
    {
      text: 'Contatto',
      icon: <People />,
      path: '/admin/contact',
    },
    {
      text: 'Analytics',
      icon: <BarChart />,
      path: '/admin/analytics',
      isUnavailable: true,
      glowRed: true,
      subItems: [
        { text: 'Vendite', path: '/admin/analytics/sales', isUnavailable: true },
        { text: 'Traffico', path: '/admin/analytics/traffic', isUnavailable: true },
        { text: 'Report', path: '/admin/analytics/reports', isUnavailable: true },
      ],
    },
    {
      text: 'Marketing',
      icon: <LocalOffer />,
      path: '/admin/marketing',
      isUnavailable: true,
      glowRed: true,
      subItems: [
        { text: 'Promozioni', path: '/admin/marketing/promotions', isUnavailable: true },
        { text: 'Newsletter', path: '/admin/marketing/newsletter', isUnavailable: true },
      ],
    },
  ];

  const bottomNavItems = [
    { text: 'Impostazioni', icon: <Settings />, path: '/admin/settings' },
  ];

  // Collapse component for submenus
  const Collapse = ({ in: inProp, children }) => {
    const [height, setHeight] = useState(0);
    const ref = React.useRef(null);

    React.useEffect(() => {
      if (inProp) {
        setHeight(ref.current?.scrollHeight || 0);
      } else {
        setHeight(0);
      }
    }, [inProp, children]);

    return (
      <Box
        ref={ref}
        sx={{
          overflow: 'hidden',
          height: inProp ? height : 0,
          transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {children}
      </Box>
    );
  };

  // Render navigation item
  const renderNavItem = (item) => {
    const isExpanded = expandedMenus[item.text] || false;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isActive = location.pathname === item.path ||
      (hasSubItems && item.subItems.some(sub => location.pathname === sub.path));
    const isUnavailable = item.isUnavailable || false;
    const glowRed = item.glowRed || false;

    const handleItemClick = () => {
      if (isUnavailable) {
        handleFeatureUnavailable(item.text);
        return;
      }
      if (hasSubItems) {
        handleMenuToggle(item.text);
      } else {
        handleNavigate(item.path);
      }
    };

    return (
      <Box key={item.text}>
        <ListItem
          button
          onClick={handleItemClick}
          sx={{
            borderRadius: '12px',
            mb: 0.5,
            px: 2,
            py: 1.2,
            backgroundColor: isActive ? 'rgba(46, 125, 50, 0.08)' : 'transparent',
            color: isActive ? '#2e7d32' : '#555555',
            '&:hover': {
              backgroundColor: isUnavailable ? 'rgba(255, 68, 68, 0.08)' : 'rgba(46, 125, 50, 0.05)',
              color: isUnavailable ? '#ff4444' : '#2e7d32',
            },
            transition: 'all 0.2s ease',
            ...(glowRed && {
              animation: 'glowPulse 2s ease-in-out infinite',
              '@keyframes glowPulse': {
                '0%': {
                  boxShadow: '0 0 0px rgba(255, 68, 68, 0)',
                },
                '50%': {
                  boxShadow: '0 0 20px rgba(255, 68, 68, 0.15), inset 0 0 20px rgba(255, 68, 68, 0.05)',
                },
                '100%': {
                  boxShadow: '0 0 0px rgba(255, 68, 68, 0)',
                },
              },
            }),
          }}
        >
          <ListItemIcon
            sx={{
              color: isUnavailable ? '#ff4444' : (isActive ? '#2e7d32' : '#888888'),
              minWidth: 40,
              ...(glowRed && {
                animation: 'iconGlowPulse 2s ease-in-out infinite',
                '@keyframes iconGlowPulse': {
                  '0%': {
                    filter: 'drop-shadow(0 0 0px rgba(255, 68, 68, 0))',
                  },
                  '50%': {
                    filter: 'drop-shadow(0 0 8px rgba(255, 68, 68, 0.4))',
                  },
                  '100%': {
                    filter: 'drop-shadow(0 0 0px rgba(255, 68, 68, 0))',
                  },
                },
              }),
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  component="span"
                  sx={{
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.9rem',
                    color: isUnavailable ? '#ff4444' : 'inherit',
                  }}
                >
                  {item.text}
                </Typography>
                {isUnavailable && (
                  <Chip
                    label="Prossimamente"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255,68,68,0.12)',
                      color: '#ff4444',
                      fontWeight: 600,
                      fontSize: '0.5rem',
                      height: '16px',
                      borderRadius: '4px',
                    }}
                  />
                )}
              </Box>
            }
          />
          {item.badge && typeof item.badge === 'number' && (
            <Chip
              label={item.badge}
              size="small"
              sx={{
                backgroundColor: '#2e7d32',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.7rem',
                height: '20px',
                minWidth: '20px',
                borderRadius: '10px',
              }}
            />
          )}
          {item.badge && typeof item.badge !== 'number' && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {item.badge}
            </Box>
          )}
          {hasSubItems && (
            <IconButton 
              size="small" 
              sx={{ 
                color: isUnavailable ? '#ff4444' : '#888888',
              }}
            >
              {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </IconButton>
          )}
        </ListItem>
        {hasSubItems && (
          <Collapse in={isExpanded}>
            <List component="div" disablePadding>
              {item.subItems.map((subItem) => {
                const isSubActive = location.pathname === subItem.path;
                const isSubUnavailable = subItem.isUnavailable || false;
                return (
                  <ListItem
                    key={subItem.text}
                    button
                    onClick={() => {
                      if (isSubUnavailable) {
                        handleFeatureUnavailable(subItem.text);
                        return;
                      }
                      handleNavigate(subItem.path);
                    }}
                    sx={{
                      pl: 6,
                      py: 1,
                      borderRadius: '12px',
                      mb: 0.3,
                      backgroundColor: isSubActive ? 'rgba(46, 125, 50, 0.06)' : 'transparent',
                      color: isSubUnavailable ? '#ff4444' : (isSubActive ? '#2e7d32' : '#666666'),
                      '&:hover': {
                        backgroundColor: isSubUnavailable ? 'rgba(255, 68, 68, 0.06)' : 'rgba(46, 125, 50, 0.04)',
                        color: isSubUnavailable ? '#ff4444' : '#2e7d32',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            component="span"
                            sx={{
                              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                              fontSize: '0.85rem',
                              fontWeight: isSubActive ? 500 : 400,
                              color: isSubUnavailable ? '#ff4444' : 'inherit',
                            }}
                          >
                            {subItem.text}
                          </Typography>
                          {isSubUnavailable && (
                            <Chip
                              label="Prossimamente"
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(255,68,68,0.12)',
                                color: '#ff4444',
                                fontWeight: 600,
                                fontSize: '0.5rem',
                                height: '16px',
                                borderRadius: '4px',
                              }}
                            />
                          )}
                        </Box>
                      }
                    />
                    {subItem.badge && subItem.badge}
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  // Render mobile drawer content
  const renderMobileDrawer = () => (
    <SwipeableDrawer
      anchor="bottom"
      open={mobileDrawerOpen}
      onClose={handleMobileMenuClose}
      onOpen={handleMobileMenuOpen}
      PaperProps={{
        sx: {
          borderRadius: '24px 24px 0 0',
          maxHeight: '85vh',
          backgroundColor: '#ffffff',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.12)',
        },
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '1.1rem',
            color: '#1a1a2e',
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          }}
        >
          Menu
        </Typography>
        <IconButton onClick={handleMobileMenuClose} sx={{ color: '#6b7280' }}>
          <Close />
        </IconButton>
      </Box>

      {/* User Profile in Mobile Drawer */}
      {user && (
        <Box
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            backgroundColor: 'rgba(46,125,50,0.04)',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Avatar
            src={user.image ? `http://localhost:5000${user.image}` : ''}
            sx={{
              width: 56,
              height: 56,
              backgroundColor: '#2e7d32',
              border: '2px solid rgba(46,125,50,0.2)',
            }}
          >
            {user.name?.charAt(0) || 'A'}
          </Avatar>
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                color: '#1a1a2e',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              {user.name}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.8rem',
                color: '#6b7280',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              {user.email}
            </Typography>
            <Chip
              label="Admin"
              size="small"
              sx={{
                mt: 0.5,
                backgroundColor: 'rgba(46,125,50,0.1)',
                color: '#2e7d32',
                fontWeight: 600,
                fontSize: '0.6rem',
                height: '18px',
              }}
            />
          </Box>
        </Box>
      )}

      {/* Navigation List */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 2 }}>
        <List sx={{ p: 0 }}>
          {navItems.map((item) => renderNavItem(item))}
          <Divider sx={{ my: 1 }} />
          {bottomNavItems.map((item) => renderNavItem(item))}
        </List>
      </Box>

      {/* Logout Button */}
      <Box sx={{ p: 2, borderTop: '1px solid #f0f0f0' }}>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            borderRadius: '12px',
            backgroundColor: 'rgba(255,68,68,0.04)',
            '&:hover': {
              backgroundColor: 'rgba(255,68,68,0.08)',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#ff4444' }}>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{
              '& .MuiListItemText-primary': {
                color: '#ff4444',
                fontWeight: 600,
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              },
            }}
          />
        </ListItem>
      </Box>
    </SwipeableDrawer>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Admin App Bar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          zIndex: theme.zIndex.drawer + 1,
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: { xs: 2, sm: 3 },
            minHeight: '64px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Show menu icon on mobile/tablet to open mobile drawer */}
            {(isMobile || isTablet) ? (
              <IconButton
                onClick={handleMobileMenuOpen}
                sx={{
                  color: '#2e7d32',
                  '&:hover': {
                    backgroundColor: 'rgba(46,125,50,0.08)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={handleSidebarToggle}
                sx={{
                  color: '#333333',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                {sidebarOpen ? <ChevronLeft /> : <MenuIcon />}
              </IconButton>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <img
                src={PA}
                alt="Prestige Auto"
                style={{
                  height: '32px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#000000',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  fontSize: '1rem',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Admin
                <Typography
                  component="span"
                  sx={{
                    color: '#2e7d32',
                    fontWeight: 700,
                  }}
                >
                  Panel
                </Typography>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Stock Status Indicators - Hide on mobile */}
            {!isMobile && (
              <Tooltip title="Stock Status">
                <Box sx={{ display: 'flex', gap: 0.5, mr: 1 }}>
                  <Chip
                    icon={<CheckCircle sx={{ fontSize: 14 }} />}
                    label={stockStats.full}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(46,125,50,0.12)',
                      color: '#2e7d32',
                      fontWeight: 600,
                      fontSize: '0.65rem',
                      height: '24px',
                      '& .MuiChip-icon': { fontSize: 14 },
                    }}
                  />
                  <Chip
                    icon={<Warning sx={{ fontSize: 14 }} />}
                    label={stockStats.low}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255,152,0,0.12)',
                      color: '#ff9800',
                      fontWeight: 600,
                      fontSize: '0.65rem',
                      height: '24px',
                      '& .MuiChip-icon': { fontSize: 14 },
                    }}
                  />
                  <Chip
                    icon={<Cancel sx={{ fontSize: 14 }} />}
                    label={stockStats.out}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255,68,68,0.12)',
                      color: '#ff4444',
                      fontWeight: 600,
                      fontSize: '0.65rem',
                      height: '24px',
                      '& .MuiChip-icon': { fontSize: 14 },
                    }}
                  />
                </Box>
              </Tooltip>
            )}

            <Tooltip title="Notifiche">
              <IconButton
                onClick={handleNotifOpen}
                sx={{
                  color: '#555555',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                <Badge
                  badgeContent={3}
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#ff4444',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.65rem',
                      height: '18px',
                      minWidth: '18px',
                      borderRadius: '50%',
                    },
                  }}
                >
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile Avatar with user info */}
            <Tooltip title={user?.name || 'Profile'}>
              <IconButton
                onClick={handleProfileOpen}
                sx={{
                  p: 0,
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'transform 0.2s ease',
                }}
              >
                <Avatar
                  src={user?.image ? `http://localhost:5000${user.image}` : ''}
                  sx={{
                    width: 36,
                    height: 36,
                    backgroundColor: '#2e7d32',
                    color: '#ffffff',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  {user?.name?.charAt(0) || 'A'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu - Enhanced with user info */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileClose}
        sx={{
          '& .MuiPaper-root': {
            width: '280px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            mt: 1,
            overflow: 'hidden',
          },
        }}
      >
        {/* User Header */}
        <Box
          sx={{
            p: 3,
            pb: 2,
            background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
            color: '#ffffff',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={user?.image ? `http://localhost:5000${user.image}` : ''}
              sx={{
                width: 56,
                height: 56,
                border: '2px solid rgba(255,255,255,0.3)',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
              }}
            >
              {user?.name?.charAt(0) || 'A'}
            </Avatar>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#ffffff',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                {user?.name || 'Admin'}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.8)',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                {user?.email || 'admin@prestigeauto.it'}
              </Typography>
              <Chip
                label="Administrator"
                size="small"
                sx={{
                  mt: 0.5,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.6rem',
                  height: '18px',
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* User Details */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Person sx={{ fontSize: 18, color: '#6b7280' }} />
            <Box>
              <Typography sx={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Full Name
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#1a1a2e' }}>
                {user?.name || 'Admin'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Email sx={{ fontSize: 18, color: '#6b7280' }} />
            <Box>
              <Typography sx={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Email
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#1a1a2e' }}>
                {user?.email || 'admin@prestigeauto.it'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <CalendarToday sx={{ fontSize: 18, color: '#6b7280' }} />
            <Box>
              <Typography sx={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Date of Birth
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#1a1a2e' }}>
                {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AdminPanelSettings sx={{ fontSize: 18, color: '#6b7280' }} />
            <Box>
              <Typography sx={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Role
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#2e7d32', textTransform: 'capitalize' }}>
                {user?.role || 'Admin'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Logout Button */}
        <MenuItem
          onClick={handleLogout}
          sx={{
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            gap: 1.5,
            py: 1.5,
            color: '#ff4444',
            backgroundColor: 'rgba(255,68,68,0.02)',
            '&:hover': {
              backgroundColor: 'rgba(255,68,68,0.08)',
            },
          }}
        >
          <Logout fontSize="small" />
          <Typography sx={{ fontWeight: 600 }}>Logout</Typography>
        </MenuItem>
      </Menu>

      {/* Notification Menu */}
      <Menu
        anchorEl={notifAnchorEl}
        open={Boolean(notifAnchorEl)}
        onClose={handleNotifClose}
        sx={{
          '& .MuiPaper-root': {
            width: '320px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            mt: 1,
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              color: '#000000',
              fontSize: '0.95rem',
            }}
          >
            Notifiche
          </Typography>
        </Box>
        <MenuItem onClick={handleNotifClose} sx={{ py: 1.5 }}>
          <Box>
            <Typography
              sx={{
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                fontWeight: 500,
                fontSize: '0.85rem',
                color: '#000000',
              }}
            >
              Nuovo ordine #12345
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                fontSize: '0.75rem',
                color: '#999999',
              }}
            >
              Da: Mario Rossi • 2 minuti fa
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotifClose} sx={{ py: 1.5 }}>
          <Box>
            <Typography
              sx={{
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                fontWeight: 500,
                fontSize: '0.85rem',
                color: '#000000',
              }}
            >
              Prodotto esaurito: Audi RS6
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                fontSize: '0.75rem',
                color: '#999999',
              }}
            >
              Magazzino • 1 ora fa
            </Typography>
          </Box>
        </MenuItem>
        <Box sx={{ p: 1.5, borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
          <Typography
            sx={{
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              fontSize: '0.8rem',
              color: '#2e7d32',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Visualizza tutte le notifiche
          </Typography>
        </Box>
      </Menu>

      {/* Sidebar Drawer - Desktop only */}
      {!isMobile && !isTablet && (
        <Drawer
          variant={isMobile ? 'temporary' : 'persistent'}
          anchor="left"
          open={sidebarOpen}
          onClose={isMobile ? handleSidebarToggle : undefined}
          sx={{
            width: sidebarOpen ? 280 : 0,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              backgroundColor: '#ffffff',
              borderRight: '1px solid #f0f0f0',
              boxShadow: 'none',
              marginTop: '64px',
              height: 'calc(100% - 64px)',
              overflow: 'hidden',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {/* Sidebar Header */}
            <Box
              sx={{
                p: 2.5,
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  color: '#999999',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Menu Principale
              </Typography>
              <IconButton size="small" onClick={handleSidebarToggle}>
                <ChevronLeft fontSize="small" sx={{ color: '#999999' }} />
              </IconButton>
            </Box>

            {/* Navigation */}
            <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 2 }}>
              <List sx={{ p: 0 }}>
                {navItems.map((item) => renderNavItem(item))}
              </List>
            </Box>

            {/* Bottom Navigation */}
            <Box sx={{ borderTop: '1px solid #f0f0f0', px: 2, py: 2 }}>
              <List sx={{ p: 0 }}>
                {bottomNavItems.map((item) => renderNavItem(item))}
              </List>
            </Box>

            {/* Sidebar Footer with Stock Summary */}
            <Box
              sx={{
                p: 2.5,
                borderTop: '1px solid #f0f0f0',
                backgroundColor: '#fafafa',
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  color: '#999999',
                  fontSize: '0.65rem',
                  textAlign: 'center',
                  letterSpacing: '0.02em',
                  mb: 1,
                }}
              >
                Prestige Auto Admin v2.0
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Chip
                  icon={<CheckCircle sx={{ fontSize: 12 }} />}
                  label={`${stockStats.full} Full`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(46,125,50,0.1)',
                    color: '#2e7d32',
                    fontWeight: 600,
                    fontSize: '0.55rem',
                    height: '20px',
                  }}
                />
                <Chip
                  icon={<Warning sx={{ fontSize: 12 }} />}
                  label={`${stockStats.low} Low`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,152,0,0.1)',
                    color: '#ff9800',
                    fontWeight: 600,
                    fontSize: '0.55rem',
                    height: '20px',
                  }}
                />
                <Chip
                  icon={<Cancel sx={{ fontSize: 12 }} />}
                  label={`${stockStats.out} Out`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,68,68,0.1)',
                    color: '#ff4444',
                    fontWeight: 600,
                    fontSize: '0.55rem',
                    height: '20px',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Drawer>
      )}

      {/* Mobile FAB Menu Button */}
      {(isMobile || isTablet) && (
        <Fab
          onClick={handleMobileMenuOpen}
          sx={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            zIndex: 999,
            backgroundColor: '#2e7d32',
            color: '#ffffff',
            width: 56,
            height: 56,
            boxShadow: '0 4px 20px rgba(46,125,50,0.35)',
            '&:hover': {
              backgroundColor: '#1b5e20',
              transform: 'scale(1.05)',
              boxShadow: '0 8px 30px rgba(46,125,50,0.45)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <MenuIcon />
        </Fab>
      )}

      {/* Mobile Drawer */}
      {(isMobile || isTablet) && renderMobileDrawer()}

      {/* Alert Dialog for Unavailable Features */}
      <Dialog
        open={alertDialogOpen}
        onClose={handleAlertClose}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            maxWidth: '420px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            overflow: 'hidden',
          },
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)',
            p: 3,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            <Warning sx={{ fontSize: 32, color: '#ffffff' }} />
          </Box>
          <Typography
            sx={{
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '1.2rem',
              mt: 2,
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            Funzionalità Non Disponibile
          </Typography>
        </Box>

        <DialogContent sx={{ p: 4, pt: 3 }}>
          <DialogContentText
            sx={{
              color: '#1a1a2e',
              fontSize: '1rem',
              lineHeight: 1.6,
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              textAlign: 'center',
            }}
          >
            {alertMessage}
          </DialogContentText>
          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: 'rgba(255,68,68,0.04)',
              borderRadius: '12px',
              border: '1px solid rgba(255,68,68,0.08)',
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                color: '#6b7280',
                fontSize: '0.85rem',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              ⚠️ Questa sezione sarà disponibile nelle prossime settimane
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            pt: 0,
            justifyContent: 'center',
          }}
        >
          <Button
            onClick={handleAlertClose}
            variant="contained"
            sx={{
              backgroundColor: '#2e7d32',
              borderRadius: '14px',
              textTransform: 'none',
              fontWeight: 600,
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              px: 4,
              py: 1.2,
              '&:hover': {
                backgroundColor: '#1b5e20',
              },
            }}
          >
            Ho Capito
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: '64px',
          marginLeft: 0,
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundImage: `url(${BDG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: 'calc(100vh - 64px)',
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            zIndex: 0,
          },
          '& > *': {
            position: 'relative',
            zIndex: 1,
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminBar;