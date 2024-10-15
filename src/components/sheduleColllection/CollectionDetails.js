// src/components/CollectionDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CollectionDetails = () => {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
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
      } catch (err) {
        console.error("Error fetching collection:", err);
      }
    };

    fetchCollection();
  }, [id]);

  if (!collection) return <div>Loading...</div>;

  return (
    <div>
      <h1>Collection Details</h1>
      <p>Date: {new Date(collection.date).toLocaleDateString()}</p>
      <p>Waste Type: {collection.wasteType}</p>
      <p>Waste Details: {collection.details}</p>
      <p>Preferred Time: {collection.time}</p>
      <p>
        Location: {collection.location.lat}, {collection.location.lng}
      </p>
      <button onClick={() => navigate(`/edit/${collection._id}`)}>Edit</button>
      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
};

export default CollectionDetails;
