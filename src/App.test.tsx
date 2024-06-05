import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Birthdays Calendar heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Birthdays Calendar/i);
  expect(headingElement).toBeInTheDocument();
});
