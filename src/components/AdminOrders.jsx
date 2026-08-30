// src/pages/AdminOrders.jsx
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
} from '@mui/material';
import {
  Search,
  Close,
  Refresh,
  CheckCircle,
  Warning,
  Cancel,
  FilterList,
  LocalShipping,
  Receipt,
  Person,
  Email,
  Phone,
  Home,
  Euro,
  Inventory,
  TrendingUp,
  TrendingDown,
  CalendarToday,
  Visibility,
  Delete,
  Edit,
  Print,
  Download,
  ArrowBack,
  ArrowForward,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axiosInstance from '../utils/axiosConfig';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const AdminOrders = () => {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState(false);
  const [deleteSingleOpen, setDeleteSingleOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    startDate: '',
    endDate: '',
    minTotal: '',
    maxTotal: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    completedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    refundedPayments: 0
  });
  const [dailySales, setDailySales] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [activeTab, setActiveTab] = useState(0);

  // Fetch orders with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, page, rowsPerPage, filters]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = '/orders/admin/orders';
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.paymentStatus && filters.paymentStatus !== 'all') params.append('paymentStatus', filters.paymentStatus);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.minTotal) params.append('minTotal', filters.minTotal);
      if (filters.maxTotal) params.append('maxTotal', filters.maxTotal);
      
      params.append('page', page + 1);
      params.append('limit', rowsPerPage);
      
      if (params.toString()) url += `?${params.toString()}`;

      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setOrders(response.data.data);
        setTotalOrders(response.data.pagination?.total || 0);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showSnackbar('Error fetching orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/orders/admin/orders/stats');
      if (response.data.success) {
        setStats(response.data.stats);
        setDailySales(response.data.dailySales || []);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      paymentStatus: 'all',
      startDate: '',
      endDate: '',
      minTotal: '',
      maxTotal: '',
    });
    setSearchTerm('');
    setPage(0);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedOrder(null);
  };

  const handleOpenStatusDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setSelectedOrder(null);
    setNewStatus('');
  };

  const handleUpdateStatus = async () => {
    try {
      const response = await axiosInstance.put(`/orders/admin/orders/${selectedOrder._id}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        showSnackbar(`Order status updated to ${newStatus}`, 'success');
        fetchOrders();
        fetchStats();
        handleCloseStatusDialog();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showSnackbar('Error updating order status', 'error');
    }
  };

  // Single Delete - Open dialog
  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setDeleteSingleOpen(true);
  };

  // Single Delete - Confirm
  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/orders/admin/orders/${orderToDelete._id}`);
      showSnackbar('Order deleted successfully!', 'success');
      setDeleteSingleOpen(false);
      setOrderToDelete(null);
      fetchOrders();
      fetchStats();
    } catch (error) {
      console.error('Error deleting order:', error);
      showSnackbar('Error deleting order', 'error');
    }
  };

  // Single Delete - Close
  const handleDeleteSingleClose = () => {
    setDeleteSingleOpen(false);
    setOrderToDelete(null);
  };

  const handleBulkDelete = async () => {
    if (selectedOrders.length === 0) {
      showSnackbar('Please select at least one order to delete', 'warning');
      return;
    }
    setDeleteMultipleOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      await axiosInstance.delete('/orders/admin/orders', {
        data: { orderIds: selectedOrders }
      });
      showSnackbar(`${selectedOrders.length} orders deleted successfully!`, 'success');
      setSelectedOrders([]);
      setSelectAll(false);
      setDeleteMultipleOpen(false);
      fetchOrders();
      fetchStats();
    } catch (error) {
      console.error('Error deleting orders:', error);
      showSnackbar('Error deleting orders', 'error');
    }
  };

  const handleBulkDeleteClose = () => {
    setDeleteMultipleOpen(false);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = orders.map(o => o._id);
      setSelectedOrders(allIds);
      setSelectAll(true);
    } else {
      setSelectedOrders([]);
      setSelectAll(false);
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      confirmed: '#1976d2',
      shipped: '#9c27b0',
      delivered: '#2e7d32',
      cancelled: '#ff4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'In Attesa',
      confirmed: 'Confermato',
      shipped: 'Spedito',
      delivered: 'Consegnato',
      cancelled: 'Annullato'
    };
    return labels[status] || status;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      completed: '#2e7d32',
      failed: '#ff4444',
      refunded: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getPaymentStatusLabel = (status) => {
    const labels = {
      pending: 'In Attesa',
      completed: 'Completato',
      failed: 'Fallito',
      refunded: 'Rimborsato'
    };
    return labels[status] || status;
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: it });
  };

  const getStatusChip = (status) => {
    const color = getStatusColor(status);
    return (
      <Chip
        label={getStatusLabel(status)}
        size="small"
        sx={{
          backgroundColor: alpha(color, 0.1),
          color: color,
          fontWeight: 600,
          fontSize: '0.7rem',
        }}
      />
    );
  };

  // Stats Cards
  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <Card
      sx={{
        borderRadius: '16px',
        border: '1px solid #f0f0f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography sx={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '1.8rem', color: '#1a1a2e', mt: 0.5 }}>
              {typeof value === 'number' && title.includes('Revenue') ? `€${value.toFixed(2)}` : value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: alpha(color, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ color: color, fontSize: 24 }} />
          </Box>
        </Box>
        {trend !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            {trend > 0 ? (
              <TrendingUp sx={{ fontSize: 16, color: '#2e7d32' }} />
            ) : trend < 0 ? (
              <TrendingDown sx={{ fontSize: 16, color: '#ff4444' }} />
            ) : null}
            <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {trend !== 0 ? `${Math.abs(trend)}% from last month` : 'No change'}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
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
          Order Management
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            color: '#6b7280',
            fontSize: '0.95rem',
          }}
        >
          Manage and track all customer orders
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={Receipt}
            title="Total Orders"
            value={stats.totalOrders}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={Euro}
            title="Total Revenue"
            value={stats.totalRevenue}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={LocalShipping}
            title="Pending Orders"
            value={stats.pendingOrders}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={CheckCircle}
            title="Completed"
            value={stats.completedPayments}
            color="#2e7d32"
          />
        </Grid>
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
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Receipt sx={{ color: '#2e7d32', fontSize: 20 }} />
              <Typography
                sx={{
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  fontWeight: 600,
                  color: '#1a1a2e',
                  fontSize: '0.9rem',
                }}
              >
                Total Orders:
              </Typography>
              <Chip
                label={totalOrders}
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

          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search by order ID, customer name, email, or phone..."
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
                {showFilters ? 'Hide Filters' : 'Filters'}
              </Button>

              {selectedOrders.length > 0 && (
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
                  Delete ({selectedOrders.length})
                </Button>
              )}

              <Tooltip title="Refresh">
                <IconButton 
                  onClick={() => { fetchOrders(); fetchStats(); }} 
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
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Order Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  label="Order Status"
                  sx={{ borderRadius: '10px' }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">In Attesa</MenuItem>
                  <MenuItem value="confirmed">Confermato</MenuItem>
                  <MenuItem value="shipped">Spedito</MenuItem>
                  <MenuItem value="delivered">Consegnato</MenuItem>
                  <MenuItem value="cancelled">Annullato</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={filters.paymentStatus}
                  onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
                  label="Payment Status"
                  sx={{ borderRadius: '10px' }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">In Attesa</MenuItem>
                  <MenuItem value="completed">Completato</MenuItem>
                  <MenuItem value="failed">Fallito</MenuItem>
                  <MenuItem value="refunded">Rimborsato</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Min Total"
                type="number"
                value={filters.minTotal}
                onChange={(e) => setFilters(prev => ({ ...prev, minTotal: e.target.value }))}
                InputProps={{ startAdornment: <InputAdornment position="start">€</InputAdornment> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Max Total"
                type="number"
                value={filters.maxTotal}
                onChange={(e) => setFilters(prev => ({ ...prev, maxTotal: e.target.value }))}
                InputProps={{ startAdornment: <InputAdornment position="start">€</InputAdornment> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setPage(0);
                    fetchOrders();
                  }}
                  sx={{
                    borderRadius: '10px',
                    backgroundColor: '#2e7d32',
                    '&:hover': { backgroundColor: '#1b5e20' },
                    textTransform: 'none',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  }}
                >
                  Apply Filters
                </Button>
                <Button
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
                  Reset All
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      {/* Orders Table */}
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
              Loading orders...
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
                      Order ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Customer
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Items
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Total
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Payment
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Receipt sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
                          <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600 }}>
                            No orders found
                          </Typography>
                          <Typography sx={{ color: '#6b7280' }}>
                            {searchTerm ? 'Try adjusting your search' : 'Orders will appear here once customers start ordering'}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow
                        key={order._id}
                        sx={{
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' },
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedOrders.includes(order._id)}
                            onChange={() => handleSelectOrder(order._id)}
                            sx={{
                              color: '#6b7280',
                              '&.Mui-checked': { color: '#2e7d32' },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.85rem' }}>
                            #{order.orderId.substring(0, 8)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography sx={{ fontWeight: 500, color: '#1a1a2e', fontSize: '0.85rem' }}>
                              {order.customer.fullName}
                            </Typography>
                            <Typography sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                              {order.customer.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.85rem', color: '#1a1a2e' }}>
                            {order.items.length} items
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 700, color: '#2e7d32', fontSize: '0.95rem' }}>
                            €{order.total.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {getStatusChip(order.status)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getPaymentStatusLabel(order.paymentStatus)}
                            size="small"
                            sx={{
                              backgroundColor: alpha(getPaymentStatusColor(order.paymentStatus), 0.1),
                              color: getPaymentStatusColor(order.paymentStatus),
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {formatDate(order.orderDate)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewOrder(order)}
                                sx={{
                                  color: '#1976d2',
                                  '&:hover': { backgroundColor: 'rgba(25,118,210,0.08)' },
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Update Status">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenStatusDialog(order)}
                                sx={{
                                  color: '#ff9800',
                                  '&:hover': { backgroundColor: 'rgba(255,152,0,0.08)' },
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(order)}
                                sx={{
                                  color: '#ff4444',
                                  '&:hover': { backgroundColor: 'rgba(255,68,68,0.08)' },
                                }}
                              >
                                <Delete fontSize="small" />
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
              count={totalOrders}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Orders per page:"
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

      {/* Order Details Dialog */}
      <Dialog
        open={openDetails}
        onClose={handleCloseDetails}
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
        {selectedOrder && (
          <>
            <DialogTitle sx={{ pb: 1, pt: 3, px: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                    Order #{selectedOrder.orderId.substring(0, 8)}
                  </Typography>
                  <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', mt: 0.5 }}>
                    Placed on {formatDate(selectedOrder.orderDate)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {getStatusChip(selectedOrder.status)}
                  <IconButton 
                    onClick={handleCloseDetails} 
                    sx={{ 
                      color: '#6b7280',
                      backgroundColor: 'rgba(0,0,0,0.04)',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.08)' },
                    }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ pt: 3, px: 4 }}>
              <Grid container spacing={3}>
                {/* Customer Information */}
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', mb: 2 }}>
                    Customer Information
                  </Typography>
                  <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person sx={{ fontSize: 16, color: '#6b7280' }} />
                          <Typography sx={{ fontWeight: 500 }}>{selectedOrder.customer.fullName}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Email sx={{ fontSize: 16, color: '#6b7280' }} />
                          <Typography>{selectedOrder.customer.email}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone sx={{ fontSize: 16, color: '#6b7280' }} />
                          <Typography>{selectedOrder.customer.phone}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Home sx={{ fontSize: 16, color: '#6b7280' }} />
                          <Typography>
                            {selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.postalCode}
                          </Typography>
                        </Box>
                      </Grid>
                      {selectedOrder.customer.notes && (
                        <Grid item xs={12}>
                          <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>
                            <strong>Notes:</strong> {selectedOrder.customer.notes}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>

                {/* Order Items */}
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', mb: 2 }}>
                    Order Items ({selectedOrder.items.length})
                  </Typography>
                  <Paper sx={{ borderRadius: '12px', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Product</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Brand</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Quantity</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Price</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', textAlign: 'right' }}>Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOrder.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                                    {item.name}
                                  </Typography>
                                  {item.selectedLogo && (
                                    <Chip label={item.selectedLogo} size="small" variant="outlined" />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>{item.brand}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>€{item.price.toFixed(2)}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600 }}>
                                €{(item.price * item.quantity).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>

                {/* Order Summary */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ color: '#6b7280' }}>Subtotal</Typography>
                      <Typography sx={{ fontWeight: 500 }}>€{selectedOrder.subtotal.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ color: '#6b7280' }}>Shipping</Typography>
                      <Typography sx={{ fontWeight: 500 }}>
                        {selectedOrder.shipping === 0 ? 'Free' : `€${selectedOrder.shipping.toFixed(2)}`}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Total</Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#2e7d32' }}>
                        €{selectedOrder.total.toFixed(2)}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                {/* Payment Info */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                    <Typography sx={{ fontWeight: 600, mb: 1 }}>Payment Information</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Chip
                        label={`Payment: ${getPaymentStatusLabel(selectedOrder.paymentStatus)}`}
                        sx={{
                          backgroundColor: alpha(getPaymentStatusColor(selectedOrder.paymentStatus), 0.1),
                          color: getPaymentStatusColor(selectedOrder.paymentStatus),
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        label={`Method: ${selectedOrder.paymentMethod}`}
                        variant="outlined"
                      />
                      {selectedOrder.paymentDate && (
                        <Chip
                          label={`Paid on: ${formatDate(selectedOrder.paymentDate)}`}
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, px: 4, gap: 1, borderTop: '1px solid #f0f0f0' }}>
              <Button
                onClick={handleCloseDetails}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  color: '#6b7280',
                  px: 3,
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handleCloseDetails();
                  handleOpenStatusDialog(selectedOrder);
                }}
                sx={{
                  backgroundColor: '#ff9800',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  fontWeight: 600,
                  px: 4,
                  '&:hover': { backgroundColor: '#e68900' },
                }}
              >
                Update Status
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3, px: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
            Update Order Status
          </Typography>
          <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', mt: 0.5 }}>
            Change the status for order #{selectedOrder?.orderId?.substring(0, 8)}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, px: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Order Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Order Status"
              sx={{ borderRadius: '12px' }}
            >
              <MenuItem value="pending">In Attesa</MenuItem>
              <MenuItem value="confirmed">Confermato</MenuItem>
              <MenuItem value="shipped">Spedito</MenuItem>
              <MenuItem value="delivered">Consegnato</MenuItem>
              <MenuItem value="cancelled">Annullato</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(255,152,0,0.04)', borderRadius: '12px', border: '1px dashed rgba(255,152,0,0.2)' }}>
            <Typography sx={{ fontSize: '0.8rem', color: '#6b7280', textAlign: 'center' }}>
              <span style={{ fontWeight: 700, color: '#ff9800' }}>Note:</span> Changing the status will update the order tracking and notify the customer.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, px: 4, gap: 1, borderTop: '1px solid #f0f0f0' }}>
          <Button
            onClick={handleCloseStatusDialog}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              color: '#6b7280',
              px: 3,
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateStatus}
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
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Single Confirmation Dialog */}
      <Dialog
        open={deleteSingleOpen}
        onClose={handleDeleteSingleClose}
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
        {/* Gradient Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)',
            p: 4,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -80,
              left: -80,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.03)',
            },
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
              This action cannot be undone
            </Typography>
          </Box>
        </Box>

        {/* Content */}
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
                You are about to delete:
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: '#ff4444',
                  fontSize: '1.05rem',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  mt: 0.5,
                }}
              >
                Order #{orderToDelete?.orderId?.substring(0, 8)}
              </Typography>
              <Typography
                sx={{
                  color: '#6b7280',
                  fontSize: '0.85rem',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  mt: 0.5,
                }}
              >
                Customer: {orderToDelete?.customer?.fullName} • Total: €{orderToDelete?.total?.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          {/* Order Details Grid */}
          <Grid container spacing={1.5} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 600,
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                Items
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: '#1a1a2e',
                  fontSize: '0.95rem',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                {orderToDelete?.items?.length || 0} products
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 600,
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                Status
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: getStatusColor(orderToDelete?.status),
                  fontSize: '0.95rem',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                {getStatusLabel(orderToDelete?.status)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 600,
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                Payment
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: getPaymentStatusColor(orderToDelete?.paymentStatus),
                  fontSize: '0.95rem',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                {getPaymentStatusLabel(orderToDelete?.paymentStatus)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 600,
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                Date
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: '#1a1a2e',
                  fontSize: '0.85rem',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                {orderToDelete?.orderDate ? formatDate(orderToDelete.orderDate) : 'N/A'}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Warning Message */}
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
              <span style={{ fontWeight: 700, color: '#ff4444' }}>Warning:</span> This will permanently remove
              this order from the system and all associated data.
            </Typography>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              fullWidth
              onClick={handleDeleteSingleClose}
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
              Cancel
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
              Yes, Delete Order
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Delete Multiple Confirmation Dialog */}
      <Dialog
        open={deleteMultipleOpen}
        onClose={handleBulkDeleteClose}
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
              <Warning sx={{ fontSize: 44, color: '#ffffff' }} />
            </Box>
            <Typography
              sx={{
                color: '#ffffff',
                fontSize: '1.2rem',
                fontWeight: 700,
                mt: 2,
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              Delete Orders
            </Typography>
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
              <Cancel sx={{ fontSize: 22, color: '#ff4444' }} />
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
                Delete {selectedOrders.length} orders?
              </Typography>
              <Typography
                sx={{
                  color: '#6b7280',
                  fontSize: '0.85rem',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                This action cannot be undone
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
              <span style={{ fontWeight: 700, color: '#ff4444' }}>Warning:</span> This will permanently remove
              all {selectedOrders.length} selected orders from the system.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              fullWidth
              onClick={handleBulkDeleteClose}
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
              Cancel
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
              Yes, Delete All
            </Button>
          </Box>
        </Box>
      </Dialog>

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

export default AdminOrders;