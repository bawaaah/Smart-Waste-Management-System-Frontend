import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation } from 'react-router-dom';

// Load your Stripe publishable key
const stripePromise = loadStripe('pk_test_your_public_key'); // Replace with your actual publishable key

const PaymentGateway = () => {
  const location = useLocation();
  const { amount } = location.state || { amount: 0 }; // Accessing amount from location.state
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

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
      });

      if (error) {
        setPaymentError(error.message);
      } else {
        // Send payment method to the backend to create payment intent
        const response = await fetch('http://localhost:3000/api/payments/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: amount * 100 }), // amount in cents
        });

        if (!response.ok) {
          const errorData = await response.json();
          setPaymentError(`Backend error: ${errorData.message}`);
          return;
        }

        const { clientSecret } = await response.json();

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

        if (result.error) {
          setPaymentError(result.error.message);
        } else if (result.paymentIntent.status === 'succeeded') {
          setPaymentSuccess('Payment successful!');
        }
      }
    };

    return (
      <div className="bg-white shadow-lg border border-gray-200 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Gateway</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 text-gray-600">
            <CardElement />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-8 py-4 rounded-lg mt-4 hover:bg-green-700 transition-all duration-300 ease-in-out"
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
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentGateway;
