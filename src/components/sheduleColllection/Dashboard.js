import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bullkwaste from "./images/bulkwaste.jpg";
import ewaste from "./images/electronicwaste.jpg";
import medicalwaste from "./images/medicalwaste.jpg";
import organicwaste from "./images/organic.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            },
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
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCollections(collections.filter((c) => c._id !== id));

      toast.success("Collection deleted successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete collection!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const wasteTypeImages = {
    "Electronic Waste": ewaste,
    "Bulky Waste": bullkwaste,
    "Organic Waste": organicwaste,
    "Medical Waste": medicalwaste,
  };

  return (
    <div className="min-h-screen bg-green-10 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Your Scheduled Collections
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((collection) => (
          <div
            key={collection._id}
            className={`rounded-lg shadow-lg overflow-hidden cursor-pointer transition transform hover:scale-105 ${
              collection.isCollected ? "bg-green-100" : "bg-gray-100"
            }`}
            onClick={() => navigate(`/collection/${collection._id}`)}
          >
            <div className="flex flex-row items-center">
              <div className="w-1/3 h-24 md:h-32 lg:h-36">
                <img
                  src={wasteTypeImages[collection.wasteType]}
                  alt={collection.wasteType}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="w-2/3 p-4">
                <p className="text-sm font-semibold">
                  Date: {new Date(collection.date).toLocaleDateString()}
                </p>
                <p className="text-sm mt-1 text-gray-700">
                  Time: {collection.time}
                </p>
                <p className="text-sm mt-2 font-semibold">
                  Status:{" "}
                  <span
                    className={
                      collection.isCollected
                        ? "text-green-600"
                        : "text-orange-600"
                    }
                  >
                    {collection.isCollected ? "Collected" : "Not Collected"}
                  </span>
                </p>
              </div>

              <div className="flex flex-col justify-center space-y-6 p-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/edit/${collection._id}`);
                  }}
                  className="bg-blue-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(collection._id);
                  }}
                  className="bg-red-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/schedule")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
        >
          Schedule New Collection
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Dashboard;
