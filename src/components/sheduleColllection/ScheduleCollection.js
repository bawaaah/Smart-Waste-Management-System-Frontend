import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleMapReact from "google-map-react";
import markerIcon from "./images/marker.png"; // Ensure the path is correct

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
      wasteType,
      details,
      date,
      time,
    };

    try {
      await axios.post("http://localhost:5000/api/collections", collection, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Error scheduling collection:", err);
    }
  };

  const handleMapClick = ({ lat, lng }) => {
    setLocation({ lat, lng });
  };

  return (
    <div>
      <h1>Schedule Waste Collection</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ height: "400px", width: "100%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyAlr9ejliXP037xHQtnJ2zscbPGxczkUrM", // Replace with your API key
            }}
            defaultCenter={{ lat: 6.9271, lng: 79.8612 }} // Center the map on Colombo, Sri Lanka
            defaultZoom={11}
            onClick={handleMapClick} // Handle user click on the map
          >
            {location.lat && location.lng && (
              <Marker lat={location.lat} lng={location.lng} icon={markerIcon} />
            )}
          </GoogleMapReact>
        </div>
        <p>
          Selected Location: {location.lat}, {location.lng}
        </p>

        <div>
          <label>Waste Type:</label>
          <div>
            {[
              "Electronic Waste",
              "Bulky Waste",
              "Organic Waste",
              "Medical Waste",
            ].map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setWasteType(type)}
                style={{ backgroundColor: wasteType === type ? "green" : "" }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label>Waste Details:</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Preferred Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Preferred Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Schedule</button>
      </form>
    </div>
  );
};

export default ScheduleCollection;
