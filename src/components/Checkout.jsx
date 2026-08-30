// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Divider,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Stack,
  Chip,
  useTheme,
  alpha,
  Snackbar,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Home,
  ShoppingCart,
  CheckCircle,
  Payment,
  ArrowBack,
  ArrowForward,
  LocationOn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axiosInstance from '../utils/axiosConfig';
import PA from '../assets/PA.png';
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

/* ------------------------------------------------------------------ */
/*  Step components live OUTSIDE Checkout so React keeps the same     */
/*  component identity across re-renders (this is what was causing    */
/*  the input focus loss on every keystroke).                         */
/* ------------------------------------------------------------------ */

// Cart Step Component
const CartStep = ({ cartItems, cartCount, cartTotal, navigate }) => (
  <Box>
    {cartItems.length === 0 ? (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <ShoppingCart sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600 }}>
          Il tuo carrello è vuoto
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/products')}
          sx={{ mt: 2, backgroundColor: '#2e7d32' }}
        >
          Continua lo Shopping
        </Button>
      </Box>
    ) : (
      <Box>
        <Typography sx={{ fontWeight: 600, color: '#1a1a2e', mb: 2 }}>
          {cartCount} articoli nel carrello
        </Typography>
        <Stack spacing={2}>
          {cartItems.map((item) => (
            <Paper
              key={item.productId}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '16px',
                border: '1px solid #f0f0f0',
                display: 'flex',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <Avatar
                src={item.mainImage ? getImageUrl(item.mainImage) : PA}
                variant="rounded"
                sx={{ width: 60, height: 60, borderRadius: '12px' }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.95rem' }}>
                  {item.name}
                </Typography>
                <Typography sx={{ color: '#6b7280', fontSize: '0.8rem' }}>
                  {item.brand} • {item.model}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                  <Typography sx={{ fontWeight: 700, color: '#2e7d32' }}>
                    €{item.price}
                  </Typography>
                  <Chip label={`Q.tà: ${item.quantity}`} size="small" />
                  <Chip label={item.selectedLogo} size="small" variant="outlined" />
                </Box>
              </Box>
              <Typography sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                €{(item.price * item.quantity).toFixed(2)}
              </Typography>
            </Paper>
          ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 600, color: '#1a1a2e' }}>
            Totale {cartCount} articoli
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#1a1a2e' }}>
            €{cartTotal.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    )}
  </Box>
);

// Shipping Step Component
const ShippingStep = ({ formData, formErrors, handleFormChange }) => (
  <Box>
    <Typography sx={{ fontWeight: 600, color: '#1a1a2e', mb: 3 }}>
      Dati di Spedizione
    </Typography>

    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Nome Completo"
          name="fullName"
          placeholder="Mario Rossi"
          value={formData.fullName}
          onChange={handleFormChange}
          error={!!formErrors.fullName}
          helperText={formErrors.fullName}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: '#6b7280', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          placeholder="mario@example.com"
          value={formData.email}
          onChange={handleFormChange}
          error={!!formErrors.email}
          helperText={formErrors.email}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: '#6b7280', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Telefono"
          name="phone"
          placeholder="+39 3XX XXX XXXX"
          value={formData.phone}
          onChange={handleFormChange}
          error={!!formErrors.phone}
          helperText={formErrors.phone}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone sx={{ color: '#6b7280', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Indirizzo"
          name="address"
          placeholder="Via Roma 123"
          value={formData.address}
          onChange={handleFormChange}
          error={!!formErrors.address}
          helperText={formErrors.address}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Home sx={{ color: '#6b7280', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Città"
          name="city"
          placeholder="Roma"
          value={formData.city}
          onChange={handleFormChange}
          error={!!formErrors.city}
          helperText={formErrors.city}
          required
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="CAP"
          name="postalCode"
          placeholder="00100"
          value={formData.postalCode}
          onChange={handleFormChange}
          error={!!formErrors.postalCode}
          helperText={formErrors.postalCode}
          required
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Paese"
          name="country"
          value={formData.country}
          onChange={handleFormChange}
          disabled
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Note (opzionale)"
          name="notes"
          placeholder="Istruzioni di consegna speciali..."
          value={formData.notes}
          onChange={handleFormChange}
          multiline
          rows={2}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
      </Grid>
    </Grid>
  </Box>
);

// Payment Step Component
const PaymentStep = ({ cartTotal, shippingCost, grandTotal, formData, cartCount }) => (
  <Box>
    <Typography sx={{ fontWeight: 600, color: '#1a1a2e', mb: 3 }}>
      Riepilogo Ordine
    </Typography>

    {/* Order Summary */}
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid #f0f0f0',
        mb: 3,
      }}
    >
      <Typography sx={{ fontWeight: 600, color: '#1a1a2e', mb: 2 }}>
        Dettagli Ordine
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ color: '#6b7280' }}>Subtotale</Typography>
        <Typography sx={{ fontWeight: 500, color: '#1a1a2e' }}>€{cartTotal.toFixed(2)}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ color: '#6b7280' }}>Spedizione</Typography>
        <Typography sx={{ fontWeight: 500, color: shippingCost === 0 ? '#2e7d32' : '#1a1a2e' }}>
          {shippingCost === 0 ? 'Gratuita' : `€${shippingCost.toFixed(2)}`}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1.1rem' }}>
          Totale
        </Typography>
        <Typography sx={{ fontWeight: 700, color: '#2e7d32', fontSize: '1.3rem' }}>
          €{grandTotal.toFixed(2)}
        </Typography>
      </Box>
    </Paper>

    {/* Shipping Info */}
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid #f0f0f0',
        mb: 3,
      }}
    >
      <Typography sx={{ fontWeight: 600, color: '#1a1a2e', mb: 2 }}>
        Dati di Spedizione
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Person sx={{ fontSize: 16, color: '#6b7280' }} />
        <Typography sx={{ color: '#1a1a2e' }}>{formData.fullName}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Email sx={{ fontSize: 16, color: '#6b7280' }} />
        <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>{formData.email}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Phone sx={{ fontSize: 16, color: '#6b7280' }} />
        <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>{formData.phone}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocationOn sx={{ fontSize: 16, color: '#6b7280' }} />
        <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>
          {formData.address}, {formData.city}, {formData.postalCode}, {formData.country}
        </Typography>
      </Box>
    </Paper>

    {/* Payment Method */}
    <Box>
      <Typography sx={{ fontWeight: 600, color: '#1a1a2e', mb: 2 }}>
        Metodo di Pagamento
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          border: '2px solid #2e7d32',
          backgroundColor: alpha('#2e7d32', 0.03),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: '#0070ba',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Payment sx={{ color: '#ffffff' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 600, color: '#1a1a2e' }}>
              PayPal
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#6b7280' }}>
              Pagamento sicuro tramite PayPal
            </Typography>
          </Box>
          <Chip label="Consigliato" size="small" sx={{ backgroundColor: '#2e7d32', color: '#ffffff' }} />
        </Box>
      </Paper>
    </Box>

    {/* Order Items Count */}
    <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
      <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>
        <strong>{cartCount}</strong> articoli nel carrello
      </Typography>
    </Box>
  </Box>
);

