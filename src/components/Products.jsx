// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
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
import {
  ShoppingCart,
  FavoriteBorder,
  Visibility,
  Star,
  CheckCircle,
  Inventory,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axiosInstance from '../utils/axiosConfig';
import { getImageUrl } from '../utils/imageUtils';

const Products = () => {
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/products?limit=50');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setSnackbar({
        open: true,
        message: 'Errore nel caricamento dei prodotti',
        severity: 'error',
      });
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

  // EXACT REPLICA of Home.jsx ProductCard
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
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff', py: { xs: 4, sm: 4, md: 8 } }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        {/* Title */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 6 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1a1a2e',
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              fontSize: { xs: '1.25rem', sm: '1.25rem', md: '2rem' },
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            Tutti i Prodotti
          </Typography>
          <Typography
            sx={{
              color: '#6b7280',
              fontSize: '0.9rem',
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            {products.length} prodotti disponibili
          </Typography>
        </Box>

        {/* Products Grid - EXACT replica of Home.jsx products section */}
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
        ) : products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Inventory sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600 }}>
              Nessun prodotto trovato
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {products.map((product, index) => {
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

export default Products;