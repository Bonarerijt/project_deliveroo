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
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  alpha,
  Tabs,
  Tab,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  LocalShipping as ShippingIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  QrCode as QrCodeIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Timeline as TimelineIcon,
  Description as DocumentIcon,
  Receipt as ReceiptIcon,
  LocalPrintshop as PrintIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import MapContainer from '../components/MapContainer';

const statusSteps = ['pending', 'in_transit', 'delivered'];
const statusLabels = {
  pending: 'Pending Pickup',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const ParcelDetail = () => {
  const { id } = useParams();
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [changeDestinationOpen, setChangeDestinationOpen] = useState(false);
  const [newDestination, setNewDestination] = useState('');
  const [updatingDestination, setUpdatingDestination] = useState(false);
  const navigate = useNavigate();

  const fetchParcel = useCallback(async () => {
    try {
      const response = await api.get(`/parcels/${id}`);
      setParcel(response.data);
    } catch (error) {
      toast.error('Failed to fetch parcel details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchParcel();
  }, [fetchParcel]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this delivery?')) {
      return;
    }

    try {
      setCancelling(true);
      await api.put(`/parcels/${id}/cancel`);
      toast.success('Parcel cancelled successfully');
      fetchParcel();
    } catch (error) {
      toast.error((error.response && error.response.data && error.response.data.detail) || 'Failed to cancel parcel');
    } finally {
      setCancelling(false);
    }
  };

  const handleChangeDestination = async () => {
    if (!newDestination.trim()) {
      toast.error('Please enter a new destination');
      return;
    }

    try {
      setUpdatingDestination(true);
      await api.put(`/parcels/${id}/destination`, {
        destination_address: newDestination.trim()
      });
      toast.success('Destination updated successfully');
      setChangeDestinationOpen(false);
      setNewDestination('');
      fetchParcel();
    } catch (error) {
      toast.error((error.response && error.response.data && error.response.data.detail) || 'Failed to update destination');
    } finally {
      setUpdatingDestination(false);
    }
  };

  const openChangeDestination = () => {
    setNewDestination(parcel.destination_address);
    setChangeDestinationOpen(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckIcon color="success" />;
      case 'in_transit': return <ShippingIcon color="info" />;
      case 'cancelled': return <CancelIcon color="error" />;
      default: return <PendingIcon color="warning" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#00C853';
      case 'in_transit': return '#2196F3';
      case 'cancelled': return '#FF5252';
      default: return '#FF9800';
    }
  };

  const getStatusIndex = (status) => {
    return statusSteps.indexOf(status);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <ShippingIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          </motion.div>
        </Box>
      </Container>
    );
  }

  if (!parcel) {
    return null;
  }

  const statusIndex = getStatusIndex(parcel.status);
  const canCancel = parcel.status === 'pending';
  const canChangeDestination = parcel.status !== 'delivered' && parcel.status !== 'cancelled';
  const statusColor = getStatusColor(parcel.status);

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Button
              startIcon={<BackIcon />}
              onClick={() => navigate('/')}
              variant="outlined"
              sx={{ borderRadius: 3, px: 3 }}
            >
              Back to Dashboard
            </Button>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h3" fontWeight={800}>
                  Delivery #{parcel.id.toString().padStart(4, '0')}
                </Typography>
                <Chip
                  label={statusLabels[parcel.status] || parcel.status}
                  icon={getStatusIcon(parcel.status)}
                  sx={{
                    bgcolor: alpha(statusColor, 0.1),
                    color: statusColor,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    height: 32,
                    '& .MuiChip-icon': {
                      color: statusColor,
                    },
                  }}
                />
              </Box>
              <Typography variant="body1" color="text.secondary">
                Created on {formatDate(parcel.created_at)}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<ShareIcon />}
              variant="outlined"
              sx={{ borderRadius: 3 }}
            >
              Share
            </Button>
            <Button
              startIcon={<DownloadIcon />}
              variant="outlined"
              onClick={() => toast.success('Receipt downloaded successfully!')}
              sx={{ borderRadius: 3 }}
            >
              Receipt
            </Button>
          </Box>
        </Box>

        {/* Progress Bar */}
        {parcel.status !== 'cancelled' && (
          <Paper sx={{ p: 4, mb: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Delivery Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tracking your package in real-time
              </Typography>
            </Box>
            
            <Box sx={{ position: 'relative', mb: 4 }}>
              <LinearProgress 
                variant="determinate"
                value={statusIndex >= 0 ? ((statusIndex + 1) / statusSteps.length) * 100 : 0}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: alpha('#0066FF', 0.1),
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #0066FF 0%, #00D4AA 100%)',
                    borderRadius: 4,
                  },
                }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                {statusSteps.map((step, index) => (
                  <Box key={step} sx={{ textAlign: 'center', position: 'relative' }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: index <= statusIndex ? '#0066FF' : alpha('#000', 0.1),
                        color: 'white',
                        fontWeight: 600,
                        mb: 1,
                        mx: 'auto',
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography
                      variant="caption"
                      fontWeight={index <= statusIndex ? 600 : 400}
                      color={index <= statusIndex ? 'primary.main' : 'text.secondary'}
                    >
                      {statusLabels[step]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: alpha('#0066FF', 0.05), border: `1px solid ${alpha('#0066FF', 0.1)}` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <LocationIcon sx={{ color: '#0066FF' }} />
                      <Typography variant="h6" fontWeight={600}>
                        Pickup Location
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {parcel.pickup_address}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: alpha('#00D4AA', 0.05), border: `1px solid ${alpha('#00D4AA', 0.1)}` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <LocationIcon sx={{ color: '#00D4AA' }} />
                      <Typography variant="h6" fontWeight={600}>
                        Destination
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {parcel.destination_address}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: alpha('#FF9800', 0.05), border: `1px solid ${alpha('#FF9800', 0.1)}` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <ScheduleIcon sx={{ color: '#FF9800' }} />
                      <Typography variant="h6" fontWeight={600}>
                        Estimated Delivery
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {parcel.duration_mins ? `${parcel.duration_mins} minutes` : 'Calculating...'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Main Content */}
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ mb: 3 }}
            >
              <Tab label="Details" />
              <Tab label="Timeline" />
              <Tab label="Documents" />
            </Tabs>

            <AnimatePresence mode="wait">
              {activeTab === 0 && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper sx={{ p: 4, mb: 4 }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      Route Map
                    </Typography>
                    <MapContainer
                      pickupAddress={parcel.pickup_address}
                      destinationAddress={parcel.destination_address}
                      pickupLat={parcel.pickup_lat}
                      pickupLng={parcel.pickup_lng}
                      destLat={parcel.destination_lat}
                      destLng={parcel.destination_lng}
                      distance={`${(parcel.distance_km && parcel.distance_km.toFixed(1)) || '480'} km`}
                      duration={`${Math.floor((parcel.duration_mins || 390) / 60)}h ${(parcel.duration_mins || 390) % 60}m`}
                    />
                  </Paper>
                  
                  <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      Delivery Details
                    </Typography>
                    
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight={600}>
                              <MoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                              Payment Information
                            </Typography>
                            <List dense>
                              <ListItem>
                                <ListItemText
                                  primary="Total Amount"
                                  secondary={
                                    <Typography variant="h4" color="primary" fontWeight={800}>
                                      ${parcel.quote_amount.toFixed(2)}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Payment Status"
                                  secondary="Paid"
                                />
                                <Chip
                                  label="Paid"
                                  size="small"
                                  sx={{
                                    bgcolor: alpha('#00C853', 0.1),
                                    color: '#00C853',
                                    fontWeight: 600,
                                  }}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Payment Method"
                                  secondary="Credit Card (•••• 4242)"
                                />
                              </ListItem>
                            </List>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight={600}>
                              <ShippingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                              Package Details
                            </Typography>
                            <List dense>
                              <ListItem>
                                <ListItemText
                                  primary="Weight Category"
                                  secondary={parcel.weight_category}
                                />
                                <Chip
                                  label={parcel.weight_category}
                                  size="small"
                                  sx={{
                                    textTransform: 'capitalize',
                                    bgcolor: alpha('#0066FF', 0.1),
                                    color: '#0066FF',
                                    fontWeight: 600,
                                  }}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Distance"
                                  secondary={`${parcel.distance_km && parcel.distance_km.toFixed(1) || 'N/A'} km`}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Current Location"
                                  secondary={parcel.present_location || 'Waiting for pickup'}
                                />
                              </ListItem>
                            </List>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={12}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight={600}>
                              <QrCodeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                              Tracking Information
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Box
                                sx={{
                                  p: 2,
                                  bgcolor: 'white',
                                  borderRadius: 2,
                                  border: '1px solid rgba(0, 0, 0, 0.1)',
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 120,
                                    height: 120,
                                    bgcolor: '#000',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 800,
                                    fontSize: '0.75rem',
                                    letterSpacing: 2,
                                    textAlign: 'center',
                                    lineHeight: 1.2,
                                  }}
                                >
                                  TRACKING {parcel.id.toString().padStart(8, '0')}
                                </Box>
                              </Box>
                              <Box>
                                <Typography variant="body1" fontWeight={600} gutterBottom>
                                  Tracking Number
                                </Typography>
                                <Typography variant="h4" color="primary" fontWeight={800} gutterBottom>
                                  {parcel.id.toString().padStart(10, '0')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Use this number to track your package on our website
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Paper>
                </motion.div>
              )}

              {activeTab === 1 && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <TimelineIcon color="primary" />
                      <Typography variant="h5" fontWeight={600}>
                        Delivery Timeline
                      </Typography>
                    </Box>
                    
                    <Box sx={{ position: 'relative', pl: 4 }}>
                      {/* Timeline items */}
                      <Box sx={{ position: 'relative', pb: 3 }}>
                        <Box sx={{ position: 'absolute', left: -20, top: 0, width: 12, height: 12, bgcolor: '#0066FF', borderRadius: '50%' }} />
                        <Box sx={{ position: 'absolute', left: -14, top: 12, width: 2, height: 'calc(100% - 12px)', bgcolor: alpha('#0066FF', 0.3) }} />
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Order Created
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {formatDate(parcel.created_at)}
                        </Typography>
                        <Typography variant="body2">
                          Your delivery order has been successfully created and is awaiting pickup.
                        </Typography>
                      </Box>

                      {parcel.status !== 'pending' && (
                        <Box sx={{ position: 'relative', pb: 3 }}>
                          <Box sx={{ position: 'absolute', left: -20, top: 0, width: 12, height: 12, bgcolor: '#2196F3', borderRadius: '50%' }} />
                          <Box sx={{ position: 'absolute', left: -14, top: 12, width: 2, height: 'calc(100% - 12px)', bgcolor: alpha('#2196F3', 0.3) }} />
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            Package Picked Up
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {new Date(parcel.updated_at || parcel.created_at).toLocaleDateString('en-US', {
                              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </Typography>
                          <Typography variant="body2">
                            Your package has been collected from {parcel.pickup_address.split(',')[0]} and is now in transit.
                          </Typography>
                        </Box>
                      )}

                      {parcel.present_location && (
                        <Box sx={{ position: 'relative', pb: 3 }}>
                          <Box sx={{ position: 'absolute', left: -20, top: 0, width: 12, height: 12, bgcolor: '#FF9800', borderRadius: '50%' }} />
                          <Box sx={{ position: 'absolute', left: -14, top: 12, width: 2, height: 'calc(100% - 12px)', bgcolor: alpha('#FF9800', 0.3) }} />
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            Location Update
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Current location updated
                          </Typography>
                          <Typography variant="body2">
                            Package is currently at: {parcel.present_location}
                          </Typography>
                        </Box>
                      )}

                      {parcel.status === 'delivered' && (
                        <Box sx={{ position: 'relative', pb: 0 }}>
                          <Box sx={{ position: 'absolute', left: -20, top: 0, width: 12, height: 12, bgcolor: '#00C853', borderRadius: '50%' }} />
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            Package Delivered
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Delivered successfully
                          </Typography>
                          <Typography variant="body2">
                            Your package has been successfully delivered to {parcel.destination_address.split(',')[0]}.
                          </Typography>
                        </Box>
                      )}

                      {parcel.status === 'cancelled' && (
                        <Box sx={{ position: 'relative', pb: 0 }}>
                          <Box sx={{ position: 'absolute', left: -20, top: 0, width: 12, height: 12, bgcolor: '#FF5252', borderRadius: '50%' }} />
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            Order Cancelled
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Cancelled by user
                          </Typography>
                          <Typography variant="body2">
                            This delivery order has been cancelled and will not be processed.
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </motion.div>
              )}

              {activeTab === 2 && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <DocumentIcon color="primary" />
                      <Typography variant="h5" fontWeight={600}>
                        Documents & Receipts
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ cursor: 'pointer', '&:hover': { bgcolor: alpha('#0066FF', 0.02) } }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <ReceiptIcon sx={{ color: '#0066FF' }} />
                              <Typography variant="h6" fontWeight={600}>
                                Delivery Receipt
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Official receipt for your delivery order
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={() => toast.success('Receipt downloaded successfully!')}
                              >
                                Download
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<PrintIcon />}
                                onClick={() => toast.success('Receipt sent to printer!')}
                              >
                                Print
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ cursor: 'pointer', '&:hover': { bgcolor: alpha('#00D4AA', 0.02) } }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <QrCodeIcon sx={{ color: '#00D4AA' }} />
                              <Typography variant="h6" fontWeight={600}>
                                Shipping Label
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Printable shipping label with tracking code
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={() => toast.success('Shipping label downloaded!')}
                              >
                                Download
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<PrintIcon />}
                                onClick={() => toast.success('Label sent to printer!')}
                              >
                                Print
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>

                      {parcel.status === 'delivered' && (
                        <Grid item xs={12} md={6}>
                          <Card variant="outlined" sx={{ cursor: 'pointer', '&:hover': { bgcolor: alpha('#00C853', 0.02) } }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <VerifiedIcon sx={{ color: '#00C853' }} />
                                <Typography variant="h6" fontWeight={600}>
                                  Proof of Delivery
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Official confirmation of successful delivery
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<DownloadIcon />}
                                  onClick={() => toast.success('Proof of delivery downloaded!')}
                                >
                                  Download
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<PrintIcon />}
                                  onClick={() => toast.success('Document sent to printer!')}
                                >
                                  Print
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <Alert severity="info">
                          <Typography variant="body2">
                            All documents are available for download in PDF format. For any issues with document access, please contact our support team.
                          </Typography>
                        </Alert>
                      </Grid>
                    </Grid>
                  </Paper>
                </motion.div>
              )}
            </AnimatePresence>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 4, mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {canChangeDestination && (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={openChangeDestination}
                    fullWidth
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    Change Destination
                  </Button>
                )}
                
                {canCancel && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    disabled={cancelling}
                    fullWidth
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    {cancelling ? 'Cancelling...' : 'Cancel Delivery'}
                  </Button>
                )}
                
                <Button
                  variant="contained"
                  startIcon={<ShippingIcon />}
                  onClick={() => navigate('/create')}
                  fullWidth
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Create Another Delivery
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<HistoryIcon />}
                  onClick={() => navigate('/')}
                  fullWidth
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  View All Deliveries
                </Button>
              </Box>
            </Paper>

            <Paper sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Need Help?
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<PhoneIcon />}
                  fullWidth
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Call Support: +254 700 000 000
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<EmailIcon />}
                  fullWidth
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Email: support@deliveroo.com
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<ChatIcon />}
                  fullWidth
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Live Chat Support
                </Button>
              </Box>

              <Alert
                severity="info"
                sx={{ mt: 3, borderRadius: 2 }}
              >
                <Typography variant="body2">
                  Our support team is available 24/7 to assist you with any questions about your delivery.
                </Typography>
              </Alert>
            </Paper>
          </Grid>
        </Grid>

        {/* Change Destination Dialog */}
        <Dialog
          open={changeDestinationOpen}
          onClose={() => setChangeDestinationOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EditIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Change Destination
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Current destination: {parcel.destination_address}
              </Typography>
              <TextField
                fullWidth
                label="New Destination Address"
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                multiline
                rows={3}
                placeholder="Enter the new destination address..."
                sx={{ mt: 2 }}
              />
              <Alert severity="info" sx={{ mt: 2 }}>
                Changing the destination may affect the delivery cost. The new quote will be calculated automatically.
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setChangeDestinationOpen(false)}
              disabled={updatingDestination}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleChangeDestination}
              disabled={updatingDestination || !newDestination.trim()}
              startIcon={<EditIcon />}
            >
              {updatingDestination ? 'Updating...' : 'Update Destination'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ParcelDetail;