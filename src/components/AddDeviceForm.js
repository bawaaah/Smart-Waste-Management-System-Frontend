// src/components/AddDeviceForm.js
import React, { useState } from 'react';
import axios from 'axios';

const AddDeviceForm = () => {
    const [deviceId, setDeviceId] = useState('');
    const [status, setStatus] = useState('Active');
    const [message, setMessage] = useState('');
    const [spaceLeft, setSpaceLeft] = useState('');
    const [deviceType, setdeviceType] = useState('');
    const [capacity, setCapacity] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/api/device/add', {
                deviceId,
                status,
                spaceLeft,
                deviceType,
                capacity
            });
            setMessage('Device added successfully!');
        } catch (error) {
            setMessage(`Error: ${error.response?.data.message || 'Failed to add device'}`);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold">Add New Device</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <label className="block mb-2">Device ID:</label>
                <input
                    type="text"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    className="border p-2 mb-4 w-full"
                    required
                />

                <label className="block mb-2">Device Type:</label>
                <input
                    type="text"
                    value={deviceType}
                    onChange={(e) => setdeviceType(e.target.value)}
                    className="border p-2 mb-4 w-full"
                    required
                />      
                
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
            </form>
        </div>
    );
};

export default AddDeviceForm;
