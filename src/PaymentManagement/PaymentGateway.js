import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

const mockResponse = { data: { clientSecret: 'secret' } };

axios.post.mockResolvedValueOnce(mockResponse);

// Load your Stripe publishable key
const stripePromise = loadStripe('pk_test_51QBBKGAOG92iZv0dAR3XuiGpwp9x0MOmUmPq7Zu7SvqLzXlLg8g0s8PTWIyZOaxINjZDeDHSU8wTOM3ygSU6Sxdu00yMRWFqNi'); // Replace with your actual publishable key

// Factory for creating payment requests
const PaymentRequestFactory = (amount, userId, paymentMethodId, billingDetails) => {
  return {
    amount: amount * 100, // Convert to cents
    userId: userId,
    paymentMethodId: paymentMethodId,
    billingDetails: billingDetails,
  };
};

const PaymentGateway = () => {
  const location = useLocation();
  const { amount, userId } = location.state || { amount: 0 }; 
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', address: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
      e.preventDefault();
      const cardElement = elements.getElement(CardElement);

      // Create payment method using card details
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: formData.name,
          email: formData.email,
          address: {
            line1: formData.address,
          },
        },
      });

      if (error) {
        setPaymentError(error.message);
      } else {
        const paymentRequest = PaymentRequestFactory(amount, userId, paymentMethod.id, {
          name: formData.name,
          email: formData.email,
          address: { line1: formData.address },
        });

        try {
          // Send payment method to the backend to create a payment intent
          const response = await fetch('http://localhost:3000/api/payments/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentRequest),
          });

          if (!response.ok) {
            const errorData = await response.json();
            setPaymentError(`Backend error: ${errorData.message}`);
            return;
          }

          const { clientSecret } = await response.json();

          // Confirm the card payment
          const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: paymentMethod.id,
          });

          if (result.error) {
            setPaymentError(result.error.message);
          } else if (result.paymentIntent.status === 'succeeded') {
            // Save payment details to the database
            await savePaymentDetails(paymentRequest);

            setPaymentSuccess('Payment successful and details saved!');
          }
        } catch (error) {
          setPaymentError(`Error processing payment: ${error.message}`);
        }
      }
    };

    // Separate function to save payment details
    const savePaymentDetails = async (paymentRequest) => {
      try {
        const saveResponse = await axios.post('http://localhost:3000/api/payments/savePayment', paymentRequest, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!saveResponse.status === 200) {
          const errorData = await saveResponse.data;
          throw new Error(`Failed to save payment: ${errorData.message}`);
        }
      } catch (error) {
        throw new Error(error.message);
      }
    };

    return (
      <div className="bg-white shadow-lg border border-gray-200 p-8 rounded-lg max-w-3xl mx-auto mt-10">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Payment Gateway</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-2 w-full"
                required
              />
            </div>
            {/* Email Input */}
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-2 w-full"
                required
              />
            </div>
            {/* Address Input */}
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="address">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-2 w-full"
                required
              />
            </div>
            {/* Card Element */}
            <div className="border border-gray-300 rounded-lg p-4">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#333',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#fa755a',
                      iconColor: '#fa755a',
                    },
                  },
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-lg mt-6 w-full hover:bg-green-700 transition-all duration-300 ease-in-out"
            disabled={!stripe}
          >
            Pay ${amount}
          </button>
          {paymentError && <div className="text-red-500 mt-4">{paymentError}</div>}
          {paymentSuccess && <div className="text-green-500 mt-4">{paymentSuccess}</div>}
        </form>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-green-600 text-white py-4">
        <h1 className="text-3xl text-center font-bold">Waste Wise</h1>
      </header>

      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>

      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="text-center">
          <p>&copy; 2024 Waste Wise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PaymentGateway;
