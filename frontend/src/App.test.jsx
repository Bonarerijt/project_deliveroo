import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App component', () => {
  render(<App />);
  // Add your assertions here
  expect(screen.getByTestId('app-container')).toBeInTheDocument();
});

