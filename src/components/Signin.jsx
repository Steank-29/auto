// src/components/Signin.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Container, 
  Paper, 
  IconButton, 
  InputAdornment, 
  Checkbox, 
  FormControlLabel,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Email, Lock, Visibility, VisibilityOff, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import PA from '../assets/PA.png';
import BDG from '../assets/BDG.png';

const Signin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

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

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token is still valid
      const verifyToken = async () => {
        try {
          await axiosInstance.get('/auth/profile');
          navigate('/admin/dashboard');
        } catch (error) {
          // Token invalid, clear it
          localStorage.removeItem('token');
        }
      };
      verifyToken();
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'remember' ? checked : value
    }));
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        // Save token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // If remember me is checked, store email for next time
        if (formData.remember) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Show success message
        setSnackbar({
          open: true,
          message: 'Login successful! Redirecting...',
          severity: 'success'
        });

        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error cases
      if (error.response) {
        // Server responded with error
        setError(error.response.data?.message || 'Invalid email or password');
      } else if (error.request) {
        // No response from server
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred');
      }
      
      setSnackbar({
        open: true,
        message: setError,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
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

  // Handle forgot password
  const handleForgotPassword = () => {
    // Navigate to forgot password page or show dialog
    setSnackbar({
      open: true,
      message: 'Please contact admin to reset your password',
      severity: 'info'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${BDG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        '&::before': {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(2px)",
        },
      }}
    >
      {/* Animated Background Particles */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0.1 + Math.random() * 0.2,
            }}
            animate={{
              y: [null, -100, -200],
              opacity: [0.1, 0.3, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: 2 + Math.random() * 3,
              height: 2 + Math.random() * 3,
              background: "rgba(255,255,255,0.3)",
              borderRadius: "50%",
            }}
          />
        ))}
      </Box>

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 5, md: 4 },
              borderRadius: "24px",
              bgcolor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Logo & Brand with Typing Animation */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                }}
              >
                <motion.div
                  animate={{
                    x: isTypingComplete ? 0 : -((displayText.length / 2) * 8),
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Box
                    component="img"
                    src={PA}
                    alt="Prestige Auto"
                    onClick={handleLogoClick}
                    sx={{
                      width: "60px",
                      height: "60px",
                      objectFit: "contain",
                      cursor: "pointer",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                </motion.div>

                <motion.div
                  animate={{
                    opacity: displayText ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      color: "#000000",
                      letterSpacing: "-0.5px",
                      whiteSpace: "nowrap",
                      fontSize: { xs: "1.3rem", sm: "1.6rem" },
                    }}
                  >
                    {renderText()}
                    {!isTypingComplete && (
                      <span
                        style={{
                          display: "inline-block",
                          width: "2px",
                          height: "28px",
                          backgroundColor: "#000000",
                          marginLeft: "2px",
                          animation: "blink 0.8s step-end infinite",
                        }}
                      />
                    )}
                  </Typography>
                </motion.div>
              </motion.div>
              
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  color: "rgba(0, 0, 0, 0.5)",
                  mt: 2,
                  fontWeight: 400,
                }}
              >
                Accedi al tuo account per gestire i tuoi proiettori
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: '12px' }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="nome@esempio.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  sx={{
                    mb: 2.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: "12px",
                      backgroundColor: "#f8f8f8",
                      color: "#000000",
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      '& fieldset': {
                        borderColor: "rgba(0,0,0,0.08)",
                      },
                      '&:hover fieldset': {
                        borderColor: "rgba(0,0,0,0.15)",
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: "#2e7d32",
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: "rgba(0,0,0,0.4)",
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      '&.Mui-focused': {
                        color: "rgba(0,0,0,0.7)",
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "rgba(0,0,0,0.3)", fontSize: "20px" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <TextField
                  fullWidth
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Inserisci la password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: "12px",
                      backgroundColor: "#f8f8f8",
                      color: "#000000",
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      '& fieldset': {
                        borderColor: "rgba(0,0,0,0.08)",
                      },
                      '&:hover fieldset': {
                        borderColor: "rgba(0,0,0,0.15)",
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: "#2e7d32",
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: "rgba(0,0,0,0.4)",
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      '&.Mui-focused': {
                        color: "rgba(0,0,0,0.7)",
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "rgba(0,0,0,0.3)", fontSize: "20px" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{ color: "rgba(0,0,0,0.3)" }}
                          disabled={loading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                      disabled={loading}
                      sx={{
                        color: "rgba(0,0,0,0.2)",
                        '&.Mui-checked': {
                          color: "#2e7d32",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(0,0,0,0.5)",
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      }}
                    >
                      Ricordami
                    </Typography>
                  }
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#2e7d32",
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    cursor: "pointer",
                    transition: "color 0.3s ease",
                    fontWeight: 500,
                    "&:hover": {
                      color: "#1b5e20",
                    },
                  }}
                  onClick={handleForgotPassword}
                >
                  Password dimenticata?
                </Typography>
              </Box>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  endIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowForward sx={{ mt: 1.5 }} />
                      </motion.span>
                    )
                  }
                  sx={{
                    backgroundColor: loading ? "#6b7280" : "#2e7d32",
                    color: "#ffffff",
                    borderRadius: "50px",
                    py: 1.8,
                    textTransform: "none",
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    fontWeight: 600,
                    fontSize: "1rem",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#1b5e20",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 48px rgba(0,0,0,0.2)",
                    },
                    "&:disabled": {
                      backgroundColor: "#6b7280",
                    },
                  }}
                >
                  {loading ? 'Accesso in corso...' : 'Accedi'}
                </Button>
              </motion.div>
            </form>

            {/* Footer Note - Inside the box */}
            <Box sx={{ textAlign: "center", mt: 4, pt: 3, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(0,0,0,0.3)",
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  letterSpacing: "0.05em",
                  fontWeight: 400,
                }}
              >
                Door Logo Projectors © 2026 • Accessori Auto Premium
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>

      {/* Snackbar Notifications */}
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
            '& .MuiAlert-icon': {
              fontSize: 24,
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}
      </style>
    </Box>
  );
};

export default Signin;