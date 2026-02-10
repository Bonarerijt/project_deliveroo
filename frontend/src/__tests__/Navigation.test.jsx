import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navigation from '../components/Navigation';
import { AuthContext } from '../contexts/AuthContext';

const theme = createTheme();

const mockUser = {
  id: 1,
  email: 'test@example.com',
  full_name: 'Test User',
  is_admin: false,
  is_active: true,
};

const mockAuthContext = {
  user: mockUser,
  login: jest.fn(),
  logout: jest.fn(),
  loading: false,
};

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={mockAuthContext}>
          {component}
        </AuthContext.Provider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Navigation Component', () => {
  test('renders navigation with user menu', () => {
    renderWithProviders(<Navigation />);
    
    expect(screen.getByText('Deliveroo')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('My Parcels')).toBeInTheDocument();
    expect(screen.getByText('New Delivery')).toBeInTheDocument();
  });

  test('shows admin link for admin users', () => {
    const adminContext = {
      ...mockAuthContext,
      user: { ...mockUser, is_admin: true },
    };

    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthContext.Provider value={adminContext}>
            <Navigation />
          </AuthContext.Provider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  test('handles logout correctly', () => {
    renderWithProviders(<Navigation />);
    
    const userMenuButton = screen.getByRole('button', { name: /account/i });
    fireEvent.click(userMenuButton);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockAuthContext.logout).toHaveBeenCalled();
  });
});