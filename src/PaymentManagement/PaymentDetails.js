import React from 'react';
import VerticalNav from '../components/Navi';
import { Link } from 'react-router-dom';

function PaymentDetails() {
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
              <div className="flex justify-between text-lg">
                <span>Reusable Waste Products</span>
                <span>$120.00</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Recyclable Waste Products</span>
                <span>$85.00</span>
              </div>
            </div>
            <div className="flex justify-between border-t border-gray-300 pt-4 mt-4 text-lg font-bold text-gray-700">
              <span>Total Cash Rewards</span>
              <span>$205.00</span>
            </div>
          </div>

          {/* Previous Payments Section */}
          <div className="bg-white shadow-lg border border-gray-200 p-6 rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Previous Payments</h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex justify-between text-lg">
                <span>Payment of Sep 2023</span>
                <span>$150.00</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Payment of Aug 2023</span>
                <span>$135.00</span>
              </div>
            </div>
            <div className="flex justify-between border-t border-gray-300 pt-4 mt-4 text-lg font-bold text-gray-700">
              <span>Total Previous Payments</span>
              <span>$285.00</span>
            </div>
          </div>
        </div>

        {/* Service Payment Section */}
        <div className="bg-white shadow-lg border border-gray-200 p-6 rounded-lg mt-8 hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Payment</h2>
          <div className="space-y-4 text-gray-600">
            <div className="flex justify-between text-lg">
              <span>Service Payment (Oct 10, 2023)</span>
              <span>$50.00</span>
            </div>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-4 mt-4 text-lg font-bold text-gray-700">
            <span>Total Service Payment</span>
            <span>$50.00</span>
          </div>
        </div>

        {/* Total Section */}
        <div className="flex justify-between bg-white text-gray-700 border border-gray-200 p-6 rounded-lg font-bold text-xl mt-8 shadow-lg">
          <span>Total Amount to Pay</span>
          <span>$540.00</span>
        </div>

        {/* Payment Button */}
        <div className="flex justify-center mt-8">
          <Link to={'/PaymentGateway'}>
            <button className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out focus:ring-4 focus:ring-green-300">
              Process Payment
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetails;
