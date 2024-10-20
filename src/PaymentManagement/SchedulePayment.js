import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Factory function for calculating payment based on device type
const PaymentCalculationFactory = (deviceType, spaceLeft, capacity) => {
  const usedCapacity = capacity - spaceLeft;
  const usagePercentage = (usedCapacity / capacity) * 100;

  let baseAmount = (usagePercentage / 10) * 10; // Example calculation: modify as needed
  let discountAmount = 0;

  if (deviceType === 'Paper' || deviceType === 'Glass') {
    discountAmount = baseAmount * 0.2; // 20% discount
    baseAmount *= 0.8; // Apply discount (80% of original amount)
  }

  return {
    usedCapacity,
    usagePercentage: usagePercentage.toFixed(2),
    baseAmount: (baseAmount + discountAmount).toFixed(2),
    discountAmount: discountAmount.toFixed(2),
    finalAmount: baseAmount.toFixed(2),
  };
};

// Payment Strategy for handling different payment methods
const cardPaymentStrategy = (amount, userId, navigate) => {
  navigate('/PaymentGateway', { state: { amount: amount, userId: userId } });
};

const walletPaymentStrategy = (amount, userId, navigate) => {
  console.log(`Processing wallet payment for userId: ${userId}, amount: $${amount}`);
  // Show toast message for wallet payment confirmation
  toast.success(`Wallet payment of $${amount} confirmed!`, { autoClose: 3000 });

  // Redirect to the homepage after 3 seconds (delay for toast to show)
  setTimeout(() => {
    navigate('/Homepage');
  }, 3000);
};

// PaymentStrategyContext: Executes the correct strategy (payment method)
const PaymentStrategyContext = ({ strategy, amount, userId, navigate }) => {
  return strategy(amount, userId, navigate);
};

function SchedulePayment({ deviceId, userId }) {
  const [deviceData, setDeviceData] = useState(null);
  const [error, setError] = useState(null);
  const [amountToPay, setAmountToPay] = useState(0);
  const [calculationDetails, setCalculationDetails] = useState({});
  const navigate = useNavigate();

  // Fetch device data from API
  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/payments/viewSchedulePayment`, {
          params: { deviceId: deviceId },
        });

        const data = response.data[0];
        const { spaceLeft, capacity, deviceType } = data;

        // Calculate payment amount using factory
        const calculation = PaymentCalculationFactory(deviceType, spaceLeft, capacity);

        setDeviceData(data);
        setAmountToPay(calculation.finalAmount);
        setCalculationDetails(calculation);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDeviceData();
  }, [deviceId]);

  const handlePayment = (paymentMethod) => {
    // Switch between payment methods
    const strategy = paymentMethod === 'card' ? cardPaymentStrategy : walletPaymentStrategy;
    PaymentStrategyContext({ strategy, amount: amountToPay, userId, navigate });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <ToastContainer />
      <header className="bg-green-600 text-white py-4">
        <h1 className="text-3xl text-center font-bold">Waste Wise</h1>
      </header>

      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-4xl font-bold text-center text-green-700 mb-6">
            Schedule Payment
          </h1>

          {error ? (
            <div className="text-red-600 text-center font-semibold mb-4">{error}</div>
          ) : !deviceData ? (
            <div className="text-gray-600 text-center animate-pulse text-lg">Loading...</div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Amount Calculation Details:</h2>
              <div className="border-b border-gray-300 mb-4"></div>
              <ul className="list-disc pl-6 text-lg space-y-2">
                <li>
                  <span className="text-gray-800">
                    Used Capacity: <strong>{calculationDetails.usedCapacity} units</strong>
                  </span>
                </li>
                <li>
                  <span className="text-gray-800">
                    Usage Percentage: <strong>{calculationDetails.usagePercentage}%</strong>
                  </span>
                </li>
                <li>
                  <span className="text-gray-800">
                    Base Amount (before discount): <strong>${calculationDetails.baseAmount}</strong>
                  </span>
                </li>
                {calculationDetails.discountAmount > 0 && (
                  <li>
                    <span className="text-red-500">
                      Discount Amount: -<strong>${calculationDetails.discountAmount}</strong>
                    </span>
                  </li>
                )}
                <li className="font-bold text-lg text-green-600">
                  Final Amount to Pay: <strong>${amountToPay}</strong>
                </li>
              </ul>

              <div className="mt-6 text-center">
                <button
                  className="bg-green-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-green-700 transition duration-200 w-full text-lg"
                  onClick={() => handlePayment('card')}>
                  Confirm Card Payment
                </button>
                <button
                  className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-blue-700 transition duration-200 w-full text-lg mt-4"
                  onClick={() => handlePayment('wallet')}>
                  Confirm Wallet Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-4">
        <div className="text-center">
          <p>&copy; 2024 Waste Wise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default SchedulePayment;
