// src/components/Details.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  CardMedia,
  Chip,
  Rating,
  Divider,
  IconButton,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Paper,
  useTheme,
  alpha,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Snackbar,
} from '@mui/material';
import {
  ShoppingCart,
  Star,
  CheckCircle,
  Inventory,
  Add,
  Remove,
  Bolt,
  WbSunny,
  Build,
  Verified,
  Person,
  Email,
  Phone,
  Home,
  Close,
  LocalShipping,
  Cached,
  Headset,
  Shield,
  ThumbUp,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { useCart } from '../context/CartContext';
import BDGC from '../assets/BDGC.png';
import { getImageUrl } from '../utils/imageUtils';

// Custom PayPal Text Component
const PayPalText = () => (
  <Typography
    component="span"
    sx={{
      fontWeight: 700,
      fontSize: '1.2rem',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.5,
    }}
  >
     <span style={{ color: '#ffffff' }}>Pay</span>
     <span style={{ color: '#070707' }}>Pal</span>
  </Typography>
);

const Details = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedLogo, setSelectedLogo] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      if (response.data.success) {
        setProduct(response.data.data);
        setSelectedLogo(response.data.data.brand);
        setSelectedImageIndex(0);
      } else {
        setError('Prodotto non trovato');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      setError('Impossibile caricare i dettagli del prodotto. Riprova più tardi.');
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
    if (stock === 0) return { label: 'Esaurito', color: '#ff4444', icon: <Inventory fontSize="small" /> };
    if (stock <= 5) return { label: 'Poco Stock', color: '#ff9800', icon: <Inventory fontSize="small" /> };
    return { label: 'Disponibile', color: '#2e7d32', icon: <CheckCircle fontSize="small" /> };
  };

  const getBrightnessLabel = (brightness) => {
    const labels = {
      'Low': 'Bassa',
      'Medium': 'Media',
      'High': 'Alta',
      'Premium': 'Premium',
    };
    return labels[brightness] || brightness;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Il nome completo è obbligatorio';
    if (!formData.email.trim()) {
      errors.email = 'L\'email è obbligatoria';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Inserisci un indirizzo email valido';
    }
    if (!formData.phone.trim()) errors.phone = 'Il numero di telefono è obbligatorio';
    if (!formData.address.trim()) errors.address = 'L\'indirizzo è obbligatorio';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const result = addToCart(product, quantity, selectedLogo);
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

  const handleBuyNow = () => {
    if (!validateForm()) return;
    setPaymentDialogOpen(true);
  };

const handlePayPalPayment = async () => {
  setIsProcessing(true);
  try {
    const orderData = {
      items: [{
        productId: product._id,
        name: product.name,
        brand: product.brand,
        model: product.model,
        price: product.price,
        quantity: quantity,
        selectedLogo: selectedLogo,
      }],
      customer: formData,
      subtotal: product.price * quantity,
      shipping: 0, // Single product shipping
      total: product.price * quantity,
    };

    const response = await axiosInstance.post('/paypal/create-order', orderData);
    
    if (response.data.success) {
      window.location.href = response.data.approvalUrl;
    } else {
      setFormErrors({ 
        submit: response.data.message || 'Errore nella creazione dell\'ordine. Riprova più tardi.' 
      });
    }
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    setFormErrors({ 
      submit: error.response?.data?.message || 'Errore nella creazione dell\'ordine. Riprova più tardi.' 
    });
  } finally {
    setIsProcessing(false);
  }
};

  // Get all images for the product
  const getAllImages = () => {
    const images = [];
    if (product.mainImage) {
      images.push(product.mainImage);
    }
    if (product.moreImages && product.moreImages.length > 0) {
      images.push(...product.moreImages);
    }
    return images;
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handlePrevImage = () => {
    const images = getAllImages();
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    const images = getAllImages();
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f5f5f5' }}>
        <CircularProgress sx={{ color: '#2e7d32' }} />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f5f5f5', p: 3 }}>
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          {error || 'Prodotto non trovato'}
          <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2, backgroundColor: '#2e7d32' }}>
            Torna Indietro
          </Button>
        </Alert>
      </Box>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const brandColor = getBrandColor(product.brand);
  const allImages = getAllImages();
  const currentImage = allImages[selectedImageIndex] || product.mainImage;

  const getAvailableBrands = () => {
    if (product.compatibleBrands && product.compatibleBrands.length > 0) {
      return product.compatibleBrands;
    }
    return [product.brand];
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3, '& .MuiBreadcrumbs-li': { color: '#6b7280', fontSize: '0.85rem' } }}>
          <Link href="/" sx={{ textDecoration: 'none', color: '#6b7280', '&:hover': { color: '#2e7d32' } }}>Home</Link>
          <Link href="/products" sx={{ textDecoration: 'none', color: '#6b7280', '&:hover': { color: '#2e7d32' } }}>Prodotti</Link>
          <Typography color="#2e7d32" sx={{ fontWeight: 600 }}>{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* LEFT - Product Image with Gallery */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '20px',
                overflow: 'hidden',
                bgcolor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.04)',
              }}
            >
              {/* Main Image */}
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 300, sm: 350, md: 400 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#fafafa',
                }}
              >
                <CardMedia
                  component="img"
                  image={getImageUrl(product.mainImage)}
                  alt={product.name}
                  sx={{
                    width: '100vw',
                    height: '100%',
                    objectFit: 'contain',
                    p: 2,
                    transition: 'all 0.3s ease',
                  }}
                />

                {/* Navigation Arrows - Only if more than 1 image */}
                {allImages.length > 1 && (
                  <>
                    <IconButton
                      onClick={handlePrevImage}
                      sx={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                        '&:hover': { bgcolor: '#ffffff' },
                        width: 36,
                        height: 36,
                      }}
                    >
                      <ChevronLeft />
                    </IconButton>
                    <IconButton
                      onClick={handleNextImage}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                        '&:hover': { bgcolor: '#ffffff' },
                        width: 36,
                        height: 36,
                      }}
                    >
                      <ChevronRight />
                    </IconButton>
                  </>
                )}

                {/* Image Counter */}
                {allImages.length > 1 && (
                  <Typography
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {selectedImageIndex + 1} / {allImages.length}
                  </Typography>
                )}

                {/* Brand Badge */}
                <Chip
                  label={product.brand}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    bgcolor: brandColor,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    height: 32,
                  }}
                />
                {product.isFeatured && (
                  <Chip
                    icon={<Star sx={{ fontSize: 14, color: '#fff' }} />}
                    label="In Evidenza"
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      left: 16,
                      bgcolor: '#2e7d32',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 28,
                    }}
                  />
                )}
              </Box>

              {/* Thumbnails Gallery */}
              {allImages.length > 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    p: 2,
                    overflowX: 'auto',
                    bgcolor: '#f8f9fa',
                    borderTop: '1px solid rgba(0,0,0,0.04)',
                    '&::-webkit-scrollbar': {
                      height: 4,
                    },
                    '&::-webkit-scrollbar-track': {
                      bgcolor: '#f1f1f1',
                      borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      bgcolor: '#c1c1c1',
                      borderRadius: '10px',
                      '&:hover': {
                        bgcolor: '#a8a8a8',
                      },
                    },
                  }}
                >
                  {allImages.map((image, index) => (
                    <Box
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      sx={{
                        width: 70,
                        height: 70,
                        minWidth: 70,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: selectedImageIndex === index ? '3px solid #2e7d32' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          borderColor: '#2e7d32',
                        },
                        bgcolor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: selectedImageIndex === index ? '0 4px 16px rgba(46,125,50,0.25)' : 'none',
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={getImageUrl(image)}
                        alt={`${product.name} - ${index + 1}`}
                        sx={{
                          width: '100vw',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* RIGHT - Product Details */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '20px',
                p: { xs: 3, md: 4 },
                bgcolor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.04)',
                height: '100%',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: { xs: '1.5rem', md: '2rem' }, mb: 0.5 }}>
                {product.name}
              </Typography>
              <Typography sx={{ color: '#6b7280', mb: 1.5, fontSize: '0.95rem' }}>
                {product.model} • {product.brand}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Rating value={4.9} precision={0.1} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#ff9800' } }} />
                <Typography sx={{ fontSize: '0.85rem', color: '#6b7280' }}>({product.reviews || 0} recensioni)</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a2e' }}>€{product.price}</Typography>
                {product.discountPrice && (
                  <>
                    <Typography sx={{ fontSize: '1.2rem', color: '#6b7280', textDecoration: 'line-through' }}>€{product.discountPrice}</Typography>
                    <Chip label={`-${Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)}%`} size="small" sx={{ bgcolor: '#ff4444', color: '#fff', fontWeight: 700 }} />
                  </>
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Features */}
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Bolt sx={{ fontSize: 20, color: '#2e7d32' }} />
                  <Typography sx={{ fontSize: '0.9rem', color: '#1a1a2e' }}>Proiezione HD - Chiara e luminosa</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Build sx={{ fontSize: 20, color: '#2e7d32' }} />
                  <Typography sx={{ fontSize: '0.9rem', color: '#1a1a2e' }}>{product.features?.installation || 'Plug & Play'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <WbSunny sx={{ fontSize: 20, color: '#2e7d32' }} />
                  <Typography sx={{ fontSize: '0.9rem', color: '#1a1a2e' }}>Luminosità: {getBrightnessLabel(product.features?.brightness || 'Premium')}</Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              {/* Select Logo */}
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.9rem', mb: 1 }}>Seleziona Logo</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {getAvailableBrands().map((brand) => (
                    <Chip
                      key={brand}
                      label={brand}
                      onClick={() => setSelectedLogo(brand)}
                      sx={{
                        bgcolor: selectedLogo === brand ? '#2e7d32' : '#f0f0f0',
                        color: selectedLogo === brand ? '#fff' : '#1a1a2e',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        height: 36,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: selectedLogo === brand ? '#1b5e20' : '#e0e0e0' },
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Quantity & Stock */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.9rem' }}>Q.tà</Typography>
                  <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))} size="small" sx={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <Remove fontSize="small" />
                  </IconButton>
                  <Typography sx={{ fontWeight: 600, minWidth: 32, textAlign: 'center', fontSize: '1rem' }}>{quantity}</Typography>
                  <IconButton onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))} size="small" sx={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <Add fontSize="small" />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: alpha(stockStatus.color, 0.08), px: 1.5, py: 0.5, borderRadius: '6px' }}>
                  {stockStatus.icon}
                  <Typography sx={{ fontWeight: 600, color: stockStatus.color, fontSize: '0.8rem' }}>
                    {stockStatus.label} • {product.stock} disponibili
                  </Typography>
                </Box>
              </Box>

              {/* Total */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: alpha('#2e7d32', 0.04), p: 2, borderRadius: '12px', mb: 3 }}>
                <Typography sx={{ fontWeight: 600, color: '#1a1a2e' }}>Totale</Typography>
                <Typography sx={{ fontWeight: 700, color: '#2e7d32', fontSize: '1.3rem' }}>€{(product.price * quantity).toFixed(2)}</Typography>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 3, textTransform: 'uppercase' }}>
                Dati per la Spedizione
              </Typography>

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                  startIcon={<ShoppingCart />}
                  sx={{
                    bgcolor: '#2e7d32',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    py: 1.5,
                    '&:hover': { bgcolor: '#1b5e20' },
                    '&:disabled': { bgcolor: '#cccccc' },
                  }}
                >
                  {product.stock === 0 ? 'Esaurito' : 'Al Carrello'}
                </Button>
              </Box>

              {formErrors.submit && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: '12px' }}>{formErrors.submit}</Alert>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Description Section */}
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            borderRadius: '20px',
            p: { xs: 3, md: 4 },
            bgcolor: '#ffffff',
            border: '1px solid rgba(0,0,0,0.04)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 2 }}>
            Descrizione
          </Typography>
          <Typography sx={{ color: '#4a4a5a', lineHeight: 1.8, mb: 3 }}>
            {product.description}
          </Typography>

          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CheckCircle sx={{ fontSize: 20, color: '#2e7d32' }} />
              <Typography sx={{ fontSize: '0.95rem', color: '#1a1a2e' }}>
                {product.features?.installation === 'Plug & Play' ? 'Nessuna foratura o cablaggio richiesto' : 'Installazione professionale consigliata'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CheckCircle sx={{ fontSize: 20, color: '#2e7d32' }} />
              <Typography sx={{ fontSize: '0.95rem', color: '#1a1a2e' }}>Chip LED HD per proiezione chiara</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CheckCircle sx={{ fontSize: 20, color: '#2e7d32' }} />
              <Typography sx={{ fontSize: '0.95rem', color: '#1a1a2e' }}>Basso consumo energetico</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CheckCircle sx={{ fontSize: 20, color: '#2e7d32' }} />
              <Typography sx={{ fontSize: '0.95rem', color: '#1a1a2e' }}>
                {product.features?.waterproof ? 'Design impermeabile' : 'Si adatta alla maggior parte dei modelli di auto'}
              </Typography>
            </Box>
          </Stack>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 2 }}>Specifiche</Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', borderBottom: '1px solid #f0f0f0' }}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </TableCell>
                        <TableCell sx={{ color: '#4a4a5a', borderBottom: '1px solid #f0f0f0' }}>{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {/* Compatible Cars */}
          {product.compatibleCars && product.compatibleCars.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 2 }}>Auto Compatibili</Typography>
              <Grid container spacing={1}>
                {product.compatibleCars.map((car, index) => (
                  <Grid item xs={4} sm={4} md={3} key={index}>
                    <Chip
                      label={car}
                      sx={{
                        bgcolor: '#e8f5e9',
                        color: '#2e7d32',
                        fontWeight: 500,
                        width: '100%',
                        justifyContent: 'center',
                        fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' },
                        height: { xs: 28, sm: 32, md: 36 },
                        '& .MuiChip-label': { textAlign: 'center', width: '100%', px: { xs: 0.5, sm: 1 } },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Paper>

        {/* PayPal Dialog */}
        <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1, pt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Pagamento PayPal</Typography>
              <IconButton onClick={() => setPaymentDialogOpen(false)}><Close /></IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 600, color: '#1a1a2e', mb: 2 }}>Riepilogo Ordine</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: '#6b7280' }}>Prodotto</Typography>
                <Typography sx={{ fontWeight: 500 }}>{product.name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: '#6b7280' }}>Quantità</Typography>
                <Typography sx={{ fontWeight: 500 }}>{quantity}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: '#6b7280' }}>Logo</Typography>
                <Typography sx={{ fontWeight: 500 }}>{selectedLogo}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: '#6b7280' }}>Prezzo</Typography>
                <Typography sx={{ fontWeight: 500 }}>€{product.price}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 600, color: '#1a1a2e' }}>Totale</Typography>
                <Typography sx={{ fontWeight: 700, color: '#2e7d32', fontSize: '1.2rem' }}>€{(product.price * quantity).toFixed(2)}</Typography>
              </Box>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, color: '#1a1a2e', mb: 1 }}>Dati di Spedizione</Typography>
              <Paper sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: '12px' }}>
                <Typography sx={{ color: '#1a1a2e' }}>{formData.fullName}</Typography>
                <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>{formData.email}</Typography>
                <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>{formData.phone}</Typography>
                <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>{formData.address}</Typography>
              </Paper>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handlePayPalPayment}
                disabled={isProcessing}
                sx={{
                  bgcolor: '#2e7d32',
                  borderRadius: '12px',
                  py: 1.8,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: '#358d39',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px #2e7d32',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {isProcessing ? (
                  'Elaborazione...'
                ) : (
                  <>
                    Paga con &nbsp; <PayPalText />
                  </>
                )}
              </Button>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>
                {isProcessing ? 'Attendere prego...' : 'Verrai reindirizzato a PayPal per completare il pagamento'}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button fullWidth onClick={() => setPaymentDialogOpen(false)} sx={{ borderRadius: '12px', textTransform: 'none', color: '#6b7280' }}>
              Annulla
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for Add to Cart */}
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
      </Container>
    </Box>
  );
};

export default Details;