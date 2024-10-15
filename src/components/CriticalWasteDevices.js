import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CriticalWasteDevices = () => {
    const [criticalDevices, setCriticalDevices] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/device');
                const devices = response.data;

                // Filter devices that are critical (e.g., fill level > 70%)
                const criticalDevices = devices.filter(device => {
                    const fillPercentage = (device.spaceLeft / device.capacity) * 100;
                    return fillPercentage <= 30; // Set your critical threshold here
                });

                setCriticalDevices(criticalDevices);
            } catch (error) {
                console.error('Error fetching device data:', error);
                setError('Failed to fetch critical device data. Please try again later.');
            }
        };

        fetchDevices();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Critical Waste Level Devices</h2>
            {error && <p className="text-red-500">{error}</p>}
            
            {/* Display critical devices */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {criticalDevices.length === 0 ? (
                    <p className="text-gray-500">No devices are currently at critical levels.</p>
                ) : (
                    criticalDevices.map(device => {
                        // Calculate the fill percentage based on space left and capacity
                        const fillPercentage = (device.spaceLeft / device.capacity) * 100;

                        return (
                            <div 
                                key={device.deviceId}
                                className="device-card bg-red-300 border border-red-500 p-4 rounded-lg shadow-md"
                                onClick={() => navigate(`/waste-dashboard/${device.deviceId}/${device.deviceType}`)} // Navigate to device dashboard
                            >
                                <h4 className="text-lg font-bold mb-2">Device ID: {device.deviceId}</h4>
                                <p className="text-gray-700 mb-2"><strong>Status:</strong> {device.status}</p>

                                {/* Dynamic fill representation */}
                                <div className="relative w-24 h-40 bg-gray-300 border-2 border-gray-500 rounded-lg mx-auto">
                                    <div 
                                        className={`absolute bottom-0 w-full bg-red-600`} 
                                        style={{ height: `${fillPercentage}%` }} 
                                    />
                                </div>
                                <p className="text-center mt-2 text-gray-700"><strong>Space Left:</strong> {device.spaceLeft} kg</p>
                                <p className="text-center text-gray-700"><strong>Capacity:</strong> {device.capacity} kg</p>
                                <p className="text-center text-gray-700"><strong>Fill Level:</strong> {fillPercentage.toFixed(2)}%</p>
                                <p className="text-gray-700 mt-2"><strong>Last Updated:</strong> {new Date(device.lastUpdated).toLocaleString()}</p>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default CriticalWasteDevices;
