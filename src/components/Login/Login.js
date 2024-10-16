import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken, setUsername: setParentUsername, setUserId }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { username, password }
      );

      const { token, user } = response.data;

      if (!user) {
        throw new Error("User data is not available");
      }

      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("username", user.username);
      localStorage.setItem("userId", user._id);

      setParentUsername(user.username);
      setUsername(user.username);
      setUserId(user._id);

      navigate(user.isAdmin ? "/WasteMonitoringDashboard" : "/WasteMonitoringDashboard");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      // You can use your own toast notification or alert here.
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="p-8 max-w-md w-full border border-gray-600 rounded-lg shadow-lg bg-gray-700 text-white">
        <h1 className="text-3xl font-bold text-center mb-6 text-teal-300">
          Login
        </h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-1 rounded-md bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 rounded-md bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md mt-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-teal-300 font-bold">
            Signup here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;