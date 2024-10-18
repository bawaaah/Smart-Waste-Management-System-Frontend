import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleMapReact from "google-map-react";
import { toast } from "react-toastify";
import bullkwaste from "./images/bulkwaste.jpg";
import ewaste from "./images/electronicwaste.jpg";
import medicalwaste from "./images/medicalwaste.jpg";
import organicwaste from "./images/organic.jpg";
import markerIcon from "./images/marker.png";

const Marker = ({ icon }) => {
  const markerRef = useRef(null);

  return (
    <div
      ref={markerRef}
      style={{ position: "absolute", transform: "translate(-50%, -100%)" }}
    >
      <img src={icon} alt="Marker" style={{ width: "30px", height: "30px" }} />
    </div>
  );
};

const ScheduleCollection = ({ userId }) => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const collection = {
      userId,
      location,
      address,
      wasteType,
      details,
      date,
      time,
    };

    try {
      await axios.post("http://localhost:5000/api/collections", collection, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Collection scheduled successfully!", {
        position: "top-center",
        autoClose: 5000,
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Error scheduling collection:", err);
      toast.error("Failed to schedule collection. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleMapClick = async ({ lat, lng }) => {
    setLocation({ lat, lng });
    fetchAddress(lat, lng);
  };

  // Fetch address using reverse geocoding API (Google Maps API)
  const fetchAddress = async (lat, lng) => {
    try {
      const apiKey = "AIzaSyAlr9ejliXP037xHQtnJ2zscbPGxczkUrM";
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      if (response.data.results.length > 0) {
        setAddress(response.data.results[0].formatted_address);
      } else {
        setAddress("Address not found");
      }
    } catch (err) {
      console.error("Error fetching address:", err);
      setAddress("Error fetching address");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-center py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md space-y-8 overflow-y-auto"
      >
        {/* Google Map */}
        <div className="relative h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden w-full">
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyAlr9ejliXP037xHQtnJ2zscbPGxczkUrM",
            }}
            defaultCenter={{ lat: 6.9271, lng: 79.8612 }}
            defaultZoom={11}
            onClick={handleMapClick}
          >
            {location.lat && location.lng && (
              <Marker lat={location.lat} lng={location.lng} icon={markerIcon} />
            )}
          </GoogleMapReact>
        </div>

        {/* Display Address */}
        {address && (
          <div>
            <label className="text-lg font-semibold text-gray-700">
              Location:
            </label>
            <p className="text-lg text-gray-800 p-3 bg-gray-100 rounded-lg border border-gray-200">
              {address}
            </p>
          </div>
        )}

        {/* Waste Type Selection */}
        <div>
          <label className="text-xl font-semibold text-gray-700 mb-4 block">
            Select Waste Type:
          </label>
          <div className="grid grid-cols-4 gap-4">
            {[
              { type: "Electronic Waste", img: ewaste },
              { type: "Bulky Waste", img: bullkwaste },
              { type: "Organic Waste", img: organicwaste },
              { type: "Medical Waste", img: medicalwaste },
            ].map(({ type, img }) => (
              <div
                key={type}
                className={`p-4 border rounded-lg flex items-center space-x-4 cursor-pointer ${
                  wasteType === type
                    ? "border-green-500 bg-green-100"
                    : "border-gray-300"
                }`}
                onClick={() => setWasteType(type)}
              >
                <img
                  src={img}
                  alt={type}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <span className="text-lg font-medium">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Waste Details */}
        <div>
          <label className="text-lg font-semibold text-gray-700">
            Waste Details:
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-100"
            placeholder="Describe the waste..."
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-lg font-semibold text-gray-700">
              Preferred Date:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-100"
            />
          </div>
          <div>
            <label className="text-lg font-semibold text-gray-700">
              Preferred Time:
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-100"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-12 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-300 w-full md:w-1/3"
          >
            Schedule
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleCollection;
