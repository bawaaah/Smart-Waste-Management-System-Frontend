import React from 'react';
import VerticalNav from './components/Navi';
import WasteGraph from './PaymentManagement/WasteGraph'; // Import the graph component

const Schedule = require('./images/Schedule.jpeg')
const Payment = require('./images/Payment.jpeg')
const Sample = require('./images/sample.jpeg')

const quickLinks = [
  {
    title: 'Schedule Connection',
    description: 'Manage your scheduled waste connections easily.',
    buttonText: 'Go to Schedule',
    imageUrl: Schedule
  },
  {
    title: 'Make Payment',
    description: 'Pay for your scheduled waste services here.',
    buttonText: 'Pay Now',
    imageUrl: Payment
  },
  {
    title: 'View Remittance',
    description: 'Check your remittance details for previous transactions.',
    buttonText: 'View Remittance',
    imageUrl: Sample
  },
];

function Home() {
  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden"> {/* Prevent scrolling */}
      <VerticalNav />

      {/* Main Area */}
      <div className='flex-1 flex flex-col p-8'> {/* Flex column to align content vertically */}
        <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">Welcome to WasteWise Dashboard</h1>

        {/* Highlighted Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8 flex-grow"> {/* Allow the grid to grow and take available space */}
          <div className="bg-green-100 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-3xl font-semibold text-green-800">Total Waste</h2>
            <p className="text-2xl text-gray-700">300 KG</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-3xl font-semibold text-green-800">Recycled Waste</h2>
            <p className="text-2xl text-gray-700">150 KG</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-3xl font-semibold text-green-800">Scheduled Connections</h2>
            <p className="text-2xl text-gray-700">5</p>
          </div>
        </div>

        {/* Graph Component */}
        <div className="flex-grow"> {/* Allow the graph to grow within its container */}
          <WasteGraph />
        </div>

        {/* Quick Links Cards */}
        <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> {/* Add margin-bottom to separate from bottom */}
          {quickLinks.map((link, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md flex items-center hover:shadow-lg transition-shadow duration-300">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{link.title}</h3>
                <p className="text-gray-600">{link.description}</p>
                <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                  {link.buttonText}
                </button>
              </div>
              <img src={link.imageUrl} alt={link.title} className="w-28 h-28 rounded-full ml-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
