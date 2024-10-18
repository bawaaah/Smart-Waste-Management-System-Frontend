// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 text-center">
      <div className="space-x-4">
        <Link to="/about" className="hover:underline">About Us</Link>
        <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        <Link to="/terms" className="hover:underline">Terms of Service</Link>
        <Link to="/contact" className="hover:underline">Contact Us</Link>
      </div>
      <p className="mt-6">Follow us: 📘 Facebook | 🐦 Twitter | 📸 Instagram</p>
    </footer>
  );
};

export default Footer;
