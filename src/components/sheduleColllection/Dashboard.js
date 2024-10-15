import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = ({ userId }) => {
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/collections`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }, // Include token if needed
          }
        );
        setCollections(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCollections();
  }, [userId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/collections/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Include token if needed
      });
      setCollections(collections.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Your Scheduled Collections</h1>
      <ul>
        {collections.map((collection) => (
          <li key={collection._id}>
            <p>Date: {new Date(collection.date).toLocaleDateString()}</p>
            <p>Waste Type: {collection.wasteType}</p>
            <p>
              Status:{" "}
              <strong>
                {collection.isCollected ? "Collected" : "Not Collected"}
              </strong>
            </p>
            <button onClick={() => navigate(`/collection/${collection._id}`)}>
              View Details
            </button>
            <button onClick={() => navigate(`/edit/${collection._id}`)}>
              Edit
            </button>
            <button onClick={() => handleDelete(collection._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate("/schedule")}>
        Schedule New Collection
      </button>
    </div>
  );
};

export default Dashboard;
