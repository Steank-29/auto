import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  useMediaQuery,
  useTheme,
  Divider,
  TextField,
  InputAdornment,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Badge,
  Paper,
  Stack,
  Collapse,
  SwipeableDrawer,
} from "@mui/material";
import {
  ShoppingCartOutlined,
  Person,
  Menu as MenuIcon,
  Search,
  Close,
  Delete,
  Add,
  Remove,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import PA from "../assets/PA.png";
import { getImageUrl } from "../utils/imageUtils";

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [productsOpen, setProductsOpen] = useState(true);

  const fullText = "Prestige Auto";

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.substring(0, index + 1));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(typingInterval);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, []);

  const handleMenuOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleCartOpen = () => {
    setCartDrawerOpen(true);
  };

  const handleCartClose = () => {
    setCartDrawerOpen(false);
  };

  const handleProfileOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  const handleProductsToggle = () => {
    setProductsOpen(!productsOpen);
  };

  const handleNavigateToLogin = () => {
    navigate("/signin");
  };

  const handleMobileLogin = () => {
    handleDrawerClose();
    navigate("/signin");
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    handleCartClose();
    navigate("/checkout");
  };

  // Render text with "Auto" in green
  const renderText = () => {
    if (!displayText) return null;
    
    const autoIndex = displayText.indexOf("Auto");
    if (autoIndex === -1) {
      return <span>{displayText}</span>;
    }
    
    return (
      <>
        <span>{displayText.substring(0, autoIndex)}</span>
        <span style={{ color: "#2e7d32" }}>Auto</span>
        <span>{displayText.substring(autoIndex + 4)}</span>
      </>
    );
  };

  const navItems = [
    { text: "Home", hasSub: false, path: "/" },
    { text: "Prodotti", hasSub: true, path: "/products", subItems: ["Side Door", "Front Logo", "Trank Logo"] },
    { text: "Contatti", hasSub: false, path: "/contact" },
  ];

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "transparent",
          boxShadow: "none",
          width: "100%",
          left: 0,
          top: 0,
          pt: { xs: 0, sm: 3, md: 4 },
          pb: { xs: 0, sm: 1.5, md: 2 },
          background: "transparent",
          backdropFilter: "none",
          zIndex: 9999,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: { xs: 0.8, sm: 1 },
            px: { xs: 2, sm: 3, md: 4 },
            width: { xs: "100%", sm: "95%", md: "90%" },
            maxWidth: "1400px",
            margin: "0 auto",
            borderRadius: { xs: "0px", sm: "50px", md: "50px" },
            backgroundColor: "rgb(255, 255, 255)",
            boxShadow: { 
              xs: "0 2px 16px rgba(0,0,0,0.08)", 
              sm: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)" 
            },
            border: "1px solid rgba(255,255,255,0.3)",
            animation: { xs: "none", sm: "float 3s ease-in-out infinite", md: "float 3s ease-in-out infinite" },
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: { 
                xs: "0 2px 16px rgba(0,0,0,0.12)", 
                sm: "0 12px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)" 
              },
              transform: { xs: "none", sm: "translateY(-2px)", md: "translateY(-2px)" },
            },
          }}
        >
          {/* Mobile/Tablet Layout */}
          {(isMobile || isTablet) ? (
            <>
              <IconButton
                onClick={drawerOpen ? handleDrawerClose : handleMenuOpen}
                sx={{
                  color: "#141010",
                  "&:hover": {
                    color: "#000000",
                    backgroundColor: "rgba(0, 0, 0, 0.06)",
                  },
                }}
              >
                {drawerOpen ? <Close /> : <MenuIcon />}
              </IconButton>

              <Box sx={{ display: "flex", alignItems: "center", flex: 1, justifyContent: "center" }}>
                <img
                  src={PA}
                  alt="Logo"
                  style={{
                    height: "35px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#151515",
                    fontWeight: 700,
                    ml: 1,
                    letterSpacing: "1px",
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    whiteSpace: "nowrap",
                    fontSize: { xs: "0.9rem", sm: "1.1rem" },
                  }}
                >
                  {renderText()}
                  {!isTypingComplete && (
                    <span
                      style={{
                        display: "inline-block",
                        width: "2px",
                        height: "20px",
                        backgroundColor: "#151515",
                        marginLeft: "2px",
                        animation: "blink 0.8s step-end infinite",
                      }}
                    />
                  )}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {!searchOpen ? (
                  <IconButton
                    onClick={handleSearchOpen}
                    sx={{
                      color: "#141010",
                      "&:hover": {
                        color: "#000000",
                        backgroundColor: "rgba(0, 0, 0, 0.06)",
                      },
                    }}
                  >
                    <Search />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={handleSearchClose}
                    sx={{
                      color: "#141010",
                      "&:hover": {
                        color: "#000000",
                        backgroundColor: "rgba(0, 0, 0, 0.06)",
                      },
                    }}
                  >
                    <Close />
                  </IconButton>
                )}
                <IconButton
                  onClick={cartDrawerOpen ? handleCartClose : handleCartOpen}
                  sx={{
                    color: "#141010",
                    "&:hover": {
                      color: "#000000",
                      backgroundColor: "rgba(0, 0, 0, 0.06)",
                    },
                  }}
                >
                  {cartDrawerOpen ? (
                    <Close />
                  ) : (
                    <Badge 
                      badgeContent={cartCount} 
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "#2e7d32",
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          height: "20px",
                          minWidth: "20px",
                          borderRadius: "50%",
                        },
                      }}
                    >
                      <ShoppingCartOutlined />
                    </Badge>
                  )}
                </IconButton>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <img
                  src={PA}
                  alt="Logo"
                  style={{
                    height: "40px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#151515",
                    fontWeight: 700,
                    ml: 1.5,
                    letterSpacing: "1px",
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    display: { xs: "none", sm: "block" },
                    minWidth: "130px",
                    fontSize: "1.1rem",
                  }}
                >
                  {renderText()}
                  {!isTypingComplete && (
                    <span
                      style={{
                        display: "inline-block",
                        width: "2px",
                        height: "24px",
                        backgroundColor: "#151515",
                        marginLeft: "2px",
                        animation: "blink 0.8s step-end infinite",
                      }}
                    />
                  )}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    onClick={() => {
                      if (item.path) {
                        navigate(item.path);
                      }
                    }}
                    sx={{
                      color: "#141010",
                      fontWeight: 500,
                      px: 2.5,
                      py: 0.8,
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      textTransform: "none",
                      fontSize: "0.9rem",
                      position: "relative",
                      borderRadius: "25px",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 4,
                        left: "50%",
                        width: 0,
                        height: "2px",
                        backgroundColor: "#000000",
                        transition: "all 0.3s ease-in-out",
                        transform: "translateX(-50%)",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        color: "#000000",
                        transform: "translateY(-1px)",
                      },
                      "&:hover::after": {
                        width: "60%",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Cerca prodotti..."
                  variant="outlined"
                  sx={{
                    width: "200px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "25px",
                      backgroundColor: "rgba(245, 245, 245, 0.8)",
                      "&:hover fieldset": {
                        borderColor: "#000000",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#000000",
                      },
                      "& input": {
                        padding: "7px 14px",
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                        fontSize: "0.8rem",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "#666666", fontSize: "18px" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          sx={{
                            color: "#666666",
                            "&:hover": {
                              color: "#000000",
                            },
                          }}
                          onClick={() => console.log("Search clicked")}
                        >
                          <Search sx={{ fontSize: "18px" }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <IconButton
                  onClick={cartDrawerOpen ? handleCartClose : handleCartOpen}
                  sx={{
                    color: "#141010",
                    "&:hover": {
                      color: "#000000",
                      backgroundColor: "rgba(0, 0, 0, 0.06)",
                    },
                  }}
                >
                  <Badge 
                    badgeContent={cartCount} 
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#2e7d32",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        height: "20px",
                        minWidth: "20px",
                        borderRadius: "50%",
                      },
                    }}
                  >
                    <ShoppingCartOutlined />
                  </Badge>
                </IconButton>

                <IconButton
                  onClick={handleNavigateToLogin}
                  sx={{
                    color: "#141010",
                    "&:hover": {
                      color: "#000000",
                      backgroundColor: "rgba(0, 0, 0, 0.06)",
                    },
                  }}
                >
                  <Person />
                </IconButton>
              </Box>
            </>
          )}
        </Toolbar>

        {searchOpen && (isMobile || isTablet) && (
          <Box
            sx={{
              px: 2,
              pb: 2,
              pt: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: { xs: "100%", sm: "95%" },
              margin: "0 auto",
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Cerca prodotti..."
              variant="outlined"
              autoFocus
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                  backgroundColor: "rgba(245, 245, 245, 0.9)",
                  "&:hover fieldset": {
                    borderColor: "#000000",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#000000",
                  },
                  "& input": {
                    padding: "10px 14px",
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    fontSize: "0.9rem",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#666666", fontSize: "22px" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileClose}
          sx={{
            "& .MuiPaper-root": {
              bgcolor: "#ffffff",
              color: "#141010",
              width: "220px",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              mt: 1,
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255,255,255,0.95)",
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleProfileClose();
              handleNavigateToLogin();
            }}
            sx={{
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.06)",
                color: "#000000",
              },
              borderRadius: "8px",
              mx: 0.5,
            }}
          >
            <Person sx={{ mr: 1, fontSize: "20px" }} />
            Profilo
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleProfileClose();
              console.log("Vai agli ordini");
            }}
            sx={{
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.06)",
                color: "#000000",
              },
              borderRadius: "8px",
              mx: 0.5,
            }}
          >
            <ShoppingCartOutlined sx={{ mr: 1, fontSize: "20px" }} />
            I Miei Ordini
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            onClick={() => {
              handleProfileClose();
              console.log("Logout");
            }}
            sx={{
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              color: "#000000",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.06)",
              },
              borderRadius: "8px",
              mx: 0.5,
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </AppBar>

      {/* Mobile Drawer with Nested Products */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{
          zIndex: 9998,
          "& .MuiDrawer-paper": {
            width: "280px",
            bgcolor: "#ffffff",
            boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
            borderRadius: "0 20px 20px 0",
            marginTop: { xs: "56px", sm: "64px" },
            height: { xs: "calc(100% - 56px)", sm: "calc(100% - 64px)" },
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "auto",
          }}
        >
          {/* Logo Centered at Top */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <img
              src={PA}
              alt="Logo"
              style={{
                height: "50px",
                width: "auto",
                objectFit: "contain",
              }}
            />
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <List sx={{ flex: 1 }}>
            {navItems.map((item) => (
              <Box key={item.text}>
                <ListItem
                  onClick={() => {
                    if (item.hasSub) {
                      handleProductsToggle();
                    } else {
                      handleDrawerClose();
                      if (item.path) {
                        navigate(item.path);
                      }
                    }
                  }}
                  sx={{
                    borderRadius: "12px",
                    mb: 0.5,
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.06)",
                    },
                    cursor: "pointer",
                  }}
                >
                  <ListItemText
                    primary={item.text}
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                        fontWeight: 500,
                        color: "#141010",
                        fontSize: "1rem",
                      },
                    }}
                  />
                  {item.hasSub && (
                    <IconButton size="small" onClick={(e) => {
                      e.stopPropagation();
                      handleProductsToggle();
                    }}>
                      {productsOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  )}
                </ListItem>
                {item.hasSub && (
                  <Collapse in={productsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => (
                        <ListItem
                          key={subItem}
                          onClick={() => {
                            handleDrawerClose();
                            navigate(`/products?category=${subItem.toLowerCase().replace(' ', '-')}`);
                          }}
                          sx={{
                            pl: 4,
                            py: 1.2,
                            borderRadius: "12px",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.06)",
                            },
                          }}
                        >
                          <ListItemText
                            primary={subItem}
                            sx={{
                              "& .MuiListItemText-primary": {
                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                                fontWeight: 400,
                                color: "#555555",
                                fontSize: "0.9rem",
                              },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </Box>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ px: 0 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Person />}
              onClick={handleMobileLogin}
              sx={{
                backgroundColor: "#2e7d32",
                borderRadius: "25px",
                py: 1.5,
                textTransform: "none",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                fontWeight: 600,
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#2e7d32",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Accedi
            </Button>
          </Box>

          {/* Footer with Copyright */}
          <Box
            sx={{
              mt: 3,
              pt: 2,
              borderTop: "1px solid #e0e0e0",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                color: "#999999",
                fontSize: "0.7rem",
              }}
            >
              © 2026 Pristige Auto. Tutti i diritti riservati.
            </Typography>
          </Box>
        </Box>
      </Drawer>

      {/* Cart Drawer */}
      <SwipeableDrawer
        anchor="right"
        open={cartDrawerOpen}
        onClose={handleCartClose}
        onOpen={handleCartOpen}
        disableBackdropTransition={false}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: "420px" },
            bgcolor: "#ffffff",
            boxShadow: "-4px 0 20px rgba(0,0,0,0.1)",
            borderRadius: { xs: "0px", sm: "20px 0 0 20px" },
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              p: 3,
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "#000000",
              }}
            >
              Il Tuo Carrello
              <Typography
                component="span"
                sx={{
                  ml: 1,
                  fontSize: "0.9rem",
                  color: "#666666",
                  fontWeight: 400,
                }}
              >
                ({cartCount} articoli)
              </Typography>
            </Typography>
            <IconButton onClick={handleCartClose}>
              <Close />
            </IconButton>
          </Box>

          {cartItems.length > 0 ? (
            <>
              <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
                <Stack spacing={2}>
                  {cartItems.map((item) => (
                    <Paper
                      key={item.productId}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: "16px",
                        border: "1px solid #f0f0f0",
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <Avatar
                        src={item.mainImage ? getImageUrl(item.mainImage) : PA}
                        variant="rounded"
                        sx={{
                          width: 70,
                          height: 70,
                          borderRadius: "12px",
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            color: "#000000",
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                            color: "#666666",
                            fontSize: "0.8rem",
                          }}
                        >
                          {item.brand} • {item.model}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                            color: "#000000",
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            mt: 0.5,
                          }}
                        >
                          €{item.price}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                            sx={{
                              border: "1px solid #e0e0e0",
                              borderRadius: "8px",
                              p: 0.5,
                              "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
                            }}
                          >
                            <Remove sx={{ fontSize: "16px" }} />
                          </IconButton>
                          <Typography
                            sx={{
                              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                              fontWeight: 500,
                              minWidth: "24px",
                              textAlign: "center",
                            }}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item.productId, Math.min(item.maxStock || 99, item.quantity + 1))}
                            sx={{
                              border: "1px solid #e0e0e0",
                              borderRadius: "8px",
                              p: 0.5,
                              "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
                            }}
                          >
                            <Add sx={{ fontSize: "16px" }} />
                          </IconButton>
                        </Box>
                      </Box>
                      <IconButton
                        onClick={() => handleRemoveFromCart(item.productId)}
                        sx={{
                          color: "#999",
                          "&:hover": { color: "#ff0000" },
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Paper>
                  ))}
                </Stack>
              </Box>

              <Box
                sx={{
                  p: 3,
                  borderTop: "1px solid #e0e0e0",
                  bgcolor: "#fafafa",
                  borderRadius: "0 0 20px 0",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "#666666",
                    }}
                  >
                    Subtotale
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: "#000000",
                    }}
                  >
                    €{cartTotal.toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "#666666",
                    }}
                  >
                    Spedizione
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "#4CAF50",
                    }}
                  >
                    {cartTotal > 100 ? "Gratuita" : "€9.90"}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      color: "#000000",
                    }}
                  >
                    Totale
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.3rem",
                      color: "#000000",
                    }}
                  >
                    €{(cartTotal + (cartTotal > 100 ? 0 : 9.90)).toFixed(2)}
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleCheckout}
                  sx={{
                    backgroundColor: "#000000",
                    borderRadius: "25px",
                    py: 1.8,
                    textTransform: "none",
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    fontWeight: 600,
                    fontSize: "1.05rem",
                    "&:hover": {
                      backgroundColor: "#333333",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Procedi al Checkout
                </Button>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
              }}
            >
              <ShoppingCartOutlined sx={{ fontSize: 80, color: "#e0e0e0", mb: 2 }} />
              <Typography
                sx={{
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  color: "#000000",
                  mb: 1,
                }}
              >
                Il tuo carrello è vuoto
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  color: "#666666",
                  textAlign: "center",
                }}
              >
                Inizia a fare shopping e aggiungi i tuoi prodotti preferiti
              </Typography>
              <Button
                variant="outlined"
                onClick={handleCartClose}
                sx={{
                  mt: 3,
                  borderColor: "#000000",
                  color: "#000000",
                  borderRadius: "25px",
                  px: 4,
                  py: 1.5,
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#333333",
                    backgroundColor: "rgba(0,0,0,0.05)",
                  },
                }}
              >
                Continua lo Shopping
              </Button>
            </Box>
          )}
        </Box>
      </SwipeableDrawer>

      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-6px);
            }
            100% {
              transform: translateY(0px);
            }
          }
        `}
      </style>
    </>
  );
};

export default Navbar;