// Success Page
const SuccessPage = ({ orderId, formData, clearCart, navigate }) => (
  <Box sx={{ textAlign: 'center', py: 4 }}>
    <CheckCircle sx={{ fontSize: 80, color: '#2e7d32', mb: 2 }} />
    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>
      Ordine Completato!
    </Typography>
    <Typography sx={{ color: '#6b7280', mb: 3 }}>
      Grazie per il tuo acquisto. Il tuo ordine è stato confermato.
    </Typography>

    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid #f0f0f0',
        maxWidth: 400,
        mx: 'auto',
        mb: 3,
      }}
    >
      <Typography sx={{ fontWeight: 600, color: '#1a1a2e' }}>
        Numero Ordine
      </Typography>
      <Typography sx={{ color: '#2e7d32', fontWeight: 700, fontSize: '1.1rem' }}>
        #{orderId || 'ORD-2026-001'}
      </Typography>
    </Paper>

    <Typography sx={{ color: '#6b7280', mb: 3 }}>
      Riceverai una email di conferma all'indirizzo {formData.email}
    </Typography>

    <Button
      variant="contained"
      onClick={() => {
        clearCart();
        navigate('/');
      }}
      sx={{
        backgroundColor: '#2e7d32',
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: 600,
        px: 4,
        py: 1.5,
        '&:hover': { backgroundColor: '#1b5e20' },
      }}
    >
      Torna alla Home
    </Button>
  </Box>
);

/* ------------------------------------------------------------------ */
/*  Main Checkout component                                           */
/* ------------------------------------------------------------------ */

