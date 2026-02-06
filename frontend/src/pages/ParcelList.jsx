import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  LocalShipping as TruckIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const ParcelList = () => {
  const [parcels, setParcels] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchParcels();
  }, []);

  useEffect(() => {
    filterParcels();
  }, [parcels, searchTerm, statusFilter]);

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

  const filterParcels = () => {
    let filtered = parcels;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(parcel =>
        parcel.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.destination_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.id.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(parcel => parcel.status === statusFilter);
    }

    setFilteredParcels(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#00C853';
      case 'in_transit': return '#2196F3';
      case 'cancelled': return '#FF5252';
      default: return '#FF9800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleQuickCancel = async (parcelId, event) => {
    event.stopPropagation(); // Prevent card click
    
    if (!window.confirm('Are you sure you want to cancel this delivery?')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [parcelId]: 'cancelling' }));
      await api.put(`/parcels/${parcelId}/cancel`);
      toast.success('Parcel cancelled successfully');
      fetchParcels();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to cancel parcel');
    } finally {
      setActionLoading(prev => ({ ...prev, [parcelId]: null }));
    }
  };

  const handleQuickEdit = (parcelId, event) => {
    event.stopPropagation(); // Prevent card click
    navigate(`/parcel/${parcelId}`);
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
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
                My Parcels
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track and manage all your deliveries
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Paper sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search by address or parcel ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {statusOptions.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      onClick={() => setStatusFilter(option.value)}
                      variant={statusFilter === option.value ? 'filled' : 'outlined'}
                      color={statusFilter === option.value ? 'primary' : 'default'}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Parcels Grid */}
        {filteredParcels.length > 0 ? (
          <Grid container spacing={3}>
            {filteredParcels.map((parcel, index) => (
              <Grid item xs={12} md={6} lg={4} key={parcel.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 30px rgba(0, 102, 255, 0.15)',
                      },
                    }}
                    onClick={() => navigate(`/parcel/${parcel.id}`)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight={600}>
                          #{parcel.id.toString().padStart(4, '0')}
                        </Typography>
                        <Chip
                          label={parcel.status.replace('_', ' ')}
                          size="small"
                          sx={{
                            bgcolor: alpha(getStatusColor(parcel.status), 0.1),
                            color: getStatusColor(parcel.status),
                            fontWeight: 500,
                            textTransform: 'capitalize',
                          }}
                        />
                      </Box>

                      {/* Route */}
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                          <LocationIcon sx={{ color: '#0066FF', mt: 0.5, fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              From
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {parcel.pickup_address.length > 40 
                                ? `${parcel.pickup_address.substring(0, 40)}...` 
                                : parcel.pickup_address}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <LocationIcon sx={{ color: '#00D4AA', mt: 0.5, fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              To
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {parcel.destination_address.length > 40 
                                ? `${parcel.destination_address.substring(0, 40)}...` 
                                : parcel.destination_address}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Details */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MoneyIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="h6" fontWeight={600} color="primary.main">
                            ${parcel.quote_amount}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(parcel.created_at)}
                        </Typography>
                      </Box>

                      {/* Weight Category */}
                      <Box sx={{ mt: 2 }}>
                        <Chip
                          label={parcel.weight_category}
                          size="small"
                          variant="outlined"
                          sx={{
                            textTransform: 'capitalize',
                            borderColor: alpha('#0066FF', 0.3),
                            color: '#0066FF',
                          }}
                        />
                      </Box>

                      {/* Present Location */}
                      {parcel.present_location && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: alpha('#2196F3', 0.05), borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Current Location
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {parcel.present_location}
                          </Typography>
                        </Box>
                      )}

                      {/* Quick Actions */}
                      {(parcel.status !== 'delivered' && parcel.status !== 'cancelled') && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={(e) => handleQuickEdit(parcel.id, e)}
                            sx={{ flex: 1, fontSize: '0.75rem' }}
                          >
                            Change Destination
                          </Button>
                          {parcel.status === 'pending' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<CancelIcon />}
                              onClick={(e) => handleQuickCancel(parcel.id, e)}
                              disabled={actionLoading[parcel.id] === 'cancelling'}
                              sx={{ flex: 1, fontSize: '0.75rem' }}
                            >
                              {actionLoading[parcel.id] === 'cancelling' ? 'Cancelling...' : 'Cancel'}
                            </Button>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <TruckIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {searchTerm || statusFilter !== 'all' ? 'No parcels found' : 'No parcels yet'}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first delivery to get started'
                }
              </Typography>
              {(!searchTerm && statusFilter === 'all') && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/create')}
                  sx={{ mt: 2 }}
                >
                  Create Delivery
                </Button>
              )}
            </Paper>
          </motion.div>
        )}
      </Box>
    </Container>
  );
};

export default ParcelList;