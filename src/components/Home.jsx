// src/components/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  IconButton,
  Rating,
  Skeleton,
  useTheme,
  alpha,
  Divider,
  Stack,
  useMediaQuery,
  Snackbar,
  Alert,
} from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowForward,
  ShoppingCart,
  FavoriteBorder,
  Visibility,
  Star,
  CheckCircle,
  Inventory,
  Verified,
  LocalShipping,
  Security,
  Support,
  Euro,
  Cached,
  Payment,
  Headset,
  VerifiedUser,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import BMWBG from '../assets/BMWBG.png';
import axiosInstance from '../utils/axiosConfig';
import blogo from '../assets/blogo.png';
import alogo from '../assets/alogo.png';
import mlogo from '../assets/mlogo.png';
import volk from '../assets/volk.png';
import imp from '../assets/imp.png';
import { getImageUrl } from '../utils/imageUtils';

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { addToCart, isInCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/products?limit=20');
      if (response.data.success) {
        const allProducts = response.data.data;
        setProducts(allProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBrandColor = (brand) => {
    const colors = {
      BMW: '#0072ce',
      Audi: '#8c8c8c',
      Mercedes: '#0a0a0a',
      Porsche: '#d5001c',
      Volkswagen: '#001a4b',
    };
    return colors[brand] || '#666666';
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Esaurito', color: '#ff4444', icon: <Inventory sx={{ fontSize: 14 }} /> };
    if (stock <= 5) return { label: 'Poco Stock', color: '#ff9800', icon: <Inventory sx={{ fontSize: 14 }} /> };
    return { label: 'Disponibile', color: '#2e7d32', icon: <CheckCircle sx={{ fontSize: 14 }} /> };
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    
    if (product.stock === 0) {
      setSnackbar({
        open: true,
        message: 'Prodotto esaurito!',
        severity: 'error',
      });
      return;
    }

    const result = addToCart(product, 1, product.brand);
    if (result.success) {
      setSnackbar({
        open: true,
        message: result.message,
        severity: 'success',
      });
    } else {
      setSnackbar({
        open: true,
        message: result.message || 'Errore durante l\'aggiunta al carrello',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  const ProductCard = ({ product, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const status = getStockStatus(product.stock);
    const inCart = isInCart(product._id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ height: '100%' }}
        onClick={() => handleProductClick(product._id)}
      >
        <Card
          sx={{
            height: '100%',
            borderRadius: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.04)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            '&:hover': {
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              transform: 'translateY(-12px)',
              borderColor: 'rgba(46,125,50,0.15)',
            },
          }}
        >
          {/* Featured Badge */}
          {product.isFeatured && (
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                zIndex: 2,
              }}
            >
              <Chip
                icon={<Star sx={{ fontSize: 14, color: '#ffffff' }} />}
                label="In Evidenza"
                size="small"
                sx={{
                  backgroundColor: '#2e7d32',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.6rem',
                  height: '28px',
                  boxShadow: '0 4px 16px rgba(46,125,50,0.3)',
                  '& .MuiChip-icon': { color: '#ffffff' },
                }}
              />
            </Box>
          )}

          {/* Discount Badge */}
          {product.discountPrice && (
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 2,
              }}
            >
              <Chip
                label={`-${Math.round(((product.price - product.discountPrice) / product.price) * 100)}%`}
                size="small"
                sx={{
                  backgroundColor: '#ff4444',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  height: '28px',
                  boxShadow: '0 4px 16px rgba(255,68,68,0.3)',
                }}
              />
            </Box>
          )}

          {/* Brand Badge */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              zIndex: 2,
            }}
          >
            <Chip
              label={product.brand}
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                color: getBrandColor(product.brand),
                fontWeight: 700,
                fontSize: '0.65rem',
                height: '26px',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${alpha(getBrandColor(product.brand), 0.15)}`,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            />
          </Box>

          {/* Product Image */}
          <Box sx={{ position: 'relative', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
            <CardMedia
              component="img"
              height={280}
              image={getImageUrl(product.mainImage)}
              alt={product.name}
              sx={{
                objectFit: 'cover',
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              }}
            />
            
            {/* Overlay on hover */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
            />

            {/* Quick View Button */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: isHovered ? 1 : 0,
                transition: 'all 0.4s ease',
                transform: `translate(-50%, -50%) ${isHovered ? 'scale(1)' : 'scale(0.8)'}`,
              }}
            >
              <Button
                variant="contained"
                startIcon={<Visibility />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleProductClick(product._id);
                }}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  color: '#1a1a2e',
                  borderRadius: '50px',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  '&:hover': {
                    backgroundColor: '#ffffff',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Veloce Vista
              </Button>
            </Box>

            {/* Stock Status */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 1.5,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Chip
                icon={status.icon}
                label={status.label}
                size="small"
                sx={{
                  backgroundColor: alpha(status.color, 0.9),
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.6rem',
                  height: '24px',
                  backdropFilter: 'blur(4px)',
                }}
              />
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                }}
              >
                {product.stock} unità rimanenti
              </Typography>
            </Box>
          </Box>

          {/* Product Details */}
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ mb: 1.5 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  color: '#1a1a2e',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  mb: 0.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: 56,
                }}
              >
                {product.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.8rem',
                  color: '#6b7280',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                {product.model} • {product.category}
              </Typography>
            </Box>

            {/* Rating & Reviews */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating
                value={product.rating || 0}
                precision={0.5}
                size="small"
                readOnly
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: '#ff9800',
                  },
                }}
              />
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: '#6b7280',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                ({product.numReviews || 0} recensioni)
              </Typography>
            </Box>

            {/* Price */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.4rem',
                  color: '#1a1a2e',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                €{product.price}
              </Typography>
              {product.discountPrice && (
                <Typography
                  sx={{
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    textDecoration: 'line-through',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  }}
                >
                  €{product.discountPrice}
                </Typography>
              )}
            </Box>
          </CardContent>

          <Divider sx={{ mx: 3 }} />

          {/* Card Actions */}
          <CardActions sx={{ p: 3, pt: 2, gap: 1.5 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<ShoppingCart sx={{ fontSize: 18 }} />}
              disabled={product.stock === 0}
              sx={{
                backgroundColor: inCart ? '#ff9800' : '#2e7d32',
                borderRadius: '14px',
                textTransform: 'none',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                fontWeight: 600,
                fontSize: '0.85rem',
                py: 1.2,
                boxShadow: '0 4px 16px rgba(46,125,50,0.2)',
                '&:hover': {
                  backgroundColor: inCart ? '#f57c00' : '#1b5e20',
                  boxShadow: '0 8px 24px rgba(46,125,50,0.3)',
                },
                '&:disabled': {
                  backgroundColor: '#cccccc',
                },
              }}
              onClick={(e) => handleAddToCart(product, e)}
            >
              {product.stock === 0 ? 'Esaurito' : inCart ? 'Nel carrello' : 'Al Carrello'}
            </Button>
            <IconButton
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: '14px',
                color: '#6b7280',
                width: 48,
                height: 48,
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                  borderColor: '#2e7d32',
                  color: '#2e7d32',
                },
                transition: 'all 0.3s ease',
              }}
              onClick={(e) => {
                e.stopPropagation();
                // Add to wishlist logic here
              }}
            >
              <FavoriteBorder sx={{ fontSize: 20 }} />
            </IconButton>
          </CardActions>
        </Card>
      </motion.div>
    );
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        ref={heroRef}
        sx={{
          minHeight: {xs: '60vh',sm: '60vh', md: '100vh' },
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: '#0a0a0a',
          overflow: 'hidden',
        }}
      >
        {/* Background Image - BMW with better visibility */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `url(${BMWBG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.6,
            zIndex: 0,
          }}
        />
        
        {/* Gradient Overlay - lighter for better image visibility */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.7) 100%)',
            zIndex: 1,
          }}
        />

        {/* Animated Particles */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0.03 + Math.random() * 0.07,
              }}
              animate={{
                y: [null, -100, -200],
                opacity: [0.03, 0.1, 0],
              }}
              transition={{
                duration: 15 + Math.random() * 30,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                position: 'absolute',
                width: 2 + Math.random() * 4,
                height: 2 + Math.random() * 4,
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '50%',
              }}
            />
          ))}
        </Box>

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div style={{ opacity, scale }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#4caf50',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      mb: 2,
                    }}
                  >
                    Premium Car Accessories
                  </Typography>

                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 900,
                      color: '#ffffff',
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      fontSize: { xs: '3rem', sm: '4rem', md: '4.5rem', lg: '5rem' },
                      lineHeight: 1.05,
                      mb: 2,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Door Logo
                    <br />
                    <span style={{ color: '#4caf50' }}>
                      Projectors
                    </span>
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: { xs: '0.95rem', sm: '1.05rem' },
                      color: 'rgba(255,255,255,0.75)',
                      maxWidth: 520,
                      lineHeight: 1.8,
                      mb: 4,
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    }}
                  >
                    Rendi ogni ingresso speciale con proiettori per logo di alta qualità 
                    per la tua auto. Scopri la nostra collezione esclusiva.
                  </Typography>

                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      backgroundColor: '#2e7d32',
                      borderRadius: '8px',
                      px: { xs: 4, sm: 4, md: 4 },
                      py: { xs: 1.4, sm: 1.4, md: 1.8 },
                      textTransform: 'none',
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      boxShadow: '0 8px 32px rgba(46,125,50,0.4)',
                      '&:hover': {
                        backgroundColor: '#1b5e20',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 48px rgba(46,125,50,0.5)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => {
                      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Esplora Prodotti
                  </Button>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Trust Badges - Full Width Grid 4 columns */}
      <Box
        sx={{
          py: 2,
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #e8e8e8',
          borderTop: '1px solid #e8e8e8',
          width: '100%',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={0} sx={{ width: '100%' }}>
            <Grid item xs={6} sm={3} sx={{ width: '25%', flexBasis: '25%', maxWidth: '25%' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 1.5,
                  px: 1,
                  transition: 'all 0.3s ease',
                  borderRight: { sm: '1px solid #e8e8e8' },
                  '&:hover': {
                    backgroundColor: 'rgba(46,125,50,0.05)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(46,125,50,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2e7d32',
                    mb: 1,
                  }}
                >
                  <LocalShipping sx={{ fontSize: 32 }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.85rem' },
                    fontWeight: 700,
                    color: '#1a1a2e',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    textAlign: 'center',
                    mb: 0.25,
                  }}
                >
                  Spedizione Gratuita
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    color: '#6b7280',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    textAlign: 'center',
                  }}
                >
                  Oltre 100€
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3} sx={{ width: '25%', flexBasis: '25%', maxWidth: '25%' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 1.5,
                  px: 1,
                  transition: 'all 0.3s ease',
                  borderRight: { sm: '1px solid #e8e8e8' },
                  '&:hover': {
                    backgroundColor: 'rgba(46,125,50,0.05)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(46,125,50,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2e7d32',
                    mb: 1,
                  }}
                >
                  <Payment sx={{ fontSize: 32 }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.85rem' },
                    fontWeight: 700,
                    color: '#1a1a2e',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    textAlign: 'center',
                    mb: 0.25,
                  }}
                >
                  Pagamento Sicuro
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    color: '#6b7280',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    textAlign: 'center',
                  }}
                >
                  Solo PayPal
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3} sx={{ width: '25%', flexBasis: '25%', maxWidth: '25%' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 1.5,
                  px: 1,
                  transition: 'all 0.3s ease',
                  borderRight: { sm: '1px solid #e8e8e8' },
                  '&:hover': {
                    backgroundColor: 'rgba(46,125,50,0.05)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(46,125,50,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2e7d32',
                    mb: 1,
                  }}
                >
                  <Cached sx={{ fontSize: 32 }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.85rem' },
                    fontWeight: 700,
                    color: '#1a1a2e',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    textAlign: 'center',
                    mb: 0.25,
                  }}
                >
                  Reso 30 Giorni
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    color: '#6b7280',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    textAlign: 'center',
                  }}
                >
                  Reso Facile
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3} sx={{ width: '25%', flexBasis: '25%', maxWidth: '25%' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 1.5,
                  px: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(46,125,50,0.05)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(46,125,50,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2e7d32',
                    mb: 1,
                  }}
                >
                  <Headset sx={{ fontSize: 32 }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.85rem' },
                    fontWeight: 700,
                    color: '#1a1a2e',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    textAlign: 'center',
                    mb: 0.25,
                  }}
                >
                  Supporto Dedicato
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    color: '#6b7280',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    textAlign: 'center',
                  }}
                >
                  Assistenza 24/7
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Products Section */}
      <Box id="products" sx={{ py: { xs: 4, sm: 4, md: 8 }, backgroundColor: '#ffffff' }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1a1a2e',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                fontSize: { xs: '1.25rem', sm: '1.25rem', md: '2rem' },
                letterSpacing: '-0.02em',
                fontWeight: 700,
              }}
            >
              Prodotti in Evidenza
            </Typography>
            <Button
              component="a"
              href="/products"
              endIcon={<ArrowForward />}
              sx={{
                color: '#2e7d32',
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#1b5e20',
                },
              }}
            >
              Visualizza Tutti
            </Button>
          </Box>

          {loading ? (
            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid size={{ xs: 6, sm: 6, md: 4 }} key={index}>
                  <Card sx={{ borderRadius: '16px' }}>
                    <Skeleton variant="rectangular" height={{ xs: 180, sm: 220, md: 280 }} />
                    <CardContent>
                      <Skeleton variant="text" height={30} width="80%" />
                      <Skeleton variant="text" height={20} width="60%" />
                      <Skeleton variant="text" height={20} width="40%" />
                      <Skeleton variant="text" height={40} width="100%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={3}>
              {products.slice(0, 6).map((product, index) => {
                return (
                  <Grid size={{ xs: 6, sm: 6, md: 4 }} key={product._id}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: '16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        border: '1px solid rgba(0,0,0,0.04)',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                          transform: 'translateY(-4px)',
                        },
                      }}
                      onClick={() => handleProductClick(product._id)}
                    >
                      {/* Product Image */}
                      <Box sx={{ 
                        position: 'relative', 
                        overflow: 'hidden', 
                        backgroundColor: '#f8f9fa',
                        height: { xs: '160px', sm: '200px', md: '280px' }
                      }}>
                        <CardMedia
                          component="img"
                          image={getImageUrl(product.mainImage)}
                          alt={product.name}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            backgroundColor: '#f8f9fa',
                          }}
                        />
                        
                        {/* Brand Badge - Top Right of Image */}
                        <Chip
                          label={product.brand}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            backgroundColor: getBrandColor(product.brand),
                            color: '#ffffff',
                            fontWeight: 600,
                            fontSize: '0.65rem',
                            height: '28px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            '& .MuiChip-label': {
                              px: 2,
                            },
                          }}
                        />
                      </Box>

                      <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Product Name */}
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: '1.05rem',
                            color: '#1a1a2e',
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                            mb: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: 56,
                          }}
                        >
                          {product.name}
                        </Typography>

                        {/* Rating only */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <Rating
                            value={product.rating || 0}
                            precision={0.5}
                            size="small"
                            readOnly
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: '#2e7d32',
                              },
                              '& .MuiRating-iconHover': {
                                color: '#2e7d32',
                              },
                            }}
                          />
                        </Box>

                        {/* Description */}
                        <Typography
                          sx={{
                            fontSize: '0.85rem',
                            color: '#6b7280',
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                            lineHeight: 1.6,
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: { xs: 2, sm: 2, md: 3 },
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            flex: 1,
                          }}
                        >
                          {product.description || 'Nessuna descrizione disponibile'}
                        </Typography>

                        {/* Price */}
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: '1.3rem',
                            color: '#1a1a2e',
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                            mb: 2,
                          }}
                        >
                          €{product.price}
                        </Typography>

                        {/* Buttons */}
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            disabled={product.stock === 0}
                            sx={{
                              backgroundColor: isInCart(product._id) ? '#ff9800' : '#2e7d32',
                              borderRadius: '10px',
                              textTransform: 'none',
                              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                              fontWeight: 600,
                              fontSize: { xs: '0.75rem', sm: '0.75rem', md: '0.85rem' },
                              py: 1.2,
                              boxShadow: '0 4px 16px rgba(46,125,50,0.2)',
                              '&:hover': {
                                backgroundColor: isInCart(product._id) ? '#f57c00' : '#1b5e20',
                                boxShadow: '0 8px 24px rgba(46,125,50,0.3)',
                              },
                              '&:disabled': {
                                backgroundColor: '#cccccc',
                              },
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isInCart(product._id)) {
                                handleProductClick(product._id);
                              } else {
                                handleAddToCart(product, e);
                              }
                            }}
                          >
                            {product.stock === 0 ? 'Esaurito' : isInCart(product._id) ? 'Nel carrello' : 'Aggiungi'}
                          </Button>
                          <IconButton
                            sx={{
                              border: '1px solid #e5e7eb',
                              borderRadius: '10px',
                              color: '#6b7280',
                              backgroundColor: '#f9f9f9',
                              width: 48,
                              height: 48,
                              '&:hover': {
                                backgroundColor: '#f0f0f0',
                                borderColor: '#d0d0d0',
                              },
                              transition: 'all 0.3s ease',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductClick(product._id);
                            }}
                          >
                            <Visibility sx={{ fontSize: 22 }} />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Brands Section */}
      <Box
        sx={{
          py: 2,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e8e8e8',
          width: '100%',
        }}
      >
        <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: '#1a1a2e',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                fontSize: { xs: '1.25rem', sm: '1.25rem', md: '2rem' },
                letterSpacing: '-0.02em',
              }}
            >
              Shop con i Marchi
            </Typography>
            <Button
              component="a"
              href="/brands"
              endIcon={<ArrowForward />}
              sx={{
                color: '#2e7d32',
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'none',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#1b5e20',
                },
              }}
            >
              Visualizza Tutti
            </Button>
          </Box>

          <Box sx={{ width: '100%' }}>
            <Grid container spacing={0} sx={{ width: '100%' }}>
              <Grid item xs={6} sm={3} sx={{ width: '25%', flexBasis: '25%', maxWidth: '25%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 2,
                    px: 1,
                    transition: 'all 0.3s ease',
                    borderRight: { sm: '1px solid #e8e8e8' },
                    '&:hover': {
                      backgroundColor: 'rgba(46,125,50,0.05)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={alogo}
                    alt="Audi"
                    sx={{
                      width: { xs: 80, sm: 100, md: 160, lg: 160 },
                      height: { xs: 50, sm: 65, md: 100, lg: 100 },
                      mb: 1,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' },
                      fontWeight: 700,
                      color: '#1a1a2e',
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}
                  >
                    Audi
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={3} sx={{ width: '25%', flexBasis: '25%', maxWidth: '25%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 2,
                    px: 1,
                    transition: 'all 0.3s ease',
                    borderRight: { sm: '1px solid #e8e8e8' },
                    '&:hover': {
                      backgroundColor: 'rgba(46,125,50,0.05)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={blogo}
                    alt="BMW"
                    sx={{
                      width: { xs: 80, sm: 100, md: 160, lg: 160 },
                      height: { xs: 50, sm: 65, md: 100, lg: 100 },
                      mb: 1,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' },
                      fontWeight: 700,
                      color: '#1a1a2e',
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}
                  >
                    BMW
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={3} sx={{ width: '25%', flexBasis: '25%', maxWidth: '25%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 2,
                    px: 1,
                    transition: 'all 0.3s ease',
                    borderRight: { sm: '1px solid #e8e8e8' },
                    '&:hover': {
                      backgroundColor: 'rgba(46,125,50,0.05)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={mlogo}
                    alt="Mercedes"
                    sx={{
                      width: { xs: 65, sm: 85, md: 130, lg: 130 },
                      height: { xs: 50, sm: 65, md: 100, lg: 100 },
                      mb: 1,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' },
                      fontWeight: 700,
                      color: '#1a1a2e',
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}
                  >
                    Mercedes
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={3} sx={{ width: '25%', flexBasis: '25%', maxWidth: '25%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 2,
                    px: 1,
                    transition: 'all 0.3s ease',
                    borderRight: { sm: '1px solid #e8e8e8' },
                    '&:hover': {
                      backgroundColor: 'rgba(46,125,50,0.05)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={volk}
                    alt="Volkswagen"
                    sx={{
                      width: { xs: 80, sm: 100, md: 160, lg: 160 },
                      height: { xs: 50, sm: 65, md: 100, lg: 100 },
                      mb: 1,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' },
                      fontWeight: 700,
                      color: '#1a1a2e',
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}
                  >
                    Volkswagen
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

      {/* Promo Section */}
      <Box
        sx={{
          backgroundColor: '#ffffff',
          width: '100%',
          py: { xs: 1, sm: 1.5, md: 2 },
        }}
      >
        <Box
          sx={{
            mx: { xs: 1.5, sm: 2, md: 4 },
            height: { xs: '80px', sm: '100px', md: '160px' },
            borderRadius: { xs: '20px', sm: '30px', md: '50px' },
            overflow: 'hidden',
            position: 'relative',
            backgroundImage: `url(${imp})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              px: { xs: 2, sm: 3, md: 5 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2, md: 2 } }}>
              <Box
                sx={{
                  width: { xs: 28, sm: 32, md: 64 },
                  height: { xs: 28, sm: 32, md: 64 },
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2e7d32',
                  flexShrink: 0,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                }}
              >
                <VerifiedUser sx={{ fontSize: { xs: 24, sm: 32, md: 48 } }} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: '#ffffff',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    fontSize: { xs: '0.85rem', sm: '1rem', md: '1.5rem' },
                    letterSpacing: '-0.02em',
                    lineHeight: { xs: 1.1, sm: 1.15, md: 1.2 },
                    textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                  }}
                >
                  Migliora la tua esperienza di guida
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.95)',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.95rem' },
                    mt: { xs: 0, sm: 0.15, md: 0.25 },
                    textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  Un piccolo dettaglio. Una grande impressione.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            '& .MuiAlert-icon': { fontSize: 24 },
            minWidth: 320,
            alignItems: 'center',
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;