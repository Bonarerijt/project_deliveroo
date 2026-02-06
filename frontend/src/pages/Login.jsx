import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Fade,
} from '@mui/material';
import { 
  Login as LoginIcon,
  LocalShipping as TruckIcon,
  Speed as SpeedIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.data.access_token) {
        login(response.data.access_token);
        toast.success('Welcome back!');
        
        // Decode token to check if user is admin
        const payload = JSON.parse(atob(response.data.access_token.split('.')[1]));
        if (payload.is_admin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError((err.response && err.response.data && err.response.data.detail) || 'Login failed. Please check your credentials.');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <TruckIcon sx={{ fontSize: 40 }} />,
      title: 'Fast Delivery',
      description: 'Express shipping across the region',
      color: '#0066FF',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Real-time Tracking',
      description: 'Live updates on your package location',
      color: '#00D4AA',
    },
    {
      icon: <ShieldIcon sx={{ fontSize: 40 }} />,
      title: 'Secure & Insured',
      description: 'Your items are protected',
      color: '#FF5252',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Box sx={{ width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                  p: 3,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.1) 0%, rgba(0, 212, 170, 0.05) 100%)',
                  border: '1px solid rgba(0, 102, 255, 0.1)',
                }}
              >
                <TruckIcon
                  sx={{
                    fontSize: 48,
                    color: 'primary.main',
                    animation: 'drive 3s infinite ease-in-out',
                    '@keyframes drive': {
                      '0%, 100%': { transform: 'translateX(0)' },
                      '50%': { transform: 'translateX(10px)' },
                    },
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #0066FF 0%, #00D4AA 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Deliveroo
                </Typography>
              </Box>
              <Typography variant="h5" color="text.secondary" fontWeight={500}>
                Premium Courier Delivery Service
              </Typography>
            </Box>
          </motion.div>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            {/* Features Section */}
            <Box sx={{ flex: 1 }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Why Choose Us?
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Experience the future of courier services with real-time tracking, 
                  premium security, and lightning-fast delivery across the region.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                    >
                      <Paper
                        sx={{
                          p: 3,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(0, 0, 0, 0.05)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 40px rgba(0, 102, 255, 0.15)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${feature.color}15 0%, ${feature.color}05 100%)`,
                            border: `1px solid ${feature.color}20`,
                          }}
                        >
                          <Box sx={{ color: feature.color }}>
                            {feature.icon}
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {feature.description}
                          </Typography>
                        </Box>
                      </Paper>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Box>

            {/* Login Form */}
            <Box sx={{ flex: 1, maxWidth: { md: 400 } }}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Paper
                  sx={{
                    p: 4,
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 102, 255, 0.1)',
                  }}
                >
                  <Typography variant="h4" fontWeight={700} gutterBottom align="center">
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" color="text.secondary" align="center" paragraph>
                    Sign in to manage your deliveries
                  </Typography>

                  {error && (
                    <Fade in={!!error}>
                      <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                      </Alert>
                    </Fade>
                  )}

                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      margin="normal"
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      margin="normal"
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<LoginIcon />}
                        disabled={loading}
                        sx={{
                          mt: 3,
                          py: 1.5,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #0066FF 0%, #00D4AA 100%)',
                          fontWeight: 600,
                          fontSize: '1rem',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #0052CC 0%, #00A888 100%)',
                          },
                        }}
                      >
                        {loading ? 'Signing in...' : 'Sign In'}
                      </Button>
                    </motion.div>
                  </form>

                  <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
                    <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                      Sample Credentials
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'rgba(0, 102, 255, 0.05)',
                        borderColor: 'rgba(0, 102, 255, 0.1)',
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="caption" fontWeight={600}>
                          👨💼 Admin Account
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Email: admin@deliveroo.com
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Password: admin123
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="caption" fontWeight={600}>
                          👤 User Account
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Email: user@deliveroo.com
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Password: user123
                        </Typography>
                      </Box>
                    </Paper>
                    
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Don't have an account?{' '}
                        <Button
                          variant="text"
                          onClick={() => navigate('/register')}
                          sx={{
                            color: 'primary.main',
                            fontWeight: 600,
                            textTransform: 'none',
                            p: 0,
                            minWidth: 'auto',
                            '&:hover': {
                              background: 'transparent',
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          Create one here
                        </Button>
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            </Box>
          </Box>

          {/* Stats Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Box
              sx={{
                mt: 6,
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 4,
              }}
            >
              {[
                { value: '10K+', label: 'Deliveries Completed' },
                { value: '99.7%', label: 'Success Rate' },
                { value: '<2h', label: 'Avg. Response Time' },
                { value: '24/7', label: 'Support Available' },
              ].map((stat, index) => (
                <Paper
                  key={stat.label}
                  sx={{
                    p: 3,
                    minWidth: 150,
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 102, 255, 0.1)',
                  }}
                >
                  <Typography variant="h4" fontWeight={800} color="primary.main">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;