import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import bullkwaste from "./images/bulkwaste.jpg";
import ewaste from "./images/electronicwaste.jpg";
import medicalwaste from "./images/medicalwaste.jpg";
import organicwaste from "./images/organic.jpg";

const CollectionDetails = () => {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  // Fetch the collection and its details
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/collections/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCollection(response.data);
        if (response.data.location) {
          fetchAddress(response.data.location.lat, response.data.location.lng);
        }
      } catch (err) {
        console.error("Error fetching collection:", err);
      }
    };

    fetchCollection();
  }, [id]);

  // Fetch address using reverse geocoding API (Google Maps API)
  const fetchAddress = async (lat, lng) => {
    try {
      const apiKey = "AIzaSyAlr9ejliXP037xHQtnJ2zscbPGxczkUrM";
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      if (response.data.results.length > 0) {
        setAddress(response.data.results[0].formatted_address); // Set the formatted address
      }
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  const wasteTypeImages = {
    "Electronic Waste": ewaste,
    "Bulky Waste": bullkwaste,
    "Organic Waste": organicwaste,
    "Medical Waste": medicalwaste,
  };

  // Helper function to format date in word format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!collection) return <div className="text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-center py-10">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md space-y-8">
        {/* Date */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          {formatDate(collection.date)}
        </h1>

        {/* Waste Type Card */}
        <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-md">
          <div className="ml-3 w-2/3">
            <h2 className="text-lg font-semibold text-gray-700">Waste Type:</h2>
            <p className="text-lg text-green-600 font-semibold">
              {collection.wasteType}
            </p>
          </div>
          <div className="w-1/3">
            <img
              src={wasteTypeImages[collection.wasteType]}
              alt={collection.wasteType}
              className="object-cover w-full h-32 rounded-lg"
            />
          </div>
        </div>

        {/* Waste Details */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700">
            Waste Details:
          </h2>
          <p className="text-lg text-gray-800 p-4 bg-gray-100 rounded-lg shadow-md">
            {collection.details}
          </p>
        </div>

        {/* Preferred Time and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              Preferred Time:
            </h2>
            <p className="text-lg text-gray-800 p-4 bg-gray-100 rounded-lg shadow-md">
              {collection.time}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Location:</h2>
            <p className="text-lg text-gray-800 p-4 bg-gray-100 rounded-lg shadow-md">
              {address ||
                `Latitude: ${collection.location.lat}, Longitude: ${collection.location.lng}`}
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate(`/edit/${collection._id}`)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-300"
          >
            Edit Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetails;
