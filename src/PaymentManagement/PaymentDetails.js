import React, { useEffect, useState } from 'react';
import VerticalNav from '../components/Navi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PaymentDetails({ userID }) {
  const [cashRewards, setCashRewards] = useState([]);
  const [previousPayments, setPreviousPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      console.log(`Fetching payment details for userID: ${userID}`); // Logging userID

      try {
        // Fetching payment details for the specific userID
        const response = await axios.get(`http://localhost:3000/api/payments/payment-details/${userID}`);
        const data = response.data;

        console.log('Payment details response:', data); // Check the structure of the response

        // Assuming data is structured as you provided
        setCashRewards(data.cashRewards || []); // Set cash rewards if available
        setPreviousPayments(data.previousPayments || []); // Set previous payments if available
      } catch (error) {
        console.error('Error fetching payment details:', error.response ? error.response.data : error.message);
      }
    };

    fetchPaymentDetails();
  }, [userID]);

  const calculateTotalCashRewards = () => {
    return cashRewards.reduce((total, reward) => total + reward, 0); // Assuming cash rewards are numbers
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Vertical Navigation */}
      <VerticalNav />

      {/* Main Area */}
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-8 text-green-700">Payment Summary</h1>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cash Rewards Section */}
          <div className="bg-white shadow-lg border border-gray-200 p-6 rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cash Rewards</h2>
            <div className="space-y-4 text-gray-600">
              {cashRewards.map((reward, index) => (
                <div className="flex justify-between text-lg" key={index}>
                  <span>Cash Reward {index + 1}</span>
                  <span>${(reward).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-gray-300 pt-4 mt-4 text-lg font-bold text-gray-700">
              <span>Total Cash Rewards</span>
              <span>${calculateTotalCashRewards().toFixed(2)}</span>
            </div>
          </div>

          {/* Previous Payments Section */}
          <div className="bg-white shadow-lg border border-gray-200 p-6 rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Previous Payments</h2>
            <div className="space-y-4 text-gray-600">
              {previousPayments.map((payment, index) => (
                <div className="flex justify-between text-lg" key={index}>
                  <span>{new Date(payment.createdAt).toLocaleDateString()}</span> {/* Format the date */}
                  <span>${payment.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetails;
