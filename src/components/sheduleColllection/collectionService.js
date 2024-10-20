// collectionService.js
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "./constants";

export const fetchCollections = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/collections`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    handleError(err);
    throw err;
  }
};

export const deleteCollection = async (id, token) => {
  try {
    await axios.delete(`${API_BASE_URL}/collections/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Collection deleted successfully!", {
      position: "top-center",
      autoClose: 3000,
    });
  } catch (err) {
    handleError(err);
    throw err;
  }
};

// Service to handle the scheduling of a collection
export const scheduleCollection = async (collection) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/collections`,
      collection,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    toast.success("Collection scheduled successfully!", {
      position: "top-center",
      autoClose: 3000,
    });
    return response;
  } catch (err) {
    handleError(err);
    throw err;
  }
};

// Handle errors and display error messages via toast
const handleError = (err) => {
  if (err.response && err.response.data && err.response.data.error) {
    toast.error(`Error: ${err.response.data.error}`, {
      position: "top-center",
      autoClose: 5000,
    });
  } else {
    toast.error("Failed to schedule collection. Please try again.", {
      position: "top-center",
      autoClose: 5000,
    });
  }
};

// Fetch address using reverse geocoding API
export const fetchAddress = async (lat, lng) => {
  const apiKey = "AIzaSyAlr9ejliXP037xHQtnJ2zscbPGxczkUrM";
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    if (response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    } else {
      return "Address not found";
    }
  } catch (err) {
    console.error("Error fetching address:", err);
    return "Error fetching address";
  }
};
