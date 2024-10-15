import './index.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes and Route
import WasteDashboard from './components/WasteDashboard';
import DeviceStatus from './components/DeviceStatus';
import AddDeviceForm from './components/AddDeviceForm';
import AddWasteRecordForm from './components/AddWasteRecordForm';
import WasteMonitoringDashboard from './components/WasteMonitoringDashboard'; // Import the new component
import ReportMalfunction from './components/ReportMalfunction'; // Import the new component
import CriticalWasteDevices from './components/CriticalWasteDevices'; // Import the new component



const App = () => {
    return (
        <Router>
            <Routes> {/* Use Routes instead of Switch */}
                <Route path="/" element={<WasteMonitoringDashboard />} /> {/* Default route shows WasteMonitoringDashboard */}
                <Route path="/device-status" element={<DeviceStatus />} /> {/* Route for DeviceStatus */}
                <Route path="/waste-dashboard/:deviceId/:deviceType" element={<WasteDashboard />} /> {/* Route for WasteDashboard */}
                <Route path="/add-device" element={<AddDeviceForm />} /> {/* Route for AddDeviceForm */}
                <Route path="/add-waste-record" element={<AddWasteRecordForm />} /> {/* Route for AddWasteRecordForm */}
                <Route path="/ReportMalfunction" element={<ReportMalfunction />} /> {/* Route for AddWasteRecordForm */}
                <Route path="/critical-devices" element={<CriticalWasteDevices />} /> {/* New route */}
            </Routes>
        </Router>
    );
};

export default App;
