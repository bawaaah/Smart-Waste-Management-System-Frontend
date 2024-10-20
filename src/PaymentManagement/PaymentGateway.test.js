// PaymentGateway.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PaymentGateway from './PaymentGateway';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { MemoryRouter, Route } from 'react-router-dom';
import axios from 'axios';

// Mock Stripe's loadStripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({ createPaymentMethod: jest.fn() })),
}));

// Mock axios for API calls
jest.mock('axios');

const stripePromise = loadStripe('pk_test_51QBBKGAOG92iZv0dAR3XuiGpwp9x0MOmUmPq7Zu7SvqLzXlLg8g0s8PTWIyZOaxINjZDeDHSU8wTOM3ygSU6Sxdu00yMRWFqNi');

describe('PaymentGateway', () => {
  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/payment', state: { amount: 10, userId: '123' } }]}>
        <Elements stripe={stripePromise}>
          <PaymentGateway />
        </Elements>
      </MemoryRouter>
    );
  });

  test('renders payment form', () => {
    expect(screen.getByText(/Payment Gateway/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByText(/Pay \$/)).toBeInTheDocument();
  });

  test('handles form input', () => {
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Main St' } });

    expect(screen.getByLabelText(/Name/i).value).toBe('John Doe');
    expect(screen.getByLabelText(/Email/i).value).toBe('john@example.com');
    expect(screen.getByLabelText(/Address/i).value).toBe('123 Main St');
  });

  test('shows error message on payment error', async () => {
    const errorMessage = 'Failed to create payment method.';
    const { createPaymentMethod } = require('@stripe/stripe-js');

    createPaymentMethod.mockResolvedValue({ error: { message: errorMessage } });

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Main St' } });
    fireEvent.click(screen.getByText(/Pay \$/));

    const errorElement = await screen.findByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });

  test('shows success message on successful payment', async () => {
    const { createPaymentMethod } = require('@stripe/stripe-js');
    const paymentIntentResponse = { clientSecret: 'secret' };
    const savePaymentResponse = { status: 200 };

    createPaymentMethod.mockResolvedValue({ paymentMethod: { id: 'pm_123' } });
    require('axios').post.mockResolvedValueOnce({ data: paymentIntentResponse });
    require('axios').post.mockResolvedValueOnce(savePaymentResponse);

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Main St' } });
    fireEvent.click(screen.getByText(/Pay \$/));

    const successElement = await screen.findByText(/Payment successful and details saved!/i);
    expect(successElement).toBeInTheDocument();
  });
});
