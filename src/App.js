import './index.css';
import React , { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes and Route
import WasteDashboard from './components/WasteDashboard';
import DeviceStatus from './components/DeviceStatus';
import AddDeviceForm from './components/AddDeviceForm';
import AddWasteRecordForm from './components/AddWasteRecordForm';
import WasteMonitoringDashboard from './components/WasteMonitoringDashboard'; // Import the new component
import ReportMalfunction from './components/ReportMalfunction'; // Import the new component
import CriticalWasteDevices from './components/CriticalWasteDevices'; // Import the new component
import Login from "./components/Login/Login"; // Ensure this import is correct
import Signup from "./components/Login/Signup"; // Ensure this import is correct 
import AdminDashboard from './components/Admin/AdminDashboard'; // Import the new component 
import AdminDeviceStatus from './components/Admin/AdminDeviceStatus'; // Import the new component 
import AdminReportMalfunction from './components/Admin/AdminReportMalfunction'; // Import the new component 
import AdminUserDashboard from './components/Admin/AdminUserDashboard'; 
import GenerateReport from './components/Admin/GenerateReport'; 






const App = () => {
    const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  const handleLoginSuccess = (data) => {
    console.log("User Data:", data); // Ensure you're seeing the full data
    const { token, user } = data; // Destructure the data
    if (user) {
      setUsername(user.username); // Set username from user object
      setUserId(user._id); // Set userId from user object
      setToken(token); // Set the token
      console.log("Updated Username:", user.username);
    } else {
      console.error("User data is missing"); // Handle case when user data is not available
    }
  };

    return (
        <Router>
            <Routes> {/* Use Routes instead of Switch */}
            {" "}
        {/* Change is here: ensure you're using Router */}
          <Route
            path="/"
            element={
              <Login
                setToken={handleLoginSuccess}
                setUsername={setUsername}
                setUserId={setUserId}
              />
            }
          />
          <Route path="/signup" element={<Signup />} />

                <Route path="/WasteMonitoringDashboard" element={<WasteMonitoringDashboard username={username} userId={userId}/>} /> {/* Default route shows WasteMonitoringDashboard */}
                <Route path="/device-status" element={<DeviceStatus username={username} userId={userId}/>} /> {/* Route for DeviceStatus */}
                <Route path="/waste-dashboard/:deviceId/:deviceType/:userId" element={<WasteDashboard />} /> {/* Route for WasteDashboard */}
                <Route path="/add-device/:userId" element={<AddDeviceForm />} /> {/* Route for AddDeviceForm */}
                <Route path="/add-waste-record" element={<AddWasteRecordForm username={username} userId={userId}/>} /> {/* Route for AddWasteRecordForm */}
                <Route path="/ReportMalfunction" element={<ReportMalfunction username={username} userId={userId}/>} /> {/* Route for AddWasteRecordForm */}
                <Route path="/critical-devices" element={<CriticalWasteDevices username={username} userId={userId}/>} /> {/* New route */}
                <Route path="/AdminDashboard" element={<AdminDashboard username={username} userId={userId}/>} /> {/* New route */}
                <Route path="/AdminDeviceStatus" element={<AdminDeviceStatus username={username} userId={userId}/>} /> {/* New route */}
                <Route path="/AdminReportMalfunction" element={<AdminReportMalfunction username={username} userId={userId}/>} /> {/* New route */} 
                <Route path="/AdminUserDashboard" element={<AdminUserDashboard username={username} userId={userId}/>} /> {/* New route */} 
                <Route path="/GenerateReport" element={<GenerateReport username={username} userId={userId}/>} /> {/* New route */} 

            </Routes>
        </Router>
    );
};

export default App;
