import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams
import AddWasteRecordForm from './AddWasteRecordForm'; // Import the form

const WasteDashboard = () => {
    const { deviceId, deviceType } = useParams(); // Get deviceId from URL parameters
    const [wasteData, setWasteData] = useState([]);
    const [showForm, setShowForm] = useState(false); // State to control form visibility

    useEffect(() => {
        const fetchWasteData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/waste/${deviceId}`);
                setWasteData(response.data);
            } catch (error) {
                console.error('Error fetching waste data:', error);
            }
        };

        fetchWasteData();
    }, [deviceId]);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold">Waste Monitoring Dashboard for Device ID: {deviceId}</h2>

            {/* Button to toggle form visibility */}
            <button 
                onClick={() => setShowForm(!showForm)} 
                className="bg-blue-500 text-white p-2 my-4"
            >
                {showForm ? 'Cancel' : 'Add New Waste Record'}
            </button>

            {/* Conditionally render the AddWasteRecordForm */}
            {showForm && <AddWasteRecordForm deviceId={deviceId} deviceType={deviceType}/>} {/* Pass deviceId to the form */}

            <div className="mt-4">
                <h3 className="text-xl">Waste Records</h3>
                {wasteData.length > 0 ? (
                    wasteData.map((record) => (
                        <div key={record._id} className="border p-4 mb-2">
                            <p><strong>Weight:</strong> {record.weight} kg</p>
                            <p><strong>Date:</strong> {new Date(record.date).toLocaleString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No waste records available.</p>
                )}
            </div>
        </div>
    );
};

export default WasteDashboard;
