// src/App.js
import './index.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes and Route
import WasteDashboard from './components/WasteDashboard';
import DeviceStatus from './components/DeviceStatus';
import AddDeviceForm from './components/AddDeviceForm';
import AddWasteRecordForm from './components/AddWasteRecordForm';


const App = () => {
    return (
      <Router>
      <Routes>  {/* Use Routes instead of Switch */}
          <Route path="/" element={<DeviceStatus />} /> {/* Define routes with element prop */}
          <Route path="/waste-dashboard/:deviceId" element={<WasteDashboard />} /> {/* Route for WasteDashboard */}
          <Route path="/add-device" element={<AddDeviceForm />} />
      </Routes>
  </Router>
    );
};

export default App;
