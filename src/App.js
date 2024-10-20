// src/App.js
import React, { useState } from "react"; // Importing useState
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importing BrowserRouter
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./components/sheduleColllection/Dashboard";
import ScheduleCollection from "./components/sheduleColllection/ScheduleCollection";
import CollectionDetails from "./components/sheduleColllection/CollectionDetails";
import EditCollection from "./components/sheduleColllection/EditCollection";

import Login from "./components/Login/Login"; // Ensure this import is correct
import Signup from "./components/Login/Signup"; // Ensure this import is correct

import PaymentDetails from "./PaymentManagement/PaymentDetails";
import PaymentGateway from "./PaymentManagement/PaymentGateway";
import SchedulePayment from "./PaymentManagement/SchedulePayment";

function App() {
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
    <div className="App">
      <Router>
        {" "}
        {/* Change is here: ensure you're using Router */}
        <Routes>
          <Route
            path="/login"
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

          {/* Payment */}
          <Route
            path="/PaymentDetails"
            element={<PaymentDetails amount={300} />}
          ></Route>
          <Route path="/PaymentGateway" element={<PaymentGateway />}></Route>
          <Route
            path="/SchedulePayment"
            element={
              <SchedulePayment
                deviceId={"PAP-1728988754534"}
                userId={"670fb1c9283b226b21a52da0"}
              />
            }
          ></Route>
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default App;
