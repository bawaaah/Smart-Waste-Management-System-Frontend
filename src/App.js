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
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default App;
