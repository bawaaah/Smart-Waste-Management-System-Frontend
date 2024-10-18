import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VerticalNav from '../components/Navi';

function PaymentGateway() {
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
    saveCard: false,
  });
  
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Validate name: only alphabetical characters
  const validateName = (name) => /^[A-Za-z\s]+$/.test(name);

  // Validate card number: must be in "1234 5678 1234 5678" format
  const validateCardNumber = (number) => /^(\d{4} \d{4} \d{4} \d{4})$/.test(number);

  // Validate expiration date: must be in "MM/YY" format
  const validateExpDate = (date) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(date);

  // Validate CVV: must be exactly 3 digits
  const validateCVV = (cvv) => /^\d{3}$/.test(cvv);

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all fields are valid
    if (!validateName(formData.cardName)) {
      setErrorMessage('Name on card must contain only alphabetical characters.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (!validateCardNumber(formData.cardNumber)) {
      setErrorMessage('Card number must be in the format "1234 5678 1234 5678".');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (!validateExpDate(formData.expDate)) {
      setErrorMessage('Expiration date must be in "MM/YY" format.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (!validateCVV(formData.cvv)) {
      setErrorMessage('CVV must be exactly 3 digits.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Show modal if validation passes
    setShowModal(true);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Vertical Navigation */}
      <VerticalNav />

      {/* Main Area */}
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-16 text-green-700 text-center">Payment Gateway</h1>

        {/* Payment Form */}
        <div className="bg-white shadow-lg border border-gray-200 p-6 rounded-lg max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-lg font-semibold mb-2">Name on Card</label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter name on your card"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-lg font-semibold mb-2">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="1234 5678 1234 5678"
              />
            </div>

            <div className="flex space-x-4 mb-6">
              <div className="flex-1">
                <label className="block text-gray-700 text-lg font-semibold mb-2">Expiration Date</label>
                <input
                  type="text"
                  name="expDate"
                  value={formData.expDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="MM/YY"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 text-lg font-semibold mb-2">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="123"
                />
              </div>
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                name="saveCard"
                checked={formData.saveCard}
                onChange={handleInputChange}
                id="save-card"
                className="w-5 h-5 text-green-600 border border-gray-300 rounded focus:ring-green-500 focus:ring-2"
              />
              <label htmlFor="save-card" className="ml-2 text-gray-700 text-md">
                Save to my account for future use
              </label>
            </div>

            {/* Pay Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 focus:ring-4 focus:ring-green-300"
              >
                Pay Now
              </button>
            </div>
          </form>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
            {errorMessage}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto text-center">
              <h2 className="text-2xl font-semibold mb-4">Confirm Payment Details</h2>
              <p className="mb-4">Name on Card: {formData.cardName}</p>
              <p className="mb-4">Card Number: {formData.cardNumber}</p>
              <p className="mb-4">Expiration Date: {formData.expDate}</p>
              <p className="mb-4">CVV: {formData.cvv}</p>

              <div className="flex justify-around mt-6">
                <Link to="/" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                  Confirm Payment
                </Link>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentGateway;
