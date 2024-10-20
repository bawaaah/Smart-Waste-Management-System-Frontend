import React, { useState } from "react"; // Import useState once
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter, Routes, Route once
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './index.css';

import WasteDashboard from './components/WasteDashboard';
import DeviceStatus from './components/DeviceStatus';
import AddDeviceForm from './components/AddDeviceForm';
import AddWasteRecordForm from './components/AddWasteRecordForm';
import WasteMonitoringDashboard from './components/WasteMonitoringDashboard';
import ReportMalfunction from './components/ReportMalfunction';
import CriticalWasteDevices from './components/CriticalWasteDevices';
import Login from "./components/Login/Login"; 
import Signup from "./components/Login/Signup"; 
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminDeviceStatus from './components/Admin/AdminDeviceStatus';
import AdminReportMalfunction from './components/Admin/AdminReportMalfunction';
import AdminUserDashboard from './components/Admin/AdminUserDashboard';
import GenerateReport from './components/Admin/GenerateReport';
import Homepage from './components/Home/Homepage';
import Dashboard from "./components/sheduleColllection/Dashboard";
import ScheduleCollection from "./components/sheduleColllection/ScheduleCollection";
import CollectionDetails from "./components/sheduleColllection/CollectionDetails";
import EditCollection from "./components/sheduleColllection/EditCollection";
import PaymentDetails from "./PaymentManagement/PaymentDetails";
import PaymentGateway from "./PaymentManagement/PaymentGateway";
import SchedulePayment from "./PaymentManagement/SchedulePayment";

function App() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  const handleLoginSuccess = (data) => {
    console.log("User Data:", data);
    const { token, user } = data;
    if (user) {
      setUsername(user.username);
      setUserId(user._id);
      setToken(token);
      console.log("Updated Username:", user.username);
    } else {
      console.error("User data is missing");
    }
  };

  return (
    <Router>
      <Routes>
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
        <Route
          path="/dashboard"
          element={<Dashboard username={username} userId={userId} />}
        />
        <Route
          path="/schedule"
          element={<ScheduleCollection username={username} userId={userId} />}
        />
        <Route
          path="/collection/:id"
          element={<CollectionDetails username={username} userId={userId} />}
        />
        <Route
          path="/edit/:id"
          element={<EditCollection username={username} userId={userId} />}
        />
        <Route path="/PaymentDetails" element={<PaymentDetails amount={300} />} />
        <Route path="/PaymentGateway" element={<PaymentGateway />} />
        <Route
          path="/SchedulePayment"
          element={
            <SchedulePayment
              deviceId={"PAP-1728988754534"}
              userId={"670fb1c9283b226b21a52da0"}
            />
          }
        />
        <Route path="/WasteMonitoringDashboard" element={<WasteMonitoringDashboard username={username} userId={userId} />} />
        <Route path="/device-status" element={<DeviceStatus username={username} userId={userId} />} />
        <Route path="/waste-dashboard/:deviceId/:deviceType/:userId" element={<WasteDashboard />} />
        <Route path="/add-device/:userId" element={<AddDeviceForm />} />
        <Route path="/add-waste-record" element={<AddWasteRecordForm username={username} userId={userId} />} />
        <Route path="/ReportMalfunction" element={<ReportMalfunction username={username} userId={userId} />} />
        <Route path="/critical-devices" element={<CriticalWasteDevices username={username} userId={userId} />} />
        <Route path="/AdminDashboard" element={<AdminDashboard username={username} userId={userId} />} />
        <Route path="/AdminDeviceStatus" element={<AdminDeviceStatus username={username} userId={userId} />} />
        <Route path="/AdminReportMalfunction" element={<AdminReportMalfunction username={username} userId={userId} />} />
        <Route path="/AdminUserDashboard" element={<AdminUserDashboard username={username} userId={userId} />} />
        <Route path="/GenerateReport" element={<GenerateReport username={username} userId={userId} />} />
        <Route path="/Homepage" element={<Homepage username={username} userId={userId} />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </Router>
  );
}

export default App;
