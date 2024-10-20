import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // State for Admin toggle
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/auth/signup", {
        username,
        password,
        isAdmin,
      });
      alert("Signup successful! You can now log in.");
      navigate("/"); // Redirect to login page after signup
    } catch (error) {
      alert("Signup error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="p-8 max-w-md w-full border border-gray-600 rounded-lg shadow-lg bg-gray-700 text-white">
        <h1 className="text-3xl font-bold text-center mb-6 text-teal-300">
          Signup
        </h1>
        <form onSubmit={handleSignup}>
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

          <div className="mb-4">
            <label className="flex items-center text-sm font-medium">
              <input
                type="checkbox"
                className="mr-2 focus:ring-teal-400"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
              />
              Are you an Admin?
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md mt-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Signup
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/" className="text-teal-300 font-bold">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
