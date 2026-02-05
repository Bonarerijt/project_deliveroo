import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  LocalShipping as TruckIcon,
  CheckCircle as DeliveredIcon,
  LocalShipping as InTransitIcon,
  Schedule as PendingIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
      const response = await api.get('/parcels/');
      setParcels(response.data);
    } catch (error) {
      toast.error('Failed to fetch parcels');
    } finally {
      setLoading(false);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      pending: 0,
      in_transit: 0,
      delivered: 0,
      cancelled: 0,
    };
    
    parcels.forEach(parcel => {
      counts[parcel.status] = (counts[parcel.status] || 0) + 1;
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();
  const totalParcels = parcels.length;

  const pieData = [
    { name: 'Pending', value: statusCounts.pending, color: '#FF9800' },
    { name: 'In Transit', value: statusCounts.in_transit, color: '#2196F3' },
    { name: 'Delivered', value: statusCounts.delivered, color: '#00C853' },
    { name: 'Cancelled', value: statusCounts.cancelled, color: '#FF5252' },
  ].filter(item => item.value > 0);

  const barData = [
    { name: 'This Week', parcels: Math.floor(totalParcels * 0.3) },
    { name: 'Last Week', parcels: Math.floor(totalParcels * 0.4) },
    { name: '2 Weeks Ago', parcels: Math.floor(totalParcels * 0.2) },
    { name: '3 Weeks Ago', parcels: Math.floor(totalParcels * 0.1) },
  ];

  // Fixed stats order: Total Parcels, Delivered, In Transit, Pending
  const stats = [
    {
      title: 'Total Parcels',
      value: totalParcels,
      icon: <TruckIcon sx={{ fontSize: 40 }} />,
      color: '#0066FF',
      change: '+12%',
    },
    {
      title: 'Delivered',
      value: statusCounts.delivered,
      icon: <DeliveredIcon sx={{ fontSize: 40 }} />,
      color: '#00C853',
      change: '+8%',
    },
    {
      title: 'In Transit',
      value: statusCounts.in_transit,
      icon: <InTransitIcon sx={{ fontSize: 40 }} />,
      color: '#2196F3',
      change: '+15%',
    },
    {
      title: 'Pending',
      value: statusCounts.pending,
      icon: <PendingIcon sx={{ fontSize: 40 }} />,
      color: '#FF9800',
      change: '-5%',
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <TruckIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          </motion.div>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h3" fontWeight={800} gutterBottom>
                Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome back! Here's an overview of your deliveries.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create')}
              sx={{ borderRadius: 3, px: 3 }}
            >
              New Delivery
            </Button>
          </Box>
        </motion.div>

        {/* Stats Cards - Fixed order: Total, Delivered, In Transit, Pending */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                    border: `1px solid ${alpha(stat.color, 0.2)}`,
                    height: '100%',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h3" fontWeight={800} color={stat.color}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stat.title}
                        </Typography>
                        <Typography variant="caption" color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}>
                          {stat.change} from last month
                        </Typography>
                      </Box>
                      <Box sx={{ color: stat.color }}>
                        {stat.icon}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Parcel Status Distribution
                </Typography>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">No parcels to display</Typography>
                  </Box>
                )}
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Weekly Activity
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="parcels" fill="#0066FF" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Recent Parcels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Paper sx={{ p: 3, mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight={600}>
                Recent Parcels
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/parcels')}
                sx={{ borderRadius: 2 }}
              >
                View All
              </Button>
            </Box>
            
            {parcels.length > 0 ? (
              <Grid container spacing={2}>
                {parcels.slice(0, 3).map((parcel) => (
                  <Grid item xs={12} md={4} key={parcel.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { transform: 'translateY(-2px)' },
                        transition: 'transform 0.2s',
                      }}
                      onClick={() => navigate(`/parcel/${parcel.id}`)}
                    >
                      <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          #{parcel.id.toString().padStart(4, '0')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {parcel.pickup_address} → {parcel.destination_address}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                          <Typography variant="body2" fontWeight={600}>
                            ${parcel.quote_amount}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: parcel.status === 'delivered' ? 'success.light' : 
                                      parcel.status === 'in_transit' ? 'info.light' : 'warning.light',
                              color: 'white',
                              textTransform: 'capitalize',
                            }}
                          >
                            {parcel.status.replace('_', ' ')}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <TruckIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No parcels yet
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Create your first delivery to get started
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/create')}
                >
                  Create Delivery
                </Button>
              </Box>
            )}
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Dashboard;

