// src/components/Footer.jsx
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
  TextField,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  YouTube,
  Phone,
  Email,
  LocationOn,
  AccessTime,
  Send,
  ArrowForward,
  LocalShipping,
  Payment,
  Cached,
  Headset,
  Copyright,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PA from '../assets/PA.png';

const Footer = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const quickLinks = [
    { text: 'Home', path: '/' },
    { text: 'Prodotti', path: '/products' },
    { text: 'Contatti', path: '/contact' },
    { text: 'Chi Siamo', path: '/about' },
    { text: 'FAQ', path: '/faq' },
  ];

  const categories = [
    { text: 'Side Door', path: '/products?category=side-door' },
    { text: 'Front Logo', path: '/products?category=front-logo' },
    { text: 'Trank Logo', path: '/products?category=trank-logo' },
    { text: 'Custom', path: '/products?category=custom' },
  ];

  const contactInfo = [
    { icon: <LocationOn sx={{ fontSize: 18 }} />, text: 'Via Roma 123, 00100 Roma' },
    { icon: <Phone sx={{ fontSize: 18 }} />, text: '+39 06 1234 5678' },
    { icon: <Email sx={{ fontSize: 18 }} />, text: 'info@prestigeauto.it' },
    { icon: <AccessTime sx={{ fontSize: 18 }} />, text: 'Lun - Ven: 9:00 - 18:00' },
  ];

  const socialLinks = [
    { icon: <Facebook />, url: 'https://facebook.com', color: '#1877F2' },
    { icon: <Instagram />, url: 'https://instagram.com', color: '#E4405F' },
    { icon: <Twitter />, url: 'https://twitter.com', color: '#1DA1F2' },
    { icon: <LinkedIn />, url: 'https://linkedin.com', color: '#0A66C2' },
    { icon: <YouTube />, url: 'https://youtube.com', color: '#FF0000' },
  ];

  const trustBadges = [
    { icon: <LocalShipping />, title: 'Spedizione Gratuita', subtitle: 'Oltre 100€' },
    { icon: <Payment />, title: 'Pagamento Sicuro', subtitle: 'PayPal & Carte' },
    { icon: <Cached />, title: 'Reso 30 Giorni', subtitle: 'Reso Facile' },
    { icon: <Headset />, title: 'Supporto 24/7', subtitle: 'Assistenza Dedicata' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        pt: { xs: 6, md: 8 },
        pb: { xs: 2, md: 3 },
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Brand & Description */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                component="img"
                src={PA}
                alt="Prestige Auto"
                sx={{
                  height: 40,
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: '#ffffff',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  letterSpacing: '0.5px',
                }}
              >
                Prestige Auto
              </Typography>
            </Box>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.9rem',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                lineHeight: 1.8,
                mb: 3,
                maxWidth: 350,
              }}
            >
              Leader nella vendita di proiettori per logo auto di alta qualità. 
              Rendi ogni ingresso speciale con i nostri prodotti premium.
            </Typography>
            
            {/* Social Links */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.6)',
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    '&:hover': {
                      backgroundColor: social.color,
                      color: '#ffffff',
                      transform: 'translateY(-3px)',
                      boxShadow: `0 8px 24px ${alpha(social.color, 0.3)}`,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.9rem',
                color: '#ffffff',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                mb: 2,
                letterSpacing: '0.5px',
              }}
            >
              Link Rapidi
            </Typography>
            <Stack spacing={1.5}>
              {quickLinks.map((link) => (
                <Link
                  key={link.text}
                  href={link.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(link.path);
                  }}
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '0.85rem',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      color: '#4caf50',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ArrowForward sx={{ fontSize: 14, opacity: 0 }} />
                  {link.text}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Categories */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.9rem',
                color: '#ffffff',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                mb: 2,
                letterSpacing: '0.5px',
              }}
            >
              Categorie
            </Typography>
            <Stack spacing={1.5}>
              {categories.map((category) => (
                <Link
                  key={category.text}
                  href={category.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(category.path);
                  }}
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '0.85rem',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      color: '#4caf50',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ArrowForward sx={{ fontSize: 14, opacity: 0 }} />
                  {category.text}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact & Newsletter */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.9rem',
                color: '#ffffff',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                mb: 2,
                letterSpacing: '0.5px',
              }}
            >
              Contatti
            </Typography>
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              {contactInfo.map((info, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '0.85rem',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  }}
                >
                  <Box
                    sx={{
                      color: '#4caf50',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {info.icon}
                  </Box>
                  {info.text}
                </Box>
              ))}
            </Stack>

            {/* Newsletter */}
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '0.85rem',
                color: '#ffffff',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                mb: 1.5,
              }}
            >
              Iscriviti alla Newsletter
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="La tua email"
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: '#ffffff',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4caf50',
                    },
                    '& input': {
                      padding: '10px 14px',
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      fontSize: '0.85rem',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  minWidth: 48,
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  backgroundColor: '#2e7d32',
                  '&:hover': {
                    backgroundColor: '#1b5e20',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Send />
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Trust Badges */}
        <Box
          sx={{
            mt: 6,
            pt: 4,
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Grid container spacing={2}>
            {trustBadges.map((badge, index) => (
              <Grid size={{ xs: 6, sm: 3 }} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      backgroundColor: 'rgba(46,125,50,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4caf50',
                      mb: 0.5,
                    }}
                  >
                    {badge.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      color: '#ffffff',
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    }}
                  >
                    {badge.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      color: 'rgba(255,255,255,0.4)',
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    }}
                  >
                    {badge.subtitle}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Bottom Bar */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Copyright sx={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }} />
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              2026 Prestige Auto. Tutti i diritti riservati.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              href="#"
              sx={{
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                textDecoration: 'none',
                '&:hover': {
                  color: '#4caf50',
                },
                transition: 'color 0.3s ease',
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              sx={{
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                textDecoration: 'none',
                '&:hover': {
                  color: '#4caf50',
                },
                transition: 'color 0.3s ease',
              }}
            >
              Termini e Condizioni
            </Link>
            <Link
              href="#"
              sx={{
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                textDecoration: 'none',
                '&:hover': {
                  color: '#4caf50',
                },
                transition: 'color 0.3s ease',
              }}
            >
              Cookies
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;