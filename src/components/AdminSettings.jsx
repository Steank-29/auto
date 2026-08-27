// src/pages/AdminSettings.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  LinearProgress,
  Avatar,
  useTheme,
  alpha,
  InputAdornment,
  Tooltip,
  Divider,
  Card,
  CardContent,
  Tab,
  Tabs,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Container,
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  CalendarToday,
  Wc,
  Image as ImageIcon,
  CloudUpload,
  Save,
  Close,
  CheckCircle,
  Error as ErrorIcon,
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  Security,
  Notifications,
  Palette,
  Language,
  Dashboard,
  Settings,
  AccountCircle,
  PhotoCamera,
  Edit,
  Delete,
  Refresh,
  Warning,
  Cancel,
  BrandingWatermark,
  Storefront,
  Category,
  ShoppingCart,
  People,
  Assessment,
  Translate,
  DarkMode,
  LightMode,
  Logout,
  Login,
  Euro
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axiosInstance from '../utils/axiosConfig';

// Tab Panel Component
const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`settings-tabpanel-${index}`}
    aria-labelledby={`settings-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const AdminSettings = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(3); // Activity tab index (3)
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    image: '',
    role: 'admin',
    createdAt: '',
    lastLogin: '',
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    gender: '',
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Image Upload State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Profile Form Errors
  const [profileErrors, setProfileErrors] = useState({});

  // Settings State
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'it',
    notifications: true,
    emailNotifications: true,
    twoFactorAuth: false,
    autoBackup: false,
    currency: 'EUR',
  });

  // Activity Log
  const [activityLog, setActivityLog] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/auth/profile');
      if (response.data.success) {
        const userData = response.data.user;
        setProfile(userData);
        setProfileForm({
          name: userData.name || '',
          email: userData.email || '',
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
          gender: userData.gender || '',
        });
        setImagePreview(userData.image ? `http://localhost:5000${userData.image}` : null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showSnackbar('Impossibile caricare i dati del profilo', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch activity log
  const fetchActivityLog = useCallback(async () => {
    try {
      // This would be a real API endpoint in production
      // For now, we'll simulate activity data
      const mockActivity = [
        { id: 1, action: 'Accesso effettuato', timestamp: new Date().toISOString(), details: 'Accesso riuscito da IP 192.168.1.1' },
        { id: 2, action: 'Profilo aggiornato', timestamp: new Date(Date.now() - 3600000).toISOString(), details: 'Informazioni del profilo modificate' },
        { id: 3, action: 'Password modificata', timestamp: new Date(Date.now() - 7200000).toISOString(), details: 'Password aggiornata con successo' },
        { id: 4, action: 'Prodotto aggiunto', timestamp: new Date(Date.now() - 86400000).toISOString(), details: 'Aggiunto nuovo prodotto: Proiettore Logo BMW' },
        { id: 5, action: 'Prodotto aggiornato', timestamp: new Date(Date.now() - 172800000).toISOString(), details: 'Prodotto aggiornato: Proiettore Logo Audi' },
      ];
      setActivityLog(mockActivity);
    } catch (error) {
      console.error('Error fetching activity log:', error);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchActivityLog();
  }, [fetchProfile, fetchActivityLog]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Profile Handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showSnackbar('Carica un\'immagine valida (JPEG, PNG, GIF o WEBP)', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showSnackbar('L\'immagine non deve superare i 5MB', 'error');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateProfileForm = () => {
    const errors = {};
    if (!profileForm.name.trim()) errors.name = 'Il nome è obbligatorio';
    if (!profileForm.email.trim()) errors.email = 'L\'email è obbligatoria';
    if (!profileForm.dateOfBirth) errors.dateOfBirth = 'La data di nascita è obbligatoria';
    if (!profileForm.gender) errors.gender = 'Il genere è obbligatorio';

    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (profileForm.email && !emailRegex.test(profileForm.email)) {
      errors.email = 'Inserisci un indirizzo email valido';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(profileForm).forEach(key => {
        if (profileForm[key]) {
          formData.append(key, profileForm[key]);
        }
      });

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axiosInstance.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        showSnackbar('Profilo aggiornato con successo!', 'success');
        await fetchProfile();
        setImageFile(null);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar(error.response?.data?.message || 'Errore durante l\'aggiornamento del profilo', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Password Handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = 'La password attuale è obbligatoria';
    if (!passwordForm.newPassword) errors.newPassword = 'La nuova password è obbligatoria';
    if (passwordForm.newPassword && passwordForm.newPassword.length < 6) {
      errors.newPassword = 'La password deve contenere almeno 6 caratteri';
    }
    if (!passwordForm.confirmPassword) errors.confirmPassword = 'Conferma la nuova password';
    if (passwordForm.newPassword && passwordForm.confirmPassword && 
        passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Le password non corrispondono';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setSubmitting(true);
    try {
      const response = await axiosInstance.put('/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (response.data.success) {
        showSnackbar('Password modificata con successo!', 'success');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setPasswordErrors({});
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showSnackbar(error.response?.data?.message || 'Errore durante il cambio password', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Settings Handlers
  const handleSettingsChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleSettingsSave = () => {
    // In a real app, this would save settings to the server
    showSnackbar('Impostazioni salvate con successo!', 'success');
  };

  // Delete Account Handler
  const handleDeleteAccount = async () => {
    try {
      // This would be a real API endpoint
      // await axiosInstance.delete('/auth/account');
      showSnackbar('Account eliminato con successo', 'success');
      // Redirect to login or home
      setTimeout(() => {
        window.location.href = '/signin';
      }, 2000);
    } catch (error) {
      console.error('Error deleting account:', error);
      showSnackbar('Errore durante l\'eliminazione dell\'account', 'error');
    }
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/signin';
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render a status badge
  const StatusBadge = ({ active }) => (
    <Chip
      size="small"
      label={active ? 'Attivo' : 'Inattivo'}
      sx={{
        backgroundColor: active ? 'rgba(46,125,50,0.1)' : 'rgba(255,68,68,0.1)',
        color: active ? '#2e7d32' : '#ff4444',
        fontWeight: 600,
        fontSize: '0.7rem',
        height: 24,
      }}
    />
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              color: '#1a1a2e',
              letterSpacing: '-0.5px',
              mb: 1,
            }}
          >
            Impostazioni Amministratore
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              color: '#6b7280',
              fontSize: '0.95rem',
            }}
          >
            Gestisci il tuo account, le preferenze e le impostazioni di sicurezza
          </Typography>
        </Box>

        {/* Loading State */}
        {loading ? (
          <Paper sx={{ p: 4, borderRadius: '16px' }}>
            <LinearProgress sx={{ borderRadius: '8px' }} />
            <Typography sx={{ mt: 2, textAlign: 'center', color: '#6b7280' }}>
              Caricamento impostazioni...
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {/* Sidebar - Quick Stats */}
            <Grid item xs={12} md={3}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  border: '1px solid #f0f0f0',
                  position: 'sticky',
                  top: 24,
                }}
              >
                {/* Profile Summary */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Box
                        sx={{
                          bgcolor: '#2e7d32',
                          borderRadius: '50%',
                          p: 0.5,
                          border: '3px solid white',
                        }}
                      >
                        <CheckCircle sx={{ fontSize: 14, color: 'white' }} />
                      </Box>
                    }
                  >
                    <Avatar
                      src={imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=2e7d32&color=fff&size=128`}
                      sx={{
                        width: 100,
                        height: 100,
                        mx: 'auto',
                        mb: 2,
                        border: '3px solid #2e7d32',
                        boxShadow: '0 4px 16px rgba(46,125,50,0.2)',
                      }}
                    />
                  </Badge>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                    {profile.name}
                  </Typography>
                  <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>
                    {profile.email}
                  </Typography>
                  <Chip
                    icon={<AdminPanelSettings sx={{ fontSize: 16 }} />}
                    label="Amministratore"
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: 'rgba(46,125,50,0.08)',
                      color: '#2e7d32',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Quick Stats */}
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>Ultimo accesso</Typography>
                    <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.85rem' }}>
                      {formatDate(profile.lastLogin)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>Membro dal</Typography>
                    <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.85rem' }}>
                      {formatDate(profile.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>Stato</Typography>
                    <StatusBadge active={true} />
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Quick Actions */}
                <Stack spacing={1}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={fetchProfile}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      borderColor: '#e5e7eb',
                      color: '#6b7280',
                      '&:hover': { borderColor: '#2e7d32', color: '#2e7d32' },
                    }}
                  >
                    Aggiorna Profilo
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Logout />}
                    onClick={() => setShowLogoutDialog(true)}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      borderColor: '#ff4444',
                      color: '#ff4444',
                      '&:hover': { borderColor: '#cc0000', backgroundColor: 'rgba(255,68,68,0.04)' },
                    }}
                  >
                    Esci
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} md={9}>
              <Paper
                sx={{
                  borderRadius: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  border: '1px solid #f0f0f0',
                  overflow: 'hidden',
                }}
              >
                {/* Tabs */}
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    borderBottom: '1px solid #f0f0f0',
                    px: 3,
                    pt: 2,
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      minHeight: 48,
                      color: '#6b7280',
                      '&.Mui-selected': {
                        color: '#2e7d32',
                      },
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#2e7d32',
                      height: 3,
                      borderRadius: '2px',
                    },
                  }}
                >
                  <Tab icon={<AccountCircle sx={{ fontSize: 20 }} />} label="Profilo" iconPosition="start" />
                  <Tab icon={<Lock sx={{ fontSize: 20 }} />} label="Sicurezza" iconPosition="start" />
                  <Tab icon={<Settings sx={{ fontSize: 20 }} />} label="Preferenze" iconPosition="start" />
                  <Tab icon={<Assessment sx={{ fontSize: 20 }} />} label="Attività" iconPosition="start" />
                </Tabs>

                {/* Profile Tab */}
                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 3 }}>
                      Modifica Profilo
                    </Typography>
                    <Typography sx={{ color: '#6b7280', mb: 4, fontSize: '0.95rem' }}>
                      Aggiorna le tue informazioni personali e la foto del profilo
                    </Typography>

                    <form onSubmit={handleProfileSubmit}>
                      <Grid container spacing={3}>
                        {/* Profile Image */}
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                            <Avatar
                              src={imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileForm.name)}&background=2e7d32&color=fff&size=128`}
                              sx={{
                                width: 100,
                                height: 100,
                                border: '3px solid #e5e7eb',
                              }}
                            />
                            <Box>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                id="profileImageUpload"
                              />
                              <label htmlFor="profileImageUpload">
                                <Button
                                  component="span"
                                  variant="outlined"
                                  startIcon={<CloudUpload />}
                                  sx={{
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    borderColor: '#e5e7eb',
                                    '&:hover': { borderColor: '#2e7d32' },
                                  }}
                                >
                                  Cambia Foto
                                </Button>
                              </label>
                              {imageFile && (
                                <Typography sx={{ color: '#2e7d32', fontSize: '0.85rem', mt: 1 }}>
                                  Nuova immagine selezionata
                                </Typography>
                              )}
                              <Typography sx={{ color: '#6b7280', fontSize: '0.75rem', mt: 0.5 }}>
                                Consigliato: Immagine quadrata, max 5MB
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        {/* Name */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Nome Completo *"
                            name="name"
                            value={profileForm.name}
                            onChange={handleProfileChange}
                            error={!!profileErrors.name}
                            helperText={profileErrors.name}
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                            }}
                          />
                        </Grid>

                        {/* Email */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Indirizzo Email *"
                            name="email"
                            type="email"
                            value={profileForm.email}
                            onChange={handleProfileChange}
                            error={!!profileErrors.email}
                            helperText={profileErrors.email}
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                            }}
                          />
                        </Grid>

                        {/* Date of Birth */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Data di Nascita *"
                            name="dateOfBirth"
                            type="date"
                            value={profileForm.dateOfBirth}
                            onChange={handleProfileChange}
                            error={!!profileErrors.dateOfBirth}
                            helperText={profileErrors.dateOfBirth}
                            required
                            InputLabelProps={{ shrink: true }}
                            sx={{
                              '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                            }}
                          />
                        </Grid>

                        {/* Gender */}
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth error={!!profileErrors.gender} required>
                            <InputLabel>Genere *</InputLabel>
                            <Select
                              name="gender"
                              value={profileForm.gender}
                              onChange={handleProfileChange}
                              label="Genere *"
                              sx={{ borderRadius: '12px' }}
                            >
                              <MenuItem value="male">Maschio</MenuItem>
                              <MenuItem value="female">Femmina</MenuItem>
                              <MenuItem value="other">Altro</MenuItem>
                            </Select>
                            {profileErrors.gender && (
                              <Typography variant="caption" color="error">
                                {profileErrors.gender}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>

                        {/* Action Buttons */}
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                              type="button"
                              onClick={() => {
                                setProfileForm({
                                  name: profile.name || '',
                                  email: profile.email || '',
                                  dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
                                  gender: profile.gender || '',
                                });
                                setImagePreview(profile.image ? `http://localhost:5000${profile.image}` : null);
                                setImageFile(null);
                                setProfileErrors({});
                              }}
                              sx={{
                                borderRadius: '12px',
                                textTransform: 'none',
                                color: '#6b7280',
                                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                              }}
                            >
                              Reimposta
                            </Button>
                            <Button
                              type="submit"
                              variant="contained"
                              disabled={submitting}
                              startIcon={<Save />}
                              sx={{
                                backgroundColor: '#2e7d32',
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 4,
                                '&:hover': { backgroundColor: '#1b5e20' },
                                '&:disabled': { backgroundColor: '#6b7280' },
                              }}
                            >
                              {submitting ? 'Salvataggio...' : 'Salva Modifiche'}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </form>
                  </Box>
                </TabPanel>

                {/* Security Tab */}
                <TabPanel value={tabValue} index={1}>
                  <Box sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 3 }}>
                      Impostazioni di Sicurezza
                    </Typography>
                    <Typography sx={{ color: '#6b7280', mb: 4, fontSize: '0.95rem' }}>
                      Modifica la password e gestisci la sicurezza dell'account
                    </Typography>

                    {/* Change Password */}
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: '12px',
                        border: '1px solid #f0f0f0',
                        mb: 4,
                      }}
                    >
                      <Typography sx={{ fontWeight: 600, color: '#1a1a2e', mb: 2 }}>
                        Cambia Password
                      </Typography>

                      <form onSubmit={handlePasswordSubmit}>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Password Attuale *"
                              name="currentPassword"
                              type={showPassword ? 'text' : 'password'}
                              value={passwordForm.currentPassword}
                              onChange={handlePasswordChange}
                              error={!!passwordErrors.currentPassword}
                              helperText={passwordErrors.currentPassword}
                              required
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => setShowPassword(!showPassword)}
                                      edge="end"
                                    >
                                      {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Nuova Password *"
                              name="newPassword"
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordForm.newPassword}
                              onChange={handlePasswordChange}
                              error={!!passwordErrors.newPassword}
                              helperText={passwordErrors.newPassword}
                              required
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => setShowNewPassword(!showNewPassword)}
                                      edge="end"
                                    >
                                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Conferma Nuova Password *"
                              name="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={passwordForm.confirmPassword}
                              onChange={handlePasswordChange}
                              error={!!passwordErrors.confirmPassword}
                              helperText={passwordErrors.confirmPassword}
                              required
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                      edge="end"
                                    >
                                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                              }}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <Button
                                type="submit"
                                variant="contained"
                                disabled={submitting}
                                startIcon={<Security />}
                                sx={{
                                  backgroundColor: '#2e7d32',
                                  borderRadius: '12px',
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  px: 4,
                                  '&:hover': { backgroundColor: '#1b5e20' },
                                  '&:disabled': { backgroundColor: '#6b7280' },
                                }}
                              >
                                {submitting ? 'Aggiornamento...' : 'Aggiorna Password'}
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </form>
                    </Paper>

                    {/* Account Danger Zone */}
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: '12px',
                        border: '1px solid #ff4444',
                        backgroundColor: 'rgba(255,68,68,0.02)',
                      }}
                    >
                      <Typography sx={{ fontWeight: 700, color: '#ff4444', mb: 1 }}>
                        Zona Pericolosa
                      </Typography>
                      <Typography sx={{ color: '#6b7280', fontSize: '0.95rem', mb: 2 }}>
                        Elimina definitivamente il tuo account e tutti i dati associati
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => setShowDeleteDialog(true)}
                        sx={{
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Elimina Account
                      </Button>
                    </Paper>
                  </Box>
                </TabPanel>

                {/* Preferences Tab */}
                <TabPanel value={tabValue} index={2}>
                  <Box sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 3 }}>
                      Preferenze
                    </Typography>
                    <Typography sx={{ color: '#6b7280', mb: 4, fontSize: '0.95rem' }}>
                      Personalizza la tua esperienza da amministratore
                    </Typography>

                    <Grid container spacing={3}>
                      {/* Theme */}
                      <Grid item xs={12}>
                        <Paper
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            border: '1px solid #f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {settings.theme === 'dark' ? <DarkMode /> : <LightMode />}
                            <Box>
                              <Typography sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                                Tema
                              </Typography>
                              <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                {settings.theme === 'dark' ? 'Tema scuro' : 'Tema chiaro'}
                              </Typography>
                            </Box>
                          </Box>
                          <FormControl size="small" sx={{ minWidth: 150 }}>
                            <Select
                              value={settings.theme}
                              onChange={(e) => handleSettingsChange('theme', e.target.value)}
                              sx={{ borderRadius: '10px' }}
                            >
                              <MenuItem value="light">Chiaro</MenuItem>
                              <MenuItem value="dark">Scuro</MenuItem>
                              <MenuItem value="system">Sistema</MenuItem>
                            </Select>
                          </FormControl>
                        </Paper>
                      </Grid>

                      {/* Language */}
                      <Grid item xs={12}>
                        <Paper
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            border: '1px solid #f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Translate />
                            <Box>
                              <Typography sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                                Lingua
                              </Typography>
                              <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                Scegli la tua lingua preferita
                              </Typography>
                            </Box>
                          </Box>
                          <FormControl size="small" sx={{ minWidth: 150 }}>
                            <Select
                              value={settings.language}
                              onChange={(e) => handleSettingsChange('language', e.target.value)}
                              sx={{ borderRadius: '10px' }}
                            >
                              <MenuItem value="it">Italiano</MenuItem>
                              <MenuItem value="en">English</MenuItem>
                              <MenuItem value="fr">Français</MenuItem>
                              <MenuItem value="de">Deutsch</MenuItem>
                              <MenuItem value="es">Español</MenuItem>
                            </Select>
                          </FormControl>
                        </Paper>
                      </Grid>

                      {/* Currency */}
                      <Grid item xs={12}>
                        <Paper
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            border: '1px solid #f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Euro />
                            <Box>
                              <Typography sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                                Valuta
                              </Typography>
                              <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                Valuta predefinita per i prodotti
                              </Typography>
                            </Box>
                          </Box>
                          <FormControl size="small" sx={{ minWidth: 150 }}>
                            <Select
                              value={settings.currency}
                              onChange={(e) => handleSettingsChange('currency', e.target.value)}
                              sx={{ borderRadius: '10px' }}
                            >
                              <MenuItem value="EUR">EUR (€)</MenuItem>
                              <MenuItem value="USD">USD ($)</MenuItem>
                              <MenuItem value="GBP">GBP (£)</MenuItem>
                              <MenuItem value="CHF">CHF (Fr)</MenuItem>
                            </Select>
                          </FormControl>
                        </Paper>
                      </Grid>

                      {/* Notifications */}
                      <Grid item xs={12}>
                        <Paper
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            border: '1px solid #f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Notifications />
                            <Box>
                              <Typography sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                                Notifiche Push
                              </Typography>
                              <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                Ricevi notifiche nella dashboard
                              </Typography>
                            </Box>
                          </Box>
                          <Switch
                            checked={settings.notifications}
                            onChange={(e) => handleSettingsChange('notifications', e.target.checked)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#2e7d32',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#2e7d32',
                              },
                            }}
                          />
                        </Paper>
                      </Grid>

                      {/* Email Notifications */}
                      <Grid item xs={12}>
                        <Paper
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            border: '1px solid #f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Email />
                            <Box>
                              <Typography sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                                Notifiche Email
                              </Typography>
                              <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                Ricevi aggiornamenti via email
                              </Typography>
                            </Box>
                          </Box>
                          <Switch
                            checked={settings.emailNotifications}
                            onChange={(e) => handleSettingsChange('emailNotifications', e.target.checked)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#2e7d32',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#2e7d32',
                              },
                            }}
                          />
                        </Paper>
                      </Grid>

                      {/* Two-Factor Authentication */}
                      <Grid item xs={12}>
                        <Paper
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            border: '1px solid #f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Security />
                            <Box>
                              <Typography sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                                Autenticazione a Due Fattori
                              </Typography>
                              <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                Aggiungi un ulteriore livello di sicurezza
                              </Typography>
                            </Box>
                          </Box>
                          <Switch
                            checked={settings.twoFactorAuth}
                            onChange={(e) => handleSettingsChange('twoFactorAuth', e.target.checked)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#2e7d32',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#2e7d32',
                              },
                            }}
                          />
                        </Paper>
                      </Grid>

                      {/* Auto Backup */}
                      <Grid item xs={12}>
                        <Paper
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            border: '1px solid #f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Save />
                            <Box>
                              <Typography sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                                Backup Automatico
                              </Typography>
                              <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                Backup automatico giornaliero dei dati
                              </Typography>
                            </Box>
                          </Box>
                          <Switch
                            checked={settings.autoBackup}
                            onChange={(e) => handleSettingsChange('autoBackup', e.target.checked)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#2e7d32',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#2e7d32',
                              },
                            }}
                          />
                        </Paper>
                      </Grid>

                      {/* Save Settings */}
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            variant="contained"
                            onClick={handleSettingsSave}
                            startIcon={<Save />}
                            sx={{
                              backgroundColor: '#2e7d32',
                              borderRadius: '12px',
                              textTransform: 'none',
                              fontWeight: 600,
                              px: 4,
                              '&:hover': { backgroundColor: '#1b5e20' },
                            }}
                          >
                            Salva Tutte le Impostazioni
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </TabPanel>

                {/* Activity Tab - Default Open */}
                <TabPanel value={tabValue} index={3}>
                  <Box sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 3 }}>
                      Registro Attività
                    </Typography>
                    <Typography sx={{ color: '#6b7280', mb: 4, fontSize: '0.95rem' }}>
                      Azioni recenti ed eventi di sistema
                    </Typography>

                    <Paper
                      sx={{
                        borderRadius: '12px',
                        border: '1px solid #f0f0f0',
                        overflow: 'hidden',
                      }}
                    >
                      <List>
                        {activityLog.length === 0 ? (
                          <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Assessment sx={{ fontSize: 48, color: '#e0e0e0', mb: 2 }} />
                            <Typography sx={{ color: '#6b7280' }}>Nessuna attività registrata</Typography>
                          </Box>
                        ) : (
                          activityLog.map((activity, index) => (
                            <React.Fragment key={activity.id}>
                              <ListItem
                                sx={{
                                  py: 2,
                                  px: 3,
                                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' },
                                }}
                              >
                                <ListItemIcon>
                                  {activity.action.includes('Accesso') && <Login sx={{ color: '#2e7d32' }} />}
                                  {activity.action.includes('Profilo') && <Person sx={{ color: '#1976d2' }} />}
                                  {activity.action.includes('Password') && <Lock sx={{ color: '#ff9800' }} />}
                                  {activity.action.includes('Prodotto') && <Storefront sx={{ color: '#9c27b0' }} />}
                                  {!activity.action.includes('Accesso') && 
                                   !activity.action.includes('Profilo') && 
                                   !activity.action.includes('Password') && 
                                   !activity.action.includes('Prodotto') && 
                                   <Settings sx={{ color: '#6b7280' }} />}
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Typography sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                                      {activity.action}
                                    </Typography>
                                  }
                                  secondary={
                                    <>
                                      <Typography component="span" variant="body2" color="textSecondary">
                                        {activity.details}
                                      </Typography>
                                      <Typography
                                        component="span"
                                        sx={{
                                          display: 'block',
                                          fontSize: '0.7rem',
                                          color: '#6b7280',
                                          mt: 0.5,
                                        }}
                                      >
                                        {formatDate(activity.timestamp)}
                                      </Typography>
                                    </>
                                  }
                                />
                              </ListItem>
                              {index < activityLog.length - 1 && <Divider />}
                            </React.Fragment>
                          ))
                        )}
                      </List>
                    </Paper>
                  </Box>
                </TabPanel>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Delete Account Confirmation Dialog */}
        <Dialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: '24px',
              maxWidth: 440,
              width: '100%',
              p: 0,
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
            },
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)',
              p: 4,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
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
                <ErrorIcon sx={{ fontSize: 44, color: '#ffffff' }} />
              </Box>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.9rem',
                  mt: 1,
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                Questa azione non può essere annullata
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            <Box
              sx={{
                p: 2,
                backgroundColor: 'rgba(255,68,68,0.04)',
                borderRadius: '12px',
                border: '1px solid rgba(255,68,68,0.08)',
                mb: 3,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  color: '#1a1a2e',
                  fontSize: '0.95rem',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                Sei sicuro di voler eliminare il tuo account?
              </Typography>
              <Typography
                sx={{
                  color: '#6b7280',
                  fontSize: '0.85rem',
                  mt: 1,
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                Questo eliminerà permanentemente tutti i tuoi dati, inclusi profilo,
                impostazioni e tutti i dati associati.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                fullWidth
                onClick={() => setShowDeleteDialog(false)}
                sx={{
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#6b7280',
                  py: 1.4,
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  '&:hover': { backgroundColor: '#f8f9fa' },
                }}
              >
                Annulla
              </Button>
              <Button
                fullWidth
                onClick={handleDeleteAccount}
                variant="contained"
                sx={{
                  backgroundColor: '#ff4444',
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.4,
                  boxShadow: '0 4px 16px rgba(255,68,68,0.25)',
                  '&:hover': {
                    backgroundColor: '#cc0000',
                    boxShadow: '0 6px 24px rgba(255,68,68,0.35)',
                  },
                }}
              >
                Sì, Elimina il Mio Account
              </Button>
            </Box>
          </Box>
        </Dialog>

        {/* Logout Confirmation Dialog */}
        <Dialog
          open={showLogoutDialog}
          onClose={() => setShowLogoutDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: '24px',
              maxWidth: 400,
              width: '100%',
              p: 0,
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
            },
          }}
        >
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'rgba(46,125,50,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Logout sx={{ fontSize: 44, color: '#2e7d32' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>
              Conferma Uscita
            </Typography>
            <Typography sx={{ color: '#6b7280', mb: 3 }}>
              Sei sicuro di voler uscire? Dovrai effettuare nuovamente il login per accedere al pannello di amministrazione.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                fullWidth
                onClick={() => setShowLogoutDialog(false)}
                sx={{
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#6b7280',
                  py: 1.4,
                  border: '1px solid #e5e7eb',
                  '&:hover': { backgroundColor: '#f8f9fa' },
                }}
              >
                Rimani Connesso
              </Button>
              <Button
                fullWidth
                onClick={handleLogout}
                variant="contained"
                sx={{
                  backgroundColor: '#2e7d32',
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.4,
                  boxShadow: '0 4px 16px rgba(46,125,50,0.25)',
                  '&:hover': {
                    backgroundColor: '#1b5e20',
                    boxShadow: '0 6px 24px rgba(46,125,50,0.35)',
                  },
                }}
              >
                Esci
              </Button>
            </Box>
          </Box>
        </Dialog>

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

export default AdminSettings;