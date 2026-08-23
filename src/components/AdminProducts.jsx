// src/pages/AdminProducts.jsx
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
  CardActionArea,
  Checkbox,
  Stack,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Close,
  Error as ErrorIcon,
  CloudUpload,
  Image as ImageIcon,
  Inventory,
  Star,
  StarBorder,
  Refresh,
  CheckCircle,
  Warning,
  Cancel,
  FilterList,
  GridView,
  TableRows,
  Category,
  Description,
  Euro,
  BrandingWatermark,
  DriveEta,
  LocalOffer,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axiosInstance from '../utils/axiosConfig';


const AdminProducts = () => {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [imageFiles, setImageFiles] = useState({ main: null, more: [] });
  const [imagePreviews, setImagePreviews] = useState({ main: null, more: [] });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState(false);
  const [filters, setFilters] = useState({
    brand: 'all',
    category: 'all',
    minPrice: '',
    maxPrice: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    category: '',
    compatibleCars: '',
    isFeatured: false,
    waterproof: true,
    brightness: 'Premium',
    installation: 'Plug & Play',
    warranty: 24,
    specifications: {},
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, page, rowsPerPage, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/products';
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (filters.brand && filters.brand !== 'all') params.append('brand', filters.brand);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      
      params.append('page', page + 1);
      params.append('limit', rowsPerPage);
      
      if (params.toString()) url += `?${params.toString()}`;

      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setProducts(response.data.data);
        setTotalProducts(response.data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showSnackbar('Error fetching products', 'error');
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

  const handleResetFilters = () => {
    setFilters({
      brand: 'all',
      category: 'all',
      minPrice: '',
      maxPrice: '',
    });
    setSearchTerm('');
    setPage(0);
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        model: product.model || '',
        description: product.description || '',
        price: product.price || '',
        discountPrice: product.discountPrice || '',
        stock: product.stock || '',
        category: product.category || '',
        compatibleCars: product.compatibleCars?.join(', ') || '',
        isFeatured: product.isFeatured || false,
        waterproof: product.features?.waterproof || false,
        brightness: product.features?.brightness || 'Premium',
        installation: product.features?.installation || 'Plug & Play',
        warranty: product.features?.warranty || 24,
        specifications: product.specifications || {},
      });
      setImagePreviews({ 
        main: product.mainImage ? `http://localhost:5000${product.mainImage}` : null, 
        more: product.moreImages?.map(img => `http://localhost:5000${img}`) || [] 
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        brand: '',
        model: '',
        description: '',
        price: '',
        discountPrice: '',
        stock: '',
        category: '',
        compatibleCars: '',
        isFeatured: false,
        waterproof: true,
        brightness: 'Premium',
        installation: 'Plug & Play',
        warranty: 12,
        specifications: {},
      });
      setImagePreviews({ main: null, more: [] });
      setImageFiles({ main: null, more: [] });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e, type) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === 'main') {
      const file = files[0];
      setImageFiles(prev => ({ ...prev, main: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => ({ ...prev, main: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      const newFiles = Array.from(files);
      setImageFiles(prev => ({ ...prev, more: [...prev.more, ...newFiles] }));
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => ({ ...prev, more: [...prev.more, reader.result] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    setImagePreviews(prev => ({
      ...prev,
      more: prev.more.filter((_, i) => i !== index),
    }));
    setImageFiles(prev => ({
      ...prev,
      more: prev.more.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Product name is required';
    if (!formData.brand) errors.brand = 'Brand is required';
    if (!formData.model) errors.model = 'Model is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) errors.price = 'Valid price is required';
    if (!formData.stock || formData.stock < 0) errors.stock = 'Valid stock is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!editingProduct && !imagePreviews.main) errors.mainImage = 'Main image is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'specifications') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'compatibleCars') {
          const carsArray = formData.compatibleCars.split(',').map(c => c.trim());
          submitData.append(key, JSON.stringify(carsArray));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      submitData.append('features', JSON.stringify({
        waterproof: formData.waterproof,
        brightness: formData.brightness,
        installation: formData.installation,
        warranty: formData.warranty,
      }));

      if (imageFiles.main) {
        submitData.append('mainImage', imageFiles.main);
      }
      imageFiles.more.forEach(file => {
        submitData.append('moreImages', file);
      });

      let response;
      if (editingProduct) {
        response = await axiosInstance.put(`/products/${editingProduct._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axiosInstance.post('/products', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (response.data.success) {
        showSnackbar(
          editingProduct ? 'Product updated successfully!' : 'Product created successfully!',
          'success'
        );
        handleCloseDialog();
        fetchProducts();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showSnackbar(
        error.response?.data?.message || 'Error saving product',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/products/${productToDelete._id}`);
      showSnackbar('Product deleted successfully!', 'success');
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showSnackbar('Error deleting product', 'error');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      showSnackbar('Please select at least one product to delete', 'warning');
      return;
    }
    setDeleteMultipleOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      await axiosInstance.delete('/products', {
        data: { productIds: selectedProducts }
      });
      showSnackbar(`${selectedProducts.length} products deleted successfully!`, 'success');
      setSelectedProducts([]);
      setSelectAll(false);
      setDeleteMultipleOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting products:', error);
      showSnackbar('Error deleting products', 'error');
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = products.map(p => p._id);
      setSelectedProducts(allIds);
      setSelectAll(true);
    } else {
      setSelectedProducts([]);
      setSelectAll(false);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleToggleFeatured = async (productId) => {
    try {
      const response = await axiosInstance.patch(`/products/${productId}/feature`);
      if (response.data.success) {
        showSnackbar('Product featured status updated!', 'success');
        fetchProducts();
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
      showSnackbar('Error updating product', 'error');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (product) => {
    if (product.stock === 0) {
      return <Chip label="Out of Stock" size="small" color="error" icon={<Cancel sx={{ fontSize: 14 }} />} />;
    } else if (product.stock <= 5) {
      return <Chip label="Low Stock" size="small" color="warning" icon={<Warning sx={{ fontSize: 14 }} />} />;
    } else {
      return <Chip label="In Stock" size="small" color="success" icon={<CheckCircle sx={{ fontSize: 14 }} />} />;
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

  const getStatusColor = (product) => {
    if (product.stock === 0) return '#ff4444';
    if (product.stock <= 5) return '#ff9800';
    return '#2e7d32';
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
            Product Management
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              color: '#6b7280',
              fontSize: '0.95rem',
            }}
          >
            Manage your door logo projectors inventory
          </Typography>
        </Box>

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
            {/* Left side - Product count */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Inventory sx={{ color: '#2e7d32', fontSize: 20 }} />
                <Typography
                  sx={{
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    fontWeight: 600,
                    color: '#1a1a2e',
                    fontSize: '0.9rem',
                  }}
                >
                  Number of Existing Products:
                </Typography>
                <Chip
                  label={totalProducts}
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
                placeholder="Search products by name, brand, or model..."
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
                  {showFilters ? 'Hide Filters' : 'Filters'}
                </Button>

                {selectedProducts.length > 0 && (
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
                    Delete ({selectedProducts.length})
                  </Button>
                )}

                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title="Table View">
                    <IconButton
                      size="small"
                      onClick={() => setViewMode('table')}
                      sx={{
                        backgroundColor: viewMode === 'table' ? 'rgba(46,125,50,0.08)' : 'transparent',
                        color: viewMode === 'table' ? '#2e7d32' : '#6b7280',
                        borderRadius: '8px',
                        '&:hover': { backgroundColor: 'rgba(46,125,50,0.08)' },
                      }}
                    >
                      <TableRows fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Grid View">
                    <IconButton
                      size="small"
                      onClick={() => setViewMode('grid')}
                      sx={{
                        backgroundColor: viewMode === 'grid' ? 'rgba(46,125,50,0.08)' : 'transparent',
                        color: viewMode === 'grid' ? '#2e7d32' : '#6b7280',
                        borderRadius: '8px',
                        '&:hover': { backgroundColor: 'rgba(46,125,50,0.08)' },
                      }}
                    >
                      <GridView fontSize="small" />
                    </IconButton>
                  </Tooltip>
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

                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenDialog()}
                  size="small"
                  sx={{
                    backgroundColor: '#2e7d32',
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#1b5e20',
                    },
                  }}
                >
                  Add
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Filters - Enhanced */}
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
              <Grid item xs={12} sm={6} md={2.5}>
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
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2.5}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    label="Category"
                    sx={{ borderRadius: '10px' }}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="Side Door">Side Door</MenuItem>
                    <MenuItem value="Front Logo">Front Logo</MenuItem>
                    <MenuItem value="Trank Logo">Trank Logo</MenuItem>
                    <MenuItem value="Custom">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2.5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Min Price"
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  InputProps={{ startAdornment: <InputAdornment position="start">€</InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Max Price"
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  InputProps={{ startAdornment: <InputAdornment position="start">€</InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    fullWidth
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
                    Apply
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

        {/* Products Table/Grid */}
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
              {viewMode === 'table' ? (
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
                          Product
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Brand
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Price
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Stock
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Status
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Featured
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Inventory sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
                              <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600 }}>
                                No products found
                              </Typography>
                              <Typography sx={{ color: '#6b7280' }}>
                                {searchTerm ? 'Try adjusting your search' : 'Start by adding your first product'}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.map((product) => (
                          <TableRow
                            key={product._id}
                            sx={{
                              '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' },
                              transition: 'background-color 0.2s ease',
                            }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedProducts.includes(product._id)}
                                onChange={() => handleSelectProduct(product._id)}
                                sx={{
                                  color: '#6b7280',
                                  '&.Mui-checked': { color: '#2e7d32' },
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                  src={product.mainImage ? `http://localhost:5000${product.mainImage}` : '/placeholder.png'}
                                  variant="rounded"
                                  sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '10px',
                                    border: '1px solid #e5e7eb',
                                    bgcolor: '#f5f5f5',
                                  }}
                                >
                                  <ImageIcon sx={{ color: '#6b7280', fontSize: 20 }} />
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
                              <Box>
                                <Typography sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                                  €{product.price}
                                </Typography>
                                {product.discountPrice && (
                                  <Typography
                                    component="span"
                                    sx={{
                                      color: '#6b7280',
                                      fontSize: '0.7rem',
                                      textDecoration: 'line-through',
                                      ml: 0.5,
                                    }}
                                  >
                                    €{product.discountPrice}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontWeight: 500, color: getStatusColor(product) }}>
                                {product.stock}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {getStatusChip(product)}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => handleToggleFeatured(product._id)}
                                sx={{
                                  color: product.isFeatured ? '#2e7d32' : '#6b7280',
                                  '&:hover': {
                                    color: product.isFeatured ? '#1b5e20' : '#2e7d32',
                                  },
                                }}
                              >
                                {product.isFeatured ? <Star sx={{ fontSize: 20 }} /> : <StarBorder sx={{ fontSize: 20 }} />}
                              </IconButton>
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenDialog(product)}
                                    sx={{
                                      color: '#2e7d32',
                                      '&:hover': { backgroundColor: 'rgba(46,125,50,0.08)' },
                                    }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteClick(product)}
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
              ) : (
                // Grid View with checkboxes
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {products.length === 0 ? (
                      <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                          <Inventory sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
                          <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600 }}>
                            No products found
                          </Typography>
                          <Typography sx={{ color: '#6b7280' }}>
                            {searchTerm ? 'Try adjusting your search' : 'Start by adding your first product'}
                          </Typography>
                        </Box>
                      </Grid>
                    ) : (
                      products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product._id}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card
                              sx={{
                                borderRadius: '16px',
                                border: '1px solid #f0f0f0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                  transform: 'translateY(-4px)',
                                },
                              }}
                            >
                              <Box sx={{ position: 'relative' }}>
                                <CardActionArea onClick={() => handleOpenDialog(product)}>
                                  <Box
                                    sx={{
                                      height: 200,
                                      backgroundColor: '#f8f9fa',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      position: 'relative',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    {product.mainImage ? (
                                      <img
                                        src={`http://localhost:5000${product.mainImage}`}
                                        alt={product.name}
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'cover',
                                        }}
                                      />
                                    ) : (
                                      <ImageIcon sx={{ fontSize: 48, color: '#e0e0e0' }} />
                                    )}
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                      }}
                                    >
                                      {product.isFeatured && (
                                        <Chip
                                          icon={<Star sx={{ fontSize: 14 }} />}
                                          label="Featured"
                                          size="small"
                                          sx={{
                                            backgroundColor: 'rgba(46,125,50,0.9)',
                                            color: '#fff',
                                            fontWeight: 600,
                                            fontSize: '0.6rem',
                                            backdropFilter: 'blur(4px)',
                                          }}
                                        />
                                      )}
                                    </Box>
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        bottom: 8,
                                        right: 8,
                                      }}
                                    >
                                      {getStatusChip(product)}
                                    </Box>
                                  </Box>
                                </CardActionArea>
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 8,
                                  }}
                                >
                                  <Checkbox
                                    checked={selectedProducts.includes(product._id)}
                                    onChange={() => handleSelectProduct(product._id)}
                                    sx={{
                                      backgroundColor: 'rgba(255,255,255,0.9)',
                                      borderRadius: '8px',
                                      '&.Mui-checked': { color: '#2e7d32' },
                                    }}
                                  />
                                </Box>
                              </Box>
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                  <Box>
                                    <Typography
                                      sx={{
                                        fontWeight: 600,
                                        color: '#1a1a2e',
                                        fontSize: '0.95rem',
                                        mb: 0.5,
                                      }}
                                    >
                                      {product.name}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        color: '#6b7280',
                                        fontSize: '0.8rem',
                                      }}
                                    >
                                      {product.model}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={product.brand}
                                    size="small"
                                    sx={{
                                      backgroundColor: alpha(getBrandColor(product.brand), 0.1),
                                      color: getBrandColor(product.brand),
                                      fontWeight: 600,
                                      fontSize: '0.6rem',
                                    }}
                                  />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                  <Box>
                                    <Typography sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1.1rem' }}>
                                      €{product.price}
                                    </Typography>
                                    {product.discountPrice && (
                                      <Typography
                                        component="span"
                                        sx={{
                                          color: '#6b7280',
                                          fontSize: '0.7rem',
                                          textDecoration: 'line-through',
                                          ml: 0.5,
                                        }}
                                      >
                                        €{product.discountPrice}
                                      </Typography>
                                    )}
                                  </Box>
                                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleToggleFeatured(product._id)}
                                      sx={{
                                        color: product.isFeatured ? '#2e7d32' : '#6b7280',
                                      }}
                                    >
                                      {product.isFeatured ? <Star sx={{ fontSize: 18 }} /> : <StarBorder sx={{ fontSize: 18 }} />}
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleOpenDialog(product)}
                                      sx={{ color: '#1976d2' }}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteClick(product)}
                                      sx={{ color: '#ff4444' }}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </Grid>
                      ))
                    )}
                  </Grid>
                </Box>
              )}
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

      {/* Add/Edit Product Dialog - Perfectly Aligned */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
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
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </Typography>
              <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', mt: 0.5 }}>
                {editingProduct ? 'Update your product details' : 'Fill in the details to add a new product'}
              </Typography>
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
          <form id="productForm" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Basic Information Section */}
              <Grid size={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box sx={{ width: 4, height: 20, backgroundColor: '#2e7d32', borderRadius: '2px' }} />
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '1rem' }}>
                    Basic Information
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Product Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>

              <Grid size={12}>
                <FormControl fullWidth error={!!formErrors.brand} required>
                  <InputLabel>Brand *</InputLabel>
                  <Select
                    name="brand"
                    value={formData.brand}
                    onChange={handleFormChange}
                    label="Brand *"
                    sx={{ borderRadius: '12px' }}
                  >
                    <MenuItem value="BMW">BMW</MenuItem>
                    <MenuItem value="Audi">Audi</MenuItem>
                    <MenuItem value="Mercedes">Mercedes</MenuItem>
                    <MenuItem value="Porsche">Porsche</MenuItem>
                    <MenuItem value="Volkswagen">Volkswagen</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {formErrors.brand && (
                    <Typography variant="caption" color="error">{formErrors.brand}</Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Model *"
                  name="model"
                  value={formData.model}
                  onChange={handleFormChange}
                  error={!!formErrors.model}
                  helperText={formErrors.model}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>

              <Grid size={12}>
                <FormControl fullWidth error={!!formErrors.category} required>
                  <InputLabel>Category *</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    label="Category *"
                    sx={{ borderRadius: '12px' }}
                  >
                    <MenuItem value="Side Door">Side Door</MenuItem>
                    <MenuItem value="Front Logo">Front Logo</MenuItem>
                    <MenuItem value="Trank Logo">Trank Logo</MenuItem>
                    <MenuItem value="Custom">Custom</MenuItem>
                  </Select>
                  {formErrors.category && (
                    <Typography variant="caption" color="error">{formErrors.category}</Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description *"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Compatible Cars (comma separated)"
                  name="compatibleCars"
                  value={formData.compatibleCars}
                  onChange={handleFormChange}
                  placeholder="e.g. BMW M4, BMW M3, BMW 4 Series"
                  helperText="Enter car models separated by commas"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>

              {/* Pricing & Stock Section */}
              <Grid size={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 1 }}>
                  <Box sx={{ width: 4, height: 20, backgroundColor: '#2e7d32', borderRadius: '2px' }} />
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '1rem' }}>
                    Pricing & Stock
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Price (€) *"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleFormChange}
                  error={!!formErrors.price}
                  helperText={formErrors.price}
                  required
                  InputProps={{ startAdornment: <InputAdornment position="start">€</InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Discount Price (€)"
                  name="discountPrice"
                  type="number"
                  value={formData.discountPrice}
                  onChange={handleFormChange}
                  InputProps={{ startAdornment: <InputAdornment position="start">€</InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Stock Quantity *"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleFormChange}
                  error={!!formErrors.stock}
                  helperText={formErrors.stock}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>

              {/* Features Section */}
              <Grid size={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 1 }}>
                  <Box sx={{ width: 4, height: 20, backgroundColor: '#2e7d32', borderRadius: '2px' }} />
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '1rem' }}>
                    Features
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.waterproof}
                      onChange={handleFormChange}
                      name="waterproof"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#2e7d32',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#2e7d32',
                        },
                      }}
                    />
                  }
                  label="Waterproof"
                />
              </Grid>

              <Grid size={12}>
                <FormControl fullWidth>
                  <InputLabel>Brightness</InputLabel>
                  <Select
                    name="brightness"
                    value={formData.brightness}
                    onChange={handleFormChange}
                    label="Brightness"
                    sx={{ borderRadius: '12px' }}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Premium">Premium</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={12}>
                <FormControl fullWidth>
                  <InputLabel>Installation</InputLabel>
                  <Select
                    name="installation"
                    value={formData.installation}
                    onChange={handleFormChange}
                    label="Installation"
                    sx={{ borderRadius: '12px' }}
                  >
                    <MenuItem value="Plug & Play">Plug & Play</MenuItem>
                    <MenuItem value="Professional">Professional</MenuItem>
                    <MenuItem value="DIY">DIY</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Warranty (months)"
                  name="warranty"
                  type="number"
                  value={formData.warranty}
                  onChange={handleFormChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>

              {/* Images Section */}
              <Grid size={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 1 }}>
                  <Box sx={{ width: 4, height: 20, backgroundColor: '#2e7d32', borderRadius: '2px' }} />
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '1rem' }}>
                    Images
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={12}>
                <Box
                  sx={{
                    border: `2px dashed ${formErrors.mainImage ? '#ff4444' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    p: 3,
                    textAlign: 'center',
                    '&:hover': { borderColor: '#2e7d32' },
                    transition: 'border-color 0.3s ease',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'main')}
                    style={{ display: 'none' }}
                    id="mainImageUpload"
                  />
                  <label htmlFor="mainImageUpload">
                    <Button
                      component="span"
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      sx={{
                        borderRadius: '12px',
                        borderColor: formErrors.mainImage ? '#ff4444' : '#e5e7eb',
                        '&:hover': { borderColor: '#2e7d32' },
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      {imagePreviews.main ? 'Change Main Image' : 'Upload Main Image *'}
                    </Button>
                  </label>
                  {imagePreviews.main && (
                    <Box sx={{ mt: 2, position: 'relative', display: 'inline-block' }}>
                      <img
                        src={imagePreviews.main}
                        alt="Main"
                        style={{
                          width: 150,
                          height: 150,
                          objectFit: 'cover',
                          borderRadius: '12px',
                          border: '1px solid #e5e7eb',
                        }}
                      />
                    </Box>
                  )}
                  {formErrors.mainImage && (
                    <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                      {formErrors.mainImage}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={12}>
                <Box
                  sx={{
                    border: '2px dashed #e5e7eb',
                    borderRadius: '12px',
                    p: 3,
                    '&:hover': { borderColor: '#2e7d32' },
                    transition: 'border-color 0.3s ease',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageChange(e, 'more')}
                    style={{ display: 'none' }}
                    id="moreImagesUpload"
                  />
                  <label htmlFor="moreImagesUpload">
                    <Button
                      component="span"
                      variant="outlined"
                      startIcon={<ImageIcon />}
                      sx={{
                        borderRadius: '12px',
                        borderColor: '#e5e7eb',
                        '&:hover': { borderColor: '#2e7d32' },
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Upload More Images
                    </Button>
                  </label>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                    {imagePreviews.more.map((preview, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <img
                          src={preview}
                          alt={`More ${index}`}
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeImage(index)}
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            backgroundColor: 'white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            '&:hover': { backgroundColor: '#ff4444', color: 'white' },
                          }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>

              {/* Featured Section */}
              <Grid size={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 1 }}>
                  <Box sx={{ width: 4, height: 20, backgroundColor: '#2e7d32', borderRadius: '2px' }} />
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '1rem' }}>
                    Featured
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isFeatured}
                      onChange={handleFormChange}
                      name="isFeatured"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#2e7d32',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#2e7d32',
                        },
                      }}
                    />
                  }
                  label="Feature this product"
                />
              </Grid>
            </Grid>
          </form>
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
            Cancel
          </Button>
          <Button
            type="submit"
            form="productForm"
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
            {isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
          </Button>
        </DialogActions>
      </Dialog>

{/* Delete Single Confirmation Dialog - Enhanced Professional */}
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
          {productToDelete?.name}
        </Typography>
        <Typography
          sx={{
            color: '#6b7280',
            fontSize: '0.85rem',
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            mt: 0.5,
          }}
        >
          Brand: {productToDelete?.brand} • Model: {productToDelete?.model}
        </Typography>
      </Box>
    </Box>

    {/* Product Details Grid */}
    <Grid container spacing={1.5} sx={{ mb: 3 }}>
      <Grid size={6}>
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
          Price
        </Typography>
        <Typography
          sx={{
            fontWeight: 600,
            color: '#1a1a2e',
            fontSize: '0.95rem',
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          }}
        >
          €{productToDelete?.price}
        </Typography>
      </Grid>
      <Grid size={6}>
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
          Stock
        </Typography>
        <Typography
          sx={{
            fontWeight: 600,
            color: '#1a1a2e',
            fontSize: '0.95rem',
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          }}
        >
          {productToDelete?.stock} units
        </Typography>
      </Grid>
      <Grid size={6}>
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
          Category
        </Typography>
        <Typography
          sx={{
            fontWeight: 600,
            color: '#1a1a2e',
            fontSize: '0.95rem',
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          }}
        >
          {productToDelete?.category}
        </Typography>
      </Grid>
      <Grid size={6}>
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
            color: productToDelete?.stock === 0 ? '#ff4444' : '#2e7d32',
            fontSize: '0.95rem',
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          }}
        >
          {productToDelete?.stock === 0 ? 'Out of Stock' : 'In Stock'}
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
        this product from your inventory and all associated data.
      </Typography>
    </Box>

    {/* Actions */}
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
        Yes, Delete Product
      </Button>
    </Box>
  </Box>
</Dialog>

{/* Delete Multiple Confirmation Dialog - Enhanced Professional */}
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
  {/* Gradient Header */}
  <Box
    sx={{
      background: 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)',
      p: 12,
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
      
    </Box>
  </Box>

  {/* Content */}
  <Box sx={{ p: 4 }}>
    {/* Selected Products Count */}
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
          Selected Products
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
          {selectedProducts.length} products selected for deletion
        </Typography>
      </Box>
    </Box>

    {/* Product List */}
    <Box
      sx={{
        maxHeight: 200,
        overflowY: 'auto',
        mb: 3,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: '10px',
          '&:hover': {
            backgroundColor: '#a8a8a8',
          },
        },
      }}
    >
      {products
        .filter(p => selectedProducts.includes(p._id))
        .map((product, index) => (
          <Box
            key={product._id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 1.5,
              borderRadius: '10px',
              mb: 0.5,
              backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(255,68,68,0.04)',
              },
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '6px',
                backgroundColor: 'rgba(255,68,68,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#ff4444',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                }}
              >
                {index + 1}
              </Typography>
            </Box>
            <Avatar
              src={product.mainImage ? `http://localhost:5000${product.mainImage}` : ''}
              variant="rounded"
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                flexShrink: 0,
                bgcolor: '#f5f5f5',
              }}
            >
              <ImageIcon sx={{ fontSize: 16, color: '#6b7280' }} />
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: '#1a1a2e',
                  fontSize: '0.85rem',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {product.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography
                  sx={{
                    color: '#6b7280',
                    fontSize: '0.7rem',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  }}
                >
                  {product.brand}
                </Typography>
                <Typography
                  sx={{
                    color: '#6b7280',
                    fontSize: '0.7rem',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  }}
                >
                  •
                </Typography>
                <Typography
                  sx={{
                    color: '#6b7280',
                    fontSize: '0.7rem',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  }}
                >
                  €{product.price}
                </Typography>
                <Typography
                  sx={{
                    color: '#6b7280',
                    fontSize: '0.7rem',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  }}
                >
                  •
                </Typography>
                <Chip
                  label={product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.6rem',
                    backgroundColor: product.stock === 0 ? 'rgba(255,68,68,0.08)' : 'rgba(46,125,50,0.08)',
                    color: product.stock === 0 ? '#ff4444' : '#2e7d32',
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>
          </Box>
        ))}
    </Box>

    {/* Affected Items Summary */}
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1.5,
        mb: 3,
      }}
    >
      {[
        { label: 'Total Selected', value: selectedProducts.length, color: '#1a1a2e' },
        { 
          label: 'In Stock', 
          value: products.filter(p => selectedProducts.includes(p._id) && p.stock > 0).length,
          color: '#2e7d32' 
        },
        { 
          label: 'Out of Stock', 
          value: products.filter(p => selectedProducts.includes(p._id) && p.stock === 0).length,
          color: '#ff4444' 
        },
      ].map((item, index) => (
        <Box
          key={index}
          sx={{
            p: 1.5,
            backgroundColor: 'rgba(0,0,0,0.02)',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid rgba(0,0,0,0.04)',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.6rem',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600,
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            {item.label}
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              color: item.color,
              fontSize: '1.1rem',
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>

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
        all {selectedProducts.length} selected products from your inventory and all associated data.
      </Typography>
    </Box>

    {/* Actions */}
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
        Yes, Delete All {selectedProducts.length} Products
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

export default AdminProducts;