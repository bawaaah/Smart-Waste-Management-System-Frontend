// src/components/EditCollection.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleMapReact from "google-map-react";

const EditCollection = () => {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [wasteType, setWasteType] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/collections/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }, // Include token for authentication
          }
        );
        setCollection(response.data);
        setLocation(response.data.location);
        setWasteType(response.data.wasteType);
        setDetails(response.data.details);
        setDate(response.data.date.substring(0, 10));
        setTime(response.data.time);
      } catch (err) {
        console.error("Error fetching collection:", err);
      }
    };

    fetchCollection();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedCollection = { location, wasteType, details, date, time };

    try {
      await axios.put(
        `http://localhost:5000/api/collections/${id}`,
        updatedCollection,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Include token for authentication
        }
      );
      navigate(`/collection/${id}`); // Navigate back to the collection details after successful update
    } catch (err) {
      console.error("Error updating collection:", err);
    }
  };

  const handleMapClick = ({ lat, lng }) => setLocation({ lat, lng });

  if (!collection) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Collection</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ height: "400px", width: "100%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyAlr9ejliXP037xHQtnJ2zscbPGxczkUrM", // Replace with your own Google Maps API key
            }}
            defaultCenter={{ lat: location.lat, lng: location.lng }}
            defaultZoom={11}
            onClick={handleMapClick}
          >
            {location.lat && location.lng && (
              <div lat={location.lat} lng={location.lng}>
                <img src="/assets/marker.png" alt="Selected Location" />
              </div>
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
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditCollection;
