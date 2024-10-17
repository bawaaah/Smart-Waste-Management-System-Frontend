import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AddDeviceForm = () => {
    const [status, setStatus] = useState('Active');
    const [message, setMessage] = useState('');
    const [spaceLeft, setSpaceLeft] = useState('');
    const [deviceType, setDeviceType] = useState('');
    const [capacity, setCapacity] = useState('');
    const [qrCode, setQrCode] = useState(''); // State to hold QR code
    const { userId } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/api/device/add', {
                status,
                spaceLeft,
                deviceType,
                capacity,
                userId
            });
            setMessage('Device added successfully!');
            setQrCode(response.data.qrCode); // Set QR code state
        } catch (error) {
            setMessage(`Error: ${error.response?.data.message || 'Failed to add device'}`);
        }
    };

    // Function to download the QR code
    const downloadQRCode = () => {
        const link = document.createElement('a');
        link.href = qrCode; // QR code image URL
        link.download = 'qr_code.png'; // Name of the downloaded file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold">Add New Device</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                {/* Removed Device ID field as it is auto-generated */}
                <label className="block mb-2">Device Type:</label>
                <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="border p-2 mb-4 w-full"
                    required
                >
                    <option value="">Select Device Type</option>
                    <option value="Plastic">Plastic / Polytene</option>
                    <option value="Degradable">Food / Degradable</option>
                    <option value="Paper">Paper</option>
                    <option value="Glass">Glass</option>
                </select>

                <label className="block mb-2">Status:</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border p-2 mb-4 w-full"
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Malfunction">Malfunction</option>
                </select>

                <label className="block mb-2">Capacity (kg):</label>
                <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="border p-2 mb-4 w-full"
                    required
                />

                <button type="submit" className="bg-blue-500 text-white p-2">Add Device</button>

                {message && <p className="mt-4">{message}</p>}
                {qrCode && ( // Display QR code if it exists
                    <div className="mt-4">
                        <h3 className="text-lg font-bold">QR Code:</h3>
                        {/* Increase the size of the QR code image */}
                        <img 
                            src={qrCode} 
                            alt="QR Code" 
                            className="mt-2" 
                            style={{ width: '200px', height: '200px' }} // Set the width and height as needed
                        />
                        <button 
                            onClick={downloadQRCode} 
                            className="mt-2 bg-green-500 text-white p-2 rounded"
                        >
                            Download QR Code
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AddDeviceForm;
