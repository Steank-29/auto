// src/pages/AdminContact.jsx
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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  TablePagination,
  Card,
  CardContent,
  Divider,
  Collapse,
  Checkbox,
  Stack,
  Tabs,
  Tab,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
} from '@mui/material';
import {
  Email,
  Person,
  Subject,
  Message,
  Delete,
  Search,
  Close,
  Error as ErrorIcon,
  Refresh,
  CheckCircle,
  Warning,
  Cancel,
  FilterList,
  Visibility,
  VisibilityOff,
  Reply,
  Archive,
  Unarchive,
  MarkEmailRead,
  MarkEmailUnread,
  AccessTime,
  Phone,
  LocationOn,
  CalendarToday,
  MoreVert,
  Check,
  Clear,
  Download,
  Print,
  Star,
  StarBorder,
  Send,
  Drafts,
  Inbox,
  DoneAll,
  Schedule,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axiosInstance from '../utils/axiosConfig';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const AdminContact = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalMessages, setTotalMessages] = useState(0);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    read: 0,
    replied: 0,
    archived: 0,
  });
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyData, setReplyData] = useState({
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [expandedMessage, setExpandedMessage] = useState(null);

  // Status options
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: '#ed6c02', icon: <Schedule /> },
    { value: 'read', label: 'Read', color: '#1976d2', icon: <Drafts /> },
    { value: 'replied', label: 'Replied', color: '#2e7d32', icon: <Send /> },
    { value: 'archived', label: 'Archived', color: '#6b7280', icon: <Archive /> },
  ];

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMessages();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, page, rowsPerPage, filters, selectedTab]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/contact/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      let url = '/contact';
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      
      // Filter by status based on tab
      const statusMap = ['pending', 'read', 'replied', 'archived'];
      if (selectedTab > 0 && selectedTab <= 4) {
        params.append('status', statusMap[selectedTab - 1]);
      }
      
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      
      params.append('page', page + 1);
      params.append('limit', rowsPerPage);
      
      if (params.toString()) url += `?${params.toString()}`;

      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setMessages(response.data.data);
        setTotalMessages(response.data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      showSnackbar('Errore nel caricamento dei messaggi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPage(0);
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      dateFrom: '',
      dateTo: '',
    });
    setSearchTerm('');
    setPage(0);
    setSelectedTab(0);
  };

  const handleOpenDialog = (message) => {
    setSelectedMessage(message);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMessage(null);
  };

  const handleViewMessage = async (message) => {
    // Mark as read if pending
    if (message.status === 'pending') {
      try {
        await axiosInstance.put(`/contact/${message._id}/status`, { status: 'read' });
        fetchMessages();
        fetchStats();
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
    setSelectedMessage(message);
    setOpenDialog(true);
  };

  const handleDeleteClick = (message) => {
    setMessageToDelete(message);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/contact/${messageToDelete._id}`);
      showSnackbar('Messaggio eliminato con successo!', 'success');
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error deleting message:', error);
      showSnackbar('Errore nell\'eliminazione del messaggio', 'error');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMessages.length === 0) {
      showSnackbar('Seleziona almeno un messaggio da eliminare', 'warning');
      return;
    }
    setDeleteMultipleOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      // Delete one by one or use bulk endpoint
      for (const id of selectedMessages) {
        await axiosInstance.delete(`/contact/${id}`);
      }
      showSnackbar(`${selectedMessages.length} messaggi eliminati con successo!`, 'success');
      setSelectedMessages([]);
      setSelectAll(false);
      setDeleteMultipleOpen(false);
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error deleting messages:', error);
      showSnackbar('Errore nell\'eliminazione dei messaggi', 'error');
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = messages.map(m => m._id);
      setSelectedMessages(allIds);
      setSelectAll(true);
    } else {
      setSelectedMessages([]);
      setSelectAll(false);
    }
  };

  const handleSelectMessage = (messageId) => {
    setSelectedMessages(prev => {
      if (prev.includes(messageId)) {
        return prev.filter(id => id !== messageId);
      } else {
        return [...prev, messageId];
      }
    });
  };

  const handleStatusChange = async (messageId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/contact/${messageId}/status`, { status: newStatus });
      if (response.data.success) {
        showSnackbar(`Stato aggiornato a "${statusOptions.find(s => s.value === newStatus)?.label}"`, 'success');
        fetchMessages();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showSnackbar('Errore nell\'aggiornamento dello stato', 'error');
    }
  };

  const handleReplyOpen = (message) => {
    setSelectedMessage(message);
    setReplyData({
      subject: `Re: ${message.subject}`,
      message: `\n\n--- Messaggio originale ---\nDa: ${message.name}\nEmail: ${message.email}\n\n${message.message}`,
    });
    setReplyDialogOpen(true);
  };

  const handleReplySubmit = async () => {
    if (!replyData.message.trim()) {
      showSnackbar('Inserisci il messaggio di risposta', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      // Send reply email via backend
      await axiosInstance.post('/contact/reply', {
        messageId: selectedMessage._id,
        to: selectedMessage.email,
        subject: replyData.subject,
        message: replyData.message,
      });

      // Update status to replied
      await axiosInstance.put(`/contact/${selectedMessage._id}/status`, { status: 'replied' });

      showSnackbar('Risposta inviata con successo!', 'success');
      setReplyDialogOpen(false);
      setReplyData({ subject: '', message: '' });
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error sending reply:', error);
      showSnackbar('Errore nell\'invio della risposta', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status) => {
    const statusMap = {
      pending: { label: 'In Attesa', color: '#ed6c02', bg: 'rgba(237,108,2,0.08)' },
      read: { label: 'Letto', color: '#1976d2', bg: 'rgba(25,118,210,0.08)' },
      replied: { label: 'Risposto', color: '#2e7d32', bg: 'rgba(46,125,50,0.08)' },
      archived: { label: 'Archiviato', color: '#6b7280', bg: 'rgba(107,114,128,0.08)' },
    };
    const info = statusMap[status] || statusMap.pending;
    return (
      <Chip
        label={info.label}
        size="small"
        sx={{
          backgroundColor: info.bg,
          color: info.color,
          fontWeight: 600,
          fontSize: '0.7rem',
        }}
      />
    );
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      pending: <Schedule sx={{ fontSize: 16 }} />,
      read: <Drafts sx={{ fontSize: 16 }} />,
      replied: <Send sx={{ fontSize: 16 }} />,
      archived: <Archive sx={{ fontSize: 16 }} />,
    };
    return iconMap[status] || iconMap.pending;
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: it });
  };

  const getTabLabel = (label, count) => {
    return (
      <Badge badgeContent={count} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 18, minWidth: 18 } }}>
        {label}
      </Badge>
    );
  };

  return (
    <>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
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
            Gestione Messaggi
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              color: '#6b7280',
              fontSize: '0.95rem',
            }}
          >
            Gestisci i messaggi dei clienti dal modulo di contatto
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[
            { label: 'Totale', value: stats.total, icon: <Inbox />, color: '#1976d2' },
            { label: 'In Attesa', value: stats.pending, icon: <Schedule />, color: '#ed6c02' },
            { label: 'Letti', value: stats.read, icon: <Drafts />, color: '#1976d2' },
            { label: 'Risposti', value: stats.replied, icon: <Send />, color: '#2e7d32' },
            { label: 'Archiviati', value: stats.archived, icon: <Archive />, color: '#6b7280' },
          ].map((stat, index) => (
            <Grid item xs={6} sm={4} md={2.4} key={index}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography
                      sx={{
                        color: '#6b7280',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: '#1a1a2e',
                        fontSize: '1.5rem',
                        mt: 0.5,
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: alpha(stat.color, 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Search and Controls */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            border: '1px solid #f0f0f0',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            {/* Left side - Message count */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ color: '#2e7d32', fontSize: 20 }} />
                <Typography
                  sx={{
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    fontWeight: 600,
                    color: '#1a1a2e',
                    fontSize: '0.9rem',
                  }}
                >
                  Totale Messaggi:
                </Typography>
                <Chip
                  label={totalMessages}
                  size="small"
                  sx={{
                    backgroundColor: '#2e7d32',
                    color: '#ffffff',
                    fontWeight: 700,
                    minWidth: 32,
                  }}
                />
              </Box>
            </Grid>

            {/* Center - Search */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Cerca per nome, email, oggetto o messaggio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#f8f9fa',
                    '&:hover': { backgroundColor: '#f0f0f0' },
                    '&.Mui-focused': { backgroundColor: '#fff' },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#6b7280', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton 
                        size="small" 
                        onClick={() => setSearchTerm('')}
                        sx={{ 
                          backgroundColor: 'rgba(0,0,0,0.04)',
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.08)' },
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Right side - Controls */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setShowFilters(!showFilters)}
                  size="small"
                  sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    borderColor: showFilters ? '#2e7d32' : '#e5e7eb',
                    color: showFilters ? '#2e7d32' : '#6b7280',
                    backgroundColor: showFilters ? 'rgba(46,125,50,0.04)' : 'transparent',
                    '&:hover': { 
                      borderColor: '#2e7d32', 
                      color: '#2e7d32',
                    },
                  }}
                >
                  {showFilters ? 'Nascondi Filtri' : 'Filtri'}
                </Button>

                {selectedMessages.length > 0 && (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleBulkDelete}
                    size="small"
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      fontWeight: 600,
                      backgroundColor: '#ff4444',
                      '&:hover': { backgroundColor: '#cc0000' },
                    }}
                  >
                    Elimina ({selectedMessages.length})
                  </Button>
                )}

                <Tooltip title="Aggiorna">
                  <IconButton 
                    onClick={() => { fetchMessages(); fetchStats(); }} 
                    size="small" 
                    sx={{ 
                      color: '#6b7280',
                      '&:hover': { 
                        color: '#2e7d32',
                        backgroundColor: 'rgba(46,125,50,0.04)',
                      },
                    }}
                  >
                    <Refresh fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Esporta CSV">
                  <IconButton 
                    size="small" 
                    sx={{ 
                      color: '#6b7280',
                      '&:hover': { 
                        color: '#2e7d32',
                        backgroundColor: 'rgba(46,125,50,0.04)',
                      },
                    }}
                  >
                    <Download fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Filters */}
        <Collapse in={showFilters}>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              border: '1px solid #f0f0f0',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Stato</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    label="Stato"
                    sx={{ borderRadius: '10px' }}
                  >
                    <MenuItem value="all">Tutti gli stati</MenuItem>
                    {statusOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Data da"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Data a"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      setPage(0);
                      fetchMessages();
                    }}
                    sx={{
                      borderRadius: '10px',
                      backgroundColor: '#2e7d32',
                      '&:hover': { backgroundColor: '#1b5e20' },
                      textTransform: 'none',
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    }}
                  >
                    Applica
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleResetFilters}
                    sx={{
                      borderRadius: '10px',
                      borderColor: '#e5e7eb',
                      color: '#6b7280',
                      '&:hover': { borderColor: '#ff4444', color: '#ff4444' },
                      textTransform: 'none',
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    }}
                  >
                    Reset
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                minHeight: 48,
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              },
              '& .Mui-selected': {
                color: '#2e7d32',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#2e7d32',
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab label={getTabLabel('Tutti', stats.total)} />
            <Tab label={getTabLabel('In Attesa', stats.pending)} />
            <Tab label={getTabLabel('Letti', stats.read)} />
            <Tab label={getTabLabel('Risposti', stats.replied)} />
            <Tab label={getTabLabel('Archiviati', stats.archived)} />
          </Tabs>
        </Box>

        {/* Messages Table */}
        <Paper
          sx={{
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            border: '1px solid #f0f0f0',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <Box sx={{ p: 4 }}>
              <LinearProgress sx={{ borderRadius: '8px' }} />
              <Typography sx={{ mt: 2, textAlign: 'center', color: '#6b7280' }}>
                Caricamento messaggi...
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectAll}
                          onChange={handleSelectAll}
                          sx={{
                            color: '#6b7280',
                            '&.Mui-checked': { color: '#2e7d32' },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Da
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Oggetto
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Data
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Stato
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
                        Azioni
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {messages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Email sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600 }}>
                              Nessun messaggio trovato
                            </Typography>
                            <Typography sx={{ color: '#6b7280' }}>
                              {searchTerm ? 'Prova a modificare la ricerca' : 'Nessun messaggio da visualizzare'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      messages.map((message) => (
                        <TableRow
                          key={message._id}
                          sx={{
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' },
                            transition: 'background-color 0.2s ease',
                            backgroundColor: message.status === 'pending' ? 'rgba(237,108,2,0.03)' : 'transparent',
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedMessages.includes(message._id)}
                              onChange={() => handleSelectMessage(message._id)}
                              sx={{
                                color: '#6b7280',
                                '&.Mui-checked': { color: '#2e7d32' },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                sx={{
                                  width: 36,
                                  height: 36,
                                  bgcolor: alpha('#2e7d32', 0.1),
                                  color: '#2e7d32',
                                  fontWeight: 600,
                                  fontSize: '0.8rem',
                                }}
                              >
                                {message.name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography
                                  sx={{
                                    fontWeight: 600,
                                    color: '#1a1a2e',
                                    fontSize: '0.85rem',
                                  }}
                                >
                                  {message.name}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: '#6b7280',
                                    fontSize: '0.75rem',
                                  }}
                                >
                                  {message.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography
                                sx={{
                                  fontWeight: message.status === 'pending' ? 700 : 500,
                                  color: '#1a1a2e',
                                  fontSize: '0.85rem',
                                }}
                              >
                                {message.subject}
                              </Typography>
                              <Typography
                                sx={{
                                  color: '#6b7280',
                                  fontSize: '0.75rem',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {message.message}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CalendarToday sx={{ fontSize: 14, color: '#6b7280' }} />
                              <Typography sx={{ color: '#6b7280', fontSize: '0.8rem' }}>
                                {formatDate(message.createdAt)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {getStatusChip(message.status)}
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                              <Tooltip title="Visualizza">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewMessage(message)}
                                  sx={{
                                    color: '#1976d2',
                                    '&:hover': { backgroundColor: 'rgba(25,118,210,0.08)' },
                                  }}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Rispondi">
                                <IconButton
                                  size="small"
                                  onClick={() => handleReplyOpen(message)}
                                  sx={{
                                    color: '#2e7d32',
                                    '&:hover': { backgroundColor: 'rgba(46,125,50,0.08)' },
                                  }}
                                >
                                  <Reply fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Elimina">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteClick(message)}
                                  sx={{
                                    color: '#ff4444',
                                    '&:hover': { backgroundColor: 'rgba(255,68,68,0.08)' },
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cambia stato">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    const currentIndex = statusOptions.findIndex(s => s.value === message.status);
                                    const nextIndex = (currentIndex + 1) % statusOptions.length;
                                    handleStatusChange(message._id, statusOptions[nextIndex].value);
                                  }}
                                  sx={{
                                    color: '#6b7280',
                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                                  }}
                                >
                                  {getStatusIcon(message.status)}
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={totalMessages}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Messaggi per pagina:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} di ${count}`}
                sx={{
                  borderTop: '1px solid #f0f0f0',
                  '& .MuiTablePagination-select': {
                    borderRadius: '8px',
                  },
                }}
              />
            </>
          )}
        </Paper>
      </Box>

      {/* View Message Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            maxHeight: '90vh',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          },
        }}
      >
        {selectedMessage && (
          <>
            <DialogTitle sx={{ pb: 1, pt: 3, px: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                      {selectedMessage.subject}
                    </Typography>
                    {getStatusChip(selectedMessage.status)}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person sx={{ fontSize: 16, color: '#6b7280' }} />
                      <Typography sx={{ color: '#1a1a2e', fontWeight: 500 }}>
                        {selectedMessage.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email sx={{ fontSize: 16, color: '#6b7280' }} />
                      <Typography sx={{ color: '#1976d2' }}>
                        {selectedMessage.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday sx={{ fontSize: 16, color: '#6b7280' }} />
                      <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>
                        {formatDate(selectedMessage.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <IconButton 
                  onClick={handleCloseDialog} 
                  sx={{ 
                    color: '#6b7280',
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.08)' },
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ pt: 3, px: 4 }}>
              {/* Message Content */}
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #f0f0f0',
                  mb: 3,
                }}
              >
                <Typography
                  sx={{
                    whiteSpace: 'pre-wrap',
                    color: '#1a1a2e',
                    lineHeight: 1.8,
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  }}
                >
                  {selectedMessage.message}
                </Typography>
              </Paper>

              {/* Additional Info */}
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      mb: 1,
                    }}
                  >
                    Informazioni
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime sx={{ fontSize: 14, color: '#6b7280' }} />
                      <Typography sx={{ fontSize: '0.85rem', color: '#1a1a2e' }}>
                        Ricevuto: {formatDate(selectedMessage.createdAt)}
                      </Typography>
                    </Box>
                    {selectedMessage.ipAddress && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ fontSize: 14, color: '#6b7280' }} />
                        <Typography sx={{ fontSize: '0.85rem', color: '#1a1a2e' }}>
                          IP: {selectedMessage.ipAddress}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      mb: 1,
                    }}
                  >
                    Azioni Rapide
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Reply />}
                      onClick={() => {
                        handleCloseDialog();
                        handleReplyOpen(selectedMessage);
                      }}
                      sx={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        borderColor: '#2e7d32',
                        color: '#2e7d32',
                        '&:hover': { backgroundColor: 'rgba(46,125,50,0.04)' },
                      }}
                    >
                      Rispondi
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Archive />}
                      onClick={() => {
                        const newStatus = selectedMessage.status === 'archived' ? 'read' : 'archived';
                        handleStatusChange(selectedMessage._id, newStatus);
                        handleCloseDialog();
                      }}
                      sx={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        borderColor: '#6b7280',
                        color: '#6b7280',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                      }}
                    >
                      {selectedMessage.status === 'archived' ? 'Ripristina' : 'Archivia'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => {
                        handleCloseDialog();
                        handleDeleteClick(selectedMessage);
                      }}
                      sx={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        borderColor: '#ff4444',
                        color: '#ff4444',
                        '&:hover': { backgroundColor: 'rgba(255,68,68,0.04)' },
                      }}
                    >
                      Elimina
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, px: 4, gap: 1, borderTop: '1px solid #f0f0f0' }}>
              <Button
                onClick={handleCloseDialog}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  color: '#6b7280',
                  px: 3,
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                }}
              >
                Chiudi
              </Button>
              <Button
                onClick={() => {
                  handleCloseDialog();
                  handleReplyOpen(selectedMessage);
                }}
                variant="contained"
                startIcon={<Reply />}
                sx={{
                  backgroundColor: '#2e7d32',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  fontWeight: 600,
                  px: 4,
                  '&:hover': { backgroundColor: '#1b5e20' },
                }}
              >
                Rispondi
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Reply Dialog */}
      <Dialog
        open={replyDialogOpen}
        onClose={() => setReplyDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            maxHeight: '90vh',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3, px: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                Rispondi al Messaggio
              </Typography>
              <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', mt: 0.5 }}>
                Rispondi a {selectedMessage?.name} ({selectedMessage?.email})
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setReplyDialogOpen(false)} 
              sx={{ 
                color: '#6b7280',
                backgroundColor: 'rgba(0,0,0,0.04)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.08)' },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 3, px: 4 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Oggetto"
                value={replyData.subject}
                onChange={(e) => setReplyData(prev => ({ ...prev, subject: e.target.value }))}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={10}
                label="Messaggio"
                value={replyData.message}
                onChange={(e) => setReplyData(prev => ({ ...prev, message: e.target.value }))}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                placeholder="Scrivi la tua risposta qui..."
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, px: 4, gap: 1, borderTop: '1px solid #f0f0f0' }}>
          <Button
            onClick={() => setReplyDialogOpen(false)}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              color: '#6b7280',
              px: 3,
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
            }}
          >
            Annulla
          </Button>
          <Button
            onClick={handleReplySubmit}
            variant="contained"
            disabled={isSubmitting || !replyData.message.trim()}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
            sx={{
              backgroundColor: '#2e7d32',
              borderRadius: '12px',
              textTransform: 'none',
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              fontWeight: 600,
              px: 4,
              '&:hover': { backgroundColor: '#1b5e20' },
              '&:disabled': { backgroundColor: '#6b7280' },
            }}
          >
            {isSubmitting ? 'Invio in corso...' : 'Invia Risposta'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Single Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
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
                mt: 0.5,
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
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              p: 2,
              backgroundColor: 'rgba(255,68,68,0.04)',
              borderRadius: '12px',
              border: '1px solid rgba(255,68,68,0.08)',
              mb: 3,
            }}
          >
            <Box
              sx={{
                minWidth: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,68,68,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ErrorIcon sx={{ fontSize: 20, color: '#ff4444' }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: '#1a1a2e',
                  fontSize: '0.95rem',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                Eliminare questo messaggio?
              </Typography>
              <Typography
                sx={{
                  color: '#6b7280',
                  fontSize: '0.85rem',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  mt: 0.5,
                }}
              >
                Da: {messageToDelete?.name} • {messageToDelete?.subject}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              p: 2,
              backgroundColor: 'rgba(255,68,68,0.03)',
              borderRadius: '12px',
              border: '1px dashed rgba(255,68,68,0.2)',
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: '0.8rem',
                color: '#6b7280',
                textAlign: 'center',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                lineHeight: 1.6,
              }}
            >
              <span style={{ fontWeight: 700, color: '#ff4444' }}>Attenzione:</span> Questo eliminerà
              permanentemente il messaggio e tutti i dati associati.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              fullWidth
              onClick={() => setDeleteDialogOpen(false)}
              sx={{
                borderRadius: '14px',
                textTransform: 'none',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                fontWeight: 600,
                color: '#6b7280',
                py: 1.4,
                border: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                '&:hover': {
                  backgroundColor: '#f8f9fa',
                  borderColor: '#d1d5db',
                },
              }}
            >
              Annulla
            </Button>
            <Button
              fullWidth
              onClick={handleDeleteConfirm}
              variant="contained"
              sx={{
                backgroundColor: '#ff4444',
                borderRadius: '14px',
                textTransform: 'none',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                fontWeight: 600,
                py: 1.4,
                boxShadow: '0 4px 16px rgba(255,68,68,0.25)',
                '&:hover': {
                  backgroundColor: '#cc0000',
                  boxShadow: '0 6px 24px rgba(255,68,68,0.35)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Sì, Elimina
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Delete Multiple Confirmation Dialog */}
      <Dialog
        open={deleteMultipleOpen}
        onClose={() => setDeleteMultipleOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            maxWidth: 480,
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
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              backgroundColor: 'rgba(255,68,68,0.04)',
              borderRadius: '12px',
              border: '1px solid rgba(255,68,68,0.08)',
              mb: 3,
            }}
          >
            <Box
              sx={{
                minWidth: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,68,68,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ErrorIcon sx={{ fontSize: 22, color: '#ff4444' }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: '#1a1a2e',
                  fontSize: '0.95rem',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                Eliminazione multipla
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: '#ff4444',
                  fontSize: '1.1rem',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  mt: 0.5,
                }}
              >
                {selectedMessages.length} messaggi selezionati
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              p: 2,
              backgroundColor: 'rgba(255,68,68,0.03)',
              borderRadius: '12px',
              border: '1px dashed rgba(255,68,68,0.2)',
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: '0.8rem',
                color: '#6b7280',
                textAlign: 'center',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                lineHeight: 1.6,
              }}
            >
              <span style={{ fontWeight: 700, color: '#ff4444' }}>Attenzione:</span> Questo eliminerà
              permanentemente tutti i {selectedMessages.length} messaggi selezionati.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              fullWidth
              onClick={() => setDeleteMultipleOpen(false)}
              sx={{
                borderRadius: '14px',
                textTransform: 'none',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                fontWeight: 600,
                color: '#6b7280',
                py: 1.4,
                border: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                '&:hover': {
                  backgroundColor: '#f8f9fa',
                  borderColor: '#d1d5db',
                },
              }}
            >
              Annulla
            </Button>
            <Button
              fullWidth
              onClick={handleBulkDeleteConfirm}
              variant="contained"
              sx={{
                backgroundColor: '#ff4444',
                borderRadius: '14px',
                textTransform: 'none',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                fontWeight: 600,
                py: 1.4,
                boxShadow: '0 4px 16px rgba(255,68,68,0.25)',
                '&:hover': {
                  backgroundColor: '#cc0000',
                  boxShadow: '0 6px 24px rgba(255,68,68,0.35)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Sì, Elimina Tutti
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
    </>
  );
};

export default AdminContact;