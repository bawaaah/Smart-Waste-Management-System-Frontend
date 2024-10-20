// src/pages/Homepage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaDollarSign, FaTruck, FaRecycle, FaMicrochip } from 'react-icons/fa';
import Header from './Header'; // Import Header
import Footer from './Footer'; // Import Footer

const Homepage = ({ userId }) => {
    const [totalDevices, setTotalDevices] = useState(0);
    const [activeDevices, setActiveDevices] = useState(0);
    const [devicesNeedingAttention, setDevicesNeedingAttention] = useState(0);
    const [criticalWasteLevels, setCriticalWasteLevels] = useState(0);
    const [error, setError] = useState('');
  // Fetch devices data from the backend on component mount
  useEffect(() => {
    const fetchDevices = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/device/${userId}`); // Adjust the URL based on your API endpoint
            const devices = response.data;
            
            // Calculate statistics
            setTotalDevices(devices.length);
            setActiveDevices(devices.filter(device => device.status === 'Active').length);
            setDevicesNeedingAttention(devices.filter(device => device.status !== 'Active').length);
            setCriticalWasteLevels(devices.filter(device => (device.spaceLeft / device.capacity) * 100 <= 30).length); // e.g., less than 30% space left
        } catch (err) {
            setError('Failed to fetch device data.');
        }
    };

    fetchDevices();
}, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-green-600 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Eco-Friendly Waste Management at Your Fingertips</h1>
        <p className="text-lg mb-6">Schedule pickups, track your waste, and manage payments in a seamless way.</p>
        <div className="space-x-4">
          <Link to="/schedule" className="px-6 py-3 bg-white text-green-600 rounded-md shadow-lg hover:bg-green-100">Schedule Waste Collection</Link>
          <Link to="/payment" className="px-6 py-3 bg-white text-green-600 rounded-md shadow-lg hover:bg-green-100">Make Payment</Link>
          <Link to="/track-waste" className="px-6 py-3 bg-white text-green-600 rounded-md shadow-lg hover:bg-green-100">Track Waste</Link>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="py-16 px-8 bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all">
          <FaDollarSign className="text-4xl text-green-600 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Payment Overview</h3>
          <p>Outstanding Payment: <strong>LKR 1,200</strong></p>
          <p>Next Payment Due: <strong>25th October 2024</strong></p>
          <Link to="/payment" className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-md">Make Payment</Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all">
          <FaTruck className="text-4xl text-green-600 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Upcoming Collection</h3>
          <p>Next Collection: <strong>20th October 2024</strong></p>
          <p>Collection Type: <strong>Household Waste</strong></p>
          <Link to="/collection-details" className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-md">View Details</Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all">
          <FaRecycle className="text-4xl text-green-600 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Waste Tracking</h3>
          <p>Waste Level: <strong>75% Full</strong></p>
          <p>Weight Collected This Month: <strong>15 kg</strong></p>
          <Link to="/track-waste" className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-md">View Waste History</Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all">
          <FaMicrochip className="text-4xl text-green-600 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Your Devices</h3>
          <p>Total Devices: <strong>{totalDevices}</strong></p>
          <p>Waste Levels Critical Devices: <strong>{criticalWasteLevels}</strong></p>
          <Link to="/WasteMonitoringDashboard" className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-md">View Devices</Link>
        </div>
      </section>

      {/* Promo Section */}
      <section className="py-12 bg-green-600 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">Join Our Recycling Program and Earn Rewards!</h3>
        <Link to="/recycling" className="px-6 py-3 bg-white text-green-600 rounded-md shadow-lg hover:bg-green-100">Learn More</Link>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;
