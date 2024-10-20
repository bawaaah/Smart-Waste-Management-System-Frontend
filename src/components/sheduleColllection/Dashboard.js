import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCollections, deleteCollection } from "./collectionService";
import { wasteTypeFactory } from "./WasteTypeFactory";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = ({ userId }) => {
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchCollections(localStorage.getItem("token"));
        setCollections(data);
      } catch (err) {
        console.error("Error fetching collections:", err);
      }
    };

    loadCollections();
  }, [userId]);

  const handleDelete = async (id) => {
    try {
      await deleteCollection(id, localStorage.getItem("token"));
      setCollections((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting collection:", err);
    }
  };

  return (
    <div className="min-h-screen bg-green-10 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Your Scheduled Collections
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((collection) => {
          const wasteData = wasteTypeFactory(collection.wasteType); // Use Factory Pattern
          return (
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
                    src={wasteData.img} // Use image from factory
                    alt={wasteData.type}
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
          );
        })}
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
