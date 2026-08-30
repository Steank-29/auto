// src/pages/AdminStock.jsx
import React, { useState, useEffect } from 'react';
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
  Badge as MuiBadge,
  Stack,
  Slider,
  LinearProgress as MuiLinearProgress,
} from '@mui/material';
import {
  Inventory,
  Search,
  Close,
  Refresh,
  Warning,
  CheckCircle,
  Cancel,
  FilterList,
  Add,
  Remove,
  Edit,
  TrendingUp,
  TrendingDown,
  Storage,
  ShoppingCart,
  LocalShipping,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  WarningAmber,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axiosInstance from '../utils/axiosConfig';
import { getImageUrl } from '../utils/imageUtils';

const AdminStock = () => {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [openStockDialog, setOpenStockDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState(0);
  const [stockAdjustment, setStockAdjustment] = useState(0);
  const [adjustmentType, setAdjustmentType] = useState('set'); // 'set', 'add', 'subtract'
  const [filters, setFilters] = useState({
    brand: 'all',
    stockStatus: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stock statistics
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStock: 0,
    outOfStock: 0,
    fullStock: 0,
  });

  // Fetch products on load
  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/products';
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (filters.brand && filters.brand !== 'all') params.append('brand', filters.brand);
      
      params.append('page', page + 1);
      params.append('limit', rowsPerPage);
      
      if (params.toString()) url += `?${params.toString()}`;

      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        let productsData = response.data.data;
        
        // Filter by stock status
        if (filters.stockStatus !== 'all') {
          if (filters.stockStatus === 'low') {
            productsData = productsData.filter(p => p.stock > 0 && p.stock <= 5);
          } else if (filters.stockStatus === 'out') {
            productsData = productsData.filter(p => p.stock === 0);
          } else if (filters.stockStatus === 'full') {
            productsData = productsData.filter(p => p.stock > 5);
          }
        }
        
        setProducts(productsData);
        setTotalProducts(productsData.length);
        calculateStats(productsData);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showSnackbar('Error fetching products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (productsData) => {
    const totalStock = productsData.reduce((sum, p) => sum + p.stock, 0);
    const outOfStock = productsData.filter(p => p.stock === 0).length;
    const lowStock = productsData.filter(p => p.stock > 0 && p.stock <= 5).length;
    const fullStock = productsData.filter(p => p.stock > 5).length;
    
    setStats({
      totalProducts: productsData.length,
      totalStock,
      outOfStock,
      lowStock,
      fullStock,
    });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  const handleOpenStockDialog = (product) => {
    setSelectedProduct(product);
    setNewStock(product.stock);
    setStockAdjustment(0);
    setAdjustmentType('set');
    setOpenStockDialog(true);
  };

  const handleCloseStockDialog = () => {
    setOpenStockDialog(false);
    setSelectedProduct(null);
    setNewStock(0);
    setStockAdjustment(0);
  };

  const handleStockUpdate = async () => {
    setIsSubmitting(true);
    try {
      let finalStock = newStock;
      
      if (adjustmentType === 'add') {
        finalStock = selectedProduct.stock + stockAdjustment;
      } else if (adjustmentType === 'subtract') {
        finalStock = Math.max(0, selectedProduct.stock - stockAdjustment);
      }
      
      await axiosInstance.patch(`/products/${selectedProduct._id}/stock`, {
        stock: finalStock
      });
      
      showSnackbar('Stock updated successfully!', 'success');
      handleCloseStockDialog();
      fetchProducts();
    } catch (error) {
      console.error('Error updating stock:', error);
      showSnackbar('Error updating stock', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleResetFilters = () => {
    setFilters({
      brand: 'all',
      stockStatus: 'all',
    });
    setSearchTerm('');
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out', color: '#ff4444', bg: 'rgba(255,68,68,0.08)', icon: <Cancel sx={{ fontSize: 14 }} /> };
    if (stock <= 5) return { label: 'Low', color: '#ff9800', bg: 'rgba(255,152,0,0.08)', icon: <WarningAmber sx={{ fontSize: 14 }} /> };
    return { label: 'Full', color: '#2e7d32', bg: 'rgba(46,125,50,0.08)', icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> };
  };

  const getStatusChip = (stock) => {
    const status = getStockStatus(stock);
    return (
      <Chip
        label={status.label}
        size="small"
        sx={{
          backgroundColor: status.bg,
          color: status.color,
          fontWeight: 700,
          fontSize: '0.7rem',
          height: 24,
          '& .MuiChip-icon': { fontSize: 14 },
        }}
        icon={status.icon}
      />
    );
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

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, page, rowsPerPage, filters]);

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
            Stock Management
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              color: '#6b7280',
              fontSize: '0.95rem',
            }}
          >
            Monitor and manage your product inventory
          </Typography>
        </Box>


{/* Stats Cards - Full Width */}
<Grid container spacing={3} sx={{ mb: 4 }}>
  {[
    { 
      title: 'Total Products', 
      value: stats.totalProducts, 
      icon: <Inventory sx={{ fontSize: 24 }} />,
      color: '#2e7d32',
      bg: 'rgba(46,125,50,0.08)',
    },
    { 
      title: 'Total Stock', 
      value: stats.totalStock, 
      icon: <Storage sx={{ fontSize: 24 }} />,
      color: '#1976d2',
      bg: 'rgba(25,118,210,0.08)',
    },
    { 
      title: 'Full Stock', 
      value: stats.fullStock, 
      icon: <CheckCircle sx={{ fontSize: 24 }} />,
      color: '#2e7d32',
      bg: 'rgba(46,125,50,0.08)',
    },
    { 
      title: 'Low Stock', 
      value: stats.lowStock, 
      icon: <Warning sx={{ fontSize: 24 }} />,
      color: '#ff9800',
      bg: 'rgba(255,152,0,0.08)',
    },
    { 
      title: 'Out of Stock', 
      value: stats.outOfStock, 
      icon: <Cancel sx={{ fontSize: 24 }} />,
      color: '#ff4444',
      bg: 'rgba(255,68,68,0.08)',
    },
  ].map((stat, index) => (
    <Grid item xs={12} sm={6} md={2.4} key={index}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        style={{ height: '100%' }}
      >
        <Card
          sx={{
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            border: '1px solid #f0f0f0',
            height: '100%',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transform: 'translateY(-4px)',
            },
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '14px',
                backgroundColor: stat.bg,
                color: stat.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
              }}
            >
              {stat.icon}
            </Box>
            <Typography
              sx={{
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {stat.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                fontSize: '2.2rem',
                fontWeight: 700,
                color: '#1a1a2e',
                mt: 0.5,
              }}
            >
              {stat.value}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
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
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Storage sx={{ color: '#2e7d32', fontSize: 20 }} />
                <Typography
                  sx={{
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    fontWeight: 600,
                    color: '#1a1a2e',
                    fontSize: '0.9rem',
                  }}
                >
                  Total Items in Stock:
                </Typography>
                <Chip
                  label={stats.totalStock}
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

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search products by name, brand, or model..."
                value={searchTerm}
                onChange={handleSearch}
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

            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
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
                  {showFilters ? 'Hide' : 'Filters'}
                </Button>
                <Tooltip title="Refresh">
                  <IconButton 
                    onClick={fetchProducts} 
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
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Brand</InputLabel>
                  <Select
                    value={filters.brand}
                    onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                    label="Brand"
                    sx={{ borderRadius: '10px' }}
                  >
                    <MenuItem value="all">All Brands</MenuItem>
                    <MenuItem value="BMW">BMW</MenuItem>
                    <MenuItem value="Audi">Audi</MenuItem>
                    <MenuItem value="Mercedes">Mercedes</MenuItem>
                    <MenuItem value="Porsche">Porsche</MenuItem>
                    <MenuItem value="Volkswagen">Volkswagen</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Stock Status</InputLabel>
                  <Select
                    value={filters.stockStatus}
                    onChange={(e) => setFilters(prev => ({ ...prev, stockStatus: e.target.value }))}
                    label="Stock Status"
                    sx={{ borderRadius: '10px' }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="full">Full Stock</MenuItem>
                    <MenuItem value="low">Low Stock</MenuItem>
                    <MenuItem value="out">Out of Stock</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setPage(0);
                      fetchProducts();
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
                    Reset
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>

        {/* Stock Table */}
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
                Loading products...
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Product
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Brand
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Price
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Current Stock
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Stock Level
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Inventory sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600 }}>
                              No products found
                            </Typography>
                            <Typography sx={{ color: '#6b7280' }}>
                              {searchTerm ? 'Try adjusting your search' : 'No products available'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => {
                        const status = getStockStatus(product.stock);
                        const stockPercentage = Math.min((product.stock / 50) * 100, 100);
                        
                        return (
                          <TableRow
                            key={product._id}
                            sx={{
                              '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' },
                              transition: 'background-color 0.2s ease',
                              ...(product.stock === 0 && { backgroundColor: 'rgba(255,68,68,0.02)' }),
                              ...(product.stock <= 5 && product.stock > 0 && { backgroundColor: 'rgba(255,152,0,0.02)' }),
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                  src={product.mainImage ? getImageUrl(product.mainImage) : ''}
                                  variant="rounded"
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '10px',
                                    border: '1px solid #e5e7eb',
                                    bgcolor: '#f5f5f5',
                                  }}
                                >
                                  <Inventory sx={{ color: '#6b7280', fontSize: 18 }} />
                                </Avatar>
                                <Box>
                                  <Typography
                                    sx={{
                                      fontWeight: 600,
                                      color: '#1a1a2e',
                                      fontSize: '0.9rem',
                                    }}
                                  >
                                    {product.name}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: '#6b7280',
                                      fontSize: '0.75rem',
                                    }}
                                  >
                                    {product.model}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={product.brand}
                                size="small"
                                sx={{
                                  backgroundColor: alpha(getBrandColor(product.brand), 0.1),
                                  color: getBrandColor(product.brand),
                                  fontWeight: 600,
                                  fontSize: '0.7rem',
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                                €{product.price}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: '1.1rem',
                                  color: status.color,
                                }}
                              >
                                {product.stock}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {getStatusChip(product.stock)}
                            </TableCell>
                            <TableCell sx={{ minWidth: 120 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <MuiLinearProgress
                                  variant="determinate"
                                  value={stockPercentage}
                                  sx={{
                                    flex: 1,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: '#f0f0f0',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: status.color,
                                      borderRadius: 3,
                                    },
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontSize: '0.65rem',
                                    color: '#6b7280',
                                    fontWeight: 500,
                                    minWidth: 30,
                                  }}
                                >
                                  {Math.round(stockPercentage)}%
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Manage Stock">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenStockDialog(product)}
                                  sx={{
                                    color: '#2e7d32',
                                    '&:hover': { backgroundColor: 'rgba(46,125,50,0.08)' },
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={totalProducts}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Products per page:"
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

      {/* Stock Management Dialog */}
      <Dialog
        open={openStockDialog}
        onClose={handleCloseStockDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3, px: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                Manage Stock
              </Typography>
              <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', mt: 0.5 }}>
                {selectedProduct?.name}
              </Typography>
            </Box>
            <IconButton 
              onClick={handleCloseStockDialog} 
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
          <Grid container spacing={3}>
            {/* Current Stock */}
            <Grid size={12}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(46,125,50,0.04)',
                  borderRadius: '12px',
                  border: '1px solid rgba(46,125,50,0.08)',
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                  }}
                >
                  Current Stock
                </Typography>
                <Typography
                  sx={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: selectedProduct?.stock === 0 ? '#ff4444' : '#2e7d32',
                  }}
                >
                  {selectedProduct?.stock}
                </Typography>
                <Typography sx={{ color: '#6b7280', fontSize: '0.8rem' }}>
                  units available
                </Typography>
              </Box>
            </Grid>

            {/* Stock Adjustment */}
            <Grid size={12}>
              <Typography sx={{ fontWeight: 600, color: '#1a1a2e', mb: 2 }}>
                Adjustment Method
              </Typography>
              <Grid container spacing={1}>
                <Grid size={4}>
                  <Button
                    fullWidth
                    variant={adjustmentType === 'set' ? 'contained' : 'outlined'}
                    onClick={() => setAdjustmentType('set')}
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      backgroundColor: adjustmentType === 'set' ? '#2e7d32' : 'transparent',
                      '&:hover': {
                        backgroundColor: adjustmentType === 'set' ? '#1b5e20' : 'rgba(46,125,50,0.04)',
                      },
                    }}
                  >
                    Set
                  </Button>
                </Grid>
                <Grid size={4}>
                  <Button
                    fullWidth
                    variant={adjustmentType === 'add' ? 'contained' : 'outlined'}
                    onClick={() => setAdjustmentType('add')}
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      backgroundColor: adjustmentType === 'add' ? '#1976d2' : 'transparent',
                      color: adjustmentType === 'add' ? '#fff' : '#1976d2',
                      borderColor: '#1976d2',
                      '&:hover': {
                        backgroundColor: adjustmentType === 'add' ? '#1565c0' : 'rgba(25,118,210,0.04)',
                      },
                    }}
                  >
                    <Add sx={{ fontSize: 16, mr: 0.5 }} /> Add
                  </Button>
                </Grid>
                <Grid size={4}>
                  <Button
                    fullWidth
                    variant={adjustmentType === 'subtract' ? 'contained' : 'outlined'}
                    onClick={() => setAdjustmentType('subtract')}
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      backgroundColor: adjustmentType === 'subtract' ? '#ff4444' : 'transparent',
                      color: adjustmentType === 'subtract' ? '#fff' : '#ff4444',
                      borderColor: '#ff4444',
                      '&:hover': {
                        backgroundColor: adjustmentType === 'subtract' ? '#cc0000' : 'rgba(255,68,68,0.04)',
                      },
                    }}
                  >
                    <Remove sx={{ fontSize: 16, mr: 0.5 }} /> Remove
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {/* Stock Input */}
            <Grid size={12}>
              {adjustmentType === 'set' ? (
                <TextField
                  fullWidth
                  label="New Stock Quantity"
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(Math.max(0, parseInt(e.target.value) || 0))}
                  InputProps={{ 
                    inputProps: { min: 0 },
                    startAdornment: <InputAdornment position="start">Units</InputAdornment>,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              ) : (
                <TextField
                  fullWidth
                  label={adjustmentType === 'add' ? 'Quantity to Add' : 'Quantity to Remove'}
                  type="number"
                  value={stockAdjustment}
                  onChange={(e) => setStockAdjustment(Math.max(0, parseInt(e.target.value) || 0))}
                  InputProps={{ 
                    inputProps: { min: 0 },
                    startAdornment: <InputAdornment position="start">Units</InputAdornment>,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              )}
            </Grid>

            {/* Preview */}
            <Grid size={12}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  borderRadius: '12px',
                  border: '1px dashed #e5e7eb',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Preview
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ color: '#6b7280', fontSize: '0.8rem' }}>
                      Current Stock
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                      {selectedProduct?.stock} units
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: '#6b7280', fontSize: '0.7rem' }}>
                      {adjustmentType === 'set' ? '→ Set to' : adjustmentType === 'add' ? '+ Add' : '- Remove'}
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: '#2e7d32' }}>
                      {adjustmentType === 'set' 
                        ? newStock 
                        : adjustmentType === 'add' 
                          ? `+${stockAdjustment}` 
                          : `-${stockAdjustment}`
                      }
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ color: '#6b7280', fontSize: '0.8rem' }}>
                      New Stock
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        color: (() => {
                          let final = selectedProduct?.stock || 0;
                          if (adjustmentType === 'set') final = newStock;
                          else if (adjustmentType === 'add') final += stockAdjustment;
                          else if (adjustmentType === 'subtract') final = Math.max(0, final - stockAdjustment);
                          return final === 0 ? '#ff4444' : final <= 5 ? '#ff9800' : '#2e7d32';
                        })(),
                      }}
                    >
                      {(() => {
                        let final = selectedProduct?.stock || 0;
                        if (adjustmentType === 'set') final = newStock;
                        else if (adjustmentType === 'add') final += stockAdjustment;
                        else if (adjustmentType === 'subtract') final = Math.max(0, final - stockAdjustment);
                        return final;
                      })()} units
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, px: 4, gap: 1, borderTop: '1px solid #f0f0f0' }}>
          <Button
            onClick={handleCloseStockDialog}
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
            onClick={handleStockUpdate}
            variant="contained"
            disabled={isSubmitting}
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
            {isSubmitting ? 'Updating...' : 'Update Stock'}
          </Button>
        </DialogActions>
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

export default AdminStock;