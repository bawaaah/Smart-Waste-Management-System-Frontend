// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="flex justify-between items-center bg-white shadow-lg py-4 px-8">
      <div className="text-2xl font-bold text-green-600">
        Waste Management
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li><Link className="text-gray-600 hover:text-green-600" to="/">Home</Link></li>
          <li><Link className="text-gray-600 hover:text-green-600" to="/services">Services</Link></li>
          <li><Link className="text-gray-600 hover:text-green-600" to="/payment">Payment</Link></li>
          <li><Link className="text-gray-600 hover:text-green-600" to="/track-waste">Track Waste</Link></li>
          <li><Link className="text-gray-600 hover:text-green-600" to="/WasteMonitoringDashboard">Devices</Link></li>
          <li><Link className="text-gray-600 hover:text-green-600" to="/profile">Profile</Link></li>
        </ul>
      </nav>
      <FaBell className="text-2xl text-green-600 cursor-pointer" />
    </header>
  );
};

export default Header;
