// src/pages/AdminDashboard.jsx
import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import {
  ShoppingBag,
  People,
  AttachMoney,
  MoreVert,
  ArrowUpward,
  ArrowDownward,
  Storefront,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  // Sample data
  const statsData = [
    {
      title: 'Vendite Totali',
      value: '€45,280',
      change: '+12.5%',
      trend: 'up',
      icon: <AttachMoney />,
      color: '#2e7d32',
    },
    {
      title: 'Ordini',
      value: '1,284',
      change: '+8.2%',
      trend: 'up',
      icon: <ShoppingBag />,
      color: '#1976d2',
    },
    {
      title: 'Clienti',
      value: '3,892',
      change: '+15.3%',
      trend: 'up',
      icon: <People />,
      color: '#ed6c02',
    },
    {
      title: 'Prodotti',
      value: '156',
      change: '-2.1%',
      trend: 'down',
      icon: <Storefront />,
      color: '#9c27b0',
    },
  ];

  const salesData = [
    { name: 'Lun', sales: 1200 },
    { name: 'Mar', sales: 1800 },
    { name: 'Mer', sales: 1500 },
    { name: 'Gio', sales: 2200 },
    { name: 'Ven', sales: 2800 },
    { name: 'Sab', sales: 2000 },
    { name: 'Dom', sales: 1600 },
  ];

  const categoryData = [
    { name: 'Side Door', value: 45 },
    { name: 'Front Logo', value: 30 },
    { name: 'Trank Logo', value: 25 },
  ];

  const COLORS = ['#2e7d32', '#1976d2', '#ed6c02'];

  const recentOrders = [
    { id: '#12345', customer: 'Mario Rossi', total: '€890', status: 'Completato', date: '2 min fa' },
    { id: '#12344', customer: 'Luca Bianchi', total: '€1,250', status: 'In elaborazione', date: '15 min fa' },
    { id: '#12343', customer: 'Giulia Verdi', total: '€560', status: 'Spedito', date: '1 ora fa' },
    { id: '#12342', customer: 'Marco Neri', total: '€2,100', status: 'In attesa', date: '2 ore fa' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completato':
        return '#2e7d32';
      case 'In elaborazione':
        return '#ed6c02';
      case 'Spedito':
        return '#1976d2';
      case 'In attesa':
        return '#9c27b0';
      default:
        return '#999999';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              color: '#000000',
              mb: 1,
            }}
          >
            Dashboard
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              color: '#666666',
              fontSize: '0.95rem',
            }}
          >
            Benvenuto! Ecco un riepilogo delle tue attività.
          </Typography>
        </motion.div>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  borderRadius: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                          fontSize: '0.8rem',
                          color: '#999999',
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                          fontSize: '1.8rem',
                          fontWeight: 700,
                          color: '#000000',
                          mt: 1,
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        backgroundColor: `${stat.color}15`,
                        color: stat.color,
                        width: 48,
                        height: 48,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                    <Chip
                      label={stat.change}
                      size="small"
                      sx={{
                        backgroundColor: stat.trend === 'up' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(255, 68, 68, 0.1)',
                        color: stat.trend === 'up' ? '#2e7d32' : '#ff4444',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: '24px',
                      }}
                      icon={stat.trend === 'up' ? <ArrowUpward sx={{ fontSize: '12px' }} /> : <ArrowDownward sx={{ fontSize: '12px' }} />}
                    />
                    <Typography
                      sx={{
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                        fontSize: '0.75rem',
                        color: '#999999',
                      }}
                    >
                      rispetto al mese scorso
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Sales Chart */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                  sx={{
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    fontWeight: 600,
                    color: '#000000',
                    fontSize: '1rem',
                  }}
                >
                  Vendite Settimanali
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#999999" fontSize={12} />
                  <YAxis stroke="#999999" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar dataKey="sales" fill="#2e7d32" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </motion.div>
        </Grid>

        {/* Category Pie Chart */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                  sx={{
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    fontWeight: 600,
                    color: '#000000',
                    fontSize: '1rem',
                  }}
                >
                  Categorie
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                {categoryData.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: COLORS[index],
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                        fontSize: '0.75rem',
                        color: '#666666',
                      }}
                    >
                      {item.name} ({item.value}%)
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                  sx={{
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    fontWeight: 600,
                    color: '#000000',
                    fontSize: '1rem',
                  }}
                >
                  Ordini Recenti
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: '20px',
                    borderColor: '#2e7d32',
                    color: '#2e7d32',
                    textTransform: 'none',
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#1b5e20',
                      backgroundColor: 'rgba(46, 125, 50, 0.05)',
                    },
                  }}
                >
                  Vedi tutti
                </Button>
              </Box>

              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <th style={{ textAlign: 'left', padding: '12px 0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif", fontWeight: 500, color: '#999999', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID Ordine</th>
                      <th style={{ textAlign: 'left', padding: '12px 0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif", fontWeight: 500, color: '#999999', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cliente</th>
                      <th style={{ textAlign: 'left', padding: '12px 0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif", fontWeight: 500, color: '#999999', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Totale</th>
                      <th style={{ textAlign: 'left', padding: '12px 0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif", fontWeight: 500, color: '#999999', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stato</th>
                      <th style={{ textAlign: 'left', padding: '12px 0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif", fontWeight: 500, color: '#999999', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr
                        key={index}
                        style={{
                          borderBottom: index < recentOrders.length - 1 ? '1px solid #f5f5f5' : 'none',
                          transition: 'background-color 0.2s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '12px 0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif", fontWeight: 500, color: '#000000', fontSize: '0.85rem' }}>{order.id}</td>
                        <td style={{ padding: '12px 0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif", color: '#555555', fontSize: '0.85rem' }}>{order.customer}</td>
                        <td style={{ padding: '12px 0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif", fontWeight: 600, color: '#000000', fontSize: '0.85rem' }}>{order.total}</td>
                        <td style={{ padding: '12px 0' }}>
                          <Chip
                            label={order.status}
                            size="small"
                            sx={{
                              backgroundColor: `${getStatusColor(order.status)}15`,
                              color: getStatusColor(order.status),
                              fontWeight: 500,
                              fontSize: '0.7rem',
                              height: '24px',
                            }}
                          />
                        </td>
                        <td style={{ padding: '12px 0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif", color: '#999999', fontSize: '0.8rem' }}>{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;