const Checkout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Italia',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const steps = ['Carrello', 'Spedizione', 'Pagamento'];

  const cartTotal = getCartTotal();
  const cartCount = getCartCount();
  const shippingCost = cartTotal > 100 ? 0 : 9.90;
  const grandTotal = cartTotal + shippingCost;

  useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      navigate('/products');
    }
  }, [cartItems, navigate, orderComplete]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
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
    if (!formData.city.trim()) errors.city = 'La città è obbligatoria';
    if (!formData.postalCode.trim()) errors.postalCode = 'Il CAP è obbligatorio';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 1) {
      if (!validateForm()) return;
    }
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handlePayPalPayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          brand: item.brand,
          model: item.model,
          price: item.price,
          quantity: item.quantity,
          selectedLogo: item.selectedLogo,
        })),
        customer: formData,
        subtotal: cartTotal,
        shipping: shippingCost,
        total: grandTotal,
      };

      console.log('Sending order data:', orderData);

      const response = await axiosInstance.post('/orders/create-order', orderData);

      console.log('PayPal response:', response.data);

      if (response.data.success) {
        // Redirect to PayPal approval URL
        window.location.href = response.data.approvalUrl;
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || 'Errore nella creazione dell\'ordine. Riprova più tardi.',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Errore nella creazione dell\'ordine. Riprova più tardi.',
        severity: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle payment success/failure from redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const returnedOrderId = urlParams.get('orderId');

    if (paymentStatus === 'success' && returnedOrderId) {
      setOrderComplete(true);
      setOrderId(returnedOrderId);
      // Clear cart after successful payment
      setTimeout(() => {
        clearCart();
      }, 1000);
    } else if (paymentStatus === 'failed') {
      setSnackbar({
        open: true,
        message: 'Il pagamento non è stato completato. Per favore riprova.',
        severity: 'error',
      });
      // Remove payment params from URL
      window.history.replaceState({}, document.title, '/checkout');
    } else if (paymentStatus === 'cancelled') {
      setSnackbar({
        open: true,
        message: 'Pagamento annullato. Puoi riprovare quando vuoi.',
        severity: 'info',
      });
      window.history.replaceState({}, document.title, '/checkout');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlaceOrder = () => {
    handlePayPalPayment();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <CartStep
            cartItems={cartItems}
            cartCount={cartCount}
            cartTotal={cartTotal}
            navigate={navigate}
          />
        );
      case 1:
        return (
          <ShippingStep
            formData={formData}
            formErrors={formErrors}
            handleFormChange={handleFormChange}
          />
        );
      case 2:
        return (
          <PaymentStep
            cartTotal={cartTotal}
            shippingCost={shippingCost}
            grandTotal={grandTotal}
            formData={formData}
            cartCount={cartCount}
          />
        );
      default:
        return 'Passo sconosciuto';
    }
  };

  if (orderComplete) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', py: 4 }}>
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '20px',
              bgcolor: '#ffffff',
              border: '1px solid rgba(0,0,0,0.04)',
            }}
          >
            <SuccessPage
              orderId={orderId}
              formData={formData}
              clearCart={clearCart}
              navigate={navigate}
            />
          </Paper>
        </Container>
      </Box>
    );
  }

  // Check if form is valid for the current step
  const isFormValid = () => {
    if (activeStep === 1) {
      return (
        formData.fullName.trim() !== '' &&
        formData.email.trim() !== '' &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
        formData.phone.trim() !== '' &&
        formData.address.trim() !== '' &&
        formData.city.trim() !== '' &&
        formData.postalCode.trim() !== ''
      );
    }
    return true;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', py: { xs: 8, md: 10 } }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            borderRadius: '20px',
            overflow: 'hidden',
            bgcolor: '#ffffff',
            border: '1px solid rgba(0,0,0,0.04)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              borderBottom: '1px solid #f0f0f0',
              background: 'linear-gradient(135deg, rgba(46,125,50,0.05) 0%, transparent 100%)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                  Checkout
                </Typography>
                <Typography sx={{ color: '#6b7280', fontSize: '0.95rem' }}>
                  Completa il tuo acquisto in pochi passi
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingCart sx={{ color: '#6b7280' }} />
                <Typography sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                  {cartCount} articoli
                </Typography>
              </Box>
            </Box>

            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mt: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '0.85rem',
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Content */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            {getStepContent(activeStep)}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<ArrowBack />}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  color: '#6b7280',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  },
                  '&:disabled': {
                    color: '#cccccc',
                  },
                }}
              >
                Indietro
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || cartItems.length === 0}
                  startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : null}
                  sx={{
                    backgroundColor: '#2e7d32',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: '#1b5e20',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      backgroundColor: '#cccccc',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isProcessing ? 'Elaborazione...' : (
                    <>
                      Paga con &nbsp; <PayPalText />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={activeStep === 1 && !isFormValid()}
                  endIcon={<ArrowForward />}
                  sx={{
                    backgroundColor: '#2e7d32',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: '#1b5e20',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      backgroundColor: '#cccccc',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Continua
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

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
      </Container>
    </Box>
  );
};

export default Checkout;