import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react'; // Importing QR code component

const AdminDeviceStatus = ({ userId }) => {
    const [devices, setDevices] = useState([]);
    const [filteredDevices, setFilteredDevices] = useState([]); // State for filtered devices
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false); // Track deletion status
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/device/`);
                setDevices(response.data);
                setFilteredDevices(response.data); // Set filtered devices to full list initially
            } catch (error) {
                console.error('Error fetching device status:', error);
                setError('Failed to fetch device data. Please try again later.');
            }
        };

        fetchDevices();
    }, [userId]);

    // Handle search input change
    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        // Filter devices based on the device ID
        const filtered = devices.filter((device) =>
            device.deviceId.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredDevices(filtered);
    };

    // Group devices by type
    const groupedDevices = filteredDevices.reduce((acc, device) => {
        if (!acc[device.deviceType]) {
            acc[device.deviceType] = [];
        }
        acc[device.deviceType].push(device);
        return acc;
    }, {});

    // Navigate to WasteDashboard on device click
    const handleDeviceClick = (deviceId, deviceType, userId) => {
        navigate(`/waste-dashboard/${deviceId}/${deviceType}/${userId}`);
    };

    // Get color based on space left
    const getFillColor = (spaceLeftPercentage) => {
        if (spaceLeftPercentage > 70) return 'bg-green-500'; // High space left (mostly empty)
        if (spaceLeftPercentage > 30) return 'bg-yellow-500'; // Medium space left
        return 'bg-red-500'; // Low space left (mostly full)
    };

    // Get background color based on device type or status
    const getBackgroundColor = (deviceType, status) => {
        if (status !== 'Active') {
            return 'bg-gray-300'; // Gray for inactive devices
        }
        switch (deviceType) {
            case 'Plastic':
                return 'bg-orange-300'; // Orange based color
            case 'Degradable':
                return 'bg-green-300'; // Green based color
            case 'Paper':
                return 'bg-blue-300'; // Blue based color
            case 'Glass':
                return 'bg-red-300'; // Red based color
            default:
                return 'bg-gray-300'; // Default color
        }
    };

    // Function to delete a device
    const handleDeleteDevice = async (deviceId) => {
        if (window.confirm('Are you sure you want to delete this device?')) {
            setIsDeleting(true);
            try {
                await axios.delete(`http://localhost:3000/api/device/delete/${deviceId}`);
                setDevices((prevDevices) => prevDevices.filter(device => device.deviceId !== deviceId));
                setFilteredDevices((prevDevices) => prevDevices.filter(device => device.deviceId !== deviceId));
                alert('Device deleted successfully.');
            } catch (error) {
                console.error('Error deleting device:', error);
                setError('Failed to delete the device. Please try again later.');
            }
            setIsDeleting(false);
        }
    };

    // Determine number of categories
    const categoryCount = Object.keys(groupedDevices).length;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Device Status</h2>
            {error && <p className="text-red-500">{error}</p>}

            {/* Search input */}
            <div className="mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search by Device ID"
                    className="border border-gray-300 p-2 rounded w-full"
                />
            </div>

            {/* Display grouped devices by type */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${Math.min(categoryCount, 4)} gap-6`}>
                {Object.keys(groupedDevices).map(deviceType => (
                    <div key={deviceType} className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">{deviceType}</h3>

                        {/* Render each device as a card */}
                        <div className="grid gap-4">
                            {groupedDevices[deviceType].map(device => {
                                // Calculate the fill percentage based on space left and capacity
                                const fillPercentage = (device.spaceLeft / device.capacity) * 100;

                                return (
                                    <div 
                                        key={device.deviceId}
                                        className={`device-card ${getBackgroundColor(deviceType, device.status)}`} // Apply background color
                                        onClick={() => handleDeviceClick(device.deviceId, device.deviceType,userId)}
                                    >
                                        <h4 className="text-lg font-bold mb-2">Device ID: {device.deviceId}</h4>
                                        <p className="text-gray-700 mb-2"><strong>Status:</strong> {device.status}</p>

                                        {/* Large Garbage Bin Representation */}
                                        <div className="relative w-24 h-40 bg-gray-300 border-2 border-gray-500 rounded-lg mx-auto">
                                            {/* Dynamic fill inside the bin */}
                                            <div 
                                                className={`absolute bottom-0 w-full ${getFillColor(fillPercentage)}`} 
                                                style={{ height: `${fillPercentage}%` }} 
                                            />
                                        </div>
                                        <p className="text-center mt-2 text-gray-700"><strong>Space Left:</strong> {device.spaceLeft} kg</p>
                                        <p className="text-center text-gray-700"><strong>Capacity:</strong> {device.capacity} kg</p>
                                        <p className="text-center text-gray-700"><strong>Fill Level:</strong> {fillPercentage.toFixed(2)}%</p>
                                        <p className="text-gray-700 mt-2"><strong>Last Updated:</strong> {new Date(device.lastUpdated).toLocaleString()}</p>

                                        {/* QR Code for the device */}
                                        <div className="relative mt-4 flex justify-end">
                                            <QRCodeSVG 
                                                value={`http://localhost:3000/device/${device.deviceId}`} // QR code will link to the device page
                                                size={64} // Smaller size for the QR code
                                                className="qr-code" // Add class for styling
                                            />
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering device click event
                                                handleDeleteDevice(device.deviceId);
                                            }}
                                            className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                                            disabled={isDeleting} // Disable button during deletion process
                                        >
                                            {isDeleting ? 'Removing...' : 'Remove Device'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDeviceStatus;
