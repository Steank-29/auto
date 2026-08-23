// src/pages/Contact.jsx
import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  useTheme,
  alpha,
  Card,
  CardContent,
  InputAdornment,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Send,
  Person,
  Subject,
  LocalShipping,
  Payment,
  Cached,
  Headset,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import BDG from '../assets/BDGC.png';

const Contact = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const formRef = useRef(null);

  // Contact Information
  const contactInfo = [
    {
      icon: <LocationOn sx={{ fontSize: 28 }} />,
      title: 'Indirizzo',
      details: ['Via Roma 123', '00100 Roma, Italia'],
      color: '#2e7d32',
    },
    {
      icon: <Phone sx={{ fontSize: 28 }} />,
      title: 'Telefono',
      details: ['+39 06 1234 5678', '+39 338 123 4567'],
      color: '#1976d2',
    },
    {
      icon: <Email sx={{ fontSize: 28 }} />,
      title: 'Email',
      details: ['info@prestigeauto.it', 'support@prestigeauto.it'],
      color: '#d32f2f',
    },
    {
      icon: <AccessTime sx={{ fontSize: 28 }} />,
      title: 'Orari di Apertura',
      details: ['Lun - Ven: 9:00 - 18:00', 'Sab: 9:00 - 13:00'],
      color: '#ed6c02',
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Il nome è obbligatorio';
    if (!formData.email.trim()) {
      errors.email = 'L\'email è obbligatoria';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Inserisci un indirizzo email valido';
    }
    if (!formData.subject.trim()) errors.subject = 'L\'oggetto è obbligatorio';
    if (!formData.message.trim()) errors.message = 'Il messaggio è obbligatorio';
    if (formData.message.trim().length < 10) errors.message = 'Il messaggio deve contenere almeno 10 caratteri';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/contact', formData);
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Il tuo messaggio è stato inviato con successo! Ti risponderemo al più presto.',
          severity: 'success',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        if (formRef.current) formRef.current.reset();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbar({
        open: true,
        message: 'Si è verificato un errore. Per favore riprova più tardi.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 10, sm: 10, md: 14 },
        backgroundImage: `url(${BDG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4}>
          {/* Left Column - Contact Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              style={{ height: '100%' }}
            >
              <Paper
                id="contact-form"
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  borderRadius: '24px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  height: '100%',
                }}
              >
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Box
                      sx={{
                        width: 4,
                        height: 32,
                        backgroundColor: '#2e7d32',
                        borderRadius: '2px',
                      }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: '#1a1a2e',
                          fontSize: { xs: '1.5rem', md: '2rem' },
                          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                          letterSpacing: '-0.02em',
                        }}
                      >
                        Invia un Messaggio
                      </Typography>
                      <Typography
                        sx={{
                          color: '#6b7280',
                          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                          fontSize: '0.9rem',
                          mt: 0.5,
                        }}
                      >
                        Compila il modulo e ti risponderemo entro 24 ore
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <form ref={formRef} onSubmit={handleSubmit}>
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Nome Completo"
                        placeholder="Mario Rossi"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ color: '#6b7280', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '14px',
                            backgroundColor: '#f8f9fa',
                            transition: 'all 0.3s ease',
                            '&:hover': { 
                              backgroundColor: '#f0f0f0',
                              borderColor: '#2e7d32',
                            },
                            '&.Mui-focused': { 
                              backgroundColor: '#ffffff',
                              borderColor: '#2e7d32',
                              boxShadow: '0 0 0 3px rgba(46,125,50,0.1)',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Indirizzo Email"
                        placeholder="mario@example.com"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '14px',
                            backgroundColor: '#f8f9fa',
                            transition: 'all 0.3s ease',
                            '&:hover': { 
                              backgroundColor: '#f0f0f0',
                              borderColor: '#2e7d32',
                            },
                            '&.Mui-focused': { 
                              backgroundColor: '#ffffff',
                              borderColor: '#2e7d32',
                              boxShadow: '0 0 0 3px rgba(46,125,50,0.1)',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="Oggetto"
                        placeholder="Richiesta informazioni su..."
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        error={!!formErrors.subject}
                        helperText={formErrors.subject}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Subject sx={{ color: '#6b7280', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '14px',
                            backgroundColor: '#f8f9fa',
                            transition: 'all 0.3s ease',
                            '&:hover': { 
                              backgroundColor: '#f0f0f0',
                              borderColor: '#2e7d32',
                            },
                            '&.Mui-focused': { 
                              backgroundColor: '#ffffff',
                              borderColor: '#2e7d32',
                              boxShadow: '0 0 0 3px rgba(46,125,50,0.1)',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Il Tuo Messaggio"
                        placeholder="Scrivi qui il tuo messaggio in dettaglio..."
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        error={!!formErrors.message}
                        helperText={formErrors.message}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '14px',
                            backgroundColor: '#f8f9fa',
                            transition: 'all 0.3s ease',
                            '&:hover': { 
                              backgroundColor: '#f0f0f0',
                              borderColor: '#2e7d32',
                            },
                            '&.Mui-focused': { 
                              backgroundColor: '#ffffff',
                              borderColor: '#2e7d32',
                              boxShadow: '0 0 0 3px rgba(46,125,50,0.1)',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={isSubmitting}
                        endIcon={isSubmitting ? <CircularProgress size={22} color="inherit" /> : <Send />}
                        sx={{
                          backgroundColor: '#2e7d32',
                          borderRadius: '14px',
                          py: 1.8,
                          textTransform: 'none',
                          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                          fontWeight: 700,
                          fontSize: '1.05rem',
                          boxShadow: '0 4px 16px rgba(46,125,50,0.25)',
                          '&:hover': {
                            backgroundColor: '#1b5e20',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 32px rgba(46,125,50,0.35)',
                          },
                          '&:active': {
                            transform: 'translateY(0)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </motion.div>
          </Grid>

          {/* Right Column - Contact Info in One Box */}
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ height: '100%' }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  borderRadius: '24px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: '#1a1a2e',
                    fontSize: '1.5rem',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    mb: 3,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Contattaci
                </Typography>

                <Stack spacing={3}>
                  {contactInfo.map((info, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '12px',
                          backgroundColor: alpha(info.color, 0.08),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: info.color,
                          flexShrink: 0,
                        }}
                      >
                        {info.icon}
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: '#1a1a2e',
                            fontSize: '0.85rem',
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                            mb: 0.25,
                          }}
                        >
                          {info.title}
                        </Typography>
                        {info.details.map((detail, i) => (
                          <Typography
                            key={i}
                            sx={{
                              color: '#6b7280',
                              fontSize: '0.85rem',
                              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                              lineHeight: 1.5,
                            }}
                          >
                            {detail}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Trust Badges Section - Below the form and info */}
        <Box
          sx={{
            mt: 6,
            py: 2,
            backgroundColor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            width: '100%',
          }}
        >
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
                  borderRight: { sm: '1px solid rgba(0,0,0,0.06)' },
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
                  borderRight: { sm: '1px solid rgba(0,0,0,0.06)' },
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
                  borderRight: { sm: '1px solid rgba(0,0,0,0.06)' },
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
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            borderRadius: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            alignItems: 'center',
            fontSize: '0.9rem',
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;