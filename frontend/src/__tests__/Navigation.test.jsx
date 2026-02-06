import React from 'react';
import { render, screen } from '@testing-library/react';
import Navigation from '../components/Navigation';

test('renders Navigation component', () => {
  render(<Navigation />);
  // Add your assertions here
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});

