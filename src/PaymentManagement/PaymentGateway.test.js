// PaymentGateway.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PaymentGateway from './PaymentGateway';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

// Mock the Stripe library
jest.mock('@stripe/stripe-js');
jest.mock('axios');

const mockStripePromise = Promise.resolve({
  createPaymentMethod: jest.fn().mockResolvedValue({
    paymentMethod: { id: 'pm_test' },
  }),
  confirmCardPayment: jest.fn().mockResolvedValue({
    paymentIntent: { status: 'succeeded' },
  }),
});

beforeEach(() => {
  loadStripe.mockReturnValue(mockStripePromise);
  axios.post.mockResolvedValue({ status: 200, data: { clientSecret: 'secret' } });
});

test('renders PaymentGateway and processes payment successfully', async () => {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/payment', state: { amount: 10, userId: 'user123' } }]}>
      <Elements stripe={mockStripePromise}>
        <PaymentGateway />
      </Elements>
    </MemoryRouter>
  );

  // Fill out the form
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
  fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });

  // Simulate submitting the form
  fireEvent.click(screen.getByRole('button', { name: /pay/i }));

  // Wait for success message
  await waitFor(() => {
    expect(screen.getByText(/payment successful and details saved/i)).toBeInTheDocument();
  });
});

test('shows error message on payment failure', async () => {
  // Mock the API to return an error
  axios.post.mockRejectedValueOnce(new Error('Payment processing error'));

  render(
    <MemoryRouter initialEntries={[{ pathname: '/payment', state: { amount: 10, userId: 'user123' } }]}>
      <Elements stripe={mockStripePromise}>
        <PaymentGateway />
      </Elements>
    </MemoryRouter>
  );

  // Fill out the form
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
  fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '456 Main St' } });

  // Simulate submitting the form
  fireEvent.click(screen.getByRole('button', { name: /pay/i }));

  // Wait for error message
  await waitFor(() => {
    expect(screen.getByText(/error processing payment/i)).toBeInTheDocument();
  });
});
