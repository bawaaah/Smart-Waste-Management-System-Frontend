import React from 'react';
import { FaHome, FaTrash, FaDollarSign, FaGift, FaQuestionCircle } from 'react-icons/fa';
import logo from '../images/logo.webp';
import { Link } from "react-router-dom";

function Navi() {
  return (
    <div className="h-screen flex">
      {/* Vertical Navigation */}
      <div className="group relative h-full">
        <div className="w-16 group-hover:w-64 transition-all duration-300 ease-in-out bg-gray-100 text-black flex flex-col items-center p-4 h-screen overflow-hidden">
          {/* Logo and Brand with Separate Divs */}
          <div className="mb-10 flex items-center p-4 rounded-lg transition-opacity duration-300 group-hover:shadow-lg">
            <div className="mr-2">
              <img src={logo} alt="WasteWise Logo" className="w-16 h-16" />
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h1 className="text-xl font-semibold text-green-600">WasteWise</h1>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col space-y-4 w-full">

            <Link to={"/"}><NavItem icon={<FaHome />} label="Dashboard" /></Link>

            <NavItem icon={<FaTrash />} label="Collections" />

            <Link to={"/PaymentDetails"}><NavItem icon={<FaDollarSign />} label="Payments" /></Link>

            <NavItem icon={<FaGift />} label="Rewards" />

            <NavItem icon={<FaQuestionCircle />} label="Help" />
            
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      {/* <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold">Welcome to WasteWise Dashboard</h1>
      </div> */}
    </div>
  );
}

function NavItem({ icon, label }) {
  return (
    <div className="flex items-center p-3 hover:bg-green-100 rounded-lg w-full cursor-pointer">
      <div className="text-green-600 mr-3">{icon}</div>
      <span className="text-lg text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{label}</span>
    </div>
  );
}

export default Navi;
