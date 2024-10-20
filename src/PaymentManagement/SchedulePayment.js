import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { calculatePayment, cardPaymentStrategy, walletPaymentStrategy, fetchDeviceData } from './PaymentService'; // Adjust the import path as necessary

function SchedulePayment({ deviceId, userId }) {
  const [deviceData, setDeviceData] = useState(null);
  const [error, setError] = useState(null);
  const [amountToPay, setAmountToPay] = useState(0);
  const [calculationDetails, setCalculationDetails] = useState({});
  const navigate = useNavigate();

  // Fetch device data from API
  useEffect(() => {
    const loadDeviceData = async () => {
      try {
        const data = await fetchDeviceData(deviceId);
        const { spaceLeft, capacity, deviceType } = data;

        // Calculate payment amount using factory
        const calculation = calculatePayment(deviceType, spaceLeft, capacity);

        setDeviceData(data);
        setAmountToPay(calculation.finalAmount);
        setCalculationDetails(calculation);
      } catch (err) {
        setError(err.message);
      }
    };

    loadDeviceData();
  }, [deviceId]);

  const handlePayment = (paymentMethod) => {
    // Switch between payment methods
    const strategy = paymentMethod === 'card' ? cardPaymentStrategy : walletPaymentStrategy;
    strategy(amountToPay, userId, navigate);
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
