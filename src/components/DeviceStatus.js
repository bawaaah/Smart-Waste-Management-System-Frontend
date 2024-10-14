import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeviceStatus = () => {
    const [devices, setDevices] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/device');
                setDevices(response.data);
            } catch (error) {
                console.error('Error fetching device status:', error);
                setError('Failed to fetch device data. Please try again later.');
            }
        };

        fetchDevices();
    }, []);

    // Group devices by type
    const groupedDevices = devices.reduce((acc, device) => {
        if (!acc[device.deviceType]) {
            acc[device.deviceType] = [];
        }
        acc[device.deviceType].push(device);
        return acc;
    }, {});

    // Navigate to WasteDashboard on device click
    const handleDeviceClick = (deviceId) => {
        navigate(`/waste-dashboard/${deviceId}`);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold">Device Status</h2>
            {error && <p className="text-red-500">{error}</p>}
            <button 
                onClick={() => navigate('/add-device')} 
                className="bg-green-500 text-white px-4 py-2 mb-4" // Add button styles
            >
                Add New Device
            </button>
            <div className="mt-4">
                {Object.keys(groupedDevices).map(deviceType => (
                    <div key={deviceType} className="mb-4">
                        <h3 className="text-xl font-semibold">{deviceType}</h3>
                        <ul className="list-disc ml-5">
                            {groupedDevices[deviceType].map(device => (
                                <li 
                                    key={device.deviceId} 
                                    className="my-2 cursor-pointer" 
                                    onClick={() => handleDeviceClick(device.deviceId)}
                                >
                                    <p><strong>Device ID:</strong> {device.deviceId}</p>
                                    <p><strong>Status:</strong> {device.status}</p>
                                    <p><strong>Space Left:</strong> {device.spaceLeft}%</p>
                                    <p><strong>Last Updated:</strong> {new Date(device.lastUpdated).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeviceStatus;
