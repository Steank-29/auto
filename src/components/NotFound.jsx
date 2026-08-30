// src/pages/NotFound.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Error,
  Home,
  Dashboard,
  ArrowBack,
  Warning,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(2.5);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Determine if user is in admin section
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Redirect path based on route type
  const redirectPath = isAdminRoute ? '/admin/dashboard' : '/';
  const redirectLabel = isAdminRoute ? 'Dashboard Amministratore' : 'Home Page';

  useEffect(() => {
    // Start countdown for automatic redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0.1) {
          clearInterval(timer);
          setIsRedirecting(true);
          navigate(redirectPath);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [navigate, redirectPath]);

  // Manual redirect handlers
  const handleRedirect = () => {
    setIsRedirecting(true);
    navigate(redirectPath);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isAdminRoute 
          ? 'linear-gradient(135deg, #f5f5f5 0%, #e8f5e9 100%)'
          : 'linear-gradient(135deg, #f5f5f5 0%, #e3f2fd 100%)',
        p: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.04)',
            }}
          >
            {/* Header with gradient */}
            <Box
              sx={{
                background: isAdminRoute
                  ? 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)'
                  : 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                p: { xs: 4, md: 6 },
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -80,
                  left: -80,
                  width: 250,
                  height: 250,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.03)',
                },
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <Error sx={{ fontSize: 64, color: '#ffffff' }} />
                </Box>
              </motion.div>

              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '1rem',
                  mt: 2,
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {isAdminRoute ? 'Area Amministrativa' : 'Area Pubblica'}
              </Typography>

              <Typography
                sx={{
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: { xs: '4rem', md: '6rem' },
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  lineHeight: 1,
                  mt: 1,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                404
              </Typography>

              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 600,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                Pagina Non Trovata
              </Typography>
            </Box>

            {/* Content */}
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  sx={{
                    color: '#1a1a2e',
                    fontSize: '1.1rem',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {isAdminRoute 
                    ? 'La pagina che stai cercando non esiste nell\'area amministrativa.'
                    : 'La pagina che stai cercando non esiste.'}
                </Typography>
                <Typography
                  sx={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  }}
                >
                  Verifica l\'URL o utilizza uno dei link qui sotto per tornare indietro.
                </Typography>
              </Box>

              {/* Countdown Progress */}
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: '#6b7280',
                      fontSize: '0.85rem',
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    }}
                  >
                    Reindirizzamento automatico a
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: isAdminRoute ? '#2e7d32' : '#1976d2',
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    }}
                  >
                    {redirectLabel}
                  </Typography>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                      variant="determinate"
                      value={(countdown / 2.5) * 100}
                      size={32}
                      thickness={4}
                      sx={{
                        color: isAdminRoute ? '#2e7d32' : '#1976d2',
                      }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#1a1a2e',
                          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                        }}
                      >
                        {Math.ceil(countdown)}s
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={handleGoBack}
                  disabled={isRedirecting}
                  sx={{
                    borderRadius: '14px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    borderColor: '#e5e7eb',
                    color: '#6b7280',
                    px: 3,
                    py: 1.2,
                    '&:hover': {
                      borderColor: isAdminRoute ? '#2e7d32' : '#1976d2',
                      color: isAdminRoute ? '#2e7d32' : '#1976d2',
                      backgroundColor: 'rgba(0,0,0,0.02)',
                    },
                  }}
                >
                  Torna Indietro
                </Button>

                <Button
                  variant="contained"
                  startIcon={isAdminRoute ? <Dashboard /> : <Home />}
                  onClick={handleRedirect}
                  disabled={isRedirecting}
                  sx={{
                    borderRadius: '14px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    px: 4,
                    py: 1.2,
                    backgroundColor: isAdminRoute ? '#2e7d32' : '#1976d2',
                    '&:hover': {
                      backgroundColor: isAdminRoute ? '#1b5e20' : '#0d47a1',
                    },
                  }}
                >
                  {isRedirecting ? 'Reindirizzamento...' : `Vai a ${redirectLabel}`}
                </Button>
              </Box>

              {/* Additional Info for Admin */}
              {isAdminRoute && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: 'rgba(46,125,50,0.04)',
                    borderRadius: '12px',
                    border: '1px solid rgba(46,125,50,0.08)',
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#6b7280',
                      fontSize: '0.8rem',
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    }}
                  >
                    <Warning sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5, color: '#ff9800' }} />
                    Sei stato reindirizzato perché la pagina richiesta non esiste.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Footer */}
          <Typography
            sx={{
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '0.75rem',
              mt: 3,
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              opacity: 0.6,
            }}
          >
            Prestige Auto • {new Date().getFullYear()}
          </Typography>
        </Container>
      </motion.div>
    </Box>
  );
};

export default NotFound;