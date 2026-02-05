import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import theme from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ParcelCreate from './pages/ParcelCreate';
import ParcelList from './pages/ParcelList';
import ParcelDetail from './pages/ParcelDetail';

// Components
import Navigation from './components/Navigation';

const AppRoutes = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #F8FAFF 0%, #E8F4FF 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '300px',
            background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.1) 0%, rgba(0, 212, 170, 0.05) 100%)',
            zIndex: 0,
          },
        }}
      >
        {/* Animated background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 102, 255, 0.05) 0%, transparent 70%)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 212, 170, 0.05) 0%, transparent 70%)',
            zIndex: 0,
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {isAuthenticated && !user?.is_admin && <Navigation />}
          <Routes>
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Login />
                  </motion.div>
                ) : (
                  user?.is_admin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                !isAuthenticated ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Register />
                  </motion.div>
                ) : (
                  user?.is_admin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />
                )
              } 
            />
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  user?.is_admin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />
                ) : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated && !user?.is_admin ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Dashboard />
                  </motion.div>
                ) : <Navigate to={user?.is_admin ? "/admin" : "/login"} replace />
              } 
            />
            <Route 
              path="/parcels" 
              element={
                isAuthenticated && !user?.is_admin ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ParcelList />
                  </motion.div>
                ) : <Navigate to={user?.is_admin ? "/admin" : "/login"} replace />
              } 
            />
            <Route 
              path="/create" 
              element={
                isAuthenticated && !user?.is_admin ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <ParcelCreate />
                  </motion.div>
                ) : <Navigate to={user?.is_admin ? "/admin" : "/login"} replace />
              } 
            />
            <Route 
              path="/admin" 
              element={
                isAuthenticated && user?.is_admin ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AdminDashboard />
                  </motion.div>
                ) : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/parcel/:id" 
              element={
                isAuthenticated ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ParcelDetail />
                  </motion.div>
                ) : <Navigate to="/login" replace />
              } 
            />
          </Routes>
        </Box>
      </Box>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[4],
          },
        }}
      />
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
