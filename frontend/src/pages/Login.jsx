import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Link,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  alpha,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  LocalShipping as TruckIcon,
  Speed as SpeedIcon,
  LocationOn as LocationIcon,
  Security as SecurityIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const features = [
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Fast Delivery',
      description: 'Lightning-fast delivery within 2-4 hours',
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40 }} />,
      title: 'Real-time Tracking',
      description: 'Track your package live on the map',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure & Insured',
      description: 'Fully insured packages with proof of delivery',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Deliveries Completed' },
    { value: '99.7%', label: 'Success Rate' },
    { value: '50K+', label: 'Happy Customers' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 0,
        }}
      >
        {/* Left Side - Features */}
        <Box
          sx={{
            flex: 1,
            background: 'linear-gradient(135deg, #0066FF 0%, #004CB8 50%, #00D4AA 100%)',
            display: { xs: 'none', lg: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 6,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Animated background elements */}
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              animation: 'float 6s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-20px)' },
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '20%',
              right: '10%',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              animation: 'float 8s ease-in-out infinite reverse',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-20px)' },
              },
            }}
          />

          {/* Animated Logo */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 120,
                  height: 120,
                  borderRadius: '30px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  mb: 4,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <TruckIcon sx={{ fontSize: 60, color: 'white' }} />
              </Box>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h2"
              fontWeight={800}
              sx={{ color: 'white', mb: 2, textAlign: 'center' }}
            >
              Deliveroo
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 6, textAlign: 'center' }}
            >
              Fast, reliable parcel delivery at your fingertips
            </Typography>
          </motion.div>

          {/* Feature Cards */}
          <Grid container spacing={3} sx={{ maxWidth: 600 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} key={feature.title}>
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 3,
                    }}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
                      <Box
                        sx={{
                          color: 'white',
                          '& .MuiSvgIcon-root': {
                            fontSize: 40,
                          },
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={600} sx={{ color: 'white' }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {feature.description}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Stats Footer */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 6,
                mt: 6,
                pt: 4,
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {stats.map((stat, index) => (
                <Box key={stat.label} sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{ color: 'white' }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Box>

        {/* Right Side - Login Form */}
        <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', py: 8 }}>
          <Box sx={{ width: '100%' }}>
            {/* Mobile Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ textAlign: 'center', mb: 4, display: { xs: 'block', lg: 'none' } }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #0066FF 0%, #00D4AA 100%)',
                    mb: 2,
                  }}
                >
                  <TruckIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h3" fontWeight={800} gutterBottom>
                  Deliveroo
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sign in to your account
                </Typography>
              </Box>
            </motion.div>

            {/* Desktop Title - Hidden on mobile */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              sx={{ display: { xs: 'none', lg: 'block' } }}
            >
              <Typography variant="h3" fontWeight={800} gutterBottom sx={{ textAlign: 'center' }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
                Sign in to access your deliveries
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Paper sx={{ p: 4 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
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
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Link
                      component={RouterLink}
                      to="/forgot-password"
                      underline="hover"
                      variant="body2"
                    >
                      Forgot password?
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      mb: 3,
                      background: 'linear-gradient(135deg, #0066FF 0%, #3399FF 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0052CC 0%, #0066FF 100%)',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Sign In'}
                  </Button>
                </form>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link component={RouterLink} to="/register" underline="hover" fontWeight={600}>
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </Paper>

              {/* Mobile Stats - Only visible on mobile */}
              <Box
                sx={{
                  display: { xs: 'flex', lg: 'none' },
                  justifyContent: 'center',
                  gap: 3,
                  mt: 4,
                  p: 3,
                  background: alpha('#0066FF', 0.05),
                  borderRadius: 3,
                }}
              >
                {stats.map((stat) => (
                  <Box key={stat.label} sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={800} color="primary.main">
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